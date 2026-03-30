/* ============================================
   Pasquil's Cyber Heist — Shared Game Logic
   ============================================ */

// SHA-256 hashes of each level's password (UPPERCASE)
const levelPasswords = {
  1: "0800d78f904a9fb47bae49d5a877224744ff6093482bc91fa12cbe24915e1768", // TULIP_HACKER
  2: "bc17a9baa24d4c1ac11c98389df632a0505a16140aa34e02f538e812002e372c", // G33STELIJK
  3: "60276d9c750ab9f73b8d7ec54c2a68ef70be0c436bfe9f2e16b00cfa552afbd8", // STROOPWAFEL42
  4: "3ed63ad803ba1a875d0a663d90370c58b427487b9ec58108571af13581cc54f7", // K00KJES_MONSTER
  5: "68a7f1e52e8a03601c8599e9f987808d408a0ba9e07f426f67c166eb8a92113d", // P4SQU1L_M4ST3R
};

const levelNames = {
  1: "Secret Diary",
  2: "Invisible Vault",
  3: "Console Cowboys",
  4: "Cookie Monster",
  5: "The Final Heist",
};

const wrongMessages = [
  "Nope! Sjonnie's secrets are safe... for now. 🔒",
  "Wrong! Have you tried looking harder? 👀",
  "Access Denied. Sjonnie is laughing at you. 😂",
  "Not even close! Sjonnie's security prevails! 💪",
  "Try again! The password is hiding in plain sight... 🙈",
  "Incorrect! Sjonnie does a little victory dance. 💃",
];

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

// Load progress from localStorage
function getProgress() {
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
  const level = getCurrentLevel();
  const normalized = input.value.trim().toUpperCase();

  if (!normalized) {
    feedback.textContent = "Type something first! Even Sjonnie can do that. ⌨️";
    feedback.className = "feedback error";
    return false;
  }

  const hash = await sha256(normalized);
  const isCorrect = hash === levelPasswords[level];

  if (isCorrect) {
    // Success!
    feedback.textContent =
      "✅ PASSWORD CORRECT! You cracked Sjonnie's " +
      (levelNames[level] || "level") +
      "! " +
      (level < 5
        ? "Proceed to the next challenge."
        : "You've completed the heist!");
    feedback.className = "feedback success";

    saveProgress(level);
    showConfetti();

    if (nextLevel) {
      nextLevel.classList.remove("hidden");
    }

    // Level 5 victory screen
    if (level === 5) {
      setTimeout(() => {
        const victory = document.querySelector(".victory-overlay");
        if (victory) {
          victory.classList.add("show");
          showConfetti();
        }
      }, 1500);
    }

    input.disabled = true;
    document.querySelector(".btn-submit").disabled = true;
  } else {
    // Wrong password
    const msg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    feedback.textContent = msg;
    feedback.className = "feedback error";

    // Show access denied for level 3
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
        btn.textContent = "No more hints! You're on your own 🫡";
        btn.disabled = true;
      }
      break;
    }
  }

  if (!revealed && btn) {
    btn.textContent = "No more hints! You're on your own 🫡";
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
      if (status) status.innerHTML = '<span class="lock">✅</span> Completed!';
      card.style.pointerEvents = "auto";
      card.style.opacity = "1";
      card.style.filter = "none";
    } else if (previousCompleted) {
      card.classList.add("unlocked");
      if (status) status.innerHTML = '<span class="lock">🔓</span> Unlocked';
      card.style.pointerEvents = "auto";
      card.style.opacity = "1";
      card.style.filter = "none";
    } else {
      card.classList.add("locked");
      if (status) status.innerHTML = '<span class="lock">🔒</span> Locked';
    }
  });
}

// Auto-init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Landing page init
  if (document.querySelector(".levels-grid")) {
    updateLandingPage();
  }
});
