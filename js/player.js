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
const timerDisplay = document.getElementById("timer");
const poseNumber = document.getElementById("pose-number");
const poseInstructions = document.getElementById("pose-instructions");
const timerProgress = document.getElementById("timer-progress");
const background = document.getElementById("background");
let specialSessionInterval = null;
let specialSessionTimeLeft = 0;

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
const stopBtn = document.getElementById("stop-btn");
const audioToggle = document.getElementById("audio-toggle");

const completionModal = document.getElementById("completion-modal");
const modalDuration = document.getElementById("modal-duration");
const modalPoses = document.getElementById("modal-poses");

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function getTranslation(key) {
  // Try to get translation from i18n system
  if (window.i18n && typeof window.i18n.getTranslation === "function") {
    const translation = window.i18n.getTranslation(key);
    return translation !== null ? translation : key; // Return key if translation is null
  }
  return key; // Fallback to key if i18n not available
}

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
    // Wait for i18n to be ready, then show error
    const showErrorWhenReady = () => {
      console.log("Checking i18n:", window.i18n);
      if (window.i18n && typeof window.i18n.getTranslation === "function") {
        const testTranslation = window.i18n.getTranslation("common.back");
        console.log("Test translation result:", testTranslation);
        const errorTranslation = window.i18n.getTranslation(
          "player.noSessionSelected",
        );
        console.log("Error translation result:", errorTranslation);
        showError(errorTranslation || "Aucune séance sélectionnée");
      } else {
        // Fallback if i18n not ready
        console.log("i18n not ready, using fallback");
        showError("Aucune séance sélectionnée");
        setTimeout(showErrorWhenReady, 100);
      }
    };
    showErrorWhenReady();
    return;
  }

  // Load session
  loadSession(sessionId);

  // Event listeners
  startBtn.addEventListener("click", startSession);
  pauseBtn.addEventListener("click", pauseSession);
  resumeBtn.addEventListener("click", resumeSession);
  stopBtn.addEventListener("click", stopSession);

  // Set button texts with translations
  const setButtonTexts = () => {
    if (window.i18n && typeof window.i18n.applyTranslations === "function") {
      window.i18n.applyTranslations();
    } else {
      // Fallback
      setTimeout(setButtonTexts, 100);
    }
  };
  setButtonTexts();

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
  // Convert sessionId to number for comparison
  const sessionIdNum = parseInt(sessionId, 10);
  currentSession = sessions.find(
    (s) => s.id === sessionIdNum || s.id === sessionId,
  );

  if (!currentSession && sessionIdNum === 41) {
    currentSession = {
      id: 41,
      title: "Étirements matinaux doux",
      level: "beginner",
      duration: 2.5,
      description: "Séance douce pour réveiller le corps en matinée.",
      free: true,
      poses: [
        {
          name: "Posture de l'enfant",
          duration: 38,
          instructions: "Détendez-vous et respirez profondément.",
        },
        {
          name: "Étirement du chat",
          duration: 38,
          instructions: "Étirez votre colonne vertébrale lentement.",
        },
        {
          name: "Étirement des jambes",
          duration: 37,
          instructions: "Étendez vos jambes doucement.",
        },
        {
          name: "Relaxation finale",
          duration: 37,
          instructions: "Terminez par une respiration calme.",
        },
      ],
    };
  }

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
  poseName.textContent = getTranslation("player.error");
  poseInstructions.innerHTML = `<p>${message}</p>`;
  startBtn.disabled = true;
}

function showPremiumPaywall() {
  poseName.textContent = getTranslation("player.premiumTitle");
  poseInstructions.innerHTML = `
    <p>${getTranslation("player.premiumMessage")}</p>
    <a href="register.html" class="btn btn-primary" style="margin-top: 1rem;">${getTranslation("player.premiumButton")}</a>
  `;
  startBtn.disabled = true;
}

/* ========================================
   SESSION CONTROL
   ======================================== */

