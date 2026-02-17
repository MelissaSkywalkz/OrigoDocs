const uiState = {
  state: "observing",
  energy: 73,
  curiosity: 58,
  social: 42,
  irritation: 21,
};

const STATE_META = {
  observing: {
    label: "Observing",
    detail: "Passive scan of environmental signals",
    orb: "Neural lattice stable",
    color: "var(--curiosity-color)",
  },
  focused: {
    label: "Focused",
    detail: "Priority threads are being resolved",
    orb: "Task convergence high",
    color: "var(--energy-color)",
  },
  social: {
    label: "Social",
    detail: "Dialogue loops open for collaboration",
    orb: "Empathy model engaged",
    color: "var(--social-color)",
  },
  defensive: {
    label: "Defensive",
    detail: "Noise filtered and boundaries tightened",
    orb: "Threat heuristics active",
    color: "var(--irritation-color)",
  },
};

const refs = {
  stateSignal: document.getElementById("stateSignal"),
  stateLabel: document.getElementById("stateLabel"),
  stateDetail: document.getElementById("stateDetail"),
  orbState: document.getElementById("orbState"),
  orbDetail: document.getElementById("orbDetail"),
  energySignal: document.getElementById("energySignal"),
  energyDetail: document.getElementById("energyDetail"),
  curiositySignal: document.getElementById("curiositySignal"),
  curiosityDetail: document.getElementById("curiosityDetail"),
  socialSignal: document.getElementById("socialSignal"),
  socialDetail: document.getElementById("socialDetail"),
  irritationSignal: document.getElementById("irritationSignal"),
  irritationDetail: document.getElementById("irritationDetail"),
  activityFeed: document.getElementById("activityFeed"),
  budgetInference: document.getElementById("budgetInference"),
  budgetMemory: document.getElementById("budgetMemory"),
  budgetIo: document.getElementById("budgetIo"),
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function detailFromValue(value, type) {
  if (value > 75) return `${type} elevated`;
  if (value > 45) return `${type} stable`;
  if (value > 20) return `${type} guarded`;
  return `${type} low`;
}

// Håller signal→etikett→detalj i samma ordning för alla vitalvärden.
function renderVitals() {
  const energy = clamp(uiState.energy);
  const curiosity = clamp(uiState.curiosity);
  const social = clamp(uiState.social);
  const irritation = clamp(uiState.irritation);

  refs.energySignal.textContent = `${energy}%`;
  refs.curiositySignal.textContent = `${curiosity}%`;
  refs.socialSignal.textContent = `${social}%`;
  refs.irritationSignal.textContent = `${irritation}%`;

  refs.energyDetail.textContent = detailFromValue(energy, "Reserve");
  refs.curiosityDetail.textContent = detailFromValue(curiosity, "Inquiry");
  refs.socialDetail.textContent = detailFromValue(social, "Outreach");
  refs.irritationDetail.textContent = detailFromValue(irritation, "Friction");
}

// applyTheme mappar state till visuella HUD-variabler (opacitet, fart, jitter, orb-beat).
function applyTheme() {
  const root = document.documentElement;
  const energy = clamp(uiState.energy);
  const curiosity = clamp(uiState.curiosity);
  const social = clamp(uiState.social);
  const irritation = clamp(uiState.irritation);

  root.style.setProperty("--energy-speed", (16 - energy / 10).toFixed(2));
  root.style.setProperty("--curiosity-speed", (19 - curiosity / 10).toFixed(2));
  root.style.setProperty("--social-speed", (22 - social / 10).toFixed(2));
  root.style.setProperty("--irritation-speed", (24 - irritation / 8).toFixed(2));

  const glow = (0.2 + energy / 160 + curiosity / 250).toFixed(2);
  const pulse = (5.2 - (energy + curiosity) / 55).toFixed(2);
  const beat = (0.9 + (energy + curiosity) / 240).toFixed(3);
  const hudOpacity = (0.26 + curiosity / 300 + social / 500).toFixed(2);
  const hudRotateA = (26 - curiosity / 12).toFixed(2);
  const hudRotateB = (21 - energy / 16 + irritation / 40).toFixed(2);
  const jitter = ((irritation - 50) / 65).toFixed(2);

  root.style.setProperty("--orb-glow", glow);
  root.style.setProperty("--orb-pulse", pulse);
  root.style.setProperty("--orb-beat", beat);
  root.style.setProperty("--hud-opacity", hudOpacity);
  root.style.setProperty("--hud-rotate-a", `${hudRotateA}s`);
  root.style.setProperty("--hud-rotate-b", `${hudRotateB}s`);
  root.style.setProperty("--hud-jitter", `${jitter}px`);
}

// Bakåtkompatibel alias för eventuella anrop som fortfarande använder gamla namnet.
const applyDynamics = applyTheme;

function resolveMode() {
  if (uiState.irritation > 70) return "defensive";
  if (uiState.social > 70) return "social";
  if (uiState.energy > 75 && uiState.curiosity > 55) return "focused";
  return uiState.state in STATE_META ? uiState.state : "observing";
}

function renderState() {
  const mode = resolveMode();
  const meta = STATE_META[mode];

  refs.stateLabel.textContent = meta.label;
  refs.stateDetail.textContent = meta.detail;
  refs.orbState.textContent = meta.label;
  refs.orbDetail.textContent = meta.orb;

  refs.stateSignal.style.background = meta.color;
  refs.stateSignal.style.boxShadow = `0 0 14px ${meta.color}`;
}

function renderFeed() {
  const items = [
    `Core signal stabilized (${uiState.state})`,
    `Energy routing at ${clamp(uiState.energy)}%`,
    `Curiosity vector drift ${clamp(uiState.curiosity)}%`,
    `Irritation filter ${clamp(uiState.irritation)}%`,
  ];
  refs.activityFeed.innerHTML = items.map((item) => `<li>${item}</li>`).join("");

  refs.budgetInference.textContent = `${Math.round(clamp(uiState.energy) * 0.82)}%`;
  refs.budgetMemory.textContent = `${Math.round(clamp(uiState.curiosity) * 0.9)}%`;
  refs.budgetIo.textContent = `${Math.round(clamp(uiState.social) * 0.88)}%`;
}

function renderAll() {
  renderVitals();
  applyTheme();
  renderState();
  renderFeed();
}

renderAll();

// Liten ambient drift för att göra UI:t levande utan att bryta existerande state-struktur.
setInterval(() => {
  uiState.energy = clamp(uiState.energy + (Math.random() * 6 - 3));
  uiState.curiosity = clamp(uiState.curiosity + (Math.random() * 8 - 4));
  uiState.social = clamp(uiState.social + (Math.random() * 6 - 3));
  uiState.irritation = clamp(uiState.irritation + (Math.random() * 5 - 2.5));
  renderAll();
}, 3200);
