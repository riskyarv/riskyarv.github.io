# 🎯 Pasquil Hacking Challenge — Game Design Document

> **Version:** 1.0
> **Author:** Danny (Lead / Game Designer)
> **Date:** 2026-03-30
> **Status:** Final Design — Ready for Implementation

---

## 1. Game Concept & Theme

### The Pitch

**"Pasquil's Cyber Heist"** — A 5-level browser-based hacking challenge where players must find hidden passwords using only their browser and developer tools. Each level teaches a real web security concept while wrapping it in the playful, cheeky humor of Pasquil.nl.

### Story Framing

> *"Welcome to Pasquil's Cyber Playground! Our bumbling intern, Stageair Sjonnie, has been building internal tools... and let's just say his security practices are 'creative.' Your mission: find the password hidden in each of Sjonnie's terrible web pages. Each password unlocks the next level. Can you hack all five before Sjonnie notices?"*

Every level is framed as one of Sjonnie's "secure" pages — he thinks he's clever, but he's made classic web security mistakes. The humor comes from Sjonnie's overconfident comments, silly variable names, and the absurdity of his "security" measures.

### Core Loop

```
Enter password → Unlock level → Explore the page → Find the hidden password → Enter it → Next level
```

### Key Design Principles

- **No server required.** 100% client-side. All HTML/CSS/JS served statically.
- **Browser-only.** Every challenge is solvable with Chrome/Firefox DevTools — no external tools needed.
- **Teach, don't trick.** Each level has a clear security lesson. The challenge is knowing WHERE to look, not solving an obscure puzzle.
- **Progressive difficulty.** Level 1 is "right-click → view source." Level 5 requires combining multiple techniques.
- **Fun first.** Humor, color, personality. This is Pasquil, not a dry CTF.

---

## 2. File Structure

```
pasquilgame/
├── index.html                  # Landing page / Level selector
├── css/
│   └── style.css               # Shared styles (all levels + landing)
├── js/
│   ├── game.js                 # Shared game logic (password checking, navigation, hints)
│   ├── level3.js               # Level 3 specific JS (console challenge)
│   └── level5.js               # Level 5 specific JS (encoding challenge)
├── levels/
│   ├── level1.html             # View Source challenge
│   ├── level2.html             # Hidden Elements challenge
│   ├── level3.html             # JavaScript Secrets challenge
│   ├── level4.html             # Cookie Monster challenge
│   └── level5.html             # The Encoder challenge
├── img/
│   ├── pasquil-logo.svg        # Pasquil logo (or text placeholder)
│   ├── sjonnie.svg             # Sjonnie character (simple illustration)
│   └── trophy.svg              # Victory trophy for completion
├── GAME_DESIGN.md              # This document
└── README.md                   # Player-facing readme
```

### Why This Structure

- **One HTML file per level** — keeps challenges isolated, easy to develop independently.
- **Shared CSS** — consistent Pasquil visual identity across all levels.
- **Shared JS (`game.js`)** — password validation, hint system, level navigation. DRY.
- **Level-specific JS** — only for levels that need dynamic behavior (Levels 3 and 5).
- **No build step.** Open `index.html` in a browser and go.

---

## 3. Level Design

---

### Level 1: "Sjonnie's Secret Diary" 📖

**Difficulty:** ⭐ (Easiest — Warm-up)

**Security Concept:** HTML source code inspection — sensitive data in HTML comments.

**Real-world lesson:** Never put secrets in HTML comments. Crawlers, bots, and curious users can all read your source code.

#### The Setup

The page displays Sjonnie's "private diary" — a silly blog-style page with a few diary entries. The page looks normal. There's a password input at the bottom that says "Enter the secret password to read more entries."

#### How the Password Is Hidden

The password is placed inside an **HTML comment** in the page source. It's not rendered in the browser, but fully visible in View Source.

```html
<!-- TODO: Sjonnie, REMOVE this before going live!!! Password = TULIP_HACKER -->
<!-- Also please stop using your cat's name as passwords... -->
```

The comment should be placed roughly in the middle of the HTML body (not at the very top — make them scroll a bit in the source).

**Password:** `TULIP_HACKER`

#### Visual Design

- Page looks like a personal blog/diary with handwritten-style font accents.
- Diary entries are silly and in character: *"Day 47: I put the password in a comment. Nobody will EVER find it. I am a security genius. — Sjonnie"*
- Include 3-4 short, humorous diary entries to give the page some body.

