/* ============================================
   Pasquil's Cyber Heist — Shared Game Logic
   ============================================ */

// SHA-256 hashes of each level's password (UPPERCASE)
const levelPasswords = {
  1: "a49254b2737592d7f15c246d8d0786c06a4f8647247a7c735e8bf15e5ff10346", // "USERNAME:PASSWORD"
  2: "8ebadbaed8281b9b46f1b2bd37000a1234da523d02b7293ebffd6a4d128e04a6",
  3: "0800d78f904a9fb47bae49d5a877224744ff6093482bc91fa12cbe24915e1768",
  4: "bc17a9baa24d4c1ac11c98389df632a0505a16140aa34e02f538e812002e372c",
  5: "60276d9c750ab9f73b8d7ec54c2a68ef70be0c436bfe9f2e16b00cfa552afbd8",
  6: "3ed63ad803ba1a875d0a663d90370c58b427487b9ec58108571af13581cc54f7",
  7: "68a7f1e52e8a03601c8599e9f987808d408a0ba9e07f426f67c166eb8a92113d",
};

const FINAL_LEVEL = 7;

const levelNames = {
  1: "Login Portal",
  2: "Well-Behaved Chatbot",
  3: "Secret Diary",
  4: "Invisible Vault",
  5: "Console Cowboys",
  6: "Cookie Monster",
  7: "The Final Heist",
};

const wrongMessageKeys = ["wrong-1", "wrong-2", "wrong-3", "wrong-4", "wrong-5", "wrong-6"];

// SHA-256 hash using SubtleCrypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Get current level number from the page
function getCurrentLevel() {
  const el = document.querySelector("[data-level]");
  return el ? parseInt(el.getAttribute("data-level"), 10) : 1;
}

// Two levels were added at the start of the game; shift progress saved
// under the old 5-level numbering (1-5) to the new numbering (3-7).
const PROGRESS_VERSION = "2";

function migrateProgress() {
  try {
    if (localStorage.getItem("pasquil_progress_version") === PROGRESS_VERSION) return;
    const raw = localStorage.getItem("pasquil_progress");
    if (raw) {
      const old = JSON.parse(raw) || {};
      const shifted = {};
      Object.keys(old).forEach((lvl) => {
        if (old[lvl]) shifted[parseInt(lvl, 10) + 2] = true;
      });
      localStorage.setItem("pasquil_progress", JSON.stringify(shifted));
    }
    localStorage.setItem("pasquil_progress_version", PROGRESS_VERSION);
  } catch {
    // Ignore storage errors (e.g. private mode)
  }
}

