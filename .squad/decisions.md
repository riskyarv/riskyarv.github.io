# Squad Decisions

## Active Decisions

### Game Architecture & Level Design

**Author:** Danny (Lead / Game Designer)  
**Date:** 2026-03-30  
**Status:** Final — ready for implementation

**Summary:** Complete game architecture for "Pasquil's Cyber Heist" — 5 levels, static HTML/CSS/JS, no server.

**Key Decisions:**

1. **File structure:** One HTML per level in `levels/`, shared `css/style.css` and `js/game.js`, level-specific JS only for Level 3 (`js/level3.js`) and Level 5 (`js/level5.js`).
2. **Password validation via SHA-256 hashes** stored in `game.js` — prevents trivially reading answers from shared code.
3. **Case-insensitive passwords** — normalized to uppercase before hashing.
4. **No URL gatekeeping** — any level is directly accessible by URL. The "lock" is the password form revealing the next URL.
5. **Progress tracked in localStorage** (`pasquil_progress`) — landing page reads this to show locked/unlocked states.
6. **3-tier hint system** — progressive hints, always sequential, Hint 3 is near-direct answer.
7. **Sjonnie character** — the bumbling intern. All level flavor text and humor flows through this character.

**Passwords:**

| Level | Password | Hiding Mechanism |
|-------|----------|-----------------|
| 1 | TULIP_HACKER | HTML comment |
| 2 | G33STELIJK | CSS-hidden element |
| 3 | STROOPWAFEL42 | JS variable (console) |
| 4 | K00KJES_MONSTER | Base64-encoded cookie |
| 5 | P4SQU1L_M4ST3R | Split across JS/data-attr/meta |

**Reference:** Full details in `/GAME_DESIGN.md`.

### Full Frontend Implementation — Vanilla Stack

**Author:** Livingston (Frontend Dev)  
**Date:** 2026-03-30  
**Status:** Implemented

**Summary:** Complete game build using vanilla HTML/CSS/JS per spec. All 10 game files created, no frameworks, no build step.

**Key Decisions:**

1. **Vanilla Stack** — No frameworks, no build step. All relative paths. Game runs by opening `index.html` directly.
2. **Web Crypto API for SHA-256** — Used native `crypto.subtle.digest()` for password hashing. Hashes precomputed and embedded in `game.js`.
3. **Theme Classes on `<body>`** — Each level activates theme via `<body class="vault-page">`, etc. Single `style.css` file with per-level overrides.
4. **CSS-Only Confetti** — 20 absolutely-positioned divs with staggered keyframe animations. No external library. Triggered by adding `.show` class.
5. **Level 4 Cookies via Inline Script** — Placed after `game.js` loads. Cookies and localStorage set idempotently on every page load.
6. **Level 5 IIFE Scope** — `level5.js` uses IIFE so `_0x1` is not directly accessible as global. Only `__heistStatus` exposed on `window`.
7. **No img/ Directory** — Emoji and CSS shapes throughout instead of SVG/PNG assets.

**Deliverables:**

- `index.html` (3.3 KB)
- `levels/level1.html` through `level5.html` (5.5–7.4 KB each)
- `css/style.css` (25.5 KB)
- `js/game.js` (6.3 KB)
- `js/level3.js` (748 B)
- `js/level5.js` (730 B)

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