#### Hints

1. **Hint 1:** "Sjonnie writes notes to himself that only he can see... or can he?" *(nudge: comments)*
2. **Hint 2:** "What you see isn't everything. Try viewing what's behind the curtain." *(nudge: view source)*
3. **Hint 3:** "Right-click → 'View Page Source' and look for Sjonnie's notes." *(direct answer)*

#### The "Aha!" Moment

Player right-clicks → View Page Source → scrolls through → sees the comment with Sjonnie's "reminder" to himself. *"Oh, it was just sitting there in the comments!"*

---

### Level 2: "The Invisible Vault" 👻

**Difficulty:** ⭐⭐ (Easy-Medium)

**Security Concept:** CSS-hidden content — security through obscurity using `display: none`, hidden elements, and visual tricks.

**Real-world lesson:** Hiding content with CSS is not security. The DOM contains everything — inspect it.

#### The Setup

The page is styled as Sjonnie's "Maximum Security Vault" — an over-the-top "secure" page with padlocks, warning signs, and dramatic text ("⚠️ AUTHORIZED PERSONNEL ONLY ⚠️"). The page appears to contain nothing useful — just warnings and a password prompt.

#### How the Password Is Hidden

The password is hidden using **multiple CSS techniques** layered on the page. Players need to use the Elements/Inspector panel to find hidden content.

Specifically, there are **three hidden elements** (to make it feel like a real hunt):

1. A `<div>` with `display: none` containing a red herring: *"Nice try! But this isn't the password. Keep looking..."*
2. A `<span>` with `color` matching the background color (white text on white background), containing another red herring: *"Getting warmer! But not here either."*
3. A `<p>` with `font-size: 0px` and `opacity: 0` containing the actual password, nested inside a `<div>` with the class `totally-not-the-password`:

```html
<div class="totally-not-the-password">
  <p style="font-size: 0; opacity: 0; position: absolute;">G33STELIJK</p>
</div>
```

**Password:** `G33STELIJK`

#### Visual Design

- Dramatic "vault" theme — dark background, neon warning colors (yellow/red).
- Exaggerated security theater: animated padlock icons, "CLASSIFIED" stamps.
- The page *feels* empty/locked down, which should trigger curiosity about what's actually in the DOM.

#### Hints

1. **Hint 1:** "Just because you can't see it doesn't mean it's not there." *(nudge: hidden elements)*
2. **Hint 2:** "Open the Inspector and search the elements. Some things are hiding in plain sight... or rather, hiding in plain HTML." *(nudge: Elements panel)*
3. **Hint 3:** "Look for elements with suspicious classes. Try Ctrl+F in the Inspector and search for 'password'." *(near-direct answer)*

#### The "Aha!" Moment

Player opens DevTools → Elements panel → starts clicking through DOM nodes → finds the `totally-not-the-password` class → realizes the password was on the page all along, just invisible. The red herrings make the hunt feel rewarding.

---

### Level 3: "Console Cowboys" 🤠

**Difficulty:** ⭐⭐⭐ (Medium)

**Security Concept:** JavaScript variable/function exposure — sensitive data stored in client-side JavaScript.

**Real-world lesson:** Anything in client-side JavaScript is public. API keys, passwords, admin flags — if it's in the JS, it's accessible.

#### The Setup

The page is Sjonnie's "Unbreakable Password Checker" — it has a password input and a button that says "Check Password." When you type a wrong password, it says "WRONG!" with a dramatic animation. The page taunts you: *"This password is protected by Sjonnie's Ultra-Secure JavaScript Encryption™."*

#### How the Password Is Hidden

The password is stored in a **JavaScript object** in the level-specific JS file (`js/level3.js`). The page also has several functions and variables as distractions.

```javascript
// Sjonnie's Ultra-Secure Password Vault™
// "Nobody ever looks in the console, right?" — Sjonnie

const sjonnieVault = {
  name: "Sjonnie's Secret Stash",
  created: "2026-01-01",
  encryption: "military-grade-256-bit-rot13-quantum", // Very real. Very secure.
  _secret_password: "STROOPWAFEL42",
  motd: "If you're reading this, I should probably find a new hiding spot..."
};

function checkPassword(input) {
  if (input === sjonnieVault._secret_password) {
    return true;
  }
  return false;
}

// Debug helper — definitely remove before production!!
console.log("%c🔐 Psst... Sjonnie left something interesting in the global scope. Try typing 'sjonnieVault' in the console.", "color: #ff6b35; font-size: 14px; font-weight: bold;");
```

