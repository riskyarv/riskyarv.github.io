import { serviceUrl, approachUrl, teamUrl, contactUrl, libraryUrl, riskUrl, trainingUrl, risquiUrl, jobsUrl, collaborationUrl, linkedin, email, maps } from "./catalog.js";

export const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M5 19 19 5M6 5h13v13"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
  pin: '<path d="M19 10c0 4-7 11-7 11S5 14 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  spark: '<path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke-width="3"/>',
  down: '<path d="M12 3v17m-6-6 6 6 6-6"/>'
};
export const icon = (name, size = 20) => `<svg class="icon icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
export const img = (name, cls = "", alt = "") => `<img class="${cls}" src="/media/${name}.webp" alt="${esc(alt)}" loading="lazy" decoding="async">`;
export const button = (url, text, style = "yellow", arrow = "arrow") => `<a class="button ${style}" href="${esc(url)}">${esc(text)}${icon(arrow, 18)}</a>`;
export const link = (url, text, arrow = "arrow") => `<a class="text-link" href="${esc(url)}">${esc(text)} ${icon(arrow, 17)}</a>`;
export const kicker = text => `<div class="kicker"><span></span>${esc(text)}</div>`;
export const num = n => String(n).padStart(2, "0");

const basics = [[serviceUrl,"Diensten"],[approachUrl,"Onze aanpak"],[teamUrl,"Over ons"]];
const knowledge = [[libraryUrl,"Alle kennis"],[riskUrl,"Standaard risicosets"],["/blog-risicomanagement/","Blog risicomanagement"],[trainingUrl,"Trainingen"],[risquiUrl,"Risqui"]];

function navlinks(entries, current = "") {
  return entries.map(([url,label]) => `<a href="${url}"${url === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");
}
export function header(current) {
  return `<a class="skip" href="#inhoud">Naar de inhoud</a>
  <header class="site-header"><div class="wrap header-inner">
    <a class="wordmark" href="/" aria-label="Pasquil – home"><img src="/media/pasquil.webp" width="138" height="40" alt="Pasquil"></a>
    <nav class="desktop-nav" aria-label="Hoofdnavigatie">${navlinks(basics,current)}
      <details class="nav-drop"><summary>Kennisbank ${icon("chevron",14)}</summary><div class="drop-panel">${navlinks(knowledge,current)}</div></details>
    </nav>
    <div class="header-cta">${button(contactUrl,"Kennismaken","ink","diagonal")}</div>
    <details class="mobile-menu"><summary aria-label="Hoofdmenu">${icon("menu",23)}${icon("close",23)}</summary>
    <nav aria-label="Mobiele navigatie"><div class="wrap">${navlinks([...basics,[libraryUrl,"Kennisbank"],[trainingUrl,"Trainingen"],[risquiUrl,"Risqui"],[contactUrl,"Contact"]],current)}</div></nav></details>
  </div></header>`;
}
export function footer() {
  return `<footer class="footer"><div class="wrap footer-top">
    <div class="footer-brand"><a href="/" aria-label="Pasquil – home"><img src="/media/pasquil-wit.webp" width="140" height="41" alt="Pasquil"></a><p>Informatiebeveiliging en privacy.<br>Met een frisse blik vanuit Utrecht.</p></div>
    <div><h2>Ontdek Pasquil</h2>${navlinks([...basics,[jobsUrl,"Vacatures"],[collaborationUrl,"Samenwerken"]])}</div>
    <div><h2>Kennis & tools</h2>${navlinks([[libraryUrl,"Kennisbank"],[riskUrl,"Risicosets"],[trainingUrl,"Trainingen"],[risquiUrl,"Risqui"]])}</div>
    <div><h2>Contact</h2><a href="${email}">hallo@pasquil.nl</a><a href="${maps}">Moreelsepark 1, Utrecht</a><a href="${linkedin}">LinkedIn ${icon("diagonal",13)}</a></div>
  </div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Pasquil</span><a href="/privacy-cookie-statement/">Privacy & cookies</a><a href="/responsible-disclosure-policy/">Responsible disclosure</a></div></footer>`;
}
export function contactBand() {
  return `<aside class="contact-band"><div class="wrap"><div>${kicker("Even kennismaken")}<h2>Koffie in Utrecht<span>?</span></h2><p>Vertel ons waar je tegenaan loopt. We denken graag met je mee.</p></div>${button(contactUrl,"Neem contact op","ink","diagonal")}</div></aside>`;
}
export function intro(p) {
  return `<div class="page-intro"><div class="wrap"><div class="crumb"><a href="/">Home</a> <span>/</span> ${esc(p.type)}</div>
    ${kicker(p.type)}<h1>${esc(p.title)}<span class="period">.</span></h1><p>${esc(p.description)}</p></div></div>`;
}
export function layout(p, body) {
  const title = `${p.title} | Pasquil`, description = esc(p.description);
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title><meta name="description" content="${description}"><meta name="theme-color" content="#f8f7f1">
    ${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="https://pasquil.nl${esc(p.url)}">`}
    <meta property="og:site_name" content="Pasquil"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${description}"><meta property="og:image" content="https://pasquil.nl/media/kantoor.webp">
    <link rel="icon" href="/media/favicon.png"><link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head><body>${header(p.url)}
    <main id="inhoud">${body}</main>${footer()}</body></html>`;
}
