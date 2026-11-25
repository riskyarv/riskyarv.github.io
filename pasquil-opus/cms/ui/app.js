// Pasquil CMS: bestanden laden, bewerken, opslaan, live voorbeeld, zoeken en geschiedenis.
import { h, getAt, setAt, clone, pathKey, stripHtml, squash, isHtmlKey, isLinkKey, placeholders, leaves, flatten, fmtDate, relTime } from './util.js';
import { labelFor } from './labels.js';
import { buildForm } from './form.js';
import { createPreview } from './preview.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const els = {
  side: $('side'),
  scrim: $('scrim'),
  nav: $('fileNav'),
  filter: $('fileFilter'),
  buildBtn: $('buildBtn'),
  buildHint: $('buildHint'),
  fileGroup: $('fileGroup'),
  fileTitle: $('fileTitle'),
  filePath: $('filePath'),
  status: $('status'),
  findBtn: $('findBtn'),
  historyBtn: $('historyBtn'),
  revertBtn: $('revertBtn'),
  saveBtn: $('saveBtn'),
  related: $('related'),
  work: $('work'),
  editor: $('editor'),
  form: $('form'),
  split: $('split'),
  pointBtn: $('pointBtn'),
  reloadBtn: $('reloadBtn'),
  finder: $('finder'),
  finderInput: $('finderInput'),
  finderList: $('finderList'),
  finderEmpty: $('finderEmpty'),
  history: $('history'),
  historyTitle: $('historyTitle'),
  historyList: $('historyList'),
  historyDetail: $('historyDetail'),
  buildDialog: $('buildDialog'),
  buildLog: $('buildLog'),
  toasts: $('toasts'),
};

const DEFAULT = 'pages/home';
const meta = new Map(); // id → metadata uit cms/config.mjs
const order = []; // volgorde van de zijbalk
const docs = new Map(); // id → { data, savedText, hash, schema, shown, structural }
const dirty = new Set();
const links = new Map();
let icons = {};
let current = null;
let form = null;
let saving = false;
let building = false;
let failed = false;
let pendingLocate = null;
let reloadTimer = null;

// ---------- hulpjes ----------

