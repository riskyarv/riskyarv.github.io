/* ============================================
   Pasquil's Cyber Heist — Players & Scoreboard
   ============================================
   Scores are shared through the Firebase Realtime Database REST API.
   Every browser signs in anonymously, so it can only write its own entry.
   Entries older than 24 hours are hidden and removed by visiting players.
   Without a configured database the scoreboard only shows the local player. */

const PLAYER_KEY = "pasquil_player";
const AUTH_KEY = "pasquil_auth";
const TOP_HACKER = "TULIP_HACKER";
const PLAYER_NAME_MAX = 20;
const SCORE_TTL_MS = 24 * 60 * 60 * 1000;
const SCOREBOARD_REFRESH_MS = 15000;
const SCOREBOARD_MAX_ROWS = 25;

function readStoredJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeStoredJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (e.g. private mode)
  }
}

function toWholeNumber(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function normalizePlayerName(name) {
  return String(name || "").replace(/\s+/g, " ").trim().slice(0, PLAYER_NAME_MAX);
}

// Also catches look-alikes such as "tulip hacker" or "Tulip-Hacker"
function isReservedName(name) {
  return String(name || "").toUpperCase().replace(/[^A-Z0-9]/g, "").includes("TULIPHACKER");
}

// ---------- Player ----------

function getPlayer() {
  const player = readStoredJSON(PLAYER_KEY);
  return player && normalizePlayerName(player.name) ? player : null;
}

function countCompletedLevels() {
  const progress = getProgress();
  let count = 0;
  for (let level = 1; level <= FINAL_LEVEL; level++) {
    if (progress[level]) count++;
  }
  return count;
}

function localScoreEntry() {
  const player = getPlayer();
  if (!player) return null;
  return {
    name: normalizePlayerName(player.name),
    levels: countCompletedLevels(),
    time: toWholeNumber(player.time),
  };
}

// Called by game.js after a correct password
function onLevelSolved(firstSolve) {
  const player = getPlayer();
  if (!player) return;
  if (firstSolve && Number.isFinite(player.startedAt)) {
    player.time = Math.round((Date.now() - player.startedAt) / 1000);
    writeStoredJSON(PLAYER_KEY, player);
  }
  syncScore().catch((err) => console.warn("Scoreboard sync failed:", err));
}

function initPlayerPanel() {
  const form = document.getElementById("player-form");
  const info = document.getElementById("player-info");
  if (!form || !info) return;

  const player = getPlayer();
  form.classList.toggle("hidden", !!player);
  info.classList.toggle("hidden", !player);
  if (player) {
    document.getElementById("player-name").textContent = normalizePlayerName(player.name);
  }
}

function handlePlayerSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("player-name-input");
  const feedback = document.getElementById("player-feedback");
  const name = normalizePlayerName(input.value);
  const errorKey = !name ? "player-name-empty" : isReservedName(name) ? "player-name-reserved" : null;

  if (errorKey) {
    feedback.innerHTML = t(errorKey);
    feedback.className = "feedback error";
    return false;
  }

  feedback.className = "feedback hidden";
  writeStoredJSON(PLAYER_KEY, { name, startedAt: Date.now(), time: 0 });
  initPlayerPanel();
  updateLandingPage();
  startScoreboard();
  return false;
}

// Lets the next person on a shared device start fresh; the old score stays on the board
function startNewPlayer() {
  if (!confirm(t("player-new-confirm"))) return;
  [PLAYER_KEY, AUTH_KEY, "pasquil_progress"].forEach((key) => localStorage.removeItem(key));
  location.reload();
}

// ---------- Firebase (REST) ----------

function getScoreboardConfig() {
  const config = window.SCOREBOARD_CONFIG || {};
  if (!config.apiKey || !config.databaseURL) return null;
  return { apiKey: config.apiKey, databaseURL: config.databaseURL.replace(/\/+$/, "") };
}

function storeAuth(uid, idToken, refreshToken, expiresIn) {
  const auth = { uid, idToken, refreshToken, expiresAt: Date.now() + Number(expiresIn || 3600) * 1000 };
  writeStoredJSON(AUTH_KEY, auth);
  return auth;
}