The `console.log` serves as a breadcrumb — when the player opens the Console tab, they'll see the styled hint message. Then they can type `sjonnieVault` to see the object, or `sjonnieVault._secret_password` to get the password directly.

**Password:** `STROOPWAFEL42`

#### Visual Design

- "Hacker terminal" aesthetic but pasquil-ified — green-on-black but with Pasquil's bright accent colors.
- Dramatic "ACCESS DENIED" animations when wrong passwords are entered.
- The taunt text should be smug and overconfident (Sjonnie is proud of his "encryption").

#### Hints

1. **Hint 1:** "Sjonnie talks to himself a lot. Have you checked where developers usually talk?" *(nudge: console)*
2. **Hint 2:** "Open the Console tab in DevTools. Sjonnie might have left a message for you." *(nudge: console.log)*
3. **Hint 3:** "Type `sjonnieVault` in the console and press Enter." *(direct answer)*

#### The "Aha!" Moment

Player opens Console → sees the styled hint from `console.log` → types `sjonnieVault` → the entire object spills out, password and all. *"He literally just left the password sitting in a JavaScript variable?!"*

---

### Level 4: "Cookie Monster" 🍪

**Difficulty:** ⭐⭐⭐⭐ (Medium-Hard)

**Security Concept:** Client-side storage — cookies, localStorage, and sessionStorage inspection.

**Real-world lesson:** Sensitive data should never be stored in browser storage in plain (or easily-reversible) form. Tokens, session data, and secrets in cookies/localStorage are accessible to any script — and any user with DevTools.

#### The Setup

The page is Sjonnie's "Cookie Bakery" — a fun, cookie-themed page where Sjonnie claims to have baked "the most secure cookies on the internet." The page has a cookie jar animation, cookie-related puns, and a password prompt.

When the page loads, it **sets a cookie and populates localStorage** with various data.

#### How the Password Is Hidden

When the page loads, JavaScript sets the following:

**Cookie:**
```javascript
document.cookie = "session_user=sjonnie; path=/";
document.cookie = "theme=dark_chocolate; path=/";
document.cookie = "secret_recipe=SzAwS0pFU19NT05TVEVS; path=/";
document.cookie = "tracking=no_thanks; path=/";
```

**localStorage:**
```javascript
localStorage.setItem("bakery_name", "Sjonnie's Cookie Corner");
localStorage.setItem("daily_special", "Stroopwafels");
localStorage.setItem("hint_hint", "The real secret is in the cookie jar (check the cookies, not localStorage!)");
```

The cookie `secret_recipe` contains the password **Base64-encoded**: `SzAwS0pFU19NT05TVEVS` decodes to `K00KJES_MONSTER`.

**Password:** `K00KJES_MONSTER`

#### The Two-Step Challenge

1. **Find the data:** Player must navigate to Application tab → Cookies / localStorage.
2. **Decode it:** The `secret_recipe` cookie value is Base64-encoded. Player needs to recognize it as Base64 and decode it (using `atob()` in the console, an online decoder, or recognizing the pattern).

The localStorage `hint_hint` entry nudges them toward the cookies if they look there first.

#### Visual Design

- Warm bakery/cookie theme — browns, oranges, cream colors.
- Cute cookie jar animation (CSS-only, can be simple).
- Cookie puns everywhere: "We take your privacy very seriously (we eat all the cookies ourselves 🍪)."

#### Hints

1. **Hint 1:** "Sjonnie loves cookies. So does your browser. Have you checked what cookies this page left behind?" *(nudge: cookies)*
2. **Hint 2:** "Go to DevTools → Application tab → Cookies. One of these cookies looks a bit... encoded." *(nudge: Application panel)*
3. **Hint 3:** "The `secret_recipe` cookie is Base64-encoded. Decode it with `atob('SzAwS0pFU19NT05TVEVS')` in the console." *(direct answer)*

#### The "Aha!" Moment

Two-phase aha: First — *"Oh, there's data in the cookies/storage!"* Second — *"Wait, this cookie value looks weird... it's encoded! Let me decode it."* The combination of finding the right storage AND decoding the value makes this level satisfying.