async function api(route, { method = 'GET', body } = {}) {
  const res = await fetch(`/cms/api/${route}`, {
    method,
    headers: { 'X-CMS': '1', ...(body != null ? { 'Content-Type': 'application/json' } : {}) },
    body: body == null ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // geen JSON
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Fout ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
const qid = (id) => `?id=${encodeURIComponent(id)}`;

const norm = (p) => `${String(p || '').replace(/index\.html$/, '').replace(/\/+$/, '')}/`;
const scopeOf = (f) => f.scope ?? (f.group === 'Algemeen' && !f.on ? '/' : null);
const ownPage = (f, path) => !!path && norm(f.preview) === norm(path);
const showsOn = (f, path) =>
  !!path &&
  (ownPage(f, path) || !!f.on?.some((p) => norm(p) === norm(path)) || (scopeOf(f) != null && norm(path).startsWith(scopeOf(f))));
const narrow = () => matchMedia('(max-width: 1100px)').matches;
const lastKey = (path) => [...path].reverse().find((k) => typeof k === 'string');
const pathLabel = (path) => path.map((s) => (typeof s === 'number' ? `#${s + 1}` : labelFor(s))).join(' › ');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const plainCache = new Map();
function plain(v) {
  if (typeof v !== 'string') return '';
  let p = plainCache.get(v);
  if (p === undefined) {
    p = squash(stripHtml(v));
    if (plainCache.size > 20000) plainCache.clear();
    plainCache.set(v, p);
  }
  return p;
}

function toast(message, { type, action, onAction, list, timeout } = {}) {
  const el = h('div', { class: `toast${type ? ` toast--${type}` : ''}`, role: type === 'error' ? 'alert' : 'status' });
  const body = h('div', { class: 'grow' }, h('span', { text: message }));
  if (list?.length) body.append(h('ul', {}, list.map((t) => h('li', { text: t }))));
  el.append(body);
  const close = () => el.remove();
  if (action) {
    el.append(
      h('button', {
        type: 'button',
        text: action,
        onclick: () => {
          close();
          onAction?.();
        },
      }),
    );
  }
  els.toasts.append(el);
  while (els.toasts.children.length > 4) els.toasts.firstElementChild.remove();
  const ms = timeout ?? (list?.length ? 14000 : action ? 8000 : type === 'error' ? 9000 : 3500);
  let t = setTimeout(close, ms);
  el.addEventListener('mouseenter', () => clearTimeout(t));
  el.addEventListener('mouseleave', () => (t = setTimeout(close, 2500)));
  return close;
}

// ---------- status ----------

function setStatus(state, text) {
  els.status.dataset.state = state;
  els.status.textContent = text;
}

function refreshChrome() {
  const n = dirty.size;
  els.saveBtn.disabled = !n || saving;
  els.saveBtn.querySelector('span').textContent = n > 1 ? `Alles opslaan (${n})` : 'Opslaan';
  els.revertBtn.disabled = !dirty.has(current) || saving;
  for (const [id, a] of links) a.querySelector('.file__dot').hidden = !dirty.has(id);
  for (const tab of els.related.querySelectorAll('.tab')) tab.querySelector('.file__dot').hidden = !dirty.has(tab.dataset.id);

  if (saving) setStatus('busy', 'Opslaan…');
  else if (failed) setStatus('error', 'Niet opgeslagen');
  else if (dirty.has(current)) setStatus('dirty', 'Niet opgeslagen');
  else if (n) setStatus('dirty', n > 1 ? `${n} andere bestanden niet opgeslagen` : '1 ander bestand niet opgeslagen');
  else setStatus('saved', 'Opgeslagen');
  document.title = `${n ? '● ' : ''}${meta.get(current)?.label || 'Laden'} – Pasquil CMS`;
}

function checkDirty(id) {
  const d = docs.get(id);
  if (JSON.stringify(d.data) !== d.savedText) dirty.add(id);
  else {
    dirty.delete(id);
    d.structural = false;
  }
  refreshChrome();
}

// ---------- zijbalk ----------

function renderSidebar(groups) {
  els.nav.replaceChildren(
    ...groups.map((g) =>
      h(
        'div',
        { class: 'side__sec' },
        h('p', { class: 'side__group', text: g.name }),
        h(
          'ul',
          {},
          g.files.map((f) => {
            const a = h(
              'a',
              { class: 'file', href: `#/${f.id}`, title: `content/${f.id}.json`, 'data-id': f.id, onclick: closeSide },
              h('span', { class: 'file__label', text: f.label }),
              h('span', { class: 'file__dot', hidden: true }, h('span', { class: 'sr-only', text: ' (niet opgeslagen)' })),
            );
            links.set(f.id, a);
            return h('li', {}, a);
          }),
        ),
      ),
    ),
  );
}

els.filter.addEventListener('input', () => {
  const t = squash(els.filter.value).toLowerCase();
  for (const sec of els.nav.children) {
    let any = false;
    for (const li of sec.querySelectorAll('li')) {
      const f = meta.get(li.firstElementChild.dataset.id);
      const show = !t || `${f.label} ${f.id} ${f.group}`.toLowerCase().includes(t);
      li.hidden = !show;
      any ||= show;
    }
    sec.hidden = !any;
  }
});
els.filter.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const first = els.nav.querySelector('li:not([hidden]) a');
  if (first) {
    e.preventDefault();
    location.hash = first.getAttribute('href');
    closeSide();
  }
});

function openSide() {
  app.classList.add('side-open');
  els.scrim.hidden = false;
  els.filter.focus();
}
function closeSide() {
  app.classList.remove('side-open');
  els.scrim.hidden = true;
}
$('sideOpen').addEventListener('click', openSide);
$('sideClose').addEventListener('click', closeSide);
els.scrim.addEventListener('click', closeSide);

// ---------- bestand openen ----------

function idFromHash() {
  const m = location.hash.match(/^#\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function openFile(id, { stay = false } = {}) {
  if (!docs.has(id)) id = DEFAULT;
  const changed = id !== current;
  current = id;
  const f = meta.get(id);
  if (idFromHash() !== id) location.hash = `#/${id}`;
  for (const [fid, a] of links) {
    if (fid === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  els.fileGroup.textContent = f.group;
  els.fileTitle.textContent = f.label;
  els.filePath.textContent = `content/${id}.json`;
  if (changed || !form) {
    pendingLocate = null;
    renderForm();
    els.editor.scrollTop = 0;
    links.get(id)?.scrollIntoView({ block: 'nearest' });
  }
  if (!stay && !showsOn(f, preview.path)) preview.navigate(f.preview);
  renderTabs();
  refreshChrome();
}

function renderForm() {
  const doc = docs.get(current);
  form = buildForm({
    container: els.form,
    scroller: els.editor,
    file: meta.get(current),
    data: doc.data,
    schema: doc.schema,
    icons,
    onChange,
    onFocus,
    toast,
  });
}

window.addEventListener('hashchange', () => {
  const id = idFromHash();
  if (id && id !== current && docs.has(id)) openFile(id);
});

// Tabs met de bestanden waarvan teksten op de getoonde pagina staan.
function renderTabs() {
  const path = preview.path;
  const own = path ? order.filter((id) => ownPage(meta.get(id), path)) : [];
  const shared = path ? order.filter((id) => !own.includes(id) && showsOn(meta.get(id), path)) : [];
  const ids = [...own, ...shared];
  els.related.hidden = ids.length < 2;
  els.related.setAttribute('role', 'tablist');
  els.related.replaceChildren(
    ...(ids.length < 2 ? [] : ids).map((id) =>
      h(
        'button',
        {
          type: 'button',
          class: 'tab',
          role: 'tab',
          'data-id': id,
          'aria-selected': String(id === current),
          onclick: () => openFile(id, { stay: true }),
        },
        h('span', { text: meta.get(id).label }),
        h('span', { class: 'file__dot', hidden: !dirty.has(id) }),
      ),
    ),
  );
}

// ---------- bewerken en live voorbeeld ----------

function onChange(path, info = {}) {
  const doc = docs.get(current);
  failed = false;
  if (info.structural) doc.structural = true;
  checkDirty(current);
  if (!dirty.has(current)) return syncPreview(current);
  if (doc.structural) return preview.note('Nieuwe of verplaatste onderdelen zie je na opslaan');
  const ok = livePatch(current, path);
  preview.note(ok || !showsOn(meta.get(current), preview.path) ? '' : 'Deze wijziging zie je na opslaan');
}

// Andere velden op deze pagina met precies dezelfde tekst.
function rivals(value, id, path) {
  const me = pathKey(path);
  const out = [];
  for (const [did, doc] of docs) {
    if (!showsOn(meta.get(did), preview.path)) continue;
    leaves(doc.shown, (p, v) => {
      if (v === value && !(did === id && pathKey(p) === me)) out.push([doc, p]);
    });
  }
  return out;
}

// Teksten van naburige velden; daarmee kiest het voorbeeld de juiste plek als een tekst vaker voorkomt.
function contextOf(doc, path, value) {
  const own = pathKey(path);
  for (let up = 1; up <= Math.min(3, path.length); up++) {
    const base = path.slice(0, -up);
    const out = [];
    leaves(getAt(doc.shown, base), (p, v) => {
      const full = [...base, ...p];
      const k = lastKey(full);
      if (pathKey(full) === own || isLinkKey(k) || placeholders(v).length) return;
      const t = (isHtmlKey(k) ? stripHtml(v) : v).replace(/\s+/g, ' ').trim().slice(0, 80);
      if (t.length >= 4 && t !== value && !out.includes(t)) out.push(t);
    });
    if (out.length) return out.slice(0, 24);
  }
  return [];
}

// null als de tekst uniek is; anders de context van het eigen veld gevolgd door die van de andere velden.
function contextsFor(id, path, value) {
  const others = rivals(value, id, path);
  if (!others.length) return null;
  return [contextOf(docs.get(id), path, value), ...others.slice(0, 8).map(([d, p]) => contextOf(d, p, value))];
}

function livePatch(id, path) {
  const doc = docs.get(id);
  const nv = getAt(doc.data, path);
  const ov = getAt(doc.shown, path);
  if (nv === ov) return true;
  if (!preview.ready || typeof nv !== 'string' || typeof ov !== 'string') return false;
  if (!showsOn(meta.get(id), preview.path)) return false;
  const ok = preview.patch(`${id}|${pathKey(path)}`, ov, nv, isHtmlKey(lastKey(path)), contextsFor(id, path, ov));
  if (ok) setAt(doc.shown, path, nv);
  return ok;
}

// Breng het voorbeeld in lijn met de (niet-opgeslagen) data van een bestand.
// 'ok', 'partial' (niet alles live te tonen) of 'structure' (andere opbouw).
function syncPreview(id) {
  const doc = docs.get(id);
  const a = flatten(doc.shown);
  const b = flatten(doc.data);
  if (a.size !== b.size || [...a.keys()].some((k) => !b.has(k))) return 'structure';
  let result = 'ok';
  for (const [k, { path, value }] of b) {
    if (a.get(k).value !== value && !livePatch(id, path)) result = 'partial';
  }
  return result;
}

function onFocus(path, el) {
  for (const x of els.form.querySelectorAll('.fld.is-located')) if (x !== el) x.classList.remove('is-located');
  if (!preview.ready) {
    pendingLocate = { id: current, path, el };
    return;
  }
  locateField(current, path, el);
}

function locateField(id, path, el) {
  const doc = docs.get(id);
  let v = doc.structural ? undefined : getAt(doc.shown, path);
  if (typeof v !== 'string') v = getAt(doc.data, path);
  const key = lastKey(path);
  if (typeof v !== 'string' || !v.trim() || isLinkKey(key) || !showsOn(meta.get(id), preview.path)) {
    preview.clearHighlight();
    preview.note(typeof v === 'string' && !isLinkKey(key) && !showsOn(meta.get(id), preview.path) ? 'Deze tekst staat niet op deze pagina' : '');
    el?.classList.remove('is-located');
    return;
  }
  const ok = preview.locate(`${id}|${pathKey(path)}`, v, isHtmlKey(key), contextsFor(id, path, v));
  if (!ok) {
    const f = meta.get(id);
    const elsewhere = [f.preview, ...(f.on || [])].filter((p) => norm(p) !== norm(preview.path));
    if (path.some((k) => k === 'seo' || k === 'jobPosting')) preview.note('Voor zoekmachines en social media, niet zichtbaar op de pagina');
    else if (elsewhere.length) preview.note(`Niet op deze pagina; kijk op ${elsewhere.map(pageName).join(' of ')}`);
  }
  el?.classList.toggle('is-located', ok);
}

function pageName(path) {
  for (const [id, f] of meta) if (id.startsWith('pages/') && ownPage(f, path)) return `“${f.label}”`;
  return path;
}

function onPreviewLoad(path) {
  clearTimeout(reloadTimer);
  reloadTimer = null;
  if (!docs.size) return;

  let pending = false;
  for (const [id, doc] of docs) {
    doc.shown = JSON.parse(doc.savedText);
    if (!dirty.has(id) || !showsOn(meta.get(id), path)) continue;
    if (doc.structural || syncPreview(id) !== 'ok') pending = true;
  }
  preview.note(pending ? 'Sommige wijzigingen zie je pas na opslaan' : '');

  try {
    $('frame').contentDocument.addEventListener('keydown', onKey);
  } catch {
    // andere origin
  }

  // Volg de navigatie in het voorbeeld, maar niet weg van niet-opgeslagen werk.
  const f = meta.get(current);
  if (f && !showsOn(f, path) && !dirty.has(current)) {
    const target = order.find((id) => ownPage(meta.get(id), path));
    if (target) openFile(target, { stay: true });
  }
  renderTabs();

  if (pendingLocate?.id === current && pendingLocate.el?.isConnected) {
    const { id, path: p, el } = pendingLocate;
    setTimeout(() => locateField(id, p, el), 120);
  }
  pendingLocate = null;
}

// ---------- aanwijzen ----------

const reCache = new Map();
function placeholderRe(p) {
  let re = reCache.get(p);
  if (!re) {
    const src = p
      .split(/(\{[a-zA-Z][a-zA-Z0-9]*\})/)
      .map((x, i) => (i % 2 ? '.+?' : escapeRe(x)))
      .join('');
    re = [new RegExp(`^${src}$`), new RegExp(src)];
    reCache.set(p, re);
  }
  return re;
}

function scoreText(value, t) {
  const p = plain(value);
  if (!p || p.length < 2) return 0;
  if (p === t) return 3;
  if (placeholders(p).length) {
    const [full, part] = placeholderRe(p);
    if (full.test(t)) return 2.5;
    if (part.test(t)) return 1.8;
  }
  if (t.length >= 3 && p.includes(t)) return 1 + t.length / p.length;
  if (p.length >= 4 && t.includes(p)) return 0.5 + (p.length / t.length) * 0.5;
  return 0;
}

function findLeaf(text, page) {
  let best = null;
  for (const [id, doc] of docs) {
    const f = meta.get(id);
    const bonus = (showsOn(f, page) ? 1 : 0) + (ownPage(f, page) ? 0.3 : 0) + (id === current && showsOn(f, page) ? 0.4 : 0);
    leaves(doc.structural ? doc.data : doc.shown, (path, value) => {
      const s = scoreText(value, text);
      if (s && (!best || s + bonus > best.score)) best = { id, path, score: s + bonus };
    });
  }
  return best;
}

function setPointing(on) {
  els.pointBtn.setAttribute('aria-pressed', String(on));
  preview.setPointing(on);
  if (on) {
    if (narrow()) setView('preview');
    toast('Klik op een tekst in het voorbeeld. Esc om te stoppen.', { timeout: 3000 });
  }
}

function onPick({ text, context, path }) {
  setPointing(false);
  const needle = text || context;
  if (!needle) return toast('Hier staat geen tekst om te bewerken.');
  let best = findLeaf(needle, path);
  if (!best && context && context !== needle) best = findLeaf(context, path);
  if (!best) return toast('Deze tekst staat niet in het CMS, maar vast in de code.', { type: 'error' });
  if (narrow()) setView('edit');
  openFile(best.id, { stay: true });
  requestAnimationFrame(() => form.reveal(best.path));
}

// ---------- opslaan ----------

async function saveAll() {
  if (saving || !dirty.size) return;
  saving = true;
  failed = false;
  refreshChrome();
  let saved = 0;
  for (const id of [...dirty]) {
    const doc = docs.get(id);
    const text = JSON.stringify(doc.data);
    const label = meta.get(id).label;
    try {
      const r = await api(`file${qid(id)}`, { method: 'PUT', body: `{"hash":${JSON.stringify(doc.hash)},"data":${text}}` });
      doc.hash = r.hash;
      doc.savedText = text;
      if (JSON.stringify(doc.data) === text) {
        dirty.delete(id);
        doc.structural = false;
      }
      saved++;
    } catch (e) {
      failed = true;
      if (e.status === 409) {
        toast(`“${label}” is intussen buiten het CMS gewijzigd.`, { type: 'error', action: 'Herladen', onAction: () => reloadDoc(id) });
      } else if (e.status === 422) {
        toast(`“${label}” is niet opgeslagen: ${e.message}`, { type: 'error', list: (e.data?.errors || []).slice(0, 6) });
      } else {
        toast(`“${label}” is niet opgeslagen: ${e.message}`, { type: 'error' });
      }
    }
  }
  saving = false;
  refreshChrome();
  if (saved) {
    toast(saved > 1 ? `${saved} bestanden opgeslagen` : 'Opgeslagen', { type: 'ok' });
    // Vite herlaadt het voorbeeld zelf; anders doen we het na even wachten.
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => preview.reload(), 1500);
  }
}

async function reloadDoc(id) {
  if (dirty.has(id) && !confirm(`Je niet-opgeslagen wijzigingen in “${meta.get(id).label}” gaan verloren. Doorgaan?`)) return;
  try {
    const r = await api(`file${qid(id)}`);
    Object.assign(docs.get(id), { data: r.data, savedText: JSON.stringify(r.data), hash: r.hash, schema: r.schema, structural: false });
    failed = false;
    if (id === current) renderForm();
    checkDirty(id);
    preview.reload();
  } catch (e) {
    toast(`Herladen mislukt: ${e.message}`, { type: 'error' });
  }
}

function revert() {
  const id = current;
  if (!dirty.has(id) || !confirm(`Niet-opgeslagen wijzigingen in “${meta.get(id).label}” weggooien?`)) return;
  const doc = docs.get(id);
  doc.data = JSON.parse(doc.savedText);
  doc.structural = false;
  failed = false;
  renderForm();
  checkDirty(id);
  if (syncPreview(id) !== 'ok') preview.reload();
  else preview.note('');
}

els.saveBtn.addEventListener('click', saveAll);
els.revertBtn.addEventListener('click', revert);

// ---------- site bouwen ----------

async function build() {
  if (building) return;
  if (dirty.size) {
    if (!confirm('Er zijn niet-opgeslagen wijzigingen. Die worden eerst opgeslagen. Doorgaan?')) return;
    await saveAll();
    if (dirty.size) return;
  }
  building = true;
  const btn = els.buildBtn;
  const label = btn.querySelector('span');
  const icon = btn.querySelector('svg');
  const spinner = h('span', { class: 'spinner' });
  btn.disabled = true;
  icon.hidden = true;
  btn.prepend(spinner);
  label.textContent = 'Bezig met bouwen…';
  try {
    const r = await api('build', { method: 'POST' });
    els.buildLog.textContent = r.log || '';
    if (r.code === 0) {
      const secs = (r.ms / 1000).toLocaleString('nl-NL', { maximumFractionDigits: 1 });
      toast(`Site gebouwd: ${r.pages} pagina’s in ${secs} s`, { type: 'ok', action: 'Log', onAction: () => els.buildDialog.showModal() });
      const time = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      els.buildHint.replaceChildren(`Gebouwd om ${time}. Publiceer nu de map `, h('code', { text: 'dist/' }), '.');
    } else {
      toast('Bouwen is mislukt.', { type: 'error', action: 'Bekijk log', onAction: () => els.buildDialog.showModal() });
    }
  } catch (e) {
    toast(e.status === 409 ? 'Er wordt al gebouwd.' : `Bouwen is mislukt: ${e.message}`, { type: 'error' });
  } finally {
    building = false;
    btn.disabled = false;
    spinner.remove();
    icon.hidden = false;
    label.textContent = 'Site bouwen';
  }
}
els.buildBtn.addEventListener('click', build);

// ---------- zoeken (⌘K) ----------

let finderIndex = [];
let finderItems = [];
let finderSel = 0;

function buildFinderIndex() {
  const out = [];
  for (const id of order) {
    const f = meta.get(id);
    out.push({ kind: 'file', id, hay: `${f.label} ${id} ${f.group}`.toLowerCase() });
    leaves(docs.get(id).data, (path, v) => {
      const text = plain(v);
      if (!text) return;
      const where = pathLabel(path);
      out.push({ kind: 'text', id, path, text, lower: text.toLowerCase(), hay: `${text} ${where} ${f.label}`.toLowerCase(), where });
    });
  }
  return out;
}

function openFinder() {
  if (!docs.size) return;
  finderIndex = buildFinderIndex();
  els.finderInput.value = '';
  els.finder.showModal();
  runFinder();
  els.finderInput.focus();
}

function runFinder() {
  const q = squash(els.finderInput.value).toLowerCase();
  const words = q.split(' ').filter(Boolean);
  let res;
  if (!words.length) {
    res = finderIndex.filter((x) => x.kind === 'file');
  } else {
    res = [];
    for (const x of finderIndex) {
      if (!words.every((w) => x.hay.includes(w))) continue;
      let score = x.kind === 'file' ? 4 : 1;
      if (x.kind === 'file') {
        if (x.hay.startsWith(q)) score += 2;
      } else {
        const i = x.lower.indexOf(q);
        if (i === 0) score += 3;
        else if (i > 0) score += 2;
        else if (words.every((w) => x.lower.includes(w))) score += 1;
        if (x.id === current) score += 0.5;
      }
      res.push({ x, score });
    }
    res = res.sort((a, b) => b.score - a.score).map((r) => r.x);
  }
  finderItems = res.slice(0, 50);
  finderSel = 0;
  els.finderEmpty.hidden = finderItems.length > 0;
  els.finderList.replaceChildren(
    ...finderItems.map((x, i) => {
      const f = meta.get(x.id);
      return h(
        'li',
        {
          id: `fr${i}`,
          role: 'option',
          'aria-selected': String(i === 0),
          onclick: () => chooseResult(x),
          onmousemove: () => selectResult(i, false),
        },
        h(
          'div',
          { class: 'finder__meta' },
          h('span', { class: 'finder__file', text: f.label }),
          h('span', { class: 'finder__path', text: x.kind === 'file' ? f.group : x.where }),
        ),
        h('div', { class: 'finder__snip' }, x.kind === 'file' ? `content/${x.id}.json` : snippet(x.text, words)),
      );
    }),
  );
  els.finderInput.setAttribute('aria-activedescendant', finderItems.length ? 'fr0' : '');
}

function snippet(text, words) {
  const lower = text.toLowerCase();
  const first = Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0), Infinity);
  let start = 0;
  if (first !== Infinity && first > 50) start = Math.max(0, text.lastIndexOf(' ', first - 30) + 1);
  const s = (start ? '…' : '') + text.slice(start, start + 180);
  const sl = s.toLowerCase();
  const marks = [];
  for (const w of words) {
    for (let i = sl.indexOf(w); i !== -1; i = sl.indexOf(w, i + w.length)) marks.push([i, i + w.length]);
  }
  marks.sort((a, b) => a[0] - b[0]);
  const out = [];
  let pos = 0;
  for (const [a, b] of marks) {
    if (a < pos) continue;
    out.push(s.slice(pos, a), h('mark', { text: s.slice(a, b) }));
    pos = b;
  }
  out.push(s.slice(pos));
  return out;
}

function selectResult(i, scroll = true) {
  if (!finderItems.length) return;
  finderSel = (i + finderItems.length) % finderItems.length;
  for (const li of els.finderList.children) li.setAttribute('aria-selected', String(li.id === `fr${finderSel}`));
  els.finderInput.setAttribute('aria-activedescendant', `fr${finderSel}`);
  if (scroll) els.finderList.children[finderSel]?.scrollIntoView({ block: 'nearest' });
}

function chooseResult(x) {
  els.finder.close();
  if (narrow()) setView('edit');
  closeSide();
  openFile(x.id);
  if (x.kind === 'text') requestAnimationFrame(() => form.reveal(x.path));
}

els.finderInput.addEventListener('input', runFinder);
els.finderInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    selectResult(finderSel + (e.key === 'ArrowDown' ? 1 : -1));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (finderItems[finderSel]) chooseResult(finderItems[finderSel]);
  }
});
els.findBtn.addEventListener('click', openFinder);

