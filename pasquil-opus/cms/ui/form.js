// Genereert een formulier uit een JSON-bestand en het schema dat de server meestuurt.
import { h, svg, clone, getAt, setAt, patternOf, isHtmlKey, isLinkKey, placeholders, stripHtml, squash } from './util.js';
import { labelFor, hints, bivNames } from './labels.js';
import { createRte } from './rte.js';

const ENUM_LABELS = {
  card: { '': 'Geen (wit)', yellow: 'Geel', navy: 'Donkerblauw' },
  listStyle: { check: 'Vinkjes', dont: 'Niet doen (rood)', cross: 'Kruisjes', numbered: 'Genummerd' },
};
const ENUMS = ['card', 'listStyle', 'photo'];
const SUMMARY_KEYS = ['title', 'label', 'name', 'risk', 'text', 'question', 'navLabel', 'heading', 'html', 'id'];
const LIMITS = { title: 60, homeTitle: 60, description: 160 };

let uid = 0;
const pk = (path) => path.join('.');
const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const nodeKey = (node, key) => (typeof key === 'number' ? node?.item : node?.keys?.[key]);

function blankFrom(node, key, icons) {
  if (!node) return '';
  const t = node.t;
  if (t.includes('object')) {
    const o = {};
    for (const k of node.req || []) o[k] = blankFrom(node.keys[k], k, icons);
    return o;
  }
  if (t.includes('array')) return node.lens ? Array(node.lens[0]).fill(false) : [];
  if (t.includes('string')) {
    if (node.vals?.length) return node.vals.includes('') ? '' : node.vals[0];
    if (key === 'icon') return Object.keys(icons)[0] || '';
    return '';
  }
  if (t.includes('number')) return 0;
  if (t.includes('boolean')) return false;
  return null;
}

// Lege kopie van een bestaand item, met behoud van keuzes (icoon, kleur, …).
function blankLike(v, key) {
  if (typeof v === 'string') return ENUMS.includes(key) || key === 'icon' ? v : '';
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  if (v === null) return null;
  if (Array.isArray(v)) return v.length && v.every((x) => typeof x === 'boolean') ? v.map(() => false) : [];
  const o = {};
  for (const k of Object.keys(v)) o[k] = blankLike(v[k], k);
  return o;
}

function uniqueId(arr, base) {
  const ids = new Set(arr.map((x) => x?.id));
  let id = base;
  for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
  return id;
}

export function itemSummary(item) {
  if (typeof item !== 'object' || !item) return squash(stripHtml(String(item ?? '')));
  for (const k of SUMMARY_KEYS) {
    const v = item[k];
    if (typeof v === 'string' && stripHtml(v).trim()) return squash(stripHtml(v)).slice(0, 140);
  }
  for (const v of Object.values(item)) if (typeof v === 'string' && v.trim()) return squash(stripHtml(v)).slice(0, 140);
  return '';
}

function iconSvg(icons, name) {
  const def = icons[name];
  const ns = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(ns, 'svg');
  s.setAttribute('aria-hidden', 'true');
  if (!def) return s;
  s.setAttribute('viewBox', def.viewBox);
  for (const d of def.paths) {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    s.append(p);
  }
  return s;
}

const fillHint = (list) =>
  h(
    'p',
    { class: 'fld__hint' },
    'Wordt automatisch ingevuld: ',
    list.flatMap((p, i) => [i ? ', ' : '', h('code', { text: p })]),
    '. Laat deze code staan.',
  );

/**
 * opts: { container, scroller, file, data, schema, icons, onChange(path, info), onFocus(path, el), toast }
 */
