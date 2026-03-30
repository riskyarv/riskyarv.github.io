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
