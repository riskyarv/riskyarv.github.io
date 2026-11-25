import { pages } from "./catalog.js";
import { home } from "./home.js";
import { data, services, approach, team, contact, training, library, article } from "./sections.js";
import { layout, intro, button } from "./ui.js";

const renderers = { home: () => home(data("services")), services, approach, team, contact, training, library, article,
  notfound: p => `${intro(p)}<div class="wrap section">${button("/","Naar de homepage")}</div>`
};
export default class {
  data() {
    return { pages, pagination: { data: "pages", size: 1, alias: "entry" },
      permalink: ({entry}) => entry.url.endsWith("/") ? `${entry.url}index.html` : entry.url };
  }
  render({entry}) {
    return layout(entry, renderers[entry.kind || "article"](entry));
  }
}
