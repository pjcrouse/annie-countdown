// Annie lands at Boston Logan on Wed June 3, 2026 at 1:23 PM Boston time.
// June is EDT (UTC-4), so the offset is -04:00.
const TARGET = new Date("2026-06-03T13:23:00-04:00").getTime();

// SHA-256 of the secret word. Compare hashes so the word isn't sitting in plain JS.
const SECRET_HASH = "205c3e16c66ff0b845700155d0394219f64e9eb6ed9db9f7758382bb4106eb11";

const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  countdown: document.getElementById("countdown"),
  arrived: document.getElementById("arrived"),
  gate: document.getElementById("gate"),
  gateForm: document.getElementById("gate-form"),
  gateInput: document.getElementById("gate-input"),
  gateError: document.getElementById("gate-error"),
  stage: document.getElementById("stage"),
};

const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const diff = TARGET - Date.now();

  if (diff <= 0) {
    els.countdown.classList.add("hidden");
    els.arrived.classList.remove("hidden");
    return true;
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  els.days.textContent = days;
  els.hours.textContent = pad(hours);
  els.minutes.textContent = pad(minutes);
  els.seconds.textContent = pad(seconds);
  return false;
}

function startCountdown() {
  if (!tick()) {
    const id = setInterval(() => {
      if (tick()) clearInterval(id);
    }, 1000);
  }
}

async function sha256Hex(str) {
  const bytes = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function unlock() {
  els.gate.classList.add("hidden");
  els.stage.classList.remove("hidden");
  startCountdown();
  try { sessionStorage.setItem("annie_unlocked", "1"); } catch {}
}

els.gateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const guess = els.gateInput.value.trim().toLowerCase();
  const hash = await sha256Hex(guess);
  if (hash === SECRET_HASH) {
    unlock();
  } else {
    els.gateError.classList.remove("hidden");
    els.gate.classList.add("shake");
    setTimeout(() => els.gate.classList.remove("shake"), 400);
    els.gateInput.select();
  }
});

// Stay unlocked within the session so a refresh doesn't ask again.
try {
  if (sessionStorage.getItem("annie_unlocked") === "1") unlock();
} catch {}

els.gateInput.focus();
