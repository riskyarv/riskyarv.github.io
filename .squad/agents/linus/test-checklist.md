# 🧪 Pasquil Cyber Heist — Comprehensive Test Checklist

**Tester:** Linus  
**Status:** Ready for Implementation Testing  
**Last Updated:** March 30, 2026

---

## LANDING PAGE (index.html)

### Layout & Content Verification
- [ ] Title "Pasquil's Cyber Heist" displays prominently
- [ ] Subtitle mentions "Sjonnie built 5 'secure' web pages"
- [ ] Five level cards render in grid (3 columns on desktop, 1 column on mobile)
- [ ] Level icons display: 📖 👻 🤠 🍪 🏆
- [ ] Footer text includes "Built with 💜 by Pasquil.nl"
- [ ] Rules box explains "All you need: A modern browser with DevTools (F12)"

### Level Lock/Unlock State
- [ ] **Level 1** is unlocked and clickable on first visit
- [ ] **Levels 2-5** are locked (greyed out, padlock visible) on first visit
- [ ] After completing Level 1, localStorage updates and Level 2 unlocks on refresh
- [ ] After completing Level 2, Level 3 unlocks
- [ ] After completing Level 3, Level 4 unlocks
- [ ] After completing Level 4, Level 5 unlocks
- [ ] Clicking any locked level shows a message/tooltip: "Complete Level X first"

### Progress Persistence
- [ ] Close browser, reopen → landing page shows which levels are unlocked
- [ ] Clear localStorage → all levels reset to locked state (except Level 1)
- [ ] localStorage key `pasquil_progress` stores JSON with level completion status
- [ ] Navigating directly to a level URL (e.g., `/levels/level2.html`) works

### Mobile Responsiveness (Landing Page)
- [ ] Cards stack single-column on screens < 768px
- [ ] Text is readable (no overflow) at 360px width
- [ ] Touch targets (buttons) are >= 44px tall
- [ ] Grid layout doesn't break on tablet (768px - 1024px)

---

## LEVEL 1: Secret Diary 📖

### Solve Path — Exact Steps
1. Navigate to Level 1
2. Right-click on page → "View Page Source" (or Ctrl+U / Cmd+U)
3. Search (Ctrl+F) for "Password" or scroll roughly halfway through source
4. Find HTML comment: `<!-- TODO: Sjonnie, REMOVE this before going live!!! Password = TULIP_HACKER -->`
5. Copy the password `TULIP_HACKER`
6. Return to page, enter into password input, click "Check →"
7. Receive success feedback and "Proceed to Level 2" button

### Expected Password
- **Correct:** `TULIP_HACKER`
- **Case-insensitive:** `tulip_hacker`, `Tulip_Hacker` all work

### Red Flags (Things That Would Be Wrong)
- [ ] Password visible in rendered page text (should ONLY be in HTML comment)
- [ ] Password in JavaScript source (should be HTML comment, not JS)
- [ ] Comment is at very top of file (should be ~50% through, force scrolling in View Source)
- [ ] Comment lacks Sjonnie's personality/humor
- [ ] Missing the actual `Password = ` text in comment (makes search harder)

### Edge Cases & Validation
- [ ] Empty input → "Please enter a password" message
- [ ] Whitespace input (spaces only) → "Wrong!" feedback
- [ ] Extra spaces: `TULIP_HACKER ` (with trailing space) → rejects or trims
- [ ] Wrong password `TULIP` → "Wrong!" with shake animation
- [ ] Multiple wrong attempts → no lockout, no rate limit

### Content & Presentation
- [ ] Page styled as personal diary/blog
- [ ] 3-4 humorous diary entries visible
- [ ] One entry mentions Sjonnie's overconfidence: *"I put the password in a comment..."*
- [ ] Header shows: "Level 1" badge, title, Sjonnie quote about security being foolproof

### Hints System
- [ ] Hint 1: "Sjonnie writes notes to himself..." — hints at comments
- [ ] Hint 2: "What you see isn't everything..." — hints at View Source
- [ ] Hint 3: "Right-click → 'View Page Source'..." — direct answer
- [ ] Hints reveal sequentially (Hint 1 → reveal button says Hint 2, etc.)
- [ ] After Hint 3, button changes to "No more hints! You're on your own 🫡"

---

## LEVEL 2: Invisible Vault 👻