// ---------- geschiedenis ----------

function display(v) {
  if (v === undefined) return '(bestaat niet)';
  if (v === null) return '(leeg)';
  if (typeof v === 'boolean') return v ? 'ja' : 'nee';
  if (typeof v !== 'string') return String(v);
  return plain(v) || '(leeg)';
}

function diffData(from, to) {
  const a = flatten(from);
  const b = flatten(to);
  const hidden = (p) => p.some((s) => typeof s === 'string' && s.startsWith('_'));
  const out = [];
  for (const [k, x] of a) {
    if (hidden(x.path)) continue;
    const y = b.get(k);
    if (!y || y.value !== x.value) out.push({ path: x.path, before: x.value, after: y ? y.value : undefined });
  }
  for (const [k, y] of b) if (!a.has(k) && !hidden(y.path)) out.push({ path: y.path, before: undefined, after: y.value });
  return out;
}

async function openHistory() {
  const id = current;
  els.historyTitle.textContent = `Geschiedenis – ${meta.get(id).label}`;
  els.historyList.replaceChildren(h('li', {}, h('span', { class: 'spinner' })));
  els.historyDetail.replaceChildren(h('p', { class: 'muted', text: 'Kies een versie om te zien wat er anders is dan nu.' }));
  els.history.showModal();
  let versions;
  try {
    ({ versions } = await api(`history${qid(id)}`));
  } catch (e) {
    els.historyList.replaceChildren(h('li', {}, h('p', { class: 'muted', text: e.message })));
    return;
  }
  if (!versions.length) {
    els.historyList.replaceChildren();
    els.historyDetail.replaceChildren(
      h('p', { class: 'muted', text: 'Nog geen eerdere versies. Bij elke keer opslaan bewaart het CMS de vorige versie (de laatste 30).' }),
    );
    return;
  }
  els.historyList.replaceChildren(
    ...versions.map((v) => {
      const btn = h(
        'button',
        { type: 'button', onclick: () => showVersion(id, v, btn) },
        h('strong', { text: relTime(v.date) }),
        h('span', { text: fmtDate(v.date) }),
      );
      return h('li', {}, btn);
    }),
  );
}

