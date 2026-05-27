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

/**
 * Séance 41 (session-player.html?id=41) — séquence de fond :
 *   Image 1 (150s) → pause 1s → Image 2 (150s)
 *
 * L’image 1 reste entièrement pilotée par `css/player.css` (#background) :
 * pas de style inline → zoom, transitions et background-size inchangés.
 * L’image 2 ne fait qu’écraser `background-image` sur le même nœud : mêmes
 * animations / classes CSS.
 *
 * Équivalent logique (sans casser pause / reprise / arrêt) :
 *   showPose("1. Posture de l'enfant.jpg", null, 150, { runTimer: false });
 *   // 150s + titres gérés par playPose()
 *   setTimeout(() => { setTimeout(() => {
 *     showPose("2. Chien tête en bas.jpg", "2. Chien tête en bas", 150, { onComplete: completeSession });
 *   }, 1000); }, 150000);
 */
const SESSION_41_BG_DIR = "yoga videos/Beginner/Gentle Morning Stretches/";
const SESSION_41_FILE_IMAGE_1 = "1. Posture de l'enfant.jpg";
const SESSION_41_FILE_IMAGE_2 = "2. Chien tête en bas.jpg";
const SESSION_41_POSE_TITLE_2 = "2. Chien tête en bas";
const SESSION_41_SEGMENT_SEC = 150;
const SESSION_41_PAUSE_MS = 1000;

let session41BetweenTimeout = null;
let session41Phase2Interval = null;
let session41Phase2TimeLeft = 0;
let session41ShowPoseTotal = SESSION_41_SEGMENT_SEC;
let session41ShowPoseOnComplete = null;
/** "idle" | "swapPending" | "phase2" */
let session41Seq = "idle";

/**
 * Applique le fichier de fond pour #background.
 * `null` ou le nom de la 1ère image → aucun style inline : l’image vient du CSS.
 * Autre nom → `background-image` relatif à la page (même #background, mêmes règles CSS).
 */
function applySession41BackgroundFileName(imageName) {
  if (!background) return;

  const useStylesheetImage =
    imageName == null ||
    imageName === SESSION_41_FILE_IMAGE_1 ||
    String(imageName).endsWith(SESSION_41_FILE_IMAGE_1);

  if (useStylesheetImage) {
    background.style.backgroundImage = "";
    return;
  }

  const relativePath = String(imageName).includes("/")
    ? String(imageName)
    : `${SESSION_41_BG_DIR}${imageName}`;
  background.style.backgroundImage = `url("${encodeURI(relativePath)}")`;
}

/**
 * Affiche une pose de fond : image, titre (#pose-name / .pose-title) et durée.
 * Ne modifie pas les règles d’animation CSS : uniquement `background-image` et `.active`.
 *
 * @param {string|null} imageName - null ou "1. Posture de l'enfant.jpg" → image depuis la feuille de style ; sinon fichier dans SESSION_41_BG_DIR
 * @param {string|null} poseTitle - texte du titre de pose ; `null` ou "" = ne pas modifier #pose-name (ex. phase 1 laissée à playPose)
 * @param {number} durationSeconds - durée compteur + cercle si `runTimer` (sinon informatif seulement)
 * @param {{ onComplete?: () => void, runTimer?: boolean }} [options] - `runTimer: false` : fond (+ titre si fourni) sans lancer le minuteur (phase 1 = postures 150s)
 */
function showPose(imageName, poseTitle, durationSeconds, options = {}) {
  const { onComplete = null, runTimer = true } = options;

  applySession41BackgroundFileName(imageName);
  background.classList.add("active");

  if (poseTitle != null && String(poseTitle).trim() !== "" && poseName) {
    poseName.textContent = poseTitle;
    poseName.removeAttribute("data-i18n");
  }

  if (!runTimer) return;

  session41ShowPoseTotal = durationSeconds;
  session41ShowPoseOnComplete = typeof onComplete === "function" ? onComplete : null;

  clearInterval(session41Phase2Interval);
  session41Phase2Interval = null;
  session41Phase2TimeLeft = durationSeconds;

  updateTimeDisplay(durationSeconds);
  updateTimerCircle(0, durationSeconds);

  runSession41Phase2Timer();
}

function resetSession41State() {
  if (session41BetweenTimeout) {
    clearTimeout(session41BetweenTimeout);
    session41BetweenTimeout = null;
  }
  if (session41Phase2Interval) {
    clearInterval(session41Phase2Interval);
    session41Phase2Interval = null;
  }
  session41Phase2TimeLeft = 0;
  session41ShowPoseTotal = SESSION_41_SEGMENT_SEC;
  session41ShowPoseOnComplete = null;
  session41Seq = "idle";
  if (background) {
    background.style.backgroundImage = "";
  }
}