function startSession() {
  if (!currentSession) return;

  if (!currentSession.poses || currentSession.poses.length === 0) {
    return;
  }

  isPlaying = true;
  isPaused = false;
  currentPoseIndex = 0;

  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");

  // Activate background for session 41
  if (Number(currentSession.id) === 41) {
    background.classList.add("active");
  }

  playPose();
}

function startSpecialSession() {
  clearInterval(specialSessionInterval);

  isPlaying = true;
  isPaused = false;
  specialSessionTimeLeft = 150;

  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");

  background.classList.add("active");

  // Display pose name and number
  if (currentSession.poses && currentSession.poses.length > 0) {
    poseName.textContent = currentSession.poses[0].name;
    poseNumber.textContent = `Posture 1 / ${currentSession.poses.length}`;
  }

  updateTimeDisplay(specialSessionTimeLeft);
  updateTimerCircle(0, 150);

  specialSessionInterval = setInterval(() => {
    specialSessionTimeLeft -= 1;
    updateTimeDisplay(specialSessionTimeLeft);
    updateTimerCircle(150 - specialSessionTimeLeft, 150);

    if (specialSessionTimeLeft <= 0) {
      clearInterval(specialSessionInterval);
      completeSpecialSession();
    }
  }, 1000);
}

function completeSpecialSession() {
  isPlaying = false;
  clearInterval(specialSessionInterval);

  pauseBtn.classList.add("hidden");
  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");

  background.classList.remove("active");
}

function resumeSpecialSession() {
  if (specialSessionTimeLeft <= 0) {
    completeSpecialSession();
    return;
  }

  specialSessionInterval = setInterval(() => {
    specialSessionTimeLeft -= 1;
    updateTimeDisplay(specialSessionTimeLeft);
    updateTimerCircle(150 - specialSessionTimeLeft, 150);

    if (specialSessionTimeLeft <= 0) {
      clearInterval(specialSessionInterval);
      completeSpecialSession();
    }
  }, 1000);
}

function pauseSession() {
  isPaused = true;
  clearInterval(poseTimer);
  clearInterval(specialSessionInterval);

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
  clearInterval(specialSessionInterval);

  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
  resumeBtn.classList.add("hidden");
  stopBtn.classList.add("hidden");

  // Reset
  currentPoseIndex = 0;
  poseName.textContent = getTranslation("player.ready");
  timerDisplay.textContent = "0:00";
  poseNumber.textContent = "";
  poseInstructions.innerHTML = `<p>${getTranslation("player.prepare")}</p>`;
  updateTimerCircle(0, 1);
  background.classList.remove("active");
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
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
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

  // Disable background
  background.classList.remove("active");

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

  const completedAt = new Date().toISOString();
  const sessionId = String(currentSession.id);
  const postures = Array.isArray(currentSession.poses)
    ? currentSession.poses.map((pose, index) => ({
        name: pose.name,
        position: index + 1,
        duration: pose.duration,
      }))
    : [];

  const legacyHistory = JSON.parse(
    localStorage.getItem("sessionHistory") || "[]",
  );

  legacyHistory.push({
    id: crypto.randomUUID(),
    userId: userId,
    sessionId: sessionId,
    sessionTitle: currentSession.title,
    duration: currentSession.duration,
    completedAt: completedAt,
  });

  localStorage.setItem("sessionHistory", JSON.stringify(legacyHistory));

  const userHistoryKey = `${userId}_history`;
  const userHistory = JSON.parse(localStorage.getItem(userHistoryKey) || "[]");

  userHistory.push({
    sessionId: sessionId,
    date: completedAt,
    durationActual: currentSession.duration,
    completed: true,
    postures: postures,
  });

  localStorage.setItem(userHistoryKey, JSON.stringify(userHistory));

  const completedSessions = Number(
    localStorage.getItem("completedSessions") || 0,
  );
  localStorage.setItem("completedSessions", String(completedSessions + 1));
}
