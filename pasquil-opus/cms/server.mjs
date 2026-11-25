// Request-handler van het CMS. Draait alleen als middleware in de Astro-devserver
// (zie integration.mjs) en is uitsluitend bereikbaar via localhost.
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as initialConfig from './config.mjs';

const UI_DIR = fileURLToPath(new URL('./ui/', import.meta.url));
const CONFIG_URL = new URL('./config.mjs', import.meta.url);

// cms/config.mjs opnieuw inlezen zodra het verandert, zodat een herstart niet nodig is.
let cfg = initialConfig;
let cfgMtime = 0;
async function loadConfig(logger) {
  const m = (await fs.stat(CONFIG_URL)).mtimeMs;
  if (!cfgMtime) cfgMtime = m;
  if (m === cfgMtime) return;
  cfgMtime = m;
  try {
    cfg = await import(`${CONFIG_URL.href}?v=${m}`);
    logger?.info('cms/config.mjs opnieuw ingelezen');
  } catch (e) {
    logger?.error(`cms/config.mjs bevat een fout, vorige versie blijft actief: ${e.message}`);
  }
}
const ID_RE = /^[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*)*$/;
const VERSION_RE = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/;
const HOST_RE = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
const LOOPBACK_RE = /^(127\.\d+\.\d+\.\d+|::1|::ffff:127\.\d+\.\d+\.\d+)$/;
const HISTORY_MAX = 30;
const BODY_MAX = 4 * 1024 * 1024;
const DANGEROUS = /<\s*(script|iframe|object|embed|style)\b|\son[a-z]+\s*=|javascript\s*:/i;

const MIME = { js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8' };
const CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
].join('; ');

const sha1 = (s) => crypto.createHash('sha1').update(s).digest('hex');
const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const join = (p, k) => (p ? `${p}.${k}` : k);

