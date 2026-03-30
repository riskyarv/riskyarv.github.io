# Project Context

- **Owner:** Bart Jansen
- **Project:** Web hacking challenge game — 5 levels testing cybersecurity skills (find the password, inspect source code, etc.). Playful and educational, inspired by OverTheWire Natas but with the fun, colorful style of Pasquil.nl and Risqui.nl.
- **Stack:** HTML, CSS, JavaScript (static web game)
- **Created:** 2026-03-30

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

- **Full game built (2026-03-30):** All 10 files created — `index.html`, 5 level pages, `css/style.css`, `js/game.js`, `js/level3.js`, `js/level5.js`.
- **Architecture:** Single shared CSS file with theme classes per level (`.diary-page`, `.vault-page`, `.terminal-page`, `.bakery-page`, `.heist-page`). Shared `game.js` handles password hashing (SubtleCrypto SHA-256), hint system, localStorage progress, and confetti.
- **Password validation:** SHA-256 hashes computed via `shasum -a 256` and stored in `game.js`. Input is case-insensitive (uppercased before hashing).
- **No frameworks:** Pure vanilla HTML/CSS/JS. No build step. Open `index.html` and go.
- **Key file paths:** `css/style.css` (all visual styles), `js/game.js` (core logic), `js/level3.js` (sjonnieVault object), `js/level5.js` (IIFE with part 1 + heistStatus helper).
- **Confetti is CSS-only:** 20 `.confetti-piece` divs with staggered `animation-delay` and `@keyframes confettiFall`. No JS library.
- **Level 4 cookies:** Set via inline `<script>` after `game.js` loads. Base64-encoded secret: `SzAwS0pFU19NT05TVEVS` → `K00KJES_MONSTER`.
- **Level 5 password split:** Part 1 in `js/level5.js` (`_0x1 = "P4"`), Part 2 in footer `data-sjonnie-part2="SQU1L_"`, Part 3 in `<meta name="sjonnie-part3" content="M4ST3R">`.
- **Responsive:** 3-col grid on desktop, 2-col on tablet, 1-col on mobile. Min viable width 360px.
- **i18n system added:** `js/i18n.js` handles multi-lingual support (NL default, EN alternative). Uses `data-i18n` attributes on HTML elements, `data-i18n-placeholder` for input placeholders. Language stored in `localStorage('pasquil_lang')`. ~100 translation keys covering all visible game text. Game.js references `t()` function for dynamic messages (wrong password, success, hints).
- **Language switcher:** Fixed-position NL|EN toggle in top-right corner on every page. CSS adapts for light/dark page themes. Orange highlight on active language.
- **Pasquil branding:** Logo downloaded to `img/pasquil-logo.png` (white on transparent, 145×42). Used in hero section of index.html and footer of all level pages. Hero header changed from purple to Pasquil blue (#0B1D51) via `--pasquil-blue` CSS variable.
- **npm serve:** `package.json` added with `serve` as devDependency. `npm start` / `npm run dev` serves on port 8080.
- **Script load order matters:** `i18n.js` must load before `game.js` (game.js uses `t()` from i18n.js). Level-specific scripts (level3.js, level5.js) load before i18n.js.
- **Challenge elements preserved during i18n:** HTML comments (level 1 password), CSS-hidden text (level 2 password), JS variables/console (level 3), cookie values (level 4), data attributes + meta tags (level 5) — all untouched by translation system.