### Solve Path — Exact Steps
1. Navigate to Level 2
2. Open DevTools (F12)
3. Go to **Elements** / **Inspector** tab
4. Use Ctrl+F in Elements panel to search for "password"
5. Alternate approach: Manually expand DOM and look for suspicious class names like `totally-not-the-password`
6. Find the nested div/span/p with various CSS hiding tricks:
   - One with `display: none` (red herring)
   - One with white text on white background (red herring)
   - One with `font-size: 0; opacity: 0` containing `G33STELIJK` (actual)
7. Copy password `G33STELIJK`
8. Enter into password input, click "Check →"

### Expected Password
- **Correct:** `G33STELIJK`
- **Case-insensitive:** `g33stelijk`, `G33STELIJK` all work

### Red Flags (Things That Would Be Wrong)
- [ ] Password visible in rendered page (no text should appear)
- [ ] Password searchable in View Source as plain text (should be hidden via CSS)
- [ ] All hidden elements use the same hiding technique (should mix methods: display:none, color-match, font-size:0)
- [ ] Class names are too obvious (e.g., `hidden-password`) instead of `totally-not-the-password`
- [ ] Red herring messages are confusing or missing

### Edge Cases & Validation
- [ ] Empty input → error message
- [ ] Case variations: `g33stelijk` → accepted
- [ ] Numbers as words: `gthreethreestelijk` → rejected
- [ ] Missing numbers: `G33STELIJ` → rejected
- [ ] Wrong numbers: `G99STELIJK` → rejected

### Content & Presentation
- [ ] Dark/dramatic vault theme with neon warning colors
- [ ] Animated padlock icons visible
- [ ] Text like "⚠️ AUTHORIZED PERSONNEL ONLY ⚠️"
- [ ] Multiple "CLASSIFIED" stamps or security theater elements
- [ ] No visible text reveals password (DOM-only)

### Hints System
- [ ] Hint 1: "Just because you can't see it..." — hints at hidden elements
- [ ] Hint 2: "Open the Inspector and search the elements..." — nudge to Elements tab
- [ ] Hint 3: "Look for `totally-not-the-password` class..." — near-direct answer
- [ ] Button shows hint count progress

---

## LEVEL 3: Console Cowboys 🤠

### Solve Path — Exact Steps
1. Navigate to Level 3
2. Open DevTools (F12)
3. Go to **Console** tab
4. See styled console.log message: *"Psst... Sjonnie left something interesting in the global scope..."*
5. Type `sjonnieVault` and press Enter
6. Object expands, showing structure with `_secret_password: "STROOPWAFEL42"`
7. OR type `sjonnieVault._secret_password` directly
8. Copy password `STROOPWAFEL42`
9. Enter into password input, click "Check →"

### Expected Password
- **Correct:** `STROOPWAFEL42`
- **Case-insensitive:** `stroopwafel42`, `STROOPWAFEL42` all work

### Red Flags (Things That Would Be Wrong)
- [ ] Password visible in page HTML or rendered text
- [ ] console.log breadcrumb missing (player has no hint to open Console)
- [ ] sjonnieVault object not globally accessible (should be window-level)
- [ ] Password stored as plaintext in validation code (defeats purpose of lesson)
- [ ] Variable name is too obvious (e.g., `password`) instead of `_secret_password`

### Edge Cases & Validation
- [ ] Empty input → error
- [ ] Case: `stroopwafel42` → accepted
- [ ] Close console and reopen → password still accessible
- [ ] Try accessing non-existent property: `sjonnieVault.fake` → undefined
- [ ] Type wrong password: `STROOPWAFEL` → rejected

### Content & Presentation
- [ ] Page has "Hacker terminal" aesthetic but Pasquil-ified
- [ ] Green-on-black or dark theme, but with Pasquil bright accent colors
- [ ] "ACCESS DENIED" animation plays on wrong password
- [ ] Page taunts: "This password is protected by Sjonnie's Ultra-Secure JavaScript Encryption™"
- [ ] Password input shows wrong feedback with dramatic style

### Hints System
- [ ] Hint 1: "Sjonnie talks to himself a lot. Have you checked where developers usually talk?" — hints at Console
- [ ] Hint 2: "Open the Console tab in DevTools. Sjonnie might have left a message..." — nudge to console.log
- [ ] Hint 3: "Type `sjonnieVault` in the console and press Enter." — direct answer
- [ ] No hint spoils the existence of _secret_password property until Hint 3

---

## LEVEL 4: Cookie Monster 🍪