---

### Level 5: "The Final Heist" 🏆

**Difficulty:** ⭐⭐⭐⭐⭐ (Hard — Boss Level)

**Security Concept:** Multi-layered client-side investigation — combining source inspection, network/resource analysis, and JavaScript debugging.

**Real-world lesson:** Real web security requires defense in depth. Attackers don't just look in one place — they examine every layer. This level combines multiple techniques from previous levels.

#### The Setup

The page is the "Pasquil Maximum Security Office" — Sjonnie's final, most "secure" page. It looks polished and intimidating. Sjonnie is pulling out all the stops: *"You've made it this far, but this page is UNBREAKABLE. I've used every security measure I know: invisible text, encrypted cookies, obfuscated code... you'll never find this one."*

#### How the Password Is Hidden — The Multi-Step Trail

This level requires the player to follow a **breadcrumb trail** across multiple hiding spots. There is NO single place where the full password is revealed — they must piece it together.

**Step 1: Find the trail start in the HTML source**

An HTML comment near the top:
```html
<!-- Sjonnie's Security Audit Log: All clear! No passwords here.
     But between you and me... check what's loaded in the Network tab. 
     Look for something that doesn't belong. -->
```

**Step 2: Discover a hidden JavaScript file**

The page loads a suspicious file via a `<script>` tag with a misleading name:
```html
<script src="js/level5.js"></script>
```

Inside `js/level5.js`:
```javascript
// Sjonnie's FINAL defense layer
// "I split the password into pieces. Even if they find one, they'll never find them all!" — Sjonnie

(function() {
  // Part 1 is right here, if you can find it
  const _0x1 = "P4"; // Part 1 of 3

  // Part 2? I hid that somewhere you'd never expect...
  // Hint: data can live in the strangest HTML attributes.

  // Part 3? Hah! Good luck. Check the network response headers.
  // ...oh wait, this is a static site. I meant the meta tags. Same thing, right?
  
  window.__heistStatus = {
    partsFound: 0,
    totalParts: 3,
    assemble: function(p1, p2, p3) {
      const result = p1 + p2 + p3;
      console.log("🔐 Assembled password: " + result);
      return result;
    }
  };
})();
```

**Step 3: Find Part 2 in a custom data attribute**

Hidden in the HTML body on a deeply nested, innocuous-looking element:
```html
<footer>
  <div class="footer-links">
    <span class="copyright" data-sjonnie-part2="SQU1L_" aria-hidden="true">© 2026 Pasquil</span>
  </div>
</footer>
```

The player needs to inspect elements and notice the `data-sjonnie-part2` attribute.

**Step 4: Find Part 3 in a meta tag**

In the `<head>`:
```html
<meta name="author" content="Sjonnie">
<meta name="description" content="Pasquil's most secure page ever">
<meta name="sjonnie-part3" content="M4ST3R">
```

**Complete Password:** `P4SQU1L_M4ST3R` (Part 1: `P4` + Part 2: `SQU1L_` + Part 3: `M4ST3R`)

#### Visual Design