export function buildForm(opts) {
  const { container, scroller, file, data, schema, icons, onChange, onFocus, toast } = opts;
  const fixed = new Set(file.fixed || []);
  const min1 = new Set(file.min1 || []);
  const versions = new Set(file.versions || []);
  const focusers = new Map();

  const changed = (path, info = {}) => onChange(path, info);

  // ---------- velden ----------

  function field(path, key, value, node, parentKey) {
    const isItem = typeof key === 'number';
    const k = isItem ? parentKey : key;
    const id = `f${++uid}`;
    const label = isItem ? `${labelFor(parentKey)} ${key + 1}` : labelFor(key);
    const wrap = h('div', { class: 'fld', 'data-pk': pk(path) });
    const top = h('div', { class: 'fld__top' });
    const parentPattern = patternOf(path.slice(0, -2));
    const inFixed = k === 'id' && fixed.has(parentPattern);
    const t = typeOf(value);
    const types = node?.t || [t];
    let control;
    let focusEl;
    let after = [];

    const origPh = placeholders(value);
    const warn = origPh.length ? h('p', { class: 'fld__warn', hidden: true }) : null;
    const limit = path.includes('seo') && LIMITS[k] ? LIMITS[k] : 0;
    const count = limit ? h('span', { class: 'fld__count' }) : null;

    const update = (v) => {
      if (count) {
        const n = stripHtml(v || '').length;
        count.textContent = `${n} / ${limit}`;
        count.classList.toggle('is-over', n > limit);
        count.title = n > limit ? 'Langer dan Google meestal toont' : '';
      }
      if (warn) {
        const missing = origPh.filter((p) => !String(v ?? '').includes(p));
        warn.hidden = !missing.length;
        warn.textContent = missing.length ? `Let op: ${missing.join(', ')} ontbreekt, dan klopt de tekst op de site niet meer.` : '';
      }
    };
    const set = (v) => {
      setAt(data, path, v);
      update(v);
      changed(path);
    };

    if (t === 'boolean') {
      const input = h('input', { type: 'checkbox', id, checked: value });
      input.addEventListener('change', () => set(input.checked));
      control = h('label', { class: 'check' }, input, h('span', { text: label }));
      focusEl = input;
      wrap.append(control);
    } else if (t === 'number') {
      const input = h('input', { class: 'inp inp--num', type: 'number', id, value: String(value), step: 'any' });
      input.addEventListener('input', () => {
        if (input.value !== '' && Number.isFinite(Number(input.value))) set(Number(input.value));
      });
      control = focusEl = input;
    } else if (t === 'null' && !types.includes('string')) {
      control = h('p', { class: 'fld__none', text: 'Niet van toepassing in deze versie.' });
    } else if (isHtmlKey(k)) {
      const rte = createRte({ value: value ?? '', label, onChange: (v) => set(v) });
      control = rte.el;
      focusEl = { focus: rte.focus };
    } else if (k === 'icon' && Object.keys(icons).length) {
      const preview = h('span', { class: 'addon icon-preview' }, iconSvg(icons, value));
      const select = h(
        'select',
        { class: 'inp', id },
        Object.keys(icons)
          .sort()
          .map((name) => h('option', { value: name, text: name, selected: name === value })),
      );
      select.addEventListener('change', () => {
        preview.replaceChildren(iconSvg(icons, select.value));
        set(select.value);
      });
      control = h('div', { class: 'inp-row' }, preview, select);
      focusEl = select;
    } else if (ENUMS.includes(k) && node?.vals) {
      const vals = [...new Set([...node.vals, value ?? ''])];
      const names = ENUM_LABELS[k] || {};
      const select = h(
        'select',
        { class: 'inp', id },
        vals.map((v) =>
          h('option', { value: v, text: names[v] ?? (v ? v[0].toUpperCase() + v.slice(1) : '(geen)'), selected: v === value }),
        ),
      );
      select.addEventListener('change', () => set(select.value));
      control = focusEl = select;
    } else {
      const s = value ?? '';
      const link = isLinkKey(k);
      const long = !link && (s.length > 80 || s.includes('\n'));
      const input = long
        ? h('textarea', { class: 'inp', id, rows: Math.min(8, Math.ceil(s.length / 70) + 1) })
        : h('input', {
            class: `inp${link || k === 'id' ? ' inp--mono' : ''}`,
            id,
            type: k === 'email' ? 'email' : 'text',
            readOnly: inFixed,
            spellcheck: link || k === 'id' ? 'false' : 'true',
            autocomplete: 'off',
          });
      input.value = s;
      const nullable = value === null;
      input.addEventListener('input', () => set(nullable && input.value === '' ? null : input.value));
      focusEl = input;
      control = input;
      if (link) {
        const open = h('a', {
          class: 'addon',
          target: '_blank',
          rel: 'noopener',
          title: 'Link openen',
          'aria-label': 'Link openen',
          html: svg(s.startsWith('mailto:') ? 'mail' : 'external'),
        });
        const sync = () => {
          const v = input.value.trim();
          open.hidden = !v || /^\s*javascript:/i.test(v);
          open.href = v.startsWith('/') || /^(https?:|mailto:|tel:)/i.test(v) ? v : `/${v}`;
        };
        input.addEventListener('input', sync);
        sync();
        control = h('div', { class: 'inp-row' }, input, open);
      }
      if (inFixed) after.push(h('p', { class: 'fld__hint', text: 'Deze sleutel koppelt de tekst aan de code en ligt vast.' }));
    }

    if (t !== 'boolean') {
      const labelable = focusEl instanceof HTMLElement && focusEl.matches('input, select, textarea');
      top.append(h(labelable ? 'label' : 'span', { class: 'fld__label', for: labelable ? id : null, text: label }));
      if (count) top.append(count);
      if (!isItem) wrap.append(top);
      wrap.append(control);
    }
    if (hints[k] && !isItem && !inFixed) after.push(h('p', { class: 'fld__hint', text: hints[k] }));
    if (origPh.length) after.push(fillHint(origPh));
    if (warn) after.push(warn);
    wrap.append(...after);
    update(value);

    if (isItem && !isHtmlKey(k) && focusEl instanceof HTMLElement) focusEl.setAttribute('aria-label', label);
    wrap.addEventListener('focusin', () => onFocus(path, wrap));
    if (focusEl) focusers.set(pk(path), () => focusEl.focus({ preventScroll: true }));
    return { wrap, top };
  }

  // ---------- objecten ----------

  function objectChildren(obj, path, node) {
    const box = h('div', { class: 'contents' });
    const render = () => {
      box.replaceChildren();
      for (const key of Object.keys(obj)) {
        if (key.startsWith('_')) continue;
        box.append(entry(obj, key, path, node, render));
      }
      const optional = Object.keys(node?.keys || {}).filter(
        (k) => !k.startsWith('_') && !(k in obj) && !(node.req || []).includes(k),
      );
      if (optional.length) {
        box.append(
          h(
            'div',
            { class: 'opts' },
            optional.map((k) =>
              h(
                'button',
                {
                  class: 'add',
                  type: 'button',
                  html: svg('plus'),
                  onclick: () => {
                    obj[k] = blankFrom(node.keys[k], k, icons);
                    render();
                    changed([...path, k], { structural: true });
                    reveal([...path, k]);
                  },
                },
                labelFor(k),
              ),
            ),
          ),
        );
      }
    };
    render();
    return box;
  }

  function entry(obj, key, path, node, rerender) {
    const v = obj[key];
    const n = nodeKey(node, key);
    const p = [...path, key];
    const t = typeOf(v);
    let el;
    if (t === 'object') {
      el = h('fieldset', { class: 'grp', 'data-pk': pk(p) }, h('legend', { text: labelFor(key) }), objectChildren(v, p, n));
    } else if (t === 'array') {
      el = list(v, p, n, key);
    } else {
      const f = field(p, key, v, n);
      el = f.wrap;
      const optional = node?.req && !node.req.includes(key);
      if (optional && t !== 'boolean') {
        f.top.append(
          h('button', {
            class: 'act act--del',
            type: 'button',
            title: 'Veld weghalen',
            'aria-label': `${labelFor(key)} weghalen`,
            html: svg('trash'),
            onclick: () => {
              delete obj[key];
              rerender();
              changed(p, { structural: true });
            },
          }),
        );
      }
    }
    return el;
  }

  // ---------- lijsten ----------

  function list(arr, path, node, key) {
    const pattern = patternOf(path);
    const isFixed = fixed.has(pattern);
    const isMin1 = min1.has(pattern);
    const isVersions = versions.has(pattern);
    const label = key === '' || key == null ? file.label : labelFor(key);
    const itemNode = node?.item;

    // BIV en andere vaste rijtjes vinkjes
    if (arr.length && arr.every((x) => typeof x === 'boolean')) {
      const names = key === 'biv' && arr.length === 3 ? bivNames : arr.map((_, i) => `Waarde ${i + 1}`);
      const wrap = h('div', { class: 'fld', 'data-pk': pk(path) }, h('span', { class: 'fld__label', text: labelFor(key) }));
      const checks = h('div', { class: 'checks' });
      arr.forEach((b, i) => {
        const input = h('input', { type: 'checkbox', checked: b });
        input.addEventListener('change', () => {
          arr[i] = input.checked;
          changed([...path, i]);
        });
        checks.append(h('label', { class: 'check' }, input, h('span', { text: names[i] })));
        if (i === 0) focusers.set(pk(path), () => input.focus({ preventScroll: true }));
      });
      wrap.append(checks);
      wrap.addEventListener('focusin', () => onFocus(path, wrap));
      return wrap;
    }

    const objects = arr.some((x) => x && typeof x === 'object' && !Array.isArray(x)) || itemNode?.t.includes('object');
    const box = h('div', { class: 'list', 'data-pk': pk(path) });
    let opened = new Set();

    const render = (focusIndex, { focus = true } = {}) => {
      const prevOpen = new Set(opened);
      box.replaceChildren(
        h(
          'div',
          { class: 'list__head' },
          key === '' ? null : h('span', { class: 'fld__label', text: label }),
          h('span', { class: 'list__count', text: String(arr.length) }),
          isFixed ? h('span', { class: 'list__fixed', text: 'vaste lijst' }) : null,
          isVersions ? h('span', { class: 'list__fixed', text: 'bovenste = nieuwste' }) : null,
        ),
      );
      opened = new Set();
      arr.forEach((item, i) => box.append(objects ? itemCard(i, prevOpen.has(i) || i === focusIndex) : primRow(i)));
      if (!isFixed) {
        box.append(
          h(
            'button',
            { class: 'add', type: 'button', html: svg('plus'), onclick: add },
            isVersions ? 'Nieuwe versie (kopie van de nieuwste)' : `${objects ? 'Item' : 'Regel'} toevoegen`,
          ),
        );
      }
      if (focusIndex != null && focus) requestAnimationFrame(() => reveal([...path, focusIndex]));
    };

    const structural = (focusIndex, o) => {
      render(focusIndex, o);
      changed(path, { structural: true });
    };

    const move = (i, d) => {
      const j = i + d;
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      const wasOpen = opened.has(i);
      const otherOpen = opened.has(j);
      opened.delete(i);
      opened.delete(j);
      if (wasOpen) opened.add(j);
      if (otherOpen) opened.add(i);
      structural(undefined, { focus: false });
      box.querySelector(`[data-pk="${CSS.escape(pk([...path, j]))}"] .act[data-act="${d < 0 ? 'up' : 'down'}"]`)?.focus();
    };

    const duplicate = (i) => {
      const copy = clone(arr[i]);
      if (copy && typeof copy === 'object' && typeof copy.id === 'string') copy.id = uniqueId(arr, `${copy.id}-kopie`);
      arr.splice(i + 1, 0, copy);
      opened = new Set([...opened].map((x) => (x > i ? x + 1 : x)));
      structural(i + 1);
    };

    const remove = (i) => {
      const [removed] = arr.splice(i, 1);
      opened = new Set([...opened].filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
      structural();
      toast(`“${itemSummary(removed).slice(0, 40) || 'Item'}” verwijderd`, {
        action: 'Herstellen',
        onAction: () => {
          if (!box.isConnected) return;
          arr.splice(Math.min(i, arr.length), 0, removed);
          opened = new Set([...opened].map((x) => (x >= i ? x + 1 : x)));
          structural(i);
        },
      });
    };

    function add() {
      let item;
      if (isVersions && arr.length) {
        item = clone(arr[0]);
        for (const k of ['title', 'label']) {
          if (typeof item[k] === 'string') item[k] = `${item[k]} (nieuw)`;
        }
        arr.unshift(item);
        opened = new Set([...opened].map((x) => x + 1));
        return structural(0);
      }
      const last = arr.at(-1);
      item = last !== undefined ? blankLike(last, typeof key === 'string' ? key : '') : blankFrom(itemNode, key, icons);
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if ('id' in item) item.id = uniqueId(arr, 'nieuw');
        if (typeof last?.nr === 'string' && /^\d+$/.test(last.nr)) item.nr = String(Number(last.nr) + 1);
      }
      arr.push(item);
      structural(arr.length - 1);
    }

    const actions = (i) => {
      const b = (act, title, icon, fn, disabled) =>
        h('button', {
          class: `act${act === 'del' ? ' act--del' : ''}`,
          type: 'button',
          title,
          'aria-label': title,
          'data-act': act,
          disabled,
          html: svg(icon),
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            fn(i);
          },
        });
      return h(
        'span',
        { class: 'acts' },
        b('up', 'Omhoog', 'up', (x) => move(x, -1), isFixed || i === 0),
        b('down', 'Omlaag', 'down', (x) => move(x, 1), isFixed || i === arr.length - 1),
        objects ? b('dup', 'Dupliceren', 'copy', duplicate, isFixed) : null,
        b('del', 'Verwijderen', 'trash', remove, isFixed || (isMin1 && arr.length <= 1)),
      );
    };

    function itemCard(i, open) {
      const p = [...path, i];
      const item = arr[i];
      const nr = h('span', { class: 'item__nr', text: typeof item?.nr === 'string' && item.nr ? item.nr : String(i + 1) });
      const title = h('span', { class: 'item__title', text: itemSummary(item) });
      const det = h('details', { class: 'item', 'data-pk': pk(p) }, h('summary', {}, nr, title, actions(i)));
      if (isVersions && i === 0) title.prepend(h('strong', { text: 'Actueel · ' }));
      let body = null;
      det.ensureBody = () => {
        if (body) return;
        body = h('div', { class: 'item__body' }, typeof item === 'object' ? objectChildren(item, p, itemNode) : null);
        det.append(body);
      };
      det.addEventListener('toggle', () => {
        if (det.open) {
          det.ensureBody();
          opened.add(i);
        } else opened.delete(i);
      });
      det.addEventListener('input', () => {
        title.textContent = itemSummary(item);
        if (isVersions && i === 0) title.prepend(h('strong', { text: 'Actueel · ' }));
        if (typeof item?.nr === 'string') nr.textContent = item.nr || String(i + 1);
      });
      if (open) {
        det.open = true;
        det.ensureBody();
        opened.add(i);
      }
      return det;
    }

    function primRow(i) {
      const p = [...path, i];
      const f = field(p, i, arr[i], itemNode, key);
      const row = h('div', { class: 'prow', 'data-pk': pk(p) }, f.wrap, actions(i));
      return row;
    }

    render();
    return box;
  }

  // ---------- opbouw ----------

  function section(title, ...children) {
    return h(
      'section',
      { class: 'sec' },
      h('div', { class: 'sec__head' }, h('h2', { text: title })),
      h('div', { class: 'sec__body' }, ...children),
    );
  }

  function intro() {
    const parts = [
      'Wijzigingen zie je meteen in het voorbeeld. Klik op ',
      h('strong', { text: 'Opslaan' }),
      ' (⌘S) om ze te bewaren.',
    ];
    if (file.group === 'Algemeen') parts.push(' Deze teksten staan op meerdere pagina’s.');
    if (file.versions) parts.push(' De bovenste versie is de nieuwste en wordt op de site getoond.');
    return h('p', { class: 'intro' }, ...parts);
  }

  function render() {
    const out = [intro()];
    if (Array.isArray(data)) {
      out.push(section(file.label, list(data, [], schema, '')));
    } else {
      const prims = [];
      const blocks = [];
      for (const key of Object.keys(data)) {
        if (key.startsWith('_')) continue;
        const v = data[key];
        const n = nodeKey(schema, key);
        if (v && typeof v === 'object') {
          const body = Array.isArray(v) ? list(v, [key], n, key) : objectChildren(v, [key], n);
          blocks.push(section(labelFor(key), body));
        } else prims.push(field([key], key, v, n).wrap);
      }
      if (prims.length) out.push(section('Algemeen', ...prims));
      out.push(...blocks);
    }
    container.replaceChildren(...out);
  }

  // Klap de juiste kaarten open, scroll naar het veld en geef het focus.
  function reveal(path, { flash = true, focus = true } = {}) {
    for (let i = 1; i <= path.length; i++) {
      const det = container.querySelector(`details.item[data-pk="${CSS.escape(pk(path.slice(0, i)))}"]`);
      if (det && !det.open && i < path.length) {
        det.open = true;
        det.ensureBody?.();
      }
    }
    let el = null;
    for (let i = path.length; i > 0 && !el; i--) {
      el = container.querySelector(`[data-pk="${CSS.escape(pk(path.slice(0, i)))}"]`);
    }
    if (!el) return false;
    const target = el.matches('details') ? el.querySelector(':scope > summary') : el;
    const sr = scroller.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    if (r.top < sr.top + 40 || r.bottom > sr.bottom - 40) {
      scroller.scrollTo({ top: scroller.scrollTop + r.top - sr.top - sr.height / 3, behavior: 'smooth' });
    }
    if (flash && el.classList.contains('fld')) {
      el.classList.remove('is-flash');
      void el.offsetWidth;
      el.classList.add('is-flash');
    }
    if (focus) {
      const f = focusers.get(pk(path));
      if (f) f();
      else if (el.matches('details')) el.querySelector('.item__body')?.querySelector('input, select, textarea, .rte__area')?.focus({ preventScroll: true });
    }
    return true;
  }

  render();
  return { reveal };
}