async function showVersion(id, v, btn) {
  for (const b of els.historyList.querySelectorAll('button')) b.setAttribute('aria-current', String(b === btn));
  els.historyDetail.replaceChildren(h('span', { class: 'spinner' }));
  let data;
  try {
    ({ data } = await api(`history${qid(id)}&v=${encodeURIComponent(v.v)}`));
  } catch (e) {
    els.historyDetail.replaceChildren(h('p', { class: 'muted', text: e.message }));
    return;
  }
  if (btn.getAttribute('aria-current') !== 'true') return;
  const changes = diffData(docs.get(id).data, data);
  const restoreBtn = h('button', {
    type: 'button',
    class: 'btn btn--yellow',
    text: 'Deze versie terugzetten',
    disabled: !changes.length,
    onclick: () => restoreVersion(id, data),
  });
  if (!changes.length) {
    els.historyDetail.replaceChildren(h('p', { class: 'muted', text: 'Deze versie is gelijk aan wat je nu hebt.' }), h('div', {}, restoreBtn));
    return;
  }
  const shown = changes.slice(0, 150);
  els.historyDetail.replaceChildren(
    h('p', {}, h('strong', { text: `${changes.length} ${changes.length === 1 ? 'tekst' : 'teksten'}` }), ' anders. Terugzetten verandert:'),
    h(
      'ul',
      { class: 'diff' },
      shown.map((c) => {
        let before = display(c.before);
        let after = display(c.after);
        if (before === after) {
          before = String(c.before);
          after = String(c.after);
        }
        return h(
          'li',
          {},
          h('span', { class: 'diff__path', text: pathLabel(c.path) }),
          h('p', { class: 'diff__old', text: before }),
          h('p', { class: 'diff__new', text: after }),
        );
      }),
    ),
    changes.length > shown.length ? h('p', { class: 'muted', text: `En nog ${changes.length - shown.length} andere.` }) : null,
    h('div', {}, restoreBtn),
  );
}

