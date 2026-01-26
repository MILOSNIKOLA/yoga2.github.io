/* ========================================
   SESSION PLAYER - JAVASCRIPT
   ======================================== */

// State
let currentSession = null;
let currentPoseIndex = 0;
let isPlaying = false;
let isPaused = false;
let poseTimer = null;
let remainingTime = 0;
let audioContext = null;

// DOM Elements
const sessionTitle = document.getElementById("player-session-title");
const sessionLevel = document.getElementById("player-session-level");
const sessionDuration = document.getElementById("player-session-duration");
const poseName = document.getElementById("pose-name");
const timeDisplay = document.getElementById("time-display");
const poseNumber = document.getElementById("pose-number");
const poseInstructions = document.getElementById("pose-instructions");
const timerProgress = document.getElementById("timer-progress");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
const stopBtn = document.getElementById("stop-btn");
const audioToggle = document.getElementById("audio-toggle");

const completionModal = document.getElementById("completion-modal");
const modalDuration = document.getElementById("modal-duration");
const modalPoses = document.getElementById("modal-poses");

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializePlayer();
});

function initializePlayer() {
  // Get session ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("id");

  if (!sessionId) {
    showError("Aucune séance sélectionnée");
    return;
  }

  // Load session
  loadSession(sessionId);

  // Event listeners
  startBtn.addEventListener("click", startSession);
  pauseBtn.addEventListener("click", pauseSession);
  resumeBtn.addEventListener("click", resumeSession);
  stopBtn.addEventListener("click", stopSession);

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
   LOAD SESSION
   ======================================== */

function loadSession(sessionId) {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  currentSession = sessions.find((s) => s.id === sessionId);

  if (!currentSession) {
    showError("Séance introuvable");
    return;
  }

  // Check if premium and user is not subscribed
  if (!currentSession.free) {
    const userId =
      sessionStorage.getItem("userId") || localStorage.getItem("userId");
    if (userId) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.id === userId);

      if (!user || !user.isPremium) {
        showPremiumPaywall();
        return;
      }
    } else {
      showPremiumPaywall();
      return;
    }
  }

  // Display session info
  displaySessionInfo();
}

function displaySessionInfo() {
  const levelLabels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  sessionTitle.textContent = currentSession.title;
  sessionLevel.textContent =
    levelLabels[currentSession.level] || currentSession.level;
  sessionDuration.textContent = `${currentSession.duration} min`;

  poseInstructions.innerHTML = `<p>${currentSession.description}</p>`;
}

function showError(message) {
  sessionTitle.textContent = message;
  poseName.textContent = "Erreur";
  poseInstructions.innerHTML = `<p>${message}</p>`;
  startBtn.disabled = true;
}

function showPremiumPaywall() {
  poseName.textContent = "Contenu Premium";
  poseInstructions.innerHTML = `
    <p>Cette séance est réservée aux membres Premium.</p>
    <a href="register.html" class="btn btn-primary" style="margin-top: 1rem;">Devenir Premium</a>
  `;
  startBtn.disabled = true;
}

/* ========================================
   SESSION CONTROL
   ======================================== */

function startSession() {
  if (
    !currentSession ||
    !currentSession.poses ||
    currentSession.poses.length === 0
  ) {
    return;
  }

  isPlaying = true;
  isPaused = false;
  currentPoseIndex = 0;

  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");

  playPose();
}

function pauseSession() {
  isPaused = true;
  clearInterval(poseTimer);

  pauseBtn.classList.add("hidden");
  resumeBtn.classList.remove("hidden");
}

function resumeSession() {
  isPaused = false;

  resumeBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");

  runPoseTimer();
}

function stopSession() {
  isPlaying = false;
  isPaused = false;
  clearInterval(poseTimer);

  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
  resumeBtn.classList.add("hidden");
  stopBtn.classList.add("hidden");

  // Reset
  currentPoseIndex = 0;
  poseName.textContent = "Prêt à commencer";
  timeDisplay.textContent = "0:00";
  poseNumber.textContent = "";
  poseInstructions.innerHTML = `<p>Préparez-vous pour votre séance</p>`;
  updateTimerCircle(0, 1);
}

/* ========================================
   POSE PLAYBACK
   ======================================== */

function playPose() {
  if (!isPlaying || currentPoseIndex >= currentSession.poses.length) {
    completeSession();
    return;
  }

  const pose = currentSession.poses[currentPoseIndex];
  remainingTime = pose.duration;

  // Update UI
  poseName.textContent = pose.name;
  poseInstructions.innerHTML = `<p>${pose.instructions}</p>`;
  poseNumber.textContent = `Posture ${currentPoseIndex + 1} / ${currentSession.poses.length}`;

  // Play transition sound
  if (audioToggle.checked) {
    playTransitionSound();
  }

  // Start timer
  runPoseTimer();
}

function runPoseTimer() {
  const pose = currentSession.poses[currentPoseIndex];
  const totalDuration = pose.duration;

  poseTimer = setInterval(() => {
    if (isPaused) return;

    remainingTime--;
    updateTimeDisplay(remainingTime);
    updateTimerCircle(totalDuration - remainingTime, totalDuration);

    if (remainingTime <= 0) {
      clearInterval(poseTimer);
      nextPose();
    }
  }, 1000);
}

function nextPose() {
  currentPoseIndex++;
  playPose();
}

/* ========================================
   UI UPDATES
   ======================================== */

function updateTimeDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateTimerCircle(elapsed, total) {
  const circumference = 534; // 2 * PI * 85
  const progress = elapsed / total;
  const offset = circumference - progress * circumference;
  timerProgress.style.strokeDashoffset = offset;
}

/* ========================================
   AUDIO
   ======================================== */

function playTransitionSound() {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 528; // C5 note
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

/* ========================================
   SESSION COMPLETION
   ======================================== */

function completeSession() {
  isPlaying = false;
  clearInterval(poseTimer);

  // Hide controls
  pauseBtn.classList.add("hidden");
  stopBtn.classList.add("hidden");

  // Save to history
  saveSessionHistory();

  // Show completion modal
  modalDuration.textContent = `${currentSession.duration} min`;
  modalPoses.textContent = currentSession.poses.length;
  completionModal.classList.remove("hidden");
}

function saveSessionHistory() {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (!userId) return;

  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");

  history.push({
    id: crypto.randomUUID(),
    userId: userId,
    sessionId: currentSession.id,
    sessionTitle: currentSession.title,
    duration: currentSession.duration,
    completedAt: new Date().toISOString(),
  });

  localStorage.setItem("sessionHistory", JSON.stringify(history));
}
