// Live voorbeeld in een iframe: schalen, teksten lokaliseren en direct bijwerken.
import { placeholders, squash, stripHtml } from './util.js';

const WIDTH = { desktop: 1280, tablet: 820, mobile: 390 };
const HEIGHT = { tablet: 1180, mobile: 844 };
const SKIP = 'script, style, template, noscript, astro-dev-toolbar, astro-dev-overlay';
const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
const YELLOW = '#fcba04';

const normTpl = document.createElement('template');
const normalize = (html) => {
  normTpl.innerHTML = html;
  return normTpl.innerHTML.trim();
};
const firstText = (html) => {
  normTpl.innerHTML = html;
  const w = document.createTreeWalker(normTpl.content, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) if (n.data.trim()) return n.data.trim().slice(0, 50);
  return '';
};
const staticPart = (s) =>
  s
    .split(/\{[a-zA-Z][a-zA-Z0-9]*\}/)
    .map((x) => x.trim())
    .sort((a, b) => b.length - a.length)[0] || '';

export function createPreview({ frame, stage, device, urlEl, openBtn, noteEl, onLoad, onPick, onPointEnd }) {
  let mode = localStorage.getItem('cms:device') || (matchMedia('(max-width: 600px)').matches ? 'mobile' : 'desktop');
  let pointing = false;
  let pendingScroll = null;
  let hlTimer;
  let bindings = new Map();
  let doc = null;
  let win = null;

  // ---------- schalen ----------

  function fit() {
    const w = WIDTH[mode];
    const pad = mode === 'desktop' ? 0 : 32;
    const sw = stage.clientWidth - pad * 2;
    const sh = stage.clientHeight - pad;
    const scale = Math.min(1, sw / w);
    const height = mode === 'desktop' ? stage.clientHeight / scale : Math.min(HEIGHT[mode], (sh - 16) / scale);
    device.dataset.device = mode;
    device.style.width = `${w}px`;
    device.style.height = `${Math.max(200, height)}px`;
    device.style.transform = `translateX(-50%) scale(${scale})`;
  }
  new ResizeObserver(fit).observe(stage);

  function setDevice(m) {
    mode = m;
    localStorage.setItem('cms:device', m);
    fit();
    return m;
  }

  // ---------- laden ----------

  const currentPath = () => {
    try {
      return frame.contentWindow.location.pathname;
    } catch {
      return null;
    }
  };

  function navigate(url, { force = false } = {}) {
    if (!force && currentPath() === url && doc) return;
    stage.classList.add('is-loading');
    frame.src = url;
  }

  function reload({ keepScroll = true } = {}) {
    if (keepScroll && win) pendingScroll = { path: currentPath(), y: win.scrollY };
    stage.classList.add('is-loading');
    try {
      frame.contentWindow.location.reload();
    } catch {
      frame.src = frame.src;
    }
  }

  frame.addEventListener('load', () => {
    stage.classList.remove('is-loading');
    bindings = new Map();
    try {
      doc = frame.contentDocument;
      win = frame.contentWindow;
    } catch {
      doc = win = null;
      return;
    }
    if (!doc?.body || win.location.protocol === 'about:') {
      doc = win = null;
      return;
    }
    const path = win.location.pathname;
    urlEl.textContent = path;
    openBtn.href = path;
    hideToolbar();
    doc.addEventListener('click', onDocClick, true);
    win.addEventListener('pagehide', () => {
      if (win) pendingScroll = { path, y: win.scrollY };
    });
    if (pendingScroll?.path === path) {
      const y = pendingScroll.y;
      win.scrollTo(0, y);
      // Lettertypen en afbeeldingen kunnen de hoogte nog veranderen.
      setTimeout(() => win?.scrollTo(0, y), 150);
    }
    pendingScroll = null;
    if (pointing) attachPointing();
    onLoad(path);
  });

  function hideToolbar() {
    // Geen paginaovergangen in het voorbeeld: die breken af als het iframe van formaat verandert.
    const vt = doc.createElement('style');
    vt.textContent = '@view-transition { navigation: none; }';
    doc.head.append(vt);
    const hide = () => {
      const t = doc?.querySelector('astro-dev-toolbar');
      if (t) t.style.display = 'none';
      return !!t;
    };
    if (hide()) return;
    const mo = new MutationObserver(() => hide() && mo.disconnect());
    mo.observe(doc.body, { childList: true });
    setTimeout(() => mo.disconnect(), 5000);
  }

  function onDocClick(e) {
    if (pointing) return;
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const url = new URL(a.href, win.location.href);
    if (url.origin !== win.location.origin || a.target === '_blank') {
      e.preventDefault();
      if (/^(https?|mailto|tel):$/.test(url.protocol)) window.open(url.href, '_blank', 'noopener');
    }
  }

  // ---------- zoeken in de pagina ----------

  function textNodes() {
    const out = [];
    if (!doc?.body) return out;
    const w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.data.trim() && !n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n);
    return out;
  }

  // Zoekt waar een tekstwaarde in de pagina staat.
  function find(value, html) {
    if (!doc?.body || typeof value !== 'string' || !value.trim()) return [];
    const ph = placeholders(value).length > 0;

    if (html) {
      const norm = normalize(value);
      const seed = ph ? staticPart(stripHtml(value)) : firstText(value);
      if (!seed) return [];
      const found = [];
      const seen = new Set();
      for (const n of textNodes()) {
        if (!n.data.includes(seed) && !squash(n.data).includes(squash(seed))) continue;
        let el = n.parentElement;
        while (el && el !== doc.body.parentElement) {
          if (seen.has(el)) break;
          const inner = el.innerHTML.trim();
          if (inner === norm) {
            seen.add(el);
            found.push({ kind: 'inner', el, live: !ph });
            break;
          }
          if (inner.includes(norm)) {
            seen.add(el);
            found.push({ kind: 'sub', el, live: !ph });
            break;
          }
          el = el.parentElement;
        }
        if (!el || el === doc.body.parentElement) {
          // Niet exact terug te vinden (bijv. door placeholders): alleen markeren.
          found.push({ kind: 'mark', el: n.parentElement, live: false });
        }
      }
      return found;
    }

    const needle = ph ? staticPart(value) : value.trim();
    if (!needle) return [];
    const res = findText(needle, ph);
    if (!res.length && !ph) {
      // De pagina toont soms een ingekorte vorm (bijv. "1. Titel." als "Titel"): alleen markeren.
      const core = needle.replace(/^\d+[.)]\s*/, '').replace(/[.:]$/, '').trim();
      if (core !== needle && core.length >= 4) return findText(core, false).map((b) => ({ ...b, live: false, multi: false }));
    }
    for (const el of doc.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(','))) {
      if (el.closest(SKIP)) continue;
      for (const a of ATTRS) if (el.getAttribute(a) === value) res.push({ kind: 'attr', el, attr: a, live: true });
    }
    return res;
  }

  function findText(needle, ph) {
    const exact = [];
    const partial = [];
    for (const n of textNodes()) {
      const i = n.data.indexOf(needle);
      if (i === -1) {
        if (!ph && squash(n.data) === squash(needle)) exact.push({ kind: 'text', node: n, start: 0, len: n.data.length, live: false });
        continue;
      }
      const b = { kind: 'text', node: n, start: i, len: needle.length, live: !ph };
      (n.data.trim() === needle ? exact : partial).push(b);
    }
    // Meerdere gedeeltelijke treffers: wel markeren, niet live vervangen (tenzij pick() er één kiest).
    return exact.length ? exact : partial.length === 1 ? partial : partial.slice(0, 12).map((b) => ({ ...b, live: false, multi: b.live }));
  }

  // Dezelfde tekst staat in meer velden op deze pagina. contexts[0] zijn de teksten rond het
  // eigen veld, de rest die rond de andere velden. Elke treffer gaat naar het veld waarvan de
  // context het dichtst bij staat; we houden de treffers van het eigen veld. null = onduidelijk.
  function pick(list, contexts) {
    if (!contexts) return list;
    if (!list.length) return null;
    const mine = [];
    for (const b of list) {
      const texts = [];
      let el = b.node ? b.node.parentElement : b.el;
      for (let d = 0; el && el !== doc.body && d < 10; d++, el = el.parentElement) texts.push(el.textContent.replace(/\s+/g, ' '));
      let best = null;
      let owner = -1;
      let tie = false;
      contexts.forEach((ctx, i) => {
        for (let d = 0; d < texts.length; d++) {
          let hits = 0;
          for (const c of ctx) if (texts[d].includes(c)) hits++;
          if (!hits) continue;
          const cmp = best ? d - best.d || best.hits - hits : -1;
          if (cmp < 0) [best, owner, tie] = [{ d, hits }, i, false];
          else if (cmp === 0 && owner !== i) tie = true;
          return;
        }
      });
      if ((owner === 0 && !tie) || (!best && list.length === 1)) mine.push(b.multi ? { ...b, live: true } : b);
    }
    return mine.length ? mine : null;
  }

  const bound = (key) => {
    const list = bindings.get(key);
    if (!list) return null;
    const ok = list.every((b) => (b.node || b.el)?.isConnected);
    return ok ? list : null;
  };

  // Werk de tekst in het voorbeeld bij; false als dat niet lukt.
  function patch(key, oldValue, newValue, html, contexts) {
    if (!doc?.body) return false;
    if (typeof oldValue !== 'string' || typeof newValue !== 'string') return false;
    if (placeholders(oldValue).length || placeholders(newValue).length) return false;
    let list = bound(key) || pick(find(oldValue, html), contexts);
    if (!list) return false;
    list = list.filter((b) => b.live);
    if (!list.length) return false;
    for (const b of list) {
      if (b.kind === 'text') {
        const d = b.node.data;
        b.node.data = d.slice(0, b.start) + newValue + d.slice(b.start + b.len);
        b.len = newValue.length;
      } else if (b.kind === 'attr') {
        b.el.setAttribute(b.attr, newValue);
      } else if (b.kind === 'inner') {
        b.el.innerHTML = newValue;
      } else if (b.kind === 'sub') {
        const o = normalize(oldValue);
        if (!b.el.innerHTML.includes(o)) return false;
        b.el.innerHTML = b.el.innerHTML.replace(o, () => newValue);
      }
    }
    // Een lege tekst is niet terug te vinden; vervangen binnen een element kan dan ook niet meer.
    if (newValue.trim() || list.every((b) => b.kind !== 'sub')) bindings.set(key, list);
    else bindings.delete(key);
    if (doc.title === oldValue) doc.title = newValue;
    return true;
  }

  function rectOf(b) {
    if (b.kind === 'text') {
      const r = doc.createRange();
      r.setStart(b.node, Math.min(b.start, b.node.data.length));
      r.setEnd(b.node, Math.min(b.start + b.len, b.node.data.length));
      return r.getBoundingClientRect();
    }
    return b.el.getBoundingClientRect();
  }

  function overlay(id) {
    let el = doc.getElementById(id);
    if (!el) {
      el = doc.createElement('div');
      el.id = id;
      Object.assign(el.style, {
        position: 'absolute',
        zIndex: '2147483646',
        pointerEvents: 'none',
        borderRadius: '6px',
        transition: 'opacity .3s, top .15s, left .15s, width .15s, height .15s',
        boxSizing: 'border-box',
      });
      doc.body.append(el);
    }
    return el;
  }

  function place(el, rect, padding = 4) {
    Object.assign(el.style, {
      top: `${rect.top + win.scrollY - padding}px`,
      left: `${rect.left + win.scrollX - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      opacity: '1',
      display: 'block',
    });
  }

  // Markeer waar een veld in het voorbeeld staat en scroll ernaartoe.
  function locate(key, value, html, contexts) {
    clearHighlight();
    if (!doc?.body) return false;
    let list = bound(key);
    if (!list) {
      const found = find(value, html);
      const picked = pick(found, contexts);
      list = picked || found;
      if (list.length && list.every((b) => b.live) && (picked || !contexts)) bindings.set(key, list);
    }
    for (const b of list) {
      const closed = (b.node?.parentElement || b.el)?.closest('details:not([open])');
      if (closed) closed.open = true;
    }
    const visible = list.find((b) => {
      const r = rectOf(b);
      return r.width > 0 && r.height > 0;
    });
    if (!visible) {
      note(list.length ? 'Nu verborgen (bijv. in het mobiele menu)' : 'Niet direct zichtbaar (bijv. een melding of schermlezertekst)');
      return false;
    }
    note('');
    const r = rectOf(visible);
    const hl = overlay('__cms_hl');
    Object.assign(hl.style, { border: `3px solid ${YELLOW}`, background: 'rgb(252 186 4 / 0.16)' });
    place(hl, r);
    if (r.top < 70 || r.bottom > win.innerHeight - 30) {
      win.scrollTo({ top: Math.max(0, r.top + win.scrollY - win.innerHeight * 0.3), behavior: 'smooth' });
    }
    clearTimeout(hlTimer);
    hlTimer = setTimeout(() => {
      hl.style.opacity = '0';
    }, 2600);
    return true;
  }

  function clearHighlight() {
    clearTimeout(hlTimer);
    const hl = doc?.getElementById('__cms_hl');
    if (hl) hl.style.opacity = '0';
  }

  function note(text) {
    noteEl.textContent = text;
    noteEl.hidden = !text;
  }

  // ---------- aanwijzen ----------

  function attachPointing() {
    if (!doc?.body) return;
    doc.addEventListener('mousemove', onMove, true);
    doc.addEventListener('click', onPointClick, true);
    doc.addEventListener('keydown', onKey, true);
    doc.documentElement.style.cursor = 'crosshair';
  }

  function detachPointing() {
    if (!doc) return;
    doc.removeEventListener('mousemove', onMove, true);
    doc.removeEventListener('click', onPointClick, true);
    doc.removeEventListener('keydown', onKey, true);
    doc.documentElement.style.cursor = '';
    const hv = doc.getElementById('__cms_hover');
    if (hv) hv.style.display = 'none';
  }

  function onMove(e) {
    const el = e.target;
    if (!(el instanceof doc.defaultView.Element) || el === doc.body || el === doc.documentElement) return;
    const hv = overlay('__cms_hover');
    Object.assign(hv.style, { border: '2px dashed #0b1d51', background: 'rgb(11 29 81 / 0.05)', transition: 'none' });
    place(hv, el.getBoundingClientRect(), 2);
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      setPointing(false);
      onPointEnd?.();
    }
  }

  function onPointClick(e) {
    e.preventDefault();
    e.stopPropagation();
    let text = '';
    let el = e.target;
    const r = doc.caretRangeFromPoint?.(e.clientX, e.clientY);
    const node = r?.startContainer;
    if (node?.nodeType === 3 && node.parentElement && el.contains(node)) {
      text = node.data;
      el = node.parentElement;
    }
    const attr = el.getAttribute?.('alt') || el.getAttribute?.('aria-label') || el.getAttribute?.('title') || '';
    if (!squash(text) && attr) text = attr;
    onPick({ text: squash(text), context: squash(el.textContent || attr), path: win.location.pathname });
  }

  function setPointing(on) {
    pointing = on;
    if (on) attachPointing();
    else detachPointing();
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pointing && !document.querySelector('dialog[open]')) {
      setPointing(false);
      onPointEnd?.();
    }
  });

  fit();

  return {
    get device() {
      return mode;
    },
    get path() {
      return doc ? currentPath() : null;
    },
    get ready() {
      return !!doc?.body && !stage.classList.contains('is-loading');
    },
    setDevice,
    navigate,
    reload,
    patch,
    locate,
    clearHighlight,
    note,
    setPointing,
    resetBindings: () => (bindings = new Map()),
  };
}