function restoreVersion(id, data) {
  const doc = docs.get(id);
  doc.data = clone(data);
  els.history.close();
  if (id === current) renderForm();
  doc.structural = false;
  checkDirty(id);
  if (dirty.has(id)) {
    const r = syncPreview(id);
    if (r === 'structure') doc.structural = true;
    preview.note(r === 'ok' ? '' : 'De teruggezette versie zie je helemaal na opslaan');
  }
  toast('Versie teruggezet. Klik op Opslaan om hem te bewaren.', { type: 'ok' });
}

els.historyBtn.addEventListener('click', openHistory);

// ---------- dialogen ----------

for (const dlg of document.querySelectorAll('dialog')) {
  let downOnBackdrop = false;
  dlg.addEventListener('mousedown', (e) => (downOnBackdrop = e.target === dlg));
  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) dlg.close();
    else if (e.target === dlg && downOnBackdrop) dlg.close();
  });
}

// ---------- weergave: splitter, apparaat, mobiel ----------

function setEditorW(pct, store = true) {
  const w = els.work.clientWidth || window.innerWidth;
  const max = Math.max(30, ((w - 380) / w) * 100);
  const v = Math.min(max, Math.max(20, pct));
  els.work.style.setProperty('--editor-w', `${v}%`);
  els.split.setAttribute('aria-valuenow', String(Math.round(v)));
  if (store) localStorage.setItem('cms:editor-w', String(v));
}
els.split.setAttribute('aria-valuemin', '20');
els.split.setAttribute('aria-valuemax', '80');
{
  const saved = Number(localStorage.getItem('cms:editor-w'));
  if (saved) setEditorW(saved, false);
  else els.split.setAttribute('aria-valuenow', '44');
}
els.split.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  els.split.setPointerCapture(e.pointerId);
  els.split.classList.add('is-dragging');
  document.body.classList.add('is-resizing');
  const r = els.work.getBoundingClientRect();
  const move = (ev) => setEditorW(((ev.clientX - r.left) / r.width) * 100);
  const up = () => {
    els.split.classList.remove('is-dragging');
    document.body.classList.remove('is-resizing');
    els.split.removeEventListener('pointermove', move);
    els.split.removeEventListener('pointerup', up);
    els.split.removeEventListener('pointercancel', up);
  };
  els.split.addEventListener('pointermove', move);
  els.split.addEventListener('pointerup', up);
  els.split.addEventListener('pointercancel', up);
});
els.split.addEventListener('keydown', (e) => {
  const now = Number(els.split.getAttribute('aria-valuenow')) || 44;
  const step = { ArrowLeft: -3, ArrowRight: 3, Home: -100, End: 100 }[e.key];
  if (step == null) return;
  e.preventDefault();
  setEditorW(now + step);
});
els.split.addEventListener('dblclick', () => setEditorW(44));

