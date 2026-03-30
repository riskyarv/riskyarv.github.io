# Project Context

- **Owner:** Bart Jansen
- **Project:** Web hacking challenge game — 5 levels testing cybersecurity skills (find the password, inspect source code, etc.). Playful and educational, inspired by OverTheWire Natas but with the fun, colorful style of Pasquil.nl and Risqui.nl.
- **Stack:** HTML, CSS, JavaScript (static web game)
- **Created:** 2026-03-30

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-30 — Full Security Review

- **CRITICAL FIX:** `game.js` had plaintext password comments next to SHA-256 hashes (e.g., `// TULIP_HACKER`). Since game.js is loaded on every page, opening Sources tab on any level exposed all 5 passwords. Removed all password comments.
- All 5 SHA-256 hashes verified correct against their passwords.
- Base64 cookie verified: `atob('SzAwS0pFU19NT05TVEVS')` = `K00KJES_MONSTER` ✅.
- No cross-level password leaks in game files (each level only exposes its own password).
- Level 2 red herring: `color: #1a1a2e` matches vault-page background exactly — invisible text works.
- Level 5 IIFE scoping: `_0x1` is not console-accessible (by design — player must read source). Hint 3 correctly guides to the source approach.
- **Deployment note:** GAME_DESIGN.md in repo root contains all passwords in plaintext. If the entire repo is served as a static site, a player could access `/GAME_DESIGN.md`. Recommend excluding from deployment or using `.htaccess`/server rules.
- Pattern: never leave plaintext passwords as code comments, even next to hashes — DevTools Sources tab makes all JS readable.
