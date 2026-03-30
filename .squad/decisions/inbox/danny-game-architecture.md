# Decision: Game Architecture & Level Design

**Author:** Danny (Lead / Game Designer)
**Date:** 2026-03-30
**Status:** Final — ready for implementation

## Summary

Complete game architecture for "Pasquil's Cyber Heist" — 5 levels, static HTML/CSS/JS, no server.

## Key Decisions

1. **File structure:** One HTML per level in `levels/`, shared `css/style.css` and `js/game.js`, level-specific JS only for Level 3 (`js/level3.js`) and Level 5 (`js/level5.js`).
2. **Password validation via SHA-256 hashes** stored in `game.js` — prevents trivially reading answers from shared code.
3. **Case-insensitive passwords** — normalized to uppercase before hashing.
4. **No URL gatekeeping** — any level is directly accessible by URL. The "lock" is the password form revealing the next URL.
5. **Progress tracked in localStorage** (`pasquil_progress`) — landing page reads this to show locked/unlocked states.
6. **3-tier hint system** — progressive hints, always sequential, Hint 3 is near-direct answer.
7. **Sjonnie character** — the bumbling intern. All level flavor text and humor flows through this character.

## Passwords

| Level | Password | Hiding Mechanism |
|-------|----------|-----------------|
| 1 | TULIP_HACKER | HTML comment |
| 2 | G33STELIJK | CSS-hidden element |
| 3 | STROOPWAFEL42 | JS variable (console) |
| 4 | K00KJES_MONSTER | Base64-encoded cookie |
| 5 | P4SQU1L_M4ST3R | Split across JS/data-attr/meta |

## Reference

Full details in `/GAME_DESIGN.md`.