const deviceBtns = [...document.querySelectorAll('.seg [data-device]')];
function syncDevice() {
  for (const b of deviceBtns) b.setAttribute('aria-pressed', String(b.dataset.device === preview.device));
}
for (const b of deviceBtns) {
  b.addEventListener('click', () => {
    preview.setDevice(b.dataset.device);
    syncDevice();
  });
}

function setView(v) {
  app.dataset.view = v;
  for (const b of document.querySelectorAll('.switch [data-view]')) b.setAttribute('aria-pressed', String(b.dataset.view === v));
}
for (const b of document.querySelectorAll('.switch [data-view]')) b.addEventListener('click', () => setView(b.dataset.view));

els.pointBtn.addEventListener('click', () => setPointing(els.pointBtn.getAttribute('aria-pressed') !== 'true'));
els.reloadBtn.addEventListener('click', () => preview.reload());

// ---------- sneltoetsen ----------

function onKey(e) {
  const mod = e.metaKey || e.ctrlKey;
  if (!mod || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 's' && !e.shiftKey) {
    e.preventDefault();
    saveAll();
  } else if (k === 'k') {
    e.preventDefault();
    if (els.finder.open) els.finder.close();
    else if (!document.querySelector('dialog[open]')) openFinder();
  }
}
document.addEventListener('keydown', onKey);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && app.classList.contains('side-open')) closeSide();
});

