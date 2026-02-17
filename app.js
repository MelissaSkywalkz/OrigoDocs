const uiState = {
  state: "RUNNING",
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

const STATE_COLORS = {
  OK: "#44f7cb",
  RUNNING: "#78b7ff",
  WAITING_APPROVAL: "#ffd366",
  BLOCKED: "#ff5f83",
};

const STATE_REASON = {
  OK: { reason_code: "TARGET_REACHED", why: "all channels responding within threshold" },
  RUNNING: { reason_code: "ACTIVE_LOOP", why: "system continues autonomous execution" },
  WAITING_APPROVAL: {
    reason_code: "MANUAL_GATE",
    why: "human approval required before next irreversible action",
  },
  BLOCKED: { reason_code: "SAFETY_STOP", why: "high friction or failed dependencies detected" },
};

const CHANNELS = ["state", "status", "budget", "requests", "diary", "library", "events"];

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
  blockerBanner: document.getElementById("blockerBanner"),
  blockerTitle: document.getElementById("blockerTitle"),
  blockerDetail: document.getElementById("blockerDetail"),
  changeSignal: document.getElementById("changeSignal"),
  changeReason: document.getElementById("changeReason"),
  healthList: document.getElementById("healthList"),
};

const dashboardState = {
  previousState: uiState.state,
  lastChange: {
    from: uiState.state,
    to: uiState.state,
    reason_code: "BOOT",
    why: "initial state sync",
  },
  fetchHealth: Object.fromEntries(CHANNELS.map((key) => [key, { ok: true, fallback: false }])),
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

function resolveOperationalState() {
  if (uiState.irritation > 86) return "BLOCKED";
  if (uiState.irritation > 66 || uiState.energy < 24) return "WAITING_APPROVAL";
  if (uiState.energy > 40 && uiState.curiosity > 28) return "RUNNING";
  return "OK";
}

function resolveMode() {
  if (uiState.irritation > 70) return "defensive";
  if (uiState.social > 70) return "social";
  if (uiState.energy > 75 && uiState.curiosity > 55) return "focused";
  return "observing";
}

function getModeTheme(mode) {
  if (mode === "defensive") {
    return { accent: "#ff6f96", accent2: "#ffbb75", glow: "#ff6f96", bg: "#1a0a16", bg2: "#2d0f23" };
  }
  if (mode === "focused") {
    return { accent: "#47ffe6", accent2: "#71e0ff", glow: "#47ffe6", bg: "#05141d", bg2: "#0d2737" };
  }
  if (mode === "social") {
    return { accent: "#ba84ff", accent2: "#8f7dff", glow: "#ba84ff", bg: "#111029", bg2: "#231b41" };
  }
  return { accent: "#78b7ff", accent2: "#47ffe6", glow: "#78b7ff", bg: "#060b15", bg2: "#15253f" };
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

// MODE-theme och STATE-color hålls separata via olika CSS-variabler.
function applyTheme() {
  const root = document.documentElement;
  const energy = clamp(uiState.energy);
  const curiosity = clamp(uiState.curiosity);
  const social = clamp(uiState.social);
  const irritation = clamp(uiState.irritation);
  const mode = resolveMode();
  const modeTheme = getModeTheme(mode);
  const operationalState = resolveOperationalState();
  const stateColor = STATE_COLORS[operationalState] || STATE_COLORS.RUNNING;

  root.style.setProperty("--accent", modeTheme.accent);
  root.style.setProperty("--accent-2", modeTheme.accent2);
  root.style.setProperty("--glow", modeTheme.glow);
  root.style.setProperty("--bg", modeTheme.bg);
  root.style.setProperty("--bg-2", modeTheme.bg2);
  root.style.setProperty("--state-color", stateColor);

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

const applyDynamics = applyTheme;

function renderState() {
  const mode = resolveMode();
  const meta = STATE_META[mode];
  const operationalState = resolveOperationalState();

  refs.stateLabel.textContent = operationalState;
  refs.stateDetail.textContent = meta.detail;
  refs.orbState.textContent = meta.label;
  refs.orbDetail.textContent = meta.orb;

  refs.stateSignal.style.background = "var(--state-color)";
  refs.stateSignal.style.boxShadow = "0 0 14px var(--state-color)";
}

function simulateFetchHealth(operationalState) {
  const next = {};
  CHANNELS.forEach((channel) => {
    const isRisky = operationalState === "WAITING_APPROVAL" || operationalState === "BLOCKED";
    const failChance = isRisky ? 0.3 : 0.08;
    const ok = Math.random() > failChance;
    const fallback = !ok && (channel === "state" || channel === "status" || Math.random() > 0.45);
    next[channel] = { ok, fallback };
  });
  dashboardState.fetchHealth = next;
}

function trackStateChange() {
  const operationalState = resolveOperationalState();
  if (operationalState === dashboardState.previousState) return;

  const reason = STATE_REASON[operationalState] || STATE_REASON.RUNNING;
  dashboardState.lastChange = {
    from: dashboardState.previousState,
    to: operationalState,
    reason_code: reason.reason_code,
    why: reason.why,
  };
  dashboardState.previousState = operationalState;
}

// What changed och Last error hämtar data från in-memory state i stället för loggar.
function renderDiagnostics() {
  const { from, to, reason_code, why } = dashboardState.lastChange;
  refs.changeSignal.textContent = `${from} → ${to}`;
  refs.changeReason.textContent = `reason_code: ${reason_code} · why: ${why}`;

  refs.healthList.innerHTML = CHANNELS.map((channel) => {
    const health = dashboardState.fetchHealth[channel];
    const status = health.ok ? "ok" : "failed";
    const fallback = health.fallback ? "fallback used" : "fallback none";
    const cls = health.ok ? "health-ok" : "health-failed";
    return `<li><span>${channel}</span><span class="health-pill ${cls}">${status}</span><span>${fallback}</span></li>`;
  }).join("");
}

function renderBlocker() {
  const operationalState = resolveOperationalState();
  const reason = STATE_REASON[operationalState] || STATE_REASON.RUNNING;
  const isBlocking = operationalState === "WAITING_APPROVAL" || operationalState === "BLOCKED";

  refs.blockerBanner.hidden = !isBlocking;
  if (!isBlocking) return;

  refs.blockerTitle.textContent = operationalState === "BLOCKED" ? "System blocked" : "Waiting for approval";
  refs.blockerDetail.textContent = `${reason.reason_code} · ${reason.why}`;
}

function renderFeed() {
  const operationalState = resolveOperationalState();
  const items = [
    `Core signal stabilized (${operationalState})`,
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
  trackStateChange();
  simulateFetchHealth(resolveOperationalState());
  renderVitals();
  applyTheme();
  renderState();
  renderBlocker();
  renderFeed();
  renderDiagnostics();
}

renderAll();

setInterval(() => {
  uiState.energy = clamp(uiState.energy + (Math.random() * 6 - 3));
  uiState.curiosity = clamp(uiState.curiosity + (Math.random() * 8 - 4));
  uiState.social = clamp(uiState.social + (Math.random() * 6 - 3));
  uiState.irritation = clamp(uiState.irritation + (Math.random() * 5 - 2.5));
  uiState.state = resolveOperationalState();
  renderAll();
}, 3200);
