import { readFileSync } from "node:fs";
import { serviceUrl, contactUrl, libraryUrl, resources, jobsUrl, collaborationUrl, maps, email, linkedin, riskUrl } from "./catalog.js";
import { esc, icon, img, num, button, link, kicker, intro, contactBand } from "./ui.js";

export const data = name => JSON.parse(readFileSync(new URL(`../content/${name}.json`, import.meta.url), "utf8"));
const illustrations = ["advies","checklist","onderzoek","monitor","lezen","ciso","camera","laptop","diskette","canta"];

export function services(p) {
  const all = data("services");
  return `${intro(p)}<section class="wrap section services-list"><div class="service-aside">${kicker("Dienstenwijzer")}<h2>Waar kunnen we bij helpen?</h2><p>Kies een dienst voor onze aanpak en de mogelijkheden.</p>${link(contactUrl, "Stel je vraag")}</div>
    <div class="service-folds">${all.map((s,i)=>`<details class="service-fold" id="${s.id}">
      <summary><span class="mono">${num(i+1)}</span><h2>${esc(s.title)}</h2><span class="fold-sign">${icon("plus")}</span></summary>
      <div class="service-content prose">${img(illustrations[i],"service-art")}${s.body}${link(contactUrl,"Bespreek deze dienst")}</div></details>`).join("")}</div></section>${contactBand()}`;
}
export function approach(p) {
  const { text, gallery } = data("approach");
  const names = ["Diskette","Harde schijf","Monitor","Toetsenbord","Raspberry Pi","Camera","Cd","Aquarium"];
  return `${intro(p)}<div class="wrap section approach-page"><div class="reading prose">${text[0]}</div>
    <h2 class="subheading">Waar je op kunt rekenen<span class="period">.</span></h2>
    <div class="values">${["Pragmatisch","Kwaliteit","Humor","Snel"].map((v,i)=>`<div><span class="mono">0${i+1} / WAARDE</span><h3>${v}</h3><div class="prose">${text[i+1]}</div></div>`).join("")}</div>
    <section class="reading prose approach-text">${text[5]}${["Mensen","Proces","Technologie","Kennis"].map((v,i)=>`<h2>${v}</h2>${text[i+6]}${i===2?`<div class="tech-strip" tabindex="0" role="region" aria-label="Illustraties van techniek">${gallery.map((url,j)=>`<figure><img src="${url}" alt="" loading="lazy"><figcaption>${names[j]}</figcaption></figure>`).join("")}</div>`:""}`).join("")}</section></div>${contactBand()}`;
}
export function team(p) {
  const {story,members} = data("team");
  return `${intro(p)}<div class="wrap section"><div class="story"><div>${kicker("Sinds 2021")}<h2>Ons verhaal<span class="period">.</span></h2></div><div class="prose">${story}</div></div>
    <div class="section-heading" id="team"><div>${kicker("De mensen achter Pasquil")}<h2>Ons team<span class="period">.</span></h2></div>${link(jobsUrl,"Werken bij Pasquil","diagonal")}</div>
    <div class="team-grid">${members.map(m=>`<article class="person"><img class="portrait" src="${m.photo}" alt="Portret van ${esc(m.name)}" width="${m.width}" height="${m.height}" loading="lazy"><div><h3>${esc(m.name)}</h3><p>${esc(m.bio)}</p>${link(m.url,"LinkedIn","diagonal")}</div></article>`).join("")}</div></div>${contactBand()}`;
}
export function contact(p) {
  return `${intro(p)}<div class="wrap section contact-grid"><div>${kicker("Direct contact")}<h2>Hoe bereik je ons<span class="period">?</span></h2>
    <a class="contact-row" href="${email}">${icon("mail",26)}<span><small>E-MAIL</small><b>hallo@pasquil.nl</b></span>${icon("diagonal",20)}</a>
    <a class="contact-row" href="${maps}">${icon("pin",26)}<span><small>ONS KANTOOR</small><b>Moreelsepark 1, Utrecht</b><span>Bekijk de route</span></span>${icon("diagonal",20)}</a>
    <div class="contact-links">${link(linkedin,"LinkedIn","diagonal")}${link(collaborationUrl,"Samenwerken")}${link(jobsUrl,"Vacatures")}</div></div>
    <figure class="contact-figure">${img("kantoor","","Het getekende Pasquil-kantoor")}<figcaption class="mono">PASQUIL / UTRECHT, NL</figcaption></figure></div>`;
}
export function training(p) {
  const { intro: opening, courses } = data("training");
  return `${intro(p)}<div class="wrap section"><div class="reading prose">${opening}</div><div class="course-grid">${courses.map((c,i)=>`<article class="course">${kicker(i===2?"Op aanvraag":`Training / ${num(i+1)}`)}<h2>${esc(c.name)}</h2><div class="prose">${c.text}</div>${button(c.url,i===2?"Vraag maatwerk aan":"Bekijk bij Springest","ink","diagonal")}</article>`).join("")}</div></div>${contactBand()}`;
}
export function library(p) {
  return `${intro(p)}<section class="wrap section library"><div class="filters" hidden>
    <div class="search-box">${icon("search")}<input type="search" aria-label="Zoeken in de kennisbank" placeholder="Zoek in de kennisbank…"></div>
    <div class="category-filters" role="group" aria-label="Filter op soort">${["Alles","Risicosets","Artikelen","Trainingen","Tool"].map((name,i)=>`<button type="button" data-filter="${name}" aria-pressed="${i===0}">${name}</button>`).join("")}</div></div>
    <p class="result-count mono" aria-live="polite">${resources.length} resultaten</p><div class="library-grid">${resources.map(r=>`<a class="library-card" data-category="${r.type}" href="${r.url}"><span class="mono">${esc(r.type)}</span>${img(r.art)}<h2>${esc(r.title)}</h2><p>${esc(r.description)}</p><span class="card-end">Bekijken ${icon("arrow",17)}</span></a>`).join("")}</div>
    <div class="empty-state" hidden><h2>Geen resultaten gevonden.</h2><p>Probeer een andere zoekterm of toon alle onderwerpen.</p><button class="button ink" type="button" id="reset-filters">Wis filters ${icon("arrow",16)}</button></div></section>`;
}
export function article(p) {
  const slug=p.url.split("/").filter(Boolean).at(-1);
  let content = readFileSync(new URL(`../content/articles/${slug}.html`,import.meta.url),"utf8");
  if (["vacatures","standaardsetziekenhuis","standaardsethogeronderwijs","standaard-risicoset-ouderenzorg","blog-risicomanagement","onafhankelijke-beoordeling-nen7510-igj"].includes(slug)) {
    content=content.replace(/^\s*<h[23]>.*?<\/h[23]>\s*/s,"");
  }
  if(slug==="privacy-cookie-statement") content=content.replace(/^<p>.*?<\/p>/,"");
  const related = p.url.startsWith(riskUrl) ? resources.filter(r=>r.type==="Risicosets" && r.url!==p.url).map(r=>[r.url,r.title]) :
    [[serviceUrl,"Onze diensten"],[libraryUrl,"Naar de kennisbank"],[contactUrl,"Contact met Pasquil"]];
  return `${intro(p)}<div class="wrap section article-layout"><article class="prose article-copy" lang="${p.lang || 'nl'}">
    ${slug==="risqui"?img("risqui","risqui-logo","Risqui"):""}${content}</article><aside class="related">${kicker("Lees verder")}${related.map(([u,n])=>link(u,n)).join("")}</aside></div>${contactBand()}`;
}