window.addEventListener('beforeunload', (e) => {
  if (!dirty.size) return;
  e.preventDefault();
  e.returnValue = '';
});

// ---------- start ----------

const preview = createPreview({
  frame: $('frame'),
  stage: $('stage'),
  device: $('device'),
  urlEl: $('previewUrl'),
  openBtn: $('openBtn'),
  noteEl: $('previewNote'),
  onLoad: onPreviewLoad,
  onPick,
  onPointEnd: () => els.pointBtn.setAttribute('aria-pressed', 'false'),
});
syncDevice();

async function init() {
  setStatus('busy', 'Laden…');
  try {
    const [{ groups }, ic] = await Promise.all([api('files'), api('icons').catch(() => ({ icons: {} }))]);
    icons = ic.icons || {};
    for (const g of groups) {
      for (const f of g.files) {
        meta.set(f.id, f);
        order.push(f.id);
      }
    }
    renderSidebar(groups);
    const loaded = await Promise.all(order.map((id) => api(`file${qid(id)}`)));
    for (const r of loaded) {
      const savedText = JSON.stringify(r.data);
      docs.set(r.id, { data: r.data, savedText, hash: r.hash, schema: r.schema, shown: JSON.parse(savedText), structural: false });
    }
  } catch (e) {
    els.fileTitle.textContent = 'Het CMS kon niet laden';
    setStatus('error', 'Fout');
    els.form.replaceChildren(h('p', { class: 'intro', text: `${e.message} Draait de ontwikkelserver nog? Herlaad dan deze pagina.` }));
    return;
  }
  openFile(idFromHash() || DEFAULT);
}

init();
