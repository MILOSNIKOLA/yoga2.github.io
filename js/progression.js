// ==================================================
// SYSTÈME DE PROGRESSION YOGA APP
// Gère: progression du niveau, verrouillage, localStorage
// ==================================================

/**
 * SAUVEGARDE LA PROGRESSION D'UN NIVEAU
 * @param {string} level - "beginner", "intermediate", "advanced"
 * @param {number} percent - 0-100
 */
function saveProgress(level, percent) {
  if (percent > 100) percent = 100;
  localStorage.setItem(`progress_${level}`, percent);
  updateProgressBar(level, percent);
  checkUnlockAdvanced();
}

/**
 * RÉCUPÈRE LA PROGRESSION D'UN NIVEAU
 * @param {string} level
 * @returns {number} 0-100
 */
function getProgress(level) {
  return parseInt(localStorage.getItem(`progress_${level}`) || "0");
}

/**
 * VÉRIFIE SI ADVANCED EST DÉVERROUILLÉ
 */
function checkUnlockAdvanced() {
  const beginnerProgress = getProgress("beginner");
  const intermediateProgress = getProgress("intermediate");

  if (beginnerProgress >= 50 && intermediateProgress >= 50) {
    localStorage.setItem("advanced_unlocked", "true");
    updateAdvancedUIState();
  }
}

/**
 * RETOURNE SI ADVANCED EST DÉVERROUILLÉ
 * @returns {boolean}
 */
function isAdvancedUnlocked() {
  return localStorage.getItem("advanced_unlocked") === "true";
}

/**
 * MET À JOUR LA BARRE DE PROGRESSION
 * @param {string} level
 * @param {number} percent
 */
function updateProgressBar(level, percent) {
  const progressBar = document.querySelector(
    `.level-progress-bar[data-level="${level}"]`,
  );
  if (progressBar) {
    progressBar.style.width = percent + "%";
  }

  const progressText = document.querySelector(
    `.level-progress-text[data-level="${level}"]`,
  );
  if (progressText) {
    progressText.textContent = `${percent}% complétée`;
  }
}

/**
 * MET À JOUR L'ÉTAT DU BOUTON ADVANCED (VERROUILLÉ/DÉVERROUILLÉ)
 */
function updateAdvancedUIState() {
  const advancedLevel = document.querySelector(".level-advanced");
  const advancedLink = document.getElementById("advanced-level");

  if (!advancedLevel && !advancedLink) return;

  if (isAdvancedUnlocked()) {
    // Déverrouiller
    if (advancedLevel) advancedLevel.classList.remove("locked");
    if (advancedLink) advancedLink.classList.remove("locked");
  } else {
    // Verrouiller
    if (advancedLevel) advancedLevel.classList.add("locked");
    if (advancedLink) advancedLink.classList.add("locked");
  }
}

/**
 * INITIALISE LES BARRES DE PROGRESSION AU CHARGEMENT
 */
function initProgressBars() {
  ["beginner", "intermediate", "advanced"].forEach((level) => {
    const progress = getProgress(level);
    updateProgressBar(level, progress);
  });
  updateAdvancedUIState();
}

/**
 * VERROUILLE LE NIVEAU ADVANCED SI CONDITIONS NON REMPLIES
 */
function applyAdvancedLocking() {
  const advancedLevel = document.getElementById("advanced-level");
  if (!advancedLevel) return;

  if (!isAdvancedUnlocked()) {
    advancedLevel.classList.add("locked");
    advancedLevel.style.pointerEvents = "none";
    advancedLevel.style.opacity = "0.5";
    advancedLevel.style.cursor = "not-allowed";

    // Empêche la navigation
    advancedLevel.href = "javascript:void(0)";
    advancedLevel.addEventListener("click", (e) => {
      e.preventDefault();
      alert(
        "🔒 Tu dois atteindre 50% dans Débutant ET Intermédiaire pour débloquer Avancé.",
      );
    });
  } else {
    // Déverrouiller
    advancedLevel.classList.remove("locked");
    advancedLevel.style.pointerEvents = "auto";
    advancedLevel.style.opacity = "1";
    advancedLevel.style.cursor = "pointer";
    advancedLevel.href = "sessions-advanced.html";
  }
}

/**
 * AJOUTE UN ÉVÉNEMENT CLICK AUX EXERCICES POUR MARQUER LA PROGRESSION
 */
function setupExerciseTracking() {
  document.querySelectorAll(".exercise-track").forEach((exercise) => {
    exercise.addEventListener("click", function () {
      const level = this.dataset.level;
      const percentValue = parseInt(this.dataset.percent);
      saveProgress(level, percentValue);
    });
  });
}

/**
 * INITIALISATION GLOBALE AU CHARGEMENT DE LA PAGE
 */
document.addEventListener("DOMContentLoaded", () => {
  initProgressBars();
  applyAdvancedLocking();
  setupExerciseTracking();
});
