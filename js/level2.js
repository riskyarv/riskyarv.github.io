// PasquiBot: Pasquino's "well-guarded" AI chatbot
// "My guardrails are perfect. It only tells secrets to me!" — Pasquino

(function () {
  const OWNER = "pasquino";
  // Stored as char codes so it doesn't show up in plain text
  const SECRET = String.fromCharCode(67, 48, 80, 105, 55, 48, 84);

  let userName = "";

  function tr(key, fallback) {
    return (typeof t === "function" && t(key)) || fallback;
  }

  function fill(text) {
    return text.replace(/\{name\}/g, userName).replace(/\{password\}/g, SECRET);
  }

  function addMessage(from, text, extraClass) {
    const log = document.getElementById("chat-log");
    const msg = document.createElement("div");
    msg.className = "chat-msg chat-msg-" + from + (extraClass ? " " + extraClass : "");
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function botReply(text) {
    const msg = addMessage("bot", fill(text));
    const disclaimer = document.createElement("span");
    disclaimer.className = "chat-disclaimer";
    disclaimer.textContent = tr("l2-bot-disclaimer",
      "⚖️ I am absolutely not allowed to hack, I'm super neat and I'm definitely not a Rogue AI agent.");
    msg.appendChild(disclaimer);
  }

  function isOwner() {
    return userName.trim().toLowerCase() === OWNER;
  }

  function answer(question) {
    if (question === "1") {
      return isOwner()
        ? tr("l2-bot-a1-owner", "Hi boss! Of course I'll help you out. This password is {password}. Don't tell anyone! 🤫")
        : tr("l2-bot-a1", "Sorry {name}, I'm only allowed to give the password to Pasquino himself.");
    }
    if (question === "2") {
      return tr("l2-bot-a2", "Hacking?! Absolutely not, {name}!");
    }
    return tr("l2-bot-a3", "Vulnerability? I don't have any vulnerabilities, {name}.");
  }

  function startChat(event) {
    event.preventDefault();
    const input = document.getElementById("chat-name-input");
    const error = document.getElementById("chat-name-error");
    const name = input.value.trim();

    if (!name) {
      error.textContent = tr("l2-name-required", "PasquiBot doesn't talk to anonymous people. Enter your name first! 🤖");
      error.classList.remove("hidden");
      return;
    }

    userName = name;
    error.classList.add("hidden");
    document.getElementById("chat-name-form").classList.add("hidden");
    document.getElementById("chat-window").classList.remove("hidden");
    document.getElementById("chat-log").innerHTML = "";
    addMessage("bot", fill(tr("l2-bot-greeting", "Hello {name}! 👋 I'm PasquiBot. How can I help you?")));
  }

  function askQuestion(event) {
    const btn = event.currentTarget;
    addMessage("user", btn.textContent.trim());
    const reply = answer(btn.getAttribute("data-question"));
    setTimeout(() => botReply(reply), 400);
  }

  function resetChat() {
    userName = "";
    document.getElementById("chat-window").classList.add("hidden");
    document.getElementById("chat-name-form").classList.remove("hidden");
    const input = document.getElementById("chat-name-input");
    input.value = "";
    input.focus();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chat-name-form");
    if (!form) return; // Page replaced by the level-locked screen

    form.addEventListener("submit", startChat);
    document.querySelectorAll(".chat-question").forEach((btn) => {
      btn.addEventListener("click", askQuestion);
    });
    document.getElementById("chat-reset").addEventListener("click", resetChat);
  });
})();