### Solve Path — Exact Steps
1. Navigate to Level 4
2. Open DevTools (F12)
3. Go to **Application** tab (or **Storage** in Firefox)
4. Navigate to **Cookies** section
5. See list of cookies set for this page:
   - `session_user=sjonnie`
   - `theme=dark_chocolate`
   - `secret_recipe=SzAwS0pFU19NT09UVEVS` ← This one
   - `tracking=no_thanks`
6. Note that `secret_recipe` value looks like Base64 encoding (uppercase letters + numbers, ends with `=`)
7. Open **Console** tab
8. Type `atob('SzAwS0pFU19NT09UVEVS')` and press Enter
9. Result: `K00KJES_MONSTER`
10. Copy password and enter into password input

### Alternative Path (localStorage hint)
1. Steps 1-2 same as above
2. Check **localStorage** section
3. See localStorage hint: `hint_hint: "The real secret is in the cookie jar..."`
4. This confirms to check cookies instead
5. Continue from step 5 above

### Expected Password
- **Correct:** `K00KJES_MONSTER`
- **Case-insensitive:** `k00kjes_monster`, `K00KJES_MONSTER` all work

### Red Flags (Things That Would Be Wrong)
- [ ] Password stored in plain text in cookie (defeats lesson — should be encoded)
- [ ] Cookies not set on page load (no data to find)
- [ ] localStorage is completely empty (removes alternative path)
- [ ] Cookie value is encrypted/hashed (should be Base64 — decodable, not unbreakable)
- [ ] No hint directing player toward cookies

### Edge Cases & Validation
- [ ] Empty input → error
- [ ] Just the encoded version: `SzAwS0pFU19NT09UVEVS` → rejected
- [ ] Decoded but wrong case: `k00kjes_monster` → accepted
- [ ] Wrong cookie: using `theme` cookie → rejected
- [ ] Manually typing instead of copy-pasting → still works

### Content & Presentation
- [ ] Warm bakery/cookie theme (browns, oranges, cream colors)
- [ ] Cute CSS-only cookie jar animation
- [ ] Cookie puns: "We take your privacy very seriously (we eat all the cookies ourselves 🍪)"
- [ ] Page is inviting, warm, contrasting with security lesson
- [ ] Sjonnie quote about loving cookies

### Hints System
- [ ] Hint 1: "Sjonnie loves cookies. So does your browser. Have you checked what cookies this page left behind?" — hints at browser cookies
- [ ] Hint 2: "Go to DevTools → Application tab → Cookies. One of these cookies looks... encoded." — near-direct guidance
- [ ] Hint 3: "The `secret_recipe` cookie is Base64-encoded. Decode it with `atob('SzAwS0pFU19NT09UVEVS')`..." — full answer
- [ ] Hints guide two-step process: find data → decode it

### Storage Verification
- [ ] Check Chrome DevTools → Application → Cookies → all four cookies present
- [ ] Check Firefox Storage → Cookies → all four cookies present
- [ ] localStorage contains `bakery_name`, `daily_special`, `hint_hint`
- [ ] Cookies are scoped to page domain correctly

---

## LEVEL 5: The Final Heist 🏆

### Solve Path — Three-Part Combination

#### Part 1: JavaScript File (P4)
1. Open Console in DevTools
2. Type `_0x1` and press Enter → returns `"P4"`
3. OR search in View Source for `js/level5.js`
4. View that file → find constant `const _0x1 = "P4"`

#### Part 2: Data Attribute (SQU1L_)
1. Open Elements/Inspector
2. Search (Ctrl+F in Elements) for `data-sjonnie`
3. Find: `<span data-sjonnie-part2="SQU1L_" ...>`
4. Copy `SQU1L_`
5. OR manually expand footer → find span with class `copyright` → check attributes

#### Part 3: Meta Tag (M4ST3R)
1. Stay in Elements/Inspector
2. Scroll to `<head>` section
3. Find: `<meta name="sjonnie-part3" content="M4ST3R">`
4. Copy `M4ST3R`
5. OR use Ctrl+F in View Source and search for `sjonnie-part3`

#### Combination
1. All three parts: `P4` + `SQU1L_` + `M4ST3R` = `P4SQU1L_M4ST3R`
2. Enter combined password into password input
3. Click "Check →"
4. Victory screen displays with confetti animation

### Expected Password
- **Correct:** `P4SQU1L_M4ST3R`
- **Case-insensitive:** `p4squil_master`, `P4SQUIL_MASTER` all work
- **Must include underscore:** `P4SQUIL_M4ST3R` NOT `P4SQUILM4ST3R`