function scheduleSession41ImageSwap() {
  if (!currentSession || Number(currentSession.id) !== 41) return;
  clearTimeout(session41BetweenTimeout);
  session41BetweenTimeout = setTimeout(() => {
    session41BetweenTimeout = null;
    session41Seq = "phase2";
    startSession41Phase2();
  }, SESSION_41_PAUSE_MS);
}

function startSession41Phase2() {
  if (!isPlaying || !currentSession || Number(currentSession.id) !== 41) return;

  poseInstructions.innerHTML =
    "<p>Corps en triangle, épaules au-dessus des poignets, poussez le bassin vers le haut.</p>";
  poseNumber.textContent = "Posture 2 / 2";

  if (audioToggle.checked) {
    playTransitionSound();
  }

  showPose(SESSION_41_FILE_IMAGE_2, SESSION_41_POSE_TITLE_2, SESSION_41_SEGMENT_SEC, {
    onComplete: () => completeSession(),
  });
}

function runSession41Phase2Timer() {
  const total = session41ShowPoseTotal;
  clearInterval(session41Phase2Interval);
  session41Phase2Interval = setInterval(() => {
    if (isPaused) return;

    session41Phase2TimeLeft -= 1;
    updateTimeDisplay(session41Phase2TimeLeft);
    updateTimerCircle(total - session41Phase2TimeLeft, total);

    if (session41Phase2TimeLeft <= 0) {
      clearInterval(session41Phase2Interval);
      session41Phase2Interval = null;
      const done = session41ShowPoseOnComplete;
      session41ShowPoseOnComplete = null;
      if (typeof done === "function") {
        done();
      }
    }
  }, 1000);
}

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
const stopBtn = document.getElementById("stop-btn");
const audioToggle = document.getElementById("audio-toggle");

const completionModal = document.getElementById("completion-modal");
const modalDuration = document.getElementById("modal-duration");
const modalPoses = document.getElementById("modal-poses");
const languageToggleBtn = document.getElementById("language-toggle");
const LANGUAGE_STORAGE_KEY = "session-player-language";
const languageOrder = ["fr", "en", "sr"];
let currentLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "fr";