- "Heist" theme — dark, dramatic, spotlights, vault door imagery.
- A visual "progress tracker" showing "Parts Found: ?/3" (purely decorative, doesn't auto-update).
- Sjonnie's final taunt: *"You think you're a hacker? Prove it. Find all three pieces."*
- Victory state should be BIG and celebratory.

#### Hints

1. **Hint 1:** "The password is split into three parts. You'll need to search everywhere — source, scripts, elements, and metadata." *(confirm the mechanic)*
2. **Hint 2:** "Part 1 is in a JS file. Part 2 is hiding in a data attribute. Part 3 is in the page metadata." *(locations without specifics)*
3. **Hint 3:** "JS variable `_0x1` = 'P4'. `data-sjonnie-part2` attribute = 'SQU1L_'. Meta tag `sjonnie-part3` = 'M4ST3R'. Combine them." *(full answer)*

#### The "Aha!" Moment

The trail of breadcrumbs is the magic here. Each piece found builds excitement. The final moment of typing `P4SQU1L_M4ST3R` and seeing the victory screen is the payoff for the entire game. *"I actually had to think like a real hacker — checking everything!"*

---

## 4. Navigation Flow

```
┌─────────────────┐
│   Landing Page   │
│   (index.html)   │
│                   │
│  [Start Level 1] │ ← No password needed
└────────┬──────────┘
         │
         ▼
┌─────────────────┐     Password: TULIP_HACKER
│    Level 1       │ ──────────────────────────────┐
│  Secret Diary    │                                │
└──────────────────┘                                ▼
                                            ┌──────────────────┐
                                            │    Level 2        │
     Password: G33STELIJK                   │  Invisible Vault  │
┌───────────────────────────────────────────│                    │
│                                           └──────────────────┘
▼
┌──────────────────┐     Password: STROOPWAFEL42
│    Level 3        │ ──────────────────────────────┐
│  Console Cowboys  │                                │
└──────────────────┘                                ▼
                                            ┌──────────────────┐
                                            │    Level 4        │
     Password: K00KJES_MONSTER              │  Cookie Monster   │
┌───────────────────────────────────────────│                    │
│                                           └──────────────────┘
▼
┌──────────────────┐     Password: P4SQU1L_M4ST3R
│    Level 5        │ ──────────────────────────────┐
│  The Final Heist  │                                │
└──────────────────┘                                ▼
                                            ┌──────────────────┐
                                            │  Victory Screen   │
                                            │  (in level5.html) │
                                            └──────────────────┘
```

### How Password Unlocking Works

Each level page has a password input form at the bottom. When the correct password is entered:

1. **Success feedback** — Green flash, confetti-style animation, congratulatory message.
2. **Reveal the link** — A "Proceed to Level N+1" button appears with the URL.
3. **Store progress** — Save to `localStorage` (`pasquil_progress: { level: N, completed: true }`), so the landing page can show which levels they've beaten.

### Password Validation

- Passwords are **case-insensitive** (convert to uppercase before comparing) — reduces frustration.
- Each level page contains the password hash (SHA-256) of the **next level's entry password** rather than a plaintext comparison. Wait — since this is client-side-only and the passwords are discoverable by design, we'll use **plaintext comparison** for simplicity. The game is ABOUT finding the passwords, so obfuscating the validation would only add confusion, not security.
- Actually, let's use a **simple hash comparison** — store the SHA-256 hash of the expected password in `game.js`. This way, a player can't skip ahead by reading the validation code. The hash approach teaches an additional subtle lesson about password storage.

```javascript
// game.js — password hashes (SHA-256)
const levelPasswords = {
  1: "e3b0c44298fc1c149afbf4c8996fb924...", // hash of TULIP_HACKER
  2: "...",                                   // hash of G33STELIJK
  3: "...",                                   // hash of STROOPWAFEL42
  4: "...",                                   // hash of K00KJES_MONSTER
  5: "...",                                   // hash of P4SQU1L_M4ST3R
};

async function checkPassword(level, input) {
  const normalized = input.trim().toUpperCase();
  const hash = await sha256(normalized);
  return hash === levelPasswords[level];
}
```

### Direct URL Access

Each level page is a standalone HTML file. Players CAN navigate directly to any level URL (e.g., `/levels/level3.html`). This is intentional — the "lock" is the password form on each page that reveals the next level's URL, not actual access control. Keep it simple.

---

## 5. Landing Page (`index.html`)

### Layout

```
┌──────────────────────────────────────────────────┐
│                                                    │
│              🔐 PASQUIL'S CYBER HEIST              │
│                                                    │
│     "Can you hack Sjonnie's terrible websites?"    │
│                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Level 1 │ │ Level 2 │ │ Level 3 │              │
│  │  📖     │ │  👻     │ │  🤠     │              │
│  │ Secret  │ │Invisible│ │ Console │              │
│  │ Diary   │ │ Vault   │ │ Cowboys │              │
│  │         │ │  🔒     │ │  🔒     │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│                                                    │
│  ┌─────────┐ ┌─────────┐                          │
│  │ Level 4 │ │ Level 5 │                          │
│  │  🍪     │ │  🏆     │                          │
│  │ Cookie  │ │  Final  │                          │
│  │ Monster │ │  Heist  │                          │
│  │  🔒     │ │  🔒     │                          │
│  └─────────┘ └─────────┘                          │
│                                                    │
│          "Brought to you by Pasquil.nl"            │
│  "Where we break things so others don't have to"   │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Behavior

- **Level 1** is always unlocked (clickable, bright, inviting).
- **Levels 2-5** start as locked (greyed out, padlock icon). They become unlocked when `localStorage` shows the previous level is completed.
- A player can click any unlocked level to navigate to it.
- The landing page reads from `localStorage` key `pasquil_progress` (a JSON object).

### Content

- **Title:** "Pasquil's Cyber Heist"
- **Subtitle:** "Sjonnie built 5 'secure' web pages. Your mission: find the hidden password in each one."
- **Intro text:** Short, punchy explanation of the game (3-4 sentences max). Mention that all you need is a browser and your wits.
- **Footer:** "Built with 💜 by Pasquil.nl — Making the internet safer, one terrible password at a time."
- **Rules box:** Small box explaining: "🔧 All you need: A modern browser with DevTools (F12). No external tools, no server hacking. Everything is in the browser."

---

## 6. Visual Style Direction

### Color Palette

| Role            | Color     | Hex       | Usage                              |
|-----------------|-----------|-----------|-------------------------------------|
| Primary         | Purple    | `#6C2DC7` | Headers, buttons, accents           |
| Secondary       | Orange    | `#FF6B35` | Highlights, hover states, alerts    |
| Accent          | Yellow    | `#FFD23F` | Stars, badges, success states       |
| Background      | Off-white | `#F5F0EB` | Page backgrounds                    |
| Dark            | Charcoal  | `#2D2D2D` | Text, dark sections                 |
| Success         | Green     | `#4CAF50` | Correct password feedback           |
| Error           | Red       | `#E53935` | Wrong password feedback             |

### Typography

- **Headings:** Bold, rounded sans-serif — `'Nunito'` or `'Poppins'` (Google Fonts). Big, playful.
- **Body:** Clean sans-serif — `'Inter'` or system fonts as fallback.
- **Code/monospace:** `'Fira Code'` or `'Source Code Pro'` — for any "hacker" themed text.

### Visual Personality

- **Bold and bright.** Nothing subtle. Big text, vivid colors, generous whitespace.
- **Rounded corners everywhere.** Cards, buttons, inputs — all have `border-radius: 12px` or more.
- **Emoji as decoration.** Use emoji freely in headings and UI elements (🔐 🍪 🏆 💀 etc.).
- **Playful micro-interactions.** Buttons scale on hover. Wrong passwords trigger a head-shake animation. Correct passwords trigger a brief confetti burst.
- **Sjonnie's personality.** Each level has a "Sjonnie says:" quote box — his overconfident commentary about his own security.
- **No stock photos.** Use CSS shapes, emoji, and simple SVG illustrations for any imagery.

### Responsive Design

- Mobile-friendly but optimized for desktop (DevTools requires a desktop browser anyway).
- Minimum viable width: 360px. Optimal: 1024px+.
- Level cards on landing page: 3-column grid on desktop, single column on mobile.

---

## 7. Shared Components

### 7.1 Password Input Form

Every level page has this form at the bottom. Consistent design across all levels.

```html
<section class="password-section" id="password-section">
  <h2>🔐 Enter the password</h2>
  <form id="password-form" onsubmit="return handlePasswordSubmit(event)">
    <div class="input-group">
      <input 
        type="text" 
        id="password-input" 
        placeholder="Type the password here..."
        autocomplete="off"
        spellcheck="false"
      >
      <button type="submit" class="btn-submit">Check →</button>
    </div>
  </form>
  <div id="feedback" class="feedback hidden"></div>
  <div id="next-level" class="next-level hidden">
    <a href="levelN+1.html" class="btn-next">Proceed to Level N+1 →</a>
  </div>
</section>
```

#### Behavior

- **On wrong password:** Show red feedback message with shake animation. Message rotates between:
  - "Nope! Sjonnie's secrets are safe... for now."
  - "Wrong! Have you tried looking harder? 👀"
  - "Access Denied. Sjonnie is laughing at you."
- **On correct password:** Show green feedback, confetti animation, reveal "next level" button.
- **Input:** Not a password field (`type="text"`) — we WANT players to see what they type.

### 7.2 Success / Fail Feedback

```css
/* Success state */
.feedback.success {
  background: #4CAF50;
  color: white;
  padding: 16px;
  border-radius: 12px;
  animation: slideIn 0.3s ease;
}

/* Error state */
.feedback.error {
  background: #E53935;
  color: white;
  padding: 16px;
  border-radius: 12px;
  animation: shake 0.5s ease;
}
```

**Success message template:** "✅ PASSWORD CORRECT! You cracked Sjonnie's {level_name}! Proceed to the next challenge."

**Confetti effect:** Simple CSS-only confetti using pseudo-elements and `@keyframes`. No external library.

### 7.3 Hint System

Each level has 3 progressive hints. Players click a "Need a hint?" button to reveal them one at a time.

```html
<section class="hints-section">
  <button class="btn-hint" onclick="showNextHint()">💡 Need a hint?</button>
  <div id="hints-container">
    <!-- Hints revealed one at a time -->
    <div class="hint hidden" data-hint="1">
      <span class="hint-label">Hint 1:</span>
      <p><!-- hint text --></p>
    </div>
    <div class="hint hidden" data-hint="2">
      <span class="hint-label">Hint 2:</span>
      <p><!-- hint text --></p>
    </div>
    <div class="hint hidden" data-hint="3">
      <span class="hint-label">Hint 3:</span>
      <p><!-- hint text --></p>
    </div>
  </div>
</section>
```

#### Behavior

- Hints are revealed **sequentially** — you must reveal Hint 1 before Hint 2.
- Each reveal has a slight delay and fade-in animation.
- After all 3 hints are shown, the button changes to "No more hints! You're on your own 🫡".
- Hint 3 is always very close to the direct answer (for accessibility — we don't want anyone truly stuck).

### 7.4 Level Header

Every level page starts with a consistent header:

```html
<header class="level-header">
  <a href="../index.html" class="back-link">← Back to levels</a>
  <div class="level-badge">Level N</div>
  <h1>Level Name</h1>
  <p class="level-subtitle">What the level is about</p>
  <div class="sjonnie-says">
    <strong>Sjonnie says:</strong> "Overconfident quote about his security"
  </div>
</header>
```

### 7.5 Victory Screen (After Level 5)

When the player enters the correct password on Level 5:

- Full-screen takeover with confetti animation.
- Big trophy emoji / illustration.
- Message: "🎉 YOU DID IT! You hacked all 5 of Sjonnie's 'secure' pages!"
- Summary of what they learned (one line per level):
  1. "HTML comments aren't secret"
  2. "CSS can't hide content from the DOM"
  3. "JavaScript variables are public"
  4. "Browser storage is not secure"
  5. "Real security requires defense in depth"
- CTA: "Want to learn more about real web security? Visit pasquil.nl"
- Share button (optional stretch goal): "I completed Pasquil's Cyber Heist! 🔐"

---

## 8. Password Reference Table

| Level | Name             | Password          | Where It's Hidden                        | Concept              |
|-------|------------------|--------------------|------------------------------------------|----------------------|
| 1     | Secret Diary     | `TULIP_HACKER`     | HTML comment in source                   | View Source           |
| 2     | Invisible Vault  | `G33STELIJK`       | CSS-hidden DOM element                   | DOM Inspection        |
| 3     | Console Cowboys  | `STROOPWAFEL42`    | JavaScript variable (console)            | JS Debugging          |
| 4     | Cookie Monster   | `K00KJES_MONSTER`  | Base64-encoded cookie                    | Storage & Encoding    |
| 5     | The Final Heist  | `P4SQU1L_M4ST3R`   | Split across JS, data-attr, meta tag     | Multi-layer Analysis  |

---

## 9. Implementation Notes

### For Frontend Developers

- **Start with `game.js`** — build the shared password checking, hint system, and navigation first. All levels depend on it.
- **Build levels in order** — Level 1 is the simplest and establishes the pattern. Each subsequent level adds complexity.
- **Test each level by actually solving it** — open DevTools and verify the password is findable using only the intended technique.
- **Keep levels self-contained** — each level HTML file should work independently. Shared JS/CSS via relative paths.

### Content Security

- Since this is a hacking game, we're intentionally "insecure" — that's the point. But:
  - Don't include actual malicious code.
  - The SHA-256 hash comparison in `game.js` prevents trivially reading passwords from the shared code.
  - Each level's password-hiding mechanism is its own contained lesson.

### Accessibility Notes

- All interactive elements should be keyboard-navigable.
- Hint system ensures no player is permanently stuck.
- Color is never the ONLY indicator — always pair with text/icons.
- Screen readers will naturally expose hidden content (which is fine — the game is about learning to use browser tools).

---

*Designed by Danny. Built for Pasquil. Hacked by you.* 🔐
