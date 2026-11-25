// Metadata voor het CMS: groepering, labels en voorbeeld-URL per contentbestand.
// Bestanden in content/ die hier niet staan, verschijnen automatisch onder "Overig".
//
// Per bestand:
//   preview  pagina die als voorbeeld getoond wordt
//   fixed    arrays (paden, `*` voor index, '' voor de root) waarvan het aantal en de
//            volgorde vastligt omdat de code ze koppelt
//   min1     arrays die minstens één item moeten houden (bijv. de nieuwste versie)
//   versions arrays met versies, nieuwste bovenaan; “nieuwe versie” kopieert de nieuwste
//   scope    pad waaronder de teksten op meerdere pagina’s staan; het voorbeeld blijft dan
//            op de huidige pagina als die eronder valt (groep Algemeen: altijd, tenzij `on`)
//   on       andere losse pagina’s waarop de teksten ook staan

const SETS = '/wat-is-onze-aanpak/template-standaard-risicoset/';

export const groups = ['Pagina’s', 'Risicosets', 'Blog', 'Algemeen', 'Overig'];

export const files = {
  // Pagina’s
  'pages/home': { group: 'Pagina’s', label: 'Home', preview: '/' },
  'pages/wat-bieden-we': { group: 'Pagina’s', label: 'Wat bieden we?', preview: '/wat-bieden-we/', fixed: ['services.items'] },
  'pages/wat-is-onze-aanpak': { group: 'Pagina’s', label: 'Wat is onze aanpak?', preview: '/wat-is-onze-aanpak/' },
  'pages/nen7510': {
    group: 'Pagina’s',
    label: 'Onafhankelijke beoordeling NEN7510',
    preview: '/wat-is-onze-aanpak/onafhankelijke-beoordeling-nen7510-igj/',
  },
  'pages/wie-zijn-we': { group: 'Pagina’s', label: 'Wie zijn we?', preview: '/wie-zijn-we/' },
  'pages/hoe-bereik-je-ons': { group: 'Pagina’s', label: 'Hoe bereik je ons?', preview: '/hoe-bereik-je-ons/' },
  'pages/samenwerken': { group: 'Pagina’s', label: 'Samenwerken', preview: '/hoe-bereik-je-ons/samenwerken/' },
  'pages/vacatures': { group: 'Pagina’s', label: 'Vacatures', preview: '/hoe-bereik-je-ons/vacatures/' },
  'pages/trainingen': { group: 'Pagina’s', label: 'Trainingen', preview: '/trainingen/' },
  'pages/risqui': { group: 'Pagina’s', label: 'Risqui', preview: '/risqui/' },
  'pages/privacy-cookie-statement': { group: 'Pagina’s', label: 'Privacy & cookies', preview: '/privacy-cookie-statement/' },
  'pages/responsible-disclosure-policy': {
    group: 'Pagina’s',
    label: 'Responsible disclosure',
    preview: '/responsible-disclosure-policy/',
  },
  'pages/404': { group: 'Pagina’s', label: 'Pagina niet gevonden (404)', preview: '/404/' },

  // Risicosets
  'pages/standaard-risicoset': { group: 'Risicosets', label: 'Standaard risicoset – pagina', preview: SETS },
  'sets/standaard': { group: 'Risicosets', label: 'Standaard risicoset – risico’s', preview: SETS, min1: ['nl', 'en'], versions: ['nl', 'en'] },
  'pages/standard-risk-set-en': {
    group: 'Risicosets',
    label: 'Standard risk set (English) – page',
    preview: `${SETS}template-standard-risk-set/`,
  },
  'pages/set-ouderenzorg': { group: 'Risicosets', label: 'Ouderenzorg – pagina', preview: `${SETS}standaard-risicoset-ouderenzorg/` },
  'sets/ouderenzorg': { group: 'Risicosets', label: 'Ouderenzorg – risico’s', preview: `${SETS}standaard-risicoset-ouderenzorg/`, min1: [''], versions: [''] },
  'pages/set-ziekenhuis': { group: 'Risicosets', label: 'Ziekenhuis – pagina', preview: `${SETS}standaardsetziekenhuis/` },
  'sets/ziekenhuis': { group: 'Risicosets', label: 'Ziekenhuis – risico’s', preview: `${SETS}standaardsetziekenhuis/`, min1: [''], versions: [''] },
  'pages/set-hogeronderwijs': { group: 'Risicosets', label: 'Hoger onderwijs – pagina', preview: `${SETS}standaardsethogeronderwijs/` },
  'sets/hogeronderwijs': {
    group: 'Risicosets',
    label: 'Hoger onderwijs – risico’s',
    preview: `${SETS}standaardsethogeronderwijs/`,
    min1: [''],
    versions: [''],
  },
  'set-ui': {
    group: 'Risicosets',
    label: 'Teksten risicotabellen',
    preview: `${SETS}standaard-risicoset-ouderenzorg/`,
    scope: SETS,
    fixed: ['riskTable.bivNames', 'riskTable.bivLetters'],
  },

  // Blog
  'pages/blog-risicomanagement': { group: 'Blog', label: 'Risicomanagement – pagina', preview: '/blog-risicomanagement/' },
  'blog/risicomanagement': { group: 'Blog', label: 'Risicomanagement – hoofdstukken', preview: '/blog-risicomanagement/', min1: [''] },

  // Algemeen
  site: { group: 'Algemeen', label: 'Bedrijfsgegevens & SEO', preview: '/' },
  menu: { group: 'Algemeen', label: 'Menu', preview: '/' },
  layout: { group: 'Algemeen', label: 'Header, footer & contactblok', preview: '/' },
  services: { group: 'Algemeen', label: 'Diensten', preview: '/wat-bieden-we/', on: ['/'], fixed: ['items'] },
};

// Sleutels met een vaste set waarden; de opties komen uit de bestaande content.
export const enums = ['card', 'listStyle', 'photo'];
