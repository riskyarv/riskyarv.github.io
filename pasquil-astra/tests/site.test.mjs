import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { aliases, pages, serviceUrl } from "../src/catalog.js";

const root = path.resolve("dist");
const htmlFiles = readdirSync(root, {recursive:true}).filter(f => f.endsWith(".html"));
const localFile = pathname => path.join(root, decodeURIComponent(pathname), pathname.endsWith("/") ? "index.html" : "");
const html = url => readFileSync(localFile(url),"utf8");

test("Alle pagina’s, media, interne links en fragmenten zijn aanwezig in de statische site", () => {
  for (const f of htmlFiles) {
    const source = readFileSync(path.join(root,f),"utf8");
    for (const [,href] of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const u = new URL(href, `https://pasquil.nl/${f}`);
      if (u.origin !== "https://pasquil.nl") continue;
      assert.ok(existsSync(localFile(u.pathname)), `${f}: ${href} ontbreekt`);
      if (u.hash) {
        assert.ok(html(u.pathname).includes(`id="${decodeURIComponent(u.hash.slice(1))}"`), `${f}: ${href} mist een bestemming`);
      }
    }
  }
});

test("Dienstlinks blijven deelbaar en de volledige inhoud is beschikbaar zonder JavaScript", () => {
  const all = JSON.parse(readFileSync("content/services.json","utf8"));
  const output = html(serviceUrl);
  for (const s of all) {
    assert.ok(output.includes(`<details class="service-fold" id="${s.id}">`));
    assert.ok(output.includes(s.body));
  }
  for (const [oldUrl,target] of Object.entries(aliases)) {
    assert.ok(html(oldUrl).includes(`content="0;url=${target}"`));
  }
});

test("Ieder openbaar document heeft een eigen titel en uitsluitend lokale scripts, beelden en stijlen", () => {
  const titles = new Set();
  for (const p of pages) {
    const source = html(p.url);
    const title = source.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title),p.url);
    titles.add(title);
    assert.equal((source.match(/<h1>/g) || []).length,1,p.url);
    assert.doesNotMatch(source,/<(?:script|img|video|link)\b[^>]*(?:src|href)="https?:\/\/(?!pasquil\.nl)/i);
  }
});