class HttpError extends Error {
  constructor(status, message, extra) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// ---------- schema: afgeleid van de huidige inhoud + eerdere versies ----------

const mk = () => ({ t: [], n: 0 });

function addShape(node, v, key) {
  const t = typeOf(v);
  if (!node.t.includes(t)) node.t.push(t);
  if (t === 'object') {
    node.keys ??= {};
    node.cnt ??= {};
    node.n++;
    for (const k of Object.keys(v)) {
      node.keys[k] = addShape(node.keys[k] || mk(), v[k], k);
      node.cnt[k] = (node.cnt[k] || 0) + 1;
    }
  } else if (t === 'array') {
    node.lens ??= [];
    if (!node.lens.includes(v.length)) node.lens.push(v.length);
    for (const x of v) node.item = addShape(node.item || mk(), x, key);
  } else if (t === 'string' && cfg.enums.includes(key)) {
    node.vals ??= [];
    if (!node.vals.includes(v)) node.vals.push(v);
  }
  return node;
}

function finalize(node) {
  if (!node) return undefined;
  const out = { t: node.t };
  if (node.keys) {
    out.keys = {};
    for (const k of Object.keys(node.keys)) out.keys[k] = finalize(node.keys[k]);
    out.req = Object.keys(node.cnt).filter((k) => node.cnt[k] === node.n);
  }
  if (node.item) out.item = finalize(node.item);
  if (node.item && node.item.t.length === 1 && node.item.t[0] === 'boolean') out.lens = node.lens;
  if (node.vals) out.vals = node.vals;
  return out;
}

function getAll(data, pattern) {
  let list = [['', data]];
  if (pattern === '') return list;
  for (const seg of pattern.split('.')) {
    const next = [];
    for (const [p, v] of list) {
      if (seg === '*') {
        if (Array.isArray(v)) v.forEach((x, i) => next.push([`${p}[${i}]`, x]));
      } else if (v && typeof v === 'object' && !Array.isArray(v) && seg in v) {
        next.push([join(p, seg), v[seg]]);
      }
    }
    list = next;
  }
  return list.filter(([, v]) => Array.isArray(v));
}

function validate(schema, data, prev, meta, icons) {
  const errs = [];
  const check = (node, v, p, key) => {
    if (errs.length >= 25) return;
    const where = p || '(root)';
    if (!node) return void errs.push(`${where}: onbekend veld`);
    const t = typeOf(v);
    const ok = node.t.includes(t) || (t === 'null' && node.t.includes('string')) || (t === 'string' && node.t.includes('null'));
    if (!ok) return void errs.push(`${where}: verwacht ${node.t.join('/')}, kreeg ${t}`);
    if (t === 'object') {
      for (const k of Object.keys(v)) {
        if (!node.keys || !(k in node.keys)) errs.push(`${join(p, k)}: onbekend veld`);
        else check(node.keys[k], v[k], join(p, k), k);
      }
      for (const k of node.req || []) if (!(k in v)) errs.push(`${join(p, k)}: ontbreekt`);
    } else if (t === 'array') {
      if (!node.item) {
        if (v.length) errs.push(`${where}: deze lijst moet leeg blijven`);
        return;
      }
      if (node.lens && !node.lens.includes(v.length)) errs.push(`${where}: moet ${node.lens.join(' of ')} waarden hebben`);
      v.forEach((x, i) => check(node.item, x, `${p}[${i}]`, key));
      const ids = v.filter((x) => x && typeof x === 'object' && typeof x.id === 'string').map((x) => x.id);
      if (ids.some((id) => !id.trim())) errs.push(`${where}: elk item heeft een id nodig`);
      const dup = ids.find((id, i) => id && ids.indexOf(id) !== i);
      if (dup) errs.push(`${where}: id “${dup}” komt dubbel voor`);
    } else if (t === 'string') {
      if (v.length > 200_000) errs.push(`${where}: tekst is te lang`);
      if (DANGEROUS.test(v)) errs.push(`${where}: scripts, inline event-handlers en javascript:-links zijn niet toegestaan`);
      if (node.vals && cfg.enums.includes(key) && !node.vals.includes(v)) errs.push(`${where}: ongeldige waarde “${v}”`);
      if (key === 'icon' && icons && !Object.hasOwn(icons, v)) errs.push(`${where}: onbekend icoon “${v}”`);
    } else if (t === 'number' && !Number.isFinite(v)) {
      errs.push(`${where}: ongeldig getal`);
    }
  };
  check(schema, data, '', '');

  for (const pattern of meta.fixed || []) {
    const before = new Map(getAll(prev, pattern).map(([p, a]) => [p, a]));
    for (const [p, a] of getAll(data, pattern)) {
      const b = before.get(p);
      if (!b) continue;
      const idsA = a.map((x) => x?.id).join('|');
      const idsB = b.map((x) => x?.id).join('|');
      if (a.length !== b.length || idsA !== idsB) errs.push(`${p || '(root)'}: aantal en volgorde liggen vast`);
    }
  }
  for (const pattern of meta.min1 || []) {
    for (const [p, a] of getAll(data, pattern)) if (!a.length) errs.push(`${p || '(root)'}: minimaal één item nodig`);
  }
  return errs;
}

// ---------- helpers ----------

function send(res, status, body, headers = {}) {
  const isJson = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(status, {
    'content-type': isJson ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  res.end(isJson ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > BODY_MAX) {
        reject(new HttpError(413, 'Te groot'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function walkJson(dir, base = dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walkJson(p, base, out);
    else if (e.name.endsWith('.json')) out.push(path.relative(base, p).slice(0, -5).split(path.sep).join('/'));
  }
  return out;
}

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

// ---------- handler ----------

export function createHandler({ root, logger }) {
  const contentDir = path.join(root, 'content');
  const historyDir = path.join(root, '.cms-history');
  const req_ = createRequire(path.join(root, 'package.json'));
  let building = false;
  let iconsCache;

  const fileOf = (id) => {
    if (typeof id !== 'string' || !ID_RE.test(id)) throw new HttpError(400, 'Ongeldig bestand');
    const p = path.join(contentDir, `${id}.json`);
    if (!p.startsWith(contentDir + path.sep)) throw new HttpError(400, 'Ongeldig bestand');
    return p;
  };
  const histOf = (id) => path.join(historyDir, id.replaceAll('/', '__'));

  async function readFile(id) {
    try {
      return await fs.readFile(fileOf(id), 'utf8');
    } catch (e) {
      if (e.code === 'ENOENT') throw new HttpError(404, 'Bestand niet gevonden');
      throw e;
    }
  }

  async function versions(id) {
    try {
      return (await fs.readdir(histOf(id)))
        .filter((f) => f.endsWith('.json') && VERSION_RE.test(f.slice(0, -5)))
        .sort()
        .reverse();
    } catch {
      return [];
    }
  }

  async function schemaFor(id, current) {
    const node = addShape(mk(), current, '');
    for (const v of await versions(id)) {
      try {
        addShape(node, JSON.parse(await fs.readFile(path.join(histOf(id), v), 'utf8')), '');
      } catch {}
    }
    return finalize(node);
  }

  async function icons() {
    const file = path.join(root, 'src/data/icons.ts');
    const stat = await fs.stat(file).catch(() => null);
    if (!stat) return null;
    if (iconsCache?.mtime === stat.mtimeMs) return iconsCache.data;
    const m = (await fs.readFile(file, 'utf8')).match(/export const icons = (\{.*?\})( as const)?;/s);
    const data = m ? JSON.parse(m[1]) : null;
    iconsCache = { mtime: stat.mtimeMs, data };
    return data;
  }

  function fontPath() {
    try {
      const dir = path.dirname(req_.resolve('@fontsource-variable/montserrat/package.json'));
      return path.join(dir, 'files/montserrat-latin-wght-normal.woff2');
    } catch {
      return null;
    }
  }

  function runBuild() {
    const astroDir = path.dirname(req_.resolve('astro/package.json'));
    const bin = path.join(astroDir, 'bin/astro.mjs');
    return new Promise((resolve) => {
      const started = Date.now();
      let log = '';
      const child = spawn(process.execPath, [bin, 'build'], {
        cwd: root,
        env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
      });
      const collect = (c) => {
        log += c.toString();
        if (log.length > 400_000) log = log.slice(-200_000);
      };
      child.stdout.on('data', collect);
      child.stderr.on('data', collect);
      child.on('error', (e) => resolve({ code: -1, ms: Date.now() - started, log: String(e) }));
      child.on('close', (code) => {
        log = stripAnsi(log);
        const pages = Number(log.match(/(\d+) page\(s\) built/)?.[1] || 0);
        resolve({ code, ms: Date.now() - started, pages, log: log.split('\n').slice(-60).join('\n') });
      });
    });
  }

  async function api(req, res, route, url) {
    await loadConfig(logger);
    const id = url.searchParams.get('id');

    if (route === 'files' && req.method === 'GET') {
      const ids = (await walkJson(contentDir)).sort();
      const byGroup = new Map(cfg.groups.map((g) => [g, []]));
      const order = Object.keys(cfg.files);
      ids.sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999) || a.localeCompare(b));
      for (const fid of ids) {
        const meta = cfg.files[fid] || { group: 'Overig', label: fid, preview: '/' };
        if (!byGroup.has(meta.group)) byGroup.set(meta.group, []);
        byGroup.get(meta.group).push({ id: fid, ...meta });
      }
      return send(res, 200, {
        groups: [...byGroup].filter(([, f]) => f.length).map(([name, files]) => ({ name, files })),
      });
    }

    if (route === 'file' && req.method === 'GET') {
      const text = await readFile(id);
      const data = JSON.parse(text);
      return send(res, 200, { id, data, hash: sha1(text), schema: await schemaFor(id, data) });
    }

    if (route === 'file' && req.method === 'PUT') {
      const meta = cfg.files[id] || {};
      let body;
      try {
        body = JSON.parse(await readBody(req));
      } catch (e) {
        if (e instanceof HttpError) throw e;
        throw new HttpError(400, 'Ongeldige JSON');
      }
      const current = await readFile(id);
      if (body.hash !== sha1(current)) {
        throw new HttpError(409, 'Dit bestand is intussen buiten het CMS gewijzigd.', { hash: sha1(current) });
      }
      const prev = JSON.parse(current);
      const errors = validate(await schemaFor(id, prev), body.data, prev, meta, await icons());
      if (errors.length) throw new HttpError(422, 'De inhoud past niet bij de structuur van dit bestand.', { errors });
      const text = `${JSON.stringify(body.data, null, 2)}\n`;
      if (text === current) return send(res, 200, { hash: sha1(text), unchanged: true });

      const dir = histOf(id);
      await fs.mkdir(dir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await fs.writeFile(path.join(dir, `${stamp}.json`), current);
      for (const old of (await versions(id)).slice(HISTORY_MAX)) await fs.rm(path.join(dir, old), { force: true });
      await fs.writeFile(fileOf(id), text);
      logger?.info(`opgeslagen: content/${id}.json`);
      return send(res, 200, { hash: sha1(text) });
    }

    if (route === 'history' && req.method === 'GET') {
      fileOf(id);
      const v = url.searchParams.get('v');
      if (v) {
        if (!VERSION_RE.test(v)) throw new HttpError(400, 'Ongeldige versie');
        try {
          return send(res, 200, { data: JSON.parse(await fs.readFile(path.join(histOf(id), `${v}.json`), 'utf8')) });
        } catch {
          throw new HttpError(404, 'Versie niet gevonden');
        }
      }
      const list = [];
      for (const f of await versions(id)) {
        const stat = await fs.stat(path.join(histOf(id), f));
        const iso = f.slice(0, -5).replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, 'T$1:$2:$3.$4Z');
        list.push({ v: f.slice(0, -5), date: iso, size: stat.size });
      }
      return send(res, 200, { versions: list });
    }

    if (route === 'icons' && req.method === 'GET') return send(res, 200, { icons: (await icons()) || {} });

    if (route === 'build' && req.method === 'POST') {
      if (building) throw new HttpError(409, 'Er loopt al een build.');
      building = true;
      try {
        logger?.info('site bouwen…');
        const result = await runBuild();
        logger?.info(result.code === 0 ? `build klaar (${result.pages} pagina’s)` : `build mislukt (code ${result.code})`);
        return send(res, 200, result);
      } finally {
        building = false;
      }
    }

    throw new HttpError(404, 'Onbekende API-route');
  }

  return async function cmsMiddleware(req, res, next) {
    const url = new URL(req.url || '/', 'http://localhost');
    const p = url.pathname;
    if (p !== '/cms' && !p.startsWith('/cms/')) return next();

    try {
      const host = req.headers.host || '';
      // Ook bij `astro dev --host` alleen verbindingen vanaf deze computer (de Host-header is te vervalsen).
      if (!LOOPBACK_RE.test(req.socket?.remoteAddress || '') || !HOST_RE.test(host)) throw new HttpError(403, 'Het CMS is alleen bereikbaar via localhost.');
      const origin = req.headers.origin;
      if (origin && origin !== `http://${host}`) throw new HttpError(403, 'Verzoek van een andere origin geweigerd.');
      if (req.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(req.headers['sec-fetch-site'])) {
        throw new HttpError(403, 'Verzoek van een andere site geweigerd.');
      }

      if (p === '/cms') return send(res, 302, '', { location: '/cms/' });

      if (p.startsWith('/cms/api/')) {
        if (req.headers['x-cms'] !== '1') throw new HttpError(403, 'Ontbrekende CMS-header.');
        return await api(req, res, p.slice('/cms/api/'.length), url);
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Niet toegestaan');

      if (p === '/cms/') {
        const html = await fs.readFile(path.join(UI_DIR, 'index.html'));
        return send(res, 200, html, {
          'content-type': 'text/html; charset=utf-8',
          'content-security-policy': CSP,
          'referrer-policy': 'no-referrer',
          'x-frame-options': 'DENY',
        });
      }

      if (p === '/cms/font.woff2') {
        const f = fontPath();
        if (!f || !existsSync(f)) throw new HttpError(404, 'Niet gevonden');
        return send(res, 200, await fs.readFile(f), { 'content-type': 'font/woff2', 'cache-control': 'max-age=86400' });
      }

      const m = p.match(/^\/cms\/([a-z][a-z0-9-]*)\.(js|css)$/);
      if (m) {
        const file = path.join(UI_DIR, `${m[1]}.${m[2]}`);
        if (!existsSync(file)) throw new HttpError(404, 'Niet gevonden');
        return send(res, 200, await fs.readFile(file), { 'content-type': MIME[m[2]] });
      }

      throw new HttpError(404, 'Niet gevonden');
    } catch (e) {
      if (e instanceof HttpError) return send(res, e.status, { error: e.message, ...e.extra });
      logger?.error(e?.stack || String(e));
      return send(res, 500, { error: 'Interne fout in het CMS.' });
    }
  };
}