const translations = {
  fr: {
    text: "Réveillez votre corps en douceur",
  },
  en: {
    text: "Gently awaken your body",
  },
  sr: {
    text: "Probudite svoje telo nežno",
  },
};

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

  const waitForI18n = (callback) => {
    const isI18nReady =
      window.i18n &&
      typeof window.i18n.getTranslation === "function" &&
      window.i18n.translations &&
      window.i18n.translations[window.i18n.currentLanguage];

    if (isI18nReady) {
      callback();
    } else {
      document.addEventListener("i18nReady", callback, { once: true });
    }
  };

  if (!sessionId) {
    waitForI18n(() => {
      showError("player.noSessionSelected");
    });
    return;
  }

  // Load session
  loadSession(sessionId);

  // Event listeners
  startBtn.addEventListener("click", startSession);
  pauseBtn.addEventListener("click", pauseSession);
  resumeBtn.addEventListener("click", resumeSession);
  stopBtn.addEventListener("click", stopSession);

  if (languageToggleBtn) {
    languageToggleBtn.addEventListener("click", toggleLanguage);
  }

  document.addEventListener("languageChanged", () => {
    if (currentSession) {
      displaySessionInfo();
    }
    applyLanguageToggle();
  });

  applyLanguageToggle();

  // Apply data-i18n translations and refresh session info once the i18n system is ready
  waitForI18n(() => {
    if (typeof window.i18n.applyTranslations === "function") {
      window.i18n.applyTranslations();
    }
    displaySessionInfo();
  });

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
  resetSession41State();

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
      descriptionTranslations: {
        en: "Gentle morning session to wake your body softly.",
        sr: "Blaga jutarnja sesija za nežno buđenje tela.",
      },
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

      const storedPremium =
        (sessionStorage.getItem("userPremium") ||
          localStorage.getItem("userPremium")) === "true";

      if (!storedPremium && (!user || !user.premium)) {
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

function getSessionDescription(session) {
  const lang = currentLang || "fr";

  if (
    lang !== "fr" &&
    session.descriptionTranslations &&
    session.descriptionTranslations[lang]
  ) {
    return session.descriptionTranslations[lang];
  }

  return session.description || translations[lang].text || translations.fr.text;
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

  poseInstructions.innerHTML = `<p>${getSessionDescription(currentSession)}</p>`;
}

function setLanguage(lang) {
  if (!languageOrder.includes(lang)) {
    lang = "fr";
  }
  currentLang = lang;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  applyLanguageToggle();
  if (currentSession) {
    displaySessionInfo();
  }
}

function toggleLanguage() {
  const currentIndex = languageOrder.indexOf(currentLang);
  const nextIndex = (currentIndex + 1) % languageOrder.length;
  setLanguage(languageOrder[nextIndex]);
}

function applyLanguageToggle() {
  const languageLabel = document.querySelector(".flag-icon");
  if (!languageLabel) return;

  if (currentLang === "en") {
    languageLabel.dataset.lang = "en";
    languageLabel.innerHTML = `
      <rect width="32" height="24" fill="#012169" />
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#fff" stroke-width="4" />
      <path d="M0 12 L32 12 M16 0 L16 24" stroke="#fff" stroke-width="4" />
      <path d="M0 12 L32 12" stroke="#C8102E" stroke-width="2" />
      <path d="M16 0 L16 24" stroke="#C8102E" stroke-width="2" />
    `;
  } else if (currentLang === "sr") {
    languageLabel.dataset.lang = "sr";
    languageLabel.innerHTML = `
      <rect width="32" height="24" fill="#FF0000" />
      <rect y="8" width="32" height="8" fill="#0C3" />
      <circle cx="16" cy="12" r="4" fill="#fff" />
    `;
  } else {
    languageLabel.dataset.lang = "fr";
    languageLabel.innerHTML = `
      <rect width="10.67" height="24" fill="#002395" />
      <rect x="10.67" width="10.67" height="24" fill="#FFFFFF" />
      <rect x="21.33" width="10.67" height="24" fill="#ED2939" />
    `;
  }
}

function showError(messageKey) {
  const message = messageKey.startsWith("player.")
    ? getTranslation(messageKey)
    : messageKey;

  sessionTitle.textContent = message;
  poseName.textContent = getTranslation("player.error");
  poseInstructions.innerHTML = `
    <p data-i18n="${messageKey}">${message}</p>
  `;

  if (window.i18n && typeof window.i18n.applyTranslations === "function") {
    window.i18n.applyTranslations();
  }

  startBtn.disabled = true;
}

function showPremiumPaywall() {
  poseName.textContent = getTranslation("player.premiumTitle");
  poseInstructions.innerHTML = `
    <p data-i18n="player.premiumMessage">${getTranslation("player.premiumMessage")}</p>
    <a href="register.html" class="btn btn-primary" style="margin-top: 1rem;" data-i18n="player.premiumButton">${getTranslation("player.premiumButton")}</a>
  `;

  if (window.i18n && typeof window.i18n.applyTranslations === "function") {
    window.i18n.applyTranslations();
  }

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

  resetSession41State();

  isPlaying = true;
  isPaused = false;
  currentPoseIndex = 0;

  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");

  // Séance 41 : fond image 1 = feuille de style uniquement (pas d’inline), timer = postures 150s
  if (Number(currentSession.id) === 41) {
    showPose(SESSION_41_FILE_IMAGE_1, null, SESSION_41_SEGMENT_SEC, {
      runTimer: false,
    });
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

  if (session41Phase2Interval) {
    clearInterval(session41Phase2Interval);
    session41Phase2Interval = null;
  }
  if (session41BetweenTimeout) {
    clearTimeout(session41BetweenTimeout);
    session41BetweenTimeout = null;
  }

  pauseBtn.classList.add("hidden");
  resumeBtn.classList.remove("hidden");
}

function resumeSession() {
  isPaused = false;

  resumeBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");

  if (Number(currentSession?.id) === 41 && session41Seq === "swapPending") {
    scheduleSession41ImageSwap();
    return;
  }
  if (
    Number(currentSession?.id) === 41 &&
    session41Seq === "phase2" &&
    session41Phase2TimeLeft > 0
  ) {
    runSession41Phase2Timer();
    return;
  }

  runPoseTimer();
}

function stopSession() {
  isPlaying = false;
  isPaused = false;
  clearInterval(poseTimer);
  clearInterval(specialSessionInterval);
  resetSession41State();

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
  if (!isPlaying) return;

  if (currentPoseIndex >= currentSession.poses.length) {
    if (Number(currentSession.id) === 41) {
      if (session41Seq === "idle") {
        session41Seq = "swapPending";
        scheduleSession41ImageSwap();
        return;
      }
      if (session41Seq === "swapPending" || session41Seq === "phase2") {
        return;
      }
    }
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
  resetSession41State();

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