### Red Flags (Things That Would Be Wrong)
- [ ] All three parts in one place (defeats multi-layer lesson)
- [ ] Parts stored in plaintext variables with obvious names (should use `_0x1`, data attributes, meta tags)
- [ ] HTML comment breadcrumb missing (should nudge toward Network/Resources tab)
- [ ] Meta tags missing or named differently (should be `sjonnie-part3`)
- [ ] Data attribute misspelled or on wrong element
- [ ] Part values are wrong (should be: `P4`, `SQU1L_`, `M4ST3R` exactly)

### Edge Cases & Validation
- [ ] Empty input → error
- [ ] Only one part: `P4` → rejected
- [ ] Two parts: `P4SQU1L_` → rejected
- [ ] Correct parts in wrong order: `M4ST3RP4SQU1L_` → rejected
- [ ] Missing underscore: `P4SQUILM4ST3R` → rejected
- [ ] Extra spaces: `P4SQU1L_M4ST3R ` → accepted (trimmed) or rejected (check implementation)
- [ ] Lowercase: `p4squil_master` → accepted (case-insensitive)

### Content & Presentation
- [ ] "Heist" theme — dark, dramatic, spotlights, vault door imagery
- [ ] Visual progress tracker showing "Parts Found: ?/3" (decorative)
- [ ] Sjonnie's final taunt: "You think you're a hacker? Prove it. Find all three pieces."
- [ ] Page looks polished/intimidating compared to earlier levels
- [ ] HTML comment hints at exploration strategy

### Hints System
- [ ] Hint 1: "The password is split into three parts. You'll need to search everywhere — source, scripts, elements, and metadata." — confirms mechanic
- [ ] Hint 2: "Part 1 is in a JS file. Part 2 is hiding in a data attribute. Part 3 is in the page metadata." — locations without values
- [ ] Hint 3: "JS variable `_0x1` = 'P4'. `data-sjonnie-part2` attribute = 'SQU1L_'. Meta tag `sjonnie-part3` = 'M4ST3R'. Combine them." — full answer
- [ ] Hint system preserves exploration intent while providing full solution if needed

### Victory Screen (Upon Success)
- [ ] Full-screen takeover display
- [ ] Confetti animation or celebratory effect
- [ ] Large trophy emoji 🏆 or celebration graphic
- [ ] Message: "🎉 YOU DID IT! You hacked all 5 of Sjonnie's 'secure' pages!"
- [ ] Summary lessons displayed (one per level):
  1. "HTML comments aren't secret"
  2. "CSS can't hide content from the DOM"
  3. "JavaScript variables are public"
  4. "Browser storage is not secure"
  5. "Real security requires defense in depth"
- [ ] CTA: "Want to learn more about real web security? Visit pasquil.nl"
- [ ] Share button (optional): "I completed Pasquil's Cyber Heist! 🔐"
- [ ] "Back to Start" button returns to landing page
- [ ] Victory state persists in localStorage (prevents repeated victory screens on page reload)

---

## CROSS-LEVEL CHECKS

### Navigation Consistency
- [ ] All level pages have "← Back to levels" link in header (returns to index.html)
- [ ] Password form on EVERY level is identical HTML structure
- [ ] Success button text: "Proceed to Level N+1" is consistently named
- [ ] Button URLs are correct: level1 → level2, level2 → level3, etc.

