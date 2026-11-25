import { pages } from "./catalog.js";
export default class {
  data() { return { permalink: "/sitemap.xml" }; }
  render() { return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>!p.noindex).map(p=>`<url><loc>https://pasquil.nl${p.url}</loc></url>`).join("")}</urlset>`; }
}
