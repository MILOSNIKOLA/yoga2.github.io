/* ========================================
   BREATHING EXERCISE - JAVASCRIPT
   ======================================== */

// Breathing patterns (in seconds)
const breathingPatterns = {
  coherence: {
    name: "Cohérence cardiaque",
    phases: [
      { name: "Inspirez", duration: 5 },
      { name: "Expirez", duration: 5 },
    ],
  },
  box: {
    name: "Box Breathing",
    phases: [
      { name: "Inspirez", duration: 4 },
      { name: "Retenez", duration: 4 },
      { name: "Expirez", duration: 4 },
      { name: "Retenez", duration: 4 },
    ],
  },
  478: {
    name: "4-7-8",
    phases: [
      { name: "Inspirez", duration: 4 },
      { name: "Retenez", duration: 7 },
      { name: "Expirez", duration: 8 },
    ],
  },
  energize: {
    name: "Énergisant",
    phases: [
      { name: "Inspirez", duration: 3 },
      { name: "Expirez", duration: 6 },
    ],
  },
};

// State
let currentType = "coherence";
let isBreathing = false;
let currentPhaseIndex = 0;
let phaseTimer = null;
let cyclesCompleted = 0;
let totalSeconds = 0;
let totalTimer = null;
let audioContext = null;

// DOM Elements
const breathTypeButtons = document.querySelectorAll(".breath-type-btn");
const startBtn = document.getElementById("start-breath-btn");
const stopBtn = document.getElementById("stop-breath-btn");
const instructionText = document.getElementById("instruction-text");
const instructionCount = document.getElementById("instruction-count");
const cyclesCountEl = document.getElementById("cycles-count");
const totalTimeEl = document.getElementById("total-time");
const soundToggle = document.getElementById("sound-toggle");
const vibrationToggle = document.getElementById("vibration-toggle");
const circleMain = document.querySelector(".circle-main");

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeBreathing();
});

function initializeBreathing() {
  // Breathing type selector
  breathTypeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      selectBreathingType(type);
    });
  });

  // Start/Stop buttons
  startBtn.addEventListener("click", startBreathing);
  stopBtn.addEventListener("click", stopBreathing);

  // Initialize audio context on first user interaction
  document.addEventListener(
    "click",
    () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    { once: true },
  );
}

/* ========================================
   BREATHING TYPE SELECTION
   ======================================== */

function selectBreathingType(type) {
  if (isBreathing) {
    stopBreathing();
  }

  currentType = type;

  // Update UI
  breathTypeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  resetStats();
}

/* ========================================
   BREATHING CONTROL
   ======================================== */

function startBreathing() {
  if (isBreathing) return;

  isBreathing = true;
  currentPhaseIndex = 0;
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");

  // Start total time counter
  totalTimer = setInterval(() => {
    totalSeconds++;
    updateTotalTime();
  }, 1000);

  // Start breathing cycle
  runBreathingPhase();
}

function stopBreathing() {
  isBreathing = false;
  clearInterval(phaseTimer);
  clearInterval(totalTimer);

  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");

  instructionText.textContent = "Pause";
  instructionCount.textContent = "";

  // Remove animations
  circleMain.classList.remove("inhale", "exhale");
}

function runBreathingPhase() {
  if (!isBreathing) return;

  const pattern = breathingPatterns[currentType];
  const phase = pattern.phases[currentPhaseIndex];

  instructionText.textContent = phase.name;

  // Play sound if enabled
  if (soundToggle.checked) {
    playBreathSound(phase.name);
  }

  // Vibrate if enabled and supported
  if (vibrationToggle.checked && navigator.vibrate) {
    navigator.vibrate(200);
  }

  // Animate circle
  animateCircle(phase.name);

  // Countdown
  let remaining = phase.duration;
  instructionCount.textContent = remaining;

  phaseTimer = setInterval(() => {
    remaining--;
    instructionCount.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(phaseTimer);
      nextPhase();
    }
  }, 1000);
}

function nextPhase() {
  const pattern = breathingPatterns[currentType];
  currentPhaseIndex++;

  if (currentPhaseIndex >= pattern.phases.length) {
    currentPhaseIndex = 0;
    cyclesCompleted++;
    updateCyclesCount();
  }

  runBreathingPhase();
}

/* ========================================
   ANIMATIONS
   ======================================== */

function animateCircle(phaseName) {
  circleMain.classList.remove("inhale", "exhale");

  if (phaseName === "Inspirez") {
    circleMain.classList.add("inhale");
  } else if (phaseName === "Expirez") {
    circleMain.classList.add("exhale");
  }
}

/* ========================================
   AUDIO
   ======================================== */

function playBreathSound(phaseName) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for different phases
  if (phaseName === "Inspirez") {
    oscillator.frequency.value = 440; // A4
  } else if (phaseName === "Expirez") {
    oscillator.frequency.value = 330; // E4
  } else {
    oscillator.frequency.value = 370; // F#4
  }

  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

/* ========================================
   STATS
   ======================================== */

function updateCyclesCount() {
  cyclesCountEl.textContent = cyclesCompleted;
}

function updateTotalTime() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  totalTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function resetStats() {
  cyclesCompleted = 0;
  totalSeconds = 0;
  updateCyclesCount();
  updateTotalTime();
}