async function loadAuth(config) {
  const stored = readStoredJSON(AUTH_KEY);
  if (stored && stored.idToken && stored.expiresAt > Date.now() + 60000) return stored;

  const key = encodeURIComponent(config.apiKey);
  if (stored && stored.refreshToken) {
    const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${key}`, {
      method: "POST",
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: stored.refreshToken }),
    });
    if (res.ok) {
      const data = await res.json();
      return storeAuth(data.user_id, data.id_token, data.refresh_token, data.expires_in);
    }
    // Only an invalid refresh token warrants a new account; anything else is retried later
    if (res.status !== 400) throw new Error(`Token refresh failed (${res.status})`);
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  if (!res.ok) throw new Error(`Anonymous sign-in failed (${res.status})`);
  const data = await res.json();
  return storeAuth(data.localId, data.idToken, data.refreshToken, data.expiresIn);
}

// Share one in-flight sign-in so parallel callers don't create multiple accounts
let authPromise = null;

function getAuth(config) {
  if (!authPromise) {
    authPromise = loadAuth(config).finally(() => {
      authPromise = null;
    });
  }
  return authPromise;
}

async function dbRequest(config, auth, method, path, query, body) {
  const params = new URLSearchParams({ ...query, auth: auth.idToken });
  const res = await fetch(`${config.databaseURL}/${path}.json?${params}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status})`);
  return res.json();
}

async function syncScore() {
  const config = getScoreboardConfig();
  const entry = localScoreEntry();
  if (!config || !entry) return;
  const auth = await getAuth(config);
  await dbRequest(config, auth, "PUT", `scoreboard/${auth.uid}`, {}, {
    ...entry,
    updatedAt: { ".sv": "timestamp" },
  });
}

async function fetchScores(config, auth) {
  const data = await dbRequest(config, auth, "GET", "scoreboard", {
    orderBy: '"updatedAt"',
    startAt: String(Date.now() - SCORE_TTL_MS),
  });
  return Object.entries(data || {}).map(([uid, entry]) => ({ ...entry, uid }));
}

// The database rules only allow deleting someone else's entry once it is older than 24 hours
async function purgeExpiredScores(config, auth) {
  const stale = await dbRequest(config, auth, "GET", "scoreboard", {
    orderBy: '"updatedAt"',
    endAt: String(Date.now() - SCORE_TTL_MS - 5 * 60 * 1000), // margin for clock skew
    limitToFirst: "25",
  });
  await Promise.all(Object.keys(stale || {}).map((uid) =>
    dbRequest(config, auth, "DELETE", `scoreboard/${uid}`).catch(() => {})
  ));
}

// ---------- Scoreboard UI ----------

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

// Most levels first, then fastest time. TULIP_HACKER is always #1.
function rankScores(entries) {
  const players = entries
    .filter((e) => e && normalizePlayerName(e.name) && !isReservedName(e.name))
    .map((e) => ({
      ...e,
      name: normalizePlayerName(e.name),
      levels: Math.min(FINAL_LEVEL, toWholeNumber(e.levels)),
      time: toWholeNumber(e.time),
    }))
    .sort((a, b) => b.levels - a.levels || a.time - b.time || (a.updatedAt || 0) - (b.updatedAt || 0));
  return [{ name: TOP_HACKER, levels: FINAL_LEVEL, time: 0, pinned: true }, ...players];
}

function scoreCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function scoreRow(entry, rank) {
  const row = document.createElement("tr");
  if (entry.pinned) row.className = "scoreboard-row-pinned";
  if (entry.me) row.className = "scoreboard-row-me";

  const name = scoreCell((entry.pinned ? "👑 " : "") + entry.name);
  name.className = "scoreboard-name";
  if (entry.me) {
    const you = document.createElement("span");
    you.className = "scoreboard-you";
    you.setAttribute("data-i18n", "scoreboard-you");
    you.textContent = t("scoreboard-you");
    name.append(" ", you);
  }

  row.append(
    scoreCell(String(rank)),
    name,
    scoreCell(`${entry.levels}/${FINAL_LEVEL}`),
    scoreCell(entry.levels ? formatDuration(entry.time) : "–")
  );
  return row;
}

function renderScoreboard(remoteEntries, myUid) {
  const tbody = document.getElementById("scoreboard-rows");
  if (!tbody) return;

  const mine = remoteEntries.find((e) => e.uid === myUid) || localScoreEntry();
  const others = remoteEntries.filter((e) => e.uid !== myUid);
  const ranked = rankScores(mine ? [...others, { ...mine, me: true }] : others);
  const myIndex = ranked.findIndex((e) => e.me);

  tbody.replaceChildren(...ranked.slice(0, SCOREBOARD_MAX_ROWS).map((e, i) => scoreRow(e, i + 1)));
  if (myIndex >= SCOREBOARD_MAX_ROWS) {
    const gap = document.createElement("tr");
    gap.className = "scoreboard-gap";
    gap.innerHTML = '<td colspan="4">…</td>';
    tbody.append(gap, scoreRow(ranked[myIndex], myIndex + 1));
  }
}

function setScoreboardStatus(key) {
  const status = document.getElementById("scoreboard-status");
  if (!status) return;
  status.classList.toggle("hidden", !key);
  if (key) {
    status.setAttribute("data-i18n", key);
    status.innerHTML = t(key);
  } else {
    status.removeAttribute("data-i18n");
  }
}

async function refreshScoreboard(purge) {
  const config = getScoreboardConfig();
  try {
    const auth = await getAuth(config);
    renderScoreboard(await fetchScores(config, auth), auth.uid);
    setScoreboardStatus(null);
    if (purge) {
      purgeExpiredScores(config, auth).catch((err) => console.warn("Scoreboard cleanup failed:", err));
    }
  } catch (err) {
    console.warn("Scoreboard unavailable:", err);
    setScoreboardStatus("scoreboard-error");
  }
}

let scoreboardTimer = null;

async function startScoreboard() {
  const section = document.getElementById("scoreboard");
  if (!section || !getPlayer()) return;

  section.classList.remove("hidden");
  renderScoreboard([], null);
  if (location.hash === "#scoreboard") section.scrollIntoView();

  if (!getScoreboardConfig()) {
    setScoreboardStatus("scoreboard-offline");
    return;
  }

  try {
    await syncScore();
  } catch (err) {
    console.warn("Scoreboard sync failed:", err);
  }
  await refreshScoreboard(true);

  if (!scoreboardTimer) {
    scoreboardTimer = setInterval(() => {
      if (!document.hidden) refreshScoreboard(false);
    }, SCOREBOARD_REFRESH_MS);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPlayerPanel();
  startScoreboard();
});
