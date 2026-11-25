import { serviceUrl, approachUrl, teamUrl, libraryUrl, resources } from "./catalog.js";
import { esc, icon, img, num, button, link, kicker, contactBand } from "./ui.js";

const spots = [
  ["Het wachtwoord", "Een wachtwoord op een flip-over is voor iedereen leesbaar. Deel het liever via een wachtwoordmanager."],
  ["Het scherm", "Ook als je maar even wegloopt: vergrendel je scherm. Zo blijft informatie op de werkplek beschermd."],
  ["De camera", "Wie mag de beelden bekijken, en hoe lang blijven ze bewaard? Privacy begint bij zulke concrete vragen."]
];
function office() {
  return `<figure class="office" aria-label="Een kijkje in het Pasquil-kantoor">
    <div class="drawing">
      <div class="sun"></div>
      <svg class="flight" viewBox="0 0 180 80" fill="none" aria-hidden="true"><path d="M1 62c26 10 63-2 65-24 2-21-23-20-22-1 2 28 70 26 111-23" stroke="currentColor" stroke-dasharray="4 5" stroke-linecap="round"/></svg>
      <img class="flying" src="/media/laptop.webp" alt="" width="78" height="52">
      <div class="office-scene"><img class="office-img" src="/media/kantoor.webp" width="1532" height="898" fetchpriority="high" alt="Pasquils getekende kantoor met een open deur, een wachtwoord op een flip-over en een Canta voor de deur.">
      ${spots.map(([title],i) => `<button type="button" class="hotspot spot-${i+1}" hidden data-spot="${i}" aria-label="Aandachtspunt ${i+1}: ${title}" aria-controls="office-note" aria-expanded="false">${icon("plus",14)}</button>`).join("")}</div>
      <span class="reg reg-tl"></span><span class="reg reg-br"></span>
    </div>
    <figcaption><span><b>FIG. 01</b> / HET PASQUIL-KANTOOR</span><button type="button" class="discover" hidden aria-controls="office-note" aria-expanded="false">${icon("target",15)} Ontdek de risico’s</button></figcaption>
    <div class="office-note" id="office-note" hidden><button type="button" class="note-close" aria-label="Sluit de toelichting">${icon("close",17)}</button>
      ${spots.map(([title,description],i) => `<div data-note="${i}" hidden><small>AANDACHTSPUNT ${num(i+1)} / 03</small><h3>${title}</h3><p>${description}</p></div>`).join("")}
      <button class="next-note" type="button">Volgend aandachtspunt ${icon("arrow",15)}</button>
    </div></figure>`;
}
const features = [
  { art:"advies", short:"Praktisch advies over informatiebeveiliging en privacy. Van DPIA tot beleid dat werkt.", label:"Advies" },
  { art:"checklist", short:"Stap voor stap naar een werkend managementsysteem voor ISO 27001 of NEN 7510.", label:"Implementaties" },
  { art:"onderzoek", short:"Breng risico’s in kaart, bepaal wat prioriteit heeft en houd zicht op de voortgang.", label:"Risicomanagement" }
];
export function home(services) {
  return `<section class="hero"><div class="wrap hero-grid">
    <div class="hero-copy">${kicker("Informatiebeveiliging & privacy")}
      <h1>Serieuze zaken.<br><em>Frisse blik.<svg class="underline" viewBox="0 0 420 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13Q159-3 415 8L408 15Q188 9 7 19Z" fill="#fcba04"/></svg></em></h1>
      <p>Wij maken informatiebeveiliging en privacy werkbaar. Met helder advies, een pragmatische aanpak en een gezonde dosis humor.</p>
      <div class="hero-actions">${button("#diensten","Ontdek onze diensten")}${link(approachUrl,"Onze aanpak","diagonal")}</div>
    </div>${office()}</div></section>
    <div class="standards"><div class="wrap standards-inner"><span class="standards-label"><i></i>Onze expertise</span>
    ${["ISO 27001","NEN 7510","AVG","NIS2","BIO","SURF"].map(s=>`<span class="standard">${icon("spark",17)}${s}</span>`).join("")}</div></div>
    <section class="section services-preview" id="diensten"><div class="wrap">
      <div class="section-heading"><div>${kicker("01 / Expertise")}<h2>Onze diensten<span class="period">.</span></h2></div>${link(serviceUrl,"Alle 10 diensten","diagonal")}</div>
      <div class="feature-grid">${features.map((f,i)=>`<a class="feature-card" href="${serviceUrl}#${services[i].id}">
        <div class="feature-meta"><span>DIENST / ${num(i+1)}</span><span class="circle-arrow">${icon("diagonal",18)}</span></div>
        <div class="card-art">${img(f.art)}</div><h3>${f.label}</h3><p>${f.short}</p></a>`).join("")}</div>
    </div></section>
    <section class="why-section"><div class="wrap why-grid"><div class="why-art"><span class="mono">FIG. 02 / ONDERWEG</span>${img("canta","", "De getekende Pasquil-Canta")}<span class="why-cross">+</span></div>
      <div>${kicker("02 / Waarom Pasquil?")}<h2>Zo kan het <em>wél.</em></h2>
      <p>We zijn professionals met kennis, maar bovenal zijn we veranderaars en overtuigers. Humor, durf en heldere communicatie staan bij ons voorop.</p>
      <p>Want informatiebeveiliging en privacy zijn niet gewoon. Daarom is Pasquil anders.</p>
      <div class="hero-actions">${button(approachUrl,"Onze aanpak","ink")}${link(teamUrl,"Ontmoet het team","diagonal")}</div></div></div></section>
    <section class="section"><div class="wrap"><div class="section-heading"><div>${kicker("03 / Kennis delen")}<h2>Uit de kennisbank<span class="period">.</span></h2></div>${link(libraryUrl,"Alle kennis","diagonal")}</div>
      <div class="resource-list">${resources.slice(0,3).map(r=>`<a href="${r.url}"><span class="mono">${esc(r.type)}</span><h3>${esc(r.title)}</h3>${icon("diagonal",22)}</a>`).join("")}</div>
    </div></section>${contactBand()}`;
}
