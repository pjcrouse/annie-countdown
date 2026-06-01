// Annie lands at Boston Logan on Wed June 3, 2026 at 1:23 PM Boston time.
// June is EDT (UTC-4), so the offset is -04:00.
const TARGET = new Date("2026-06-03T13:23:00-04:00").getTime();

const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  countdown: document.getElementById("countdown"),
  arrived: document.getElementById("arrived"),
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

if (!tick()) {
  const id = setInterval(() => {
    if (tick()) clearInterval(id);
  }, 1000);
}
