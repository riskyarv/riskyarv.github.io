# Project Context

- **Owner:** Bart Jansen
- **Project:** Web hacking challenge game — 5 levels testing cybersecurity skills (find the password, inspect source code, etc.). Playful and educational, inspired by OverTheWire Natas but with the fun, colorful style of Pasquil.nl and Risqui.nl.
- **Stack:** HTML, CSS, JavaScript (static web game)
- **Created:** 2026-03-30

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-30 — Game Architecture & Level Design Complete

- **Design doc:** `GAME_DESIGN.md` in repo root — the single source of truth for all 5 levels.
- **Architecture:** Static HTML/CSS/JS. One HTML per level (`levels/level1-5.html`), shared `css/style.css` and `js/game.js`, level-specific JS only for L3 and L5.
- **Level progression:** View Source → CSS Hidden Elements → JS Console → Cookies/Base64 → Multi-layer (split password across JS, data-attr, meta tag).
- **Passwords (all uppercase):** TULIP_HACKER → G33STELIJK → STROOPWAFEL42 → K00KJES_MONSTER → P4SQU1L_M4ST3R.
- **Password validation:** SHA-256 hash comparison in `game.js` so passwords can't be trivially extracted from shared code. Case-insensitive (normalize to uppercase).
- **Hint system:** 3 progressive hints per level, revealed sequentially. Hint 3 is always near-direct answer.
- **Navigation:** Each level reveals next level URL on correct password. Landing page tracks progress via localStorage key `pasquil_progress`.
- **Style:** Pasquil palette — purple (#6C2DC7), orange (#FF6B35), yellow (#FFD23F), off-white (#F5F0EB). Nunito/Poppins headings, rounded corners, emoji-heavy, playful.
- **Character:** "Stageair Sjonnie" — bumbling intern whose bad security practices are the puzzle. Humor source.
- **Key decision:** No URL-based access control. Levels are standalone pages. The "lock" is the password form that reveals the next URL, not actual gatekeeping.
