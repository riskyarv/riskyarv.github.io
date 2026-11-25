// Kleine hulpfuncties die door alle CMS-modules gedeeld worden.

export const ICON = {
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  unlink: '<path d="M14.5 9.5l1-1M9.5 14.5l-1 1M17 13l2-2a4 4 0 0 0-5.7-5.7l-2 2M7 11l-2 2a4 4 0 0 0 5.7 5.7l2-2M4 4l16 16"/>',
  ul: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  ol: '<path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M4 9h3M4 14.5c.5-1 2.8-1 2.8.5S4 17 4 19.5h3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

export const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : String(c));
  return el;
}

export const pathKey = (path) => path.join('\u001f');
export const patternOf = (path) => path.map((p) => (typeof p === 'number' ? '*' : p)).join('.');

export function getAt(obj, path) {
  return path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setAt(obj, path, value) {
  const parent = getAt(obj, path.slice(0, -1));
  parent[path.at(-1)] = value;
}

export const clone = (v) => (v === undefined ? v : structuredClone(v));

const decoder = document.createElement('template');
export function stripHtml(s) {
  if (typeof s !== 'string') return '';
  if (!/[<&]/.test(s)) return s;
  decoder.innerHTML = s.replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|li|h\d)>/gi, '$& ');
  return decoder.content.textContent;
}

export const squash = (s) => s.replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();

export const isHtmlKey = (k) => typeof k === 'string' && (k === 'html' || /Html$/.test(k));
export const isLinkKey = (k) =>
  typeof k === 'string' && (/^(href|url|src|maps|linkedin|risqui)$/.test(k) || /(Href|Url)$/.test(k));

export const placeholders = (s) => (typeof s === 'string' ? s.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) || [] : []);

// Alle tekstwaarden van een bestand, met pad.
export function leaves(data, visit, path = []) {
  if (typeof data === 'string') visit(path, data);
  else if (Array.isArray(data)) data.forEach((v, i) => leaves(v, visit, [...path, i]));
  else if (data && typeof data === 'object') {
    for (const k of Object.keys(data)) if (!k.startsWith('_')) leaves(data[k], visit, [...path, k]);
  }
}

export function flatten(data, out = new Map(), path = []) {
  if (Array.isArray(data)) data.forEach((v, i) => flatten(v, out, [...path, i]));
  else if (data && typeof data === 'object') for (const k of Object.keys(data)) flatten(data[k], out, [...path, k]);
  else out.set(pathKey(path), { path, value: data });
  return out;
}

export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export const slugify = (s) =>
  stripHtml(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' en ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const fmtDate = (iso) =>
  new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

export const relTime = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('nl', { numeric: 'auto' });
  if (s < 60) return 'zojuist';
  if (s < 3600) return rtf.format(-Math.round(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
  return rtf.format(-Math.round(s / 86400), 'day');
};
