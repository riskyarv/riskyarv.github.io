# pasquil.nl

Statische website van Pasquil, gebouwd met [Astro](https://astro.build). Geen cookies en geen verzoeken naar derden: lettertype, iconen en media worden zelf gehost. Alle teksten staan in `content/` en zijn te beheren met een klein lokaal CMS (zie hieronder).

## Commando's

| Commando          | Actie                                         |
| :---------------- | :-------------------------------------------- |
| `npm install`     | Dependencies installeren (Node ≥ 22)          |
| `npm run dev`     | Lokale ontwikkelserver op `localhost:4321`    |
| `npm run cms`     | Ontwikkelserver + CMS openen in de browser    |
| `npm run build`   | Productiebuild naar `./dist/`                 |
| `npm run preview` | De build lokaal bekijken                      |

De inhoud van `dist/` kan op elke statische host (Netlify, Cloudflare Pages, Nginx, …) worden gezet.

## Structuur

- `src/pages/`: één map per pagina; de URL's zijn gelijk aan die van de oude WordPress-site.
- `src/components/`: header, footer, hero, CTA-band, breadcrumbs en de risicoset-tabellen.
- `src/layouts/`: `Base.astro` (meta, OG, JSON-LD) en `SetPage.astro` (sectorsets).
- `content/`: alle teksten als JSON (pagina's, menu, header/footer, diensten, risicosets, blog).
- `src/data/site.ts`: leest `content/` in en levert navigatie, contactgegevens en diensten aan de pagina's.
- `cms/`: het lokale CMS (alleen actief tijdens `astro dev`).
- `src/styles/global.css`: het designsysteem (kleuren, typografie, knoppen, kaarten).
- `public/.well-known/security.txt`: werk het veld `Expires` jaarlijks bij.

## Iconen

De iconen komen uit Font Awesome Free (CC BY 4.0) en worden als inline SVG gebundeld. Voeg een naam toe in `scripts/build-icons.mjs` en draai daarna:

```sh
node scripts/build-icons.mjs
```

Let op: `<Icon>` is een eigen component. Gebruik in scoped `<style>`-blokken daarom `:global(.icon)` om iconen te stylen.

## Teksten beheren (CMS)

```sh
npm run cms
```

Dit start de ontwikkelserver en opent `http://localhost:4321/cms/`. Het CMS werkt ook tijdens een gewone `npm run dev`.

1. Kies links een pagina of onderdeel (of zoek met ⌘K / Ctrl+K).
2. Pas de teksten aan. Het voorbeeld rechts werkt direct mee. Klik op een veld om de tekst in het voorbeeld te markeren. Met **Aanwijzen** klik je in het voorbeeld op een tekst om naar het bijbehorende veld te springen.
3. Sla op met ⌘S / Ctrl+S. Wijzigingen worden naar `content/*.json` geschreven.
4. Klik op **Site bouwen** en publiceer daarna de map `dist/`.

Goed om te weten:

- **Geschiedenis.** Elke opslag bewaart de vorige versie in `.cms-history/` (maximaal 30 per bestand). Via *Geschiedenis* zie je de verschillen en zet je een versie terug. Deze map staat niet in git.
- **Controle.** Bij opslaan wordt gecontroleerd dat de structuur van het bestand gelijk blijft: dezelfde velden en typen, geldige iconen, geen scripts. Bewerkt iemand anders hetzelfde bestand tegelijk, dan krijg je een melding in plaats van dat werk wordt overschreven.
- **Veldconventies in `content/`.** Sleutels die eindigen op `Html` zijn opgemaakte tekst (vet, cursief, links, lijsten). `{naam}` in een tekst is een placeholder die de site invult; laat die staan. Sleutels die met `_` beginnen zijn verborgen in het CMS (bijvoorbeeld voor technische velden).
- **Instellingen** staan in `cms/config.mjs`: groepen, labels en voorbeeldpagina per bestand, en welke lijsten een vaste lengte hebben (`fixed`), minstens één item houden (`min1`) of versies zijn (`versions`). Met `scope` en `on` geef je aan op welke pagina's de teksten ook staan. Wijzigingen worden zonder herstart ingelezen. Nieuwe JSON-bestanden in `content/` verschijnen vanzelf onder *Overig*.
- **Beveiliging.** Het CMS bestaat alleen tijdens `astro dev` en komt nooit in `dist/` terecht. Het accepteert alleen verzoeken via `localhost` vanaf de eigen pagina; ook met `astro dev --host` is het niet via het netwerk te bereiken.

