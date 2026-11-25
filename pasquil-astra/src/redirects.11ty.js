import { aliases } from "./catalog.js";
export default class {
  data() {
    return { routes: Object.entries(aliases), pagination: { data: "routes", size: 1, alias: "route" }, permalink: ({route}) => `${route[0]}index.html` };
  }
  render({route:[,url]}) {
    return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${url}"><link rel="canonical" href="https://pasquil.nl${url}"><title>Pagina verplaatst | Pasquil</title></head><body><a href="${url}">Ga naar de risicoset</a></body></html>`;
  }
}
