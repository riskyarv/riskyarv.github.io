# Pasquil

Statische, Nederlandstalige herbouw van pasquil.nl. De oorspronkelijke pagina-adressen, dienstankers, teamprofielen, trainingen, blogs, risicosets en juridische pagina’s zijn behouden. Een kennisbank maakt de inhoud ook doorzoekbaar. Het ontwerp gebruikt Pasquils eigen woordmerk, illustraties, donkerblauw (`#0b1d51`) en geel (`#fcba04`).

## Lokaal

Gebruik Node.js 22 of nieuwer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4317`. Wijzigingen in inhoud, templates en stijlen worden automatisch verwerkt.

## Inhoud en beheer

- `content/`: dienstbeschrijvingen, team, trainingen en aanpak als JSON; artikelen en volledige risicotabellen als semantische HTML.
- Bij vervanging van een teamfoto vul je in `content/team.json` de pixelbreedte en -hoogte van het nieuwe bestand in. De site toont het hele portret in zijn eigen verhouding.
- `src/catalog.js`: pagina-adressen, titels, zoekcategorieën en historische URL’s.
- `src/`: Eleventy-templates voor de homepage, navigatie en vervolgpagina’s.
- `public/`: lokale beelden, video, fonts met licenties, CSS, JavaScript en disclosure-bestanden. De site gebruikt geen externe trackers, cookies of formulierdienst. Contact verloopt per e-mail, routebeschrijving via Google Maps en trainingsinschrijvingen via de bestaande aanbieder.

## Publiceren

`npm test` bouwt de site en controleert onder meer lokale links en fragmenten. `npm run build` schrijft de publiceerbare website naar `dist/`. Publiceer de **inhoud** van die map op de webroot, inclusief `.well-known/`, en stel `404.html` in als foutpagina. Gebruik directory-indexen (`index.html`), geen SPA-fallback. Voor de bekende oude risicoset-adressen zijn doorverwijspagina’s inbegrepen.

Controleer vóór publicatie de actuele cursusdata, risicosetversies, meldadres, publieke PGP-sleutel en vervaldatum in `.well-known/security.txt`. Publiceren of wijzigen van de bestaande WordPress-site gebeurt niet door de lokale build.
