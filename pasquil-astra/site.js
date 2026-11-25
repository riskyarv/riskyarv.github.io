const menus = [...document.querySelectorAll(".nav-drop,.mobile-menu")];
for (const menu of menus) {
  menu.addEventListener("focusout", event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
}
document.addEventListener("click", event => {
  for (const menu of menus) {
    if (!menu.contains(event.target) || event.target.closest("a")) menu.open = false;
  }
});
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const active = menus.find(menu => menu.open && menu.contains(document.activeElement));
  if (active) {
    active.open = false;
    active.querySelector("summary").focus();
  }
});
matchMedia("(max-width:800px)").addEventListener("change", () => {
  for (const menu of menus) menu.open = false;
});

function showLinkedService() {
  const section = document.getElementById(location.hash.slice(1));
  if (section?.matches("details.service-fold")) {
    section.open = true;
    section.scrollIntoView({ block: "start", behavior: "instant" });
  }
}
window.addEventListener("hashchange", showLinkedService);
showLinkedService();

const office = document.querySelector(".office");
if (office) {
  const panel = office.querySelector(".office-note");
  const discover = office.querySelector(".discover");
  const controls = [...office.querySelectorAll(".hotspot")];
  const notes = [...office.querySelectorAll("[data-note]")];
  const closeButton = office.querySelector(".note-close");
  let index = 0, opener;

  function showNote(i, trigger) {
    index = i;
    if (trigger) opener = trigger;
    controls.forEach((c,n) => c.setAttribute("aria-expanded", n === i ? "true" : "false"));
    notes.forEach((note,n) => { note.hidden = n !== i; });
    discover.setAttribute("aria-expanded","true");
    panel.hidden = false;
    const heading = notes[i].querySelector("h3");
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
  }
  function closeNote(restoreFocus) {
    panel.hidden = true;
    [...controls,discover].forEach(c => c.setAttribute("aria-expanded","false"));
    if (restoreFocus) opener?.focus({preventScroll:true});
  }
  controls.forEach((c,i) => {
    c.hidden = false;
    c.addEventListener("click", () => !panel.hidden && i === index ? closeNote(true) : showNote(i,c));
  });
  discover.hidden = false;
  discover.addEventListener("click", () => panel.hidden ? showNote(0,discover) : closeNote(true));
  closeButton.addEventListener("click", () => closeNote(true));
  office.querySelector(".next-note").addEventListener("click", () => showNote((index+1)%notes.length));
  office.addEventListener("keydown", e => {
    if (e.key === "Escape" && !panel.hidden) closeNote(true);
  });
  document.addEventListener("click", e => {
    if (!panel.hidden && !office.contains(e.target)) closeNote(false);
  });
}

const library = document.querySelector(".library");
if (library) {
  const input = library.querySelector("input");
  const filters = [...library.querySelectorAll("[data-filter]")];
  const cards = [...library.querySelectorAll("[data-category]")];
  const message = library.querySelector(".result-count");
  let category = "Alles";
  function update() {
    const query = input.value.trim().toLocaleLowerCase("nl");
    let count = 0;
    for (const card of cards) {
      const matches = (category === "Alles" || category === card.dataset.category)
        && card.textContent.toLocaleLowerCase("nl").includes(query);
      card.hidden = !matches;
      if (matches) count++;
    }
    message.textContent = `${count} ${count === 1 ? "resultaat" : "resultaten"}`;
    library.querySelector(".empty-state").hidden = count !== 0;
    for (const f of filters) f.setAttribute("aria-pressed",String(f.dataset.filter === category));
  }
  library.querySelector(".filters").hidden = false;
  input.addEventListener("input", update);
  filters.forEach(f => f.addEventListener("click", () => { category = f.dataset.filter; update(); }));
  library.querySelector("#reset-filters").addEventListener("click", () => {
    category = "Alles";
    input.value = "";
    update();
    input.focus();
  });
}