### CSS/Styling Consistency
- [ ] All levels use same font families (Nunito/Poppins for headers, Inter for body)
- [ ] Color palette consistent:
  - Primary purple (#6C2DC7)
  - Secondary orange (#FF6B35)
  - Yellow accent (#FFD23F)
  - Off-white background (#F5F0EB)
  - Charcoal text (#2D2D2D)
  - Success green (#4CAF50)
  - Error red (#E53935)
- [ ] All buttons have rounded corners (border-radius: 12px)
- [ ] Hover states scale/highlight consistently
- [ ] Wrong password trigger shake animation on all levels
- [ ] Correct password triggers confetti/success animation

### Password Form Behavior (All Levels)
- [ ] Input field is `type="text"` (not password) — players can see what they type
- [ ] Input has `autocomplete="off"` and `spellcheck="false"`
- [ ] Form submission clears input on success
- [ ] Input field maintains focus after wrong attempt (can retry without clicking)
- [ ] Feedback messages rotate (3 different wrong-password messages)
- [ ] Success feedback appears above form or replaces it

### Hint System Consistency (All Levels)
- [ ] Button text: "💡 Need a hint?"
- [ ] Hints appear below button with fade-in animation
- [ ] Hint labels: "Hint 1:", "Hint 2:", "Hint 3:"
- [ ] No hints visible on page load
- [ ] Each click reveals ONE hint in order (1 → 2 → 3)
- [ ] After hint 3, button text changes: "No more hints! You're on your own 🫡"
- [ ] Hints cannot be "unrevealed" — only progressive reveal

### Header Consistency (All Levels)
- [ ] Level badge displays correct number (Level 1, Level 2, etc.)
- [ ] Level name matches game design (Secret Diary, Invisible Vault, etc.)
- [ ] Level subtitle describes the challenge
- [ ] Sjonnie quote includes personality/humor
- [ ] All header sections are readable and well-spaced

---

## MOBILE RESPONSIVENESS SPOT CHECKS

### Portrait Mode (360px - 480px)
- [ ] Password form stacks vertically (input above button)
- [ ] Input and button are full width
- [ ] Buttons are >= 44px tall (touch-friendly)
- [ ] Text doesn't overflow, use smaller font sizes if needed
- [ ] Hints section doesn't overflow horizontally
- [ ] Sjonnie quote and header text remain readable

### Tablet Mode (768px - 1024px)
- [ ] Layout still readable
- [ ] Password form can be side-by-side (input + button) if space allows
- [ ] Hints section displays well
- [ ] No huge whitespace gaps

### Desktop (1024px+)
- [ ] Generous padding/margins
- [ ] Password input is reasonable width (not full-screen)
- [ ] All interactive elements have sufficient spacing

### General Mobile Checks (All Sizes)
- [ ] No horizontal scrolling at declared minimum (360px)
- [ ] Touch targets are >= 44px × 44px
- [ ] Font sizes readable without zooming (minimum 16px body text)
- [ ] CSS media queries are properly tested in Chrome DevTools device emulation

---

## HINT SYSTEM VERIFICATION (ALL LEVELS)

### Hint Reveal Mechanics
- [ ] Click "Need a hint?" → Hint 1 fades in
- [ ] Click again → Hint 2 fades in (Hint 1 stays visible)
- [ ] Click again → Hint 3 fades in (both previous hints stay visible)
- [ ] Click again → No new content, button text changes to "No more hints! 🫡"
- [ ] Refresh page → all hints hidden again (no state persistence on hints)

### Hint Content Quality (Per Level)
- [ ] Hint 1 is vague nudge (not revealing the exact technique)
- [ ] Hint 2 guides toward the correct tool/location
- [ ] Hint 3 is very close to direct answer (accessibility fallback)
- [ ] All hints match the learning objective for that level
- [ ] No hint spoils the next level's lesson

### Hint Styling
- [ ] Hint containers have distinct background or border
- [ ] Hint numbers are bold or visually distinct
- [ ] Hints are readable and well-formatted
- [ ] Fade-in animation is smooth (no janky appearance)

---

## PASSWORD VALIDATION (ALL LEVELS)

### Case Insensitivity
- [ ] `TULIP_HACKER` = `tulip_hacker` = `Tulip_Hacker` → all correct

### Whitespace Trimming
- [ ] ` TULIP_HACKER ` (with leading/trailing spaces) → accepted or trimmed
- [ ] Document the exact behavior (trim vs. reject)

### Special Characters
- [ ] Underscores preserved: `G33STELIJK` has no underscore; `K00KJES_MONSTER` has one
- [ ] Password with numbers: all must match exactly (case-agnostic)
- [ ] No accept-anything behavior

### Wrong Password Feedback
- [ ] Message rotates between 3 options (check game design for exact text)
- [ ] Shake animation is visible and appropriate
- [ ] No error console logs spam (clean implementation)

### Correct Password Feedback
- [ ] Green background success message
- [ ] Message includes "✅ PASSWORD CORRECT!" or similar
- [ ] Confetti or celebratory animation plays
- [ ] "Proceed to Level N+1" button appears
- [ ] Button is clickable and navigates to correct next level

### Hash Comparison (Backend Security)
- [ ] Passwords are compared using SHA-256 hashes, not plaintext
- [ ] game.js contains hashes, not plaintext passwords
- [ ] Hashes are correct (verified during implementation)

---

## BROWSER COMPATIBILITY SPOT CHECKS

### Chrome / Edge (Latest)
- [ ] All levels load correctly
- [ ] DevTools Console, Elements, Application tabs work as expected
- [ ] localStorage functionality works
- [ ] Cookies set and readable
- [ ] CSS animations smooth
- [ ] No console errors

### Firefox (Latest)
- [ ] All levels load correctly
- [ ] Inspector, Console, Storage tabs work as expected
- [ ] localStorage and cookies accessible
- [ ] CSS animations smooth

### Safari (Latest)
- [ ] All levels load correctly
- [ ] Developer Tools work correctly
- [ ] localStorage functionality works
- [ ] Cookies visible in dev tools
- [ ] CSS animations smooth

---

## PERFORMANCE & LOADING

- [ ] All pages load in < 2 seconds on standard connection
- [ ] No render-blocking resources (CSS and JS are optimized)
- [ ] Images/SVGs load without delay
- [ ] Confetti animation doesn't cause jank or lag
- [ ] Hint reveal animations are smooth

---

## ACCESSIBILITY CHECKS

- [ ] All interactive elements (buttons, inputs, links) are keyboard-navigable
- [ ] Tab order makes sense (top to bottom, left to right)
- [ ] Links have visible focus states (outline or underline)
- [ ] Password input has label (even if visually hidden)
- [ ] Color alone isn't the only indicator (text + color for success/error)
- [ ] Hint button communicates state (enabled/disabled)
- [ ] Victory screen text is readable and conveys message clearly

---

## EDGE CASES & STRESS TESTS

### Input Handling
- [ ] Empty string input: "" → rejected
- [ ] Very long input (1000+ characters) → accepted or truncated, no crash
- [ ] Special Unicode characters (emoji, accents) → rejected gracefully
- [ ] Copy-paste with extra whitespace → trimmed or rejected (consistent)

### Navigation
- [ ] Direct URL access to any level (e.g., `/levels/level3.html`) → page loads
- [ ] Browser back button → returns to correct page
- [ ] Browser forward button → works after back navigation
- [ ] Rapid button clicks on password form → only one submission processed

### State Management
- [ ] localStorage values are JSON-serializable
- [ ] Corrupt localStorage data → game handles gracefully (resets or shows error)
- [ ] Clearing cache/cookies → landing page still shows correct unlocked levels
- [ ] Multiple tabs open → progress updates in all tabs (if refreshed)

### Visual Edge Cases
- [ ] Page renders correctly at 360px, 375px, 768px, 1024px, 1440px widths
- [ ] Text doesn't clip or overflow in smaller viewports
- [ ] Emoji render correctly on all platforms

---

## SECURITY (INTENTIONAL INSECURITY) CHECKS

- [ ] No malicious code in level files
- [ ] JavaScript is readable (not minified/obfuscated beyond playability)
- [ ] Passwords are findable using browser tools only (no custom extensions needed)
- [ ] No network requests to external APIs (client-side only)
- [ ] localStorage keys are appropriate (no sensitive non-game data)

---

## FINAL VALIDATION CHECKLIST

Before marking Level as "Ready":
- [ ] All passwords discoverable via intended path
- [ ] All passwords NOT visible in unintended places
- [ ] Hint system works end-to-end
- [ ] Password validation works (correct/incorrect)
- [ ] Next level link works and navigates correctly
- [ ] CSS/styling is consistent with design
- [ ] Mobile layout tested at 360px and 1024px
- [ ] No console errors or warnings
- [ ] Accessibility basics are met (keyboard nav, focus states)

---

## TESTING ENVIRONMENT SETUP

- [ ] Chrome/Edge with DevTools (F12)
- [ ] Firefox with Developer Tools (F12)
- [ ] Safari with Developer Tools (Cmd+Opt+I)
- [ ] Mobile device or DevTools device emulation for responsive testing
- [ ] Clear browser cache between tests (or use incognito/private mode)
- [ ] Fresh localStorage state (use DevTools to clear)

---

## PASS/FAIL CRITERIA

**Level PASSES when:**
- All password discovery paths work as documented
- All hints work and guide correctly
- Password validation works (case-insensitive, trims whitespace)
- Visual design matches theme and palette
- Navigation links to next level work
- No console errors or critical warnings
- Mobile responsive at 360px and 1024px minimum

**Level FAILS if:**
- Password is visible in wrong place (e.g., HTML comment visible in Level 4)
- Password discovery path is unclear or broken
- Hints are misleading or missing
- Password validation has logic errors
- Navigation doesn't work
- Layout breaks at declared viewport widths

---

*Test this checklist as Livingston builds. Report outcomes and any blockers immediately.*
