export const serviceUrl = "/wat-bieden-we/";
export const approachUrl = "/wat-is-onze-aanpak/";
export const teamUrl = "/wie-zijn-we/";
export const contactUrl = "/hoe-bereik-je-ons/";
export const libraryUrl = "/kennisbank/";
export const riskUrl = `${approachUrl}template-standaard-risicoset/`;
export const trainingUrl = "/trainingen/";
export const risquiUrl = "/risqui/";
export const jobsUrl = `${contactUrl}vacatures/`;
export const collaborationUrl = `${contactUrl}samenwerken/`;
export const linkedin = "https://www.linkedin.com/company/pasquil-consulting";
export const email = "mailto:hallo@pasquil.nl";
export const maps = "https://goo.gl/maps/YNZHknAnEPEoDNga9";

export const resources = [
  { url: riskUrl, title: "Standaard risicoset", type: "Risicosets", description: "Een concreet vertrekpunt voor je eigen risicoanalyse, met voorbeelden en eerdere versies.", art: "checklist" },
  { url: "/blog-risicomanagement/", title: "Risicomanagement voor informatiebeveiliging", type: "Artikelen", description: "Van inventarisatie en analyse tot behandeling, evaluatie en rapportage.", art: "onderzoek" },
  { url: trainingUrl, title: "Trainingen", type: "Trainingen", description: "Cursussen, workshops en maatwerktrainingen over privacy en informatiebeveiliging.", art: "lezen" },
  { url: `${approachUrl}onafhankelijke-beoordeling-nen7510-igj/`, title: "Onafhankelijke beoordeling NEN7510", type: "Artikelen", description: "Wat verwacht de IGJ en hoe werkt een onafhankelijke beoordeling in de zorg?", art: "advies" },
  { url: `${riskUrl}standaard-risicoset-ouderenzorg/`, title: "Risicoset ouderenzorg", type: "Risicosets", description: "Risico’s en maatregelen uit de praktijk van de ouderenzorg, met NEN7510:2024.", art: "checklist" },
  { url: `${riskUrl}standaardsetziekenhuis/`, title: "Risicoset ziekenhuizen", type: "Risicosets", description: "Een standaard risico- en maatregelenset, ontwikkeld met experts uit ziekenhuizen.", art: "checklist" },
  { url: `${riskUrl}standaardsethogeronderwijs/`, title: "Risicoset hoger onderwijs", type: "Risicosets", description: "Voorbeelden van risico’s en maatregelen voor het hoger onderwijs.", art: "checklist" },
  { url: `${riskUrl}template-standard-risk-set/`, title: "Standard risk set (English)", type: "Risicosets", description: "The English-language collection of sample information security risks.", art: "checklist", lang: "en" },
  { url: risquiUrl, title: "Risqui", type: "Tool", description: "De risicomanagementtool die is ontstaan vanuit het advieswerk van Pasquil.", art: "monitor" }
];

export const pages = [
  { url: "/", title: "Informatiebeveiliging & privacy", kind: "home", description: "Pasquil is een adviesbureau in Utrecht. We maken informatiebeveiliging en privacy werkbaar met heldere adviezen, pragmatiek en humor." },
  { url: serviceUrl, title: "Onze diensten", kind: "services", type: "Expertise", description: "Van een eerste advies tot een volledige implementatie: zo helpt Pasquil bij informatiebeveiliging en privacy." },
  { url: approachUrl, title: "Onze aanpak", kind: "approach", type: "Werkwijze", description: "Mensen, processen en techniek. Met die drie samen maken we informatiebeveiliging werkbaar." },
  { url: teamUrl, title: "Over Pasquil", kind: "team", type: "Het bureau", description: "Maak kennis met de adviseurs achter Pasquil. Een team in Utrecht met kennis van zaken en een gezonde dosis humor." },
  { url: contactUrl, title: "Kennismaken", kind: "contact", type: "Contact", description: "Een vraag, een idee of gewoon een kop koffie? Mail ons of kom langs op afspraak in Utrecht." },
  { url: libraryUrl, title: "Kennisbank", kind: "library", type: "Kennis delen", description: "Onze kennis is er om te delen. Hier vind je praktische risicosets, artikelen, trainingen en onze eigen tool." },
  ...resources.map(r => ({ ...r, kind: r.url === trainingUrl ? "training" : "article" })),
  { url: jobsUrl, title: "Vacatures", type: "Werken bij Pasquil", description: "We maken graag kennis met adviseurs informatiebeveiliging en privacy." },
  { url: collaborationUrl, title: "Samenwerken", type: "Het bureau", description: "Samen optrekken met Pasquil? Er is altijd ruimte voor een goed gesprek." },
  { url: "/privacy-cookie-statement/", title: "Privacy & cookies", type: "Website", description: "Hoe Pasquil omgaat met privacy en cookies op deze website." },
  { url: "/responsible-disclosure-policy/", title: "Responsible disclosure", lang: "en", type: "Policy", description: "How to report a security problem to Pasquil." },
  { url: "/wat-bieden-we-oud/", title: "Wat bieden we? – archief", type: "Archief", noindex: true, description: "Het eerdere overzicht van onze diensten." },
  { url: "/404.html", title: "Pagina niet gevonden", kind: "notfound", noindex: true, description: "Deze pagina is niet gevonden." }
];

export const aliases = Object.fromEntries(
  resources.filter(r => r.url.startsWith(riskUrl)).flatMap(r => {
    const slug = r.url.split("/").filter(Boolean).at(-1);
    return [[`/wat-doen-we/${slug}/`, r.url], [`/${slug}/`, r.url]];
  })
);
