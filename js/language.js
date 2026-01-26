/**
 * LANGUAGE TOGGLE - Gestion du changement de langue
 * 3 langues : Anglais (par défaut), Français, Serbe
 */

// Configurations des langues avec SVG
const languages = {
  en: {
    name: "English",
    svg: `<svg class="flag-icon" data-lang="en" width="32" height="24" viewBox="0 0 32 24">
      <rect width="32" height="24" fill="#012169"/>
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4"/>
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5"/>
      <path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8"/>
      <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5"/>
    </svg>`,
  },
  fr: {
    name: "Français",
    svg: `<svg class="flag-icon" data-lang="fr" width="32" height="24" viewBox="0 0 32 24">
      <rect width="10.67" height="24" fill="#002395"/>
      <rect x="10.67" width="10.67" height="24" fill="#FFFFFF"/>
      <rect x="21.33" width="10.67" height="24" fill="#ED2939"/>
    </svg>`,
  },
  sr: {
    name: "Српски",
    svg: `<svg class="flag-icon" data-lang="sr" width="32" height="24" viewBox="0 0 32 24">
      <rect width="32" height="8" fill="#C6363C"/>
      <rect y="8" width="32" height="8" fill="#0C4076"/>
      <rect y="16" width="32" height="8" fill="#FFFFFF"/>
    </svg>`,
  },
};

const languageOrder = ["en", "fr", "sr"];

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  setupLanguageToggle();
});

/**
 * Initialise la langue depuis localStorage ou défaut (anglais)
 */
function initLanguage() {
  const savedLang = localStorage.getItem("preferred-language") || "en";
  setLanguage(savedLang);
}

/**
 * Configure le bouton de changement de langue
 */
function setupLanguageToggle() {
  const toggleBtn = document.getElementById("language-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("preferred-language") || "en";
    const currentIndex = languageOrder.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    const nextLang = languageOrder[nextIndex];

    setLanguage(nextLang);
  });
}

/**
 * Change la langue active
 * @param {string} lang - Code de la langue (en, fr, sr)
 */
function setLanguage(lang) {
  if (!languages[lang]) lang = "en";

  // Sauvegarde la langue
  localStorage.setItem("preferred-language", lang);

  // Met à jour l'attribut lang du HTML
  document.documentElement.lang = lang;

  // Met à jour l'icône du bouton avec le SVG
  const toggleBtn = document.getElementById("language-toggle");
  if (toggleBtn) {
    toggleBtn.innerHTML = languages[lang].svg;
  }

  // Ici vous pouvez ajouter la logique pour traduire le contenu
  // Par exemple, recharger les textes depuis un fichier de traduction
  console.log(`Langue changée : ${languages[lang].name}`);
}

/**
 * Récupère la langue actuelle
 * @returns {string} Code de la langue actuelle
 */
function getCurrentLanguage() {
  return localStorage.getItem("preferred-language") || "en";
}

/**
 * Récupère le nom de la langue actuelle
 * @returns {string} Nom de la langue
 */
function getCurrentLanguageName() {
  const lang = getCurrentLanguage();
  return languages[lang].name;
}