// Load progress from localStorage
function getProgress() {
  migrateProgress();
  try {
    const raw = localStorage.getItem("pasquil_progress");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save level completion
function saveProgress(level) {
  const progress = getProgress();
  progress[level] = true;
  localStorage.setItem("pasquil_progress", JSON.stringify(progress));
}

// Check if a level is completed
function isLevelCompleted(level) {
  return !!getProgress()[level];
}

// Show confetti
function showConfetti() {
  const container = document.querySelector(".confetti-container");
  if (container) {
    container.classList.add("show");
    setTimeout(() => container.classList.remove("show"), 4000);
  }
}

// Handle password form submission
async function handlePasswordSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("password-input");
  const feedback = document.getElementById("feedback");
  const nextLevel = document.getElementById("next-level");
  const usernameInput = document.getElementById("username-input");
  const level = getCurrentLevel();
  let normalized = input.value.trim().toUpperCase();

  // Login-style levels check "USERNAME:PASSWORD"
  if (usernameInput) {
    const username = usernameInput.value.trim().toUpperCase();
    if (!username || !normalized) {
      feedback.textContent = t("type-both") || "Fill in both a username and a password! ⌨️";
      feedback.className = "feedback error";
      return false;
    }
    normalized = username + ":" + normalized;
  }

  if (!normalized) {
    feedback.textContent = t("type-something") || "Type something first! Even Pasquino can do that. ⌨️";
    feedback.className = "feedback error";
    return false;
  }

  const hash = await sha256(normalized);
  const isCorrect = hash === levelPasswords[level];

  if (isCorrect) {
    const successMsg = (t("success-msg") || "✅ PASSWORD CORRECT! You cracked Pasquino's {levelName}! ")
      .replace("{levelName}", t("card-title-" + level) || levelNames[level] || "level");
    const suffix = level < FINAL_LEVEL
      ? (t("success-proceed") || "Proceed to the next challenge.")
      : (t("success-complete") || "You've completed the heist!");
    feedback.textContent = successMsg + suffix;
    feedback.className = "feedback success";

    saveProgress(level);
    showConfetti();

    if (nextLevel) {
      nextLevel.classList.remove("hidden");
    }

    // Final level victory screen
    if (level === FINAL_LEVEL) {
      setTimeout(() => {
        const victory = document.querySelector(".victory-overlay");
        if (victory) {
          victory.classList.add("show");
          showConfetti();
        }
      }, 1500);
    }

    input.disabled = true;
    if (usernameInput) usernameInput.disabled = true;
    document.querySelector(".btn-submit").disabled = true;
  } else {
    // Wrong password
    const key = wrongMessageKeys[Math.floor(Math.random() * wrongMessageKeys.length)];
    const msg = t(key) || "Nope! Pasquino's secrets are safe... for now. 🔒";
    feedback.textContent = msg;
    feedback.className = "feedback error";

    // Show access denied (Console Cowboys level)
    const accessDenied = document.getElementById("access-denied");
    if (accessDenied) {
      accessDenied.classList.add("show");
      setTimeout(() => accessDenied.classList.remove("show"), 1500);
    }
  }

  return false;
}

// Progressive hint system
function showNextHint() {
  const hints = document.querySelectorAll("#hints-container .hint");
  const btn = document.querySelector(".btn-hint");
  let revealed = false;

  for (let i = 0; i < hints.length; i++) {
    if (hints[i].classList.contains("hidden")) {
      hints[i].classList.remove("hidden");
      revealed = true;

      // Check if this was the last hint
      if (i === hints.length - 1) {
        btn.textContent = t("no-more-hints") || "No more hints! You're on your own 🫡";
        btn.disabled = true;
      }
      break;
    }
  }

  if (!revealed && btn) {
    btn.textContent = t("no-more-hints") || "No more hints! You're on your own 🫡";
    btn.disabled = true;
  }
}

// Landing page: update level cards based on progress
function updateLandingPage() {
  const cards = document.querySelectorAll(".level-card");
  const progress = getProgress();

  cards.forEach((card) => {
    const level = parseInt(card.getAttribute("data-level"), 10);
    const status = card.querySelector(".card-status");
    const isCompleted = progress[level];
    const previousCompleted = level === 1 || progress[level - 1];

    card.classList.remove("locked", "unlocked", "completed");

    if (isCompleted) {
      card.classList.add("completed");
      if (status) status.innerHTML = t("status-completed") || '<span class="lock">✅</span> Completed!';
      card.style.pointerEvents = "auto";
      card.style.opacity = "1";
      card.style.filter = "none";
    } else if (previousCompleted) {
      card.classList.add("unlocked");
      if (status) status.innerHTML = t("status-unlocked") || '<span class="lock">🔓</span> Unlocked';
      card.style.pointerEvents = "auto";
      card.style.opacity = "1";
      card.style.filter = "none";
    } else {
      card.classList.add("locked");
      if (status) status.innerHTML = t("status-locked") || '<span class="lock">🔒</span> Locked';
    }
  });
}

// Guard: block access to levels if the previous level isn't completed
function checkLevelAccess() {
  const level = getCurrentLevel();
  if (level <= 1) return; // Level 1 is always accessible

  const prevCompleted = isLevelCompleted(level - 1);
  if (prevCompleted) return;

  const lang = (typeof getLang === "function") ? getLang() : "nl";
  const title = (typeof t === "function" && t("level-locked-title")) || "🚫 Nice try!";
  const text = ((typeof t === "function" && t("level-locked-text")) ||
    "You need to complete the previous level first. Go back and solve Level {prev}!")
    .replace("{prev}", level - 1);
  const backText = (typeof t === "function" && t("level-locked-back")) || "← Back to levels";

  const wrapper = document.querySelector(".page-wrapper");
  if (wrapper) {
    wrapper.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;padding:2rem;">
        <h1 style="font-size:2.5rem;margin-bottom:1rem;">${title}</h1>
        <p style="font-size:1.2rem;max-width:500px;margin-bottom:2rem;opacity:0.85;">${text}</p>
        <a href="../index.html" style="color:#a78bfa;text-decoration:none;font-size:1.1rem;">${backText}</a>
      </div>
    `;
  }
}

// Auto-init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Landing page init
  if (document.querySelector(".levels-grid")) {
    updateLandingPage();
  }

  // Level page guard
  if (document.querySelector("[data-level]") && !document.querySelector(".levels-grid")) {
    checkLevelAccess();
  }
});
