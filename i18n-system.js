/**
 * ═══════════════════════════════════════════════════════════════════════
 * SYSTÈME DE TRADUCTION GÉNÉRIQUE POUR TOUT SITE WEB
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Version: 2.0.0
 * Date: 28 janvier 2026
 * Licence: MIT - Utilisable sur n'importe quel projet
 *
 * FONCTIONNALITÉS:
 * - 🌍 Support de plusieurs langues
 * - 🔄 Changement instantané sans rechargement
 * - 💾 Sauvegarde dans localStorage
 * - 🎨 Drapeaux SVG personnalisables
 * - ⚡ Léger et performant
 * - 🔧 100% personnalisable
 * - 📱 Responsive
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

class I18nSystem {
  constructor(config = {}) {
    // Configuration par défaut
    this.config = {
      defaultLang: config.defaultLang || "fr",
      languages: config.languages || {},
      translations: config.translations || {},
      storageKey: config.storageKey || "site-language",
      toggleButtonId: config.toggleButtonId || "language-toggle",
      onLanguageChange: config.onLanguageChange || null,
      ...config,
    };

    this.currentLang = null;
    this.languageOrder = Object.keys(this.config.languages);

    this.init();
  }

  /**
   * Initialise le système de traduction
   */
  init() {
    // Charge la langue sauvegardée ou utilise la langue par défaut
    const savedLang = this.getSavedLanguage();
    this.setLanguage(savedLang);

    // Configure le bouton de changement de langue
    this.setupToggleButton();

    console.log(
      `[i18n] Système initialisé avec la langue: ${this.currentLang}`,
    );
  }

  /**
   * Récupère la langue sauvegardée
   */
  getSavedLanguage() {
    return (
      localStorage.getItem(this.config.storageKey) || this.config.defaultLang
    );
  }

  /**
   * Sauvegarde la langue
   */
  saveLanguage(lang) {
    localStorage.setItem(this.config.storageKey, lang);
  }

  /**
   * Configure le bouton de changement de langue
   */
  setupToggleButton() {
    const button = document.getElementById(this.config.toggleButtonId);
    if (!button) {
      console.warn(`[i18n] Bouton #${this.config.toggleButtonId} non trouvé`);
      return;
    }

    button.addEventListener("click", () => {
      const currentIndex = this.languageOrder.indexOf(this.currentLang);
      const nextIndex = (currentIndex + 1) % this.languageOrder.length;
      const nextLang = this.languageOrder[nextIndex];
      this.setLanguage(nextLang);
    });
  }

  /**
   * Change la langue active
   */
  setLanguage(lang) {
    // Valide la langue
    if (!this.config.languages[lang]) {
      console.warn(
        `[i18n] Langue "${lang}" non supportée, utilisation de la langue par défaut`,
      );
      lang = this.config.defaultLang;
    }

    this.currentLang = lang;

    // Sauvegarde
    this.saveLanguage(lang);

    // Met à jour l'attribut lang du HTML
    document.documentElement.lang = lang;

    // Met à jour le bouton
    this.updateToggleButton();

    // Applique les traductions
    this.applyTranslations();

    // Callback personnalisé
    if (typeof this.config.onLanguageChange === "function") {
      this.config.onLanguageChange(lang, this.config.languages[lang]);
    }

    console.log(`[i18n] Langue changée: ${this.config.languages[lang].name}`);
  }

  /**
   * Met à jour le bouton de langue
   */
  updateToggleButton() {
    const button = document.getElementById(this.config.toggleButtonId);
    if (!button) return;

    const langConfig = this.config.languages[this.currentLang];

    // Met à jour le contenu (SVG ou texte)
    if (langConfig.flag) {
      button.innerHTML = langConfig.flag;
    } else {
      button.textContent = langConfig.code.toUpperCase();
    }

    // Met à jour l'aria-label
    button.setAttribute(
      "aria-label",
      this.translate("aria.language") || "Change language",
    );
  }

  /**
   * Applique les traductions à tous les éléments [data-i18n]
   */
  applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.translate(key);

      if (translation) {
        element.textContent = translation;
      } else {
        console.warn(
          `[i18n] Traduction manquante pour la clé "${key}" en langue "${this.currentLang}"`,
        );
      }
    });

    // Traduit aussi les attributs data-i18n-placeholder
    this.applyPlaceholderTranslations();

    // Traduit les attributs data-i18n-title
    this.applyTitleTranslations();
  }

  /**
   * Applique les traductions aux placeholders
   */
  applyPlaceholderTranslations() {
    const elements = document.querySelectorAll("[data-i18n-placeholder]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translation = this.translate(key);

      if (translation) {
        element.placeholder = translation;
      }
    });
  }

  /**
   * Applique les traductions aux titres (title attribute)
   */
  applyTitleTranslations() {
    const elements = document.querySelectorAll("[data-i18n-title]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n-title");
      const translation = this.translate(key);

      if (translation) {
        element.title = translation;
      }
    });
  }

  /**
   * Récupère une traduction
   */
  translate(key) {
    const translations = this.config.translations[this.currentLang];
    if (!translations) return null;

    // Support des clés imbriquées (ex: "hero.title")
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) return null;
    }

    return value;
  }

  /**
   * Récupère la langue actuelle
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Ajoute une nouvelle langue
   */
  addLanguage(code, config, translations) {
    this.config.languages[code] = config;
    this.config.translations[code] = translations;
    this.languageOrder = Object.keys(this.config.languages);
    console.log(`[i18n] Nouvelle langue ajoutée: ${config.name}`);
  }

  /**
   * Ajoute des traductions à une langue existante
   */
  addTranslations(lang, translations) {
    if (!this.config.translations[lang]) {
      this.config.translations[lang] = {};
    }
    Object.assign(this.config.translations[lang], translations);
    console.log(`[i18n] Traductions ajoutées pour: ${lang}`);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DRAPEAUX SVG PAR DÉFAUT
 * ═══════════════════════════════════════════════════════════════════════
 */

const FLAGS = {
  fr: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="10.67" height="24" fill="#002395"/>
    <rect x="10.67" width="10.67" height="24" fill="#FFFFFF"/>
    <rect x="21.33" width="10.67" height="24" fill="#ED2939"/>
  </svg>`,

  sr: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="32" height="8" fill="#C6363C"/>
    <rect y="8" width="32" height="8" fill="#0C4076"/>
    <rect y="16" width="32" height="8" fill="#FFFFFF"/>
  </svg>`,

  en: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="32" height="24" fill="#012169"/>
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4"/>
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5"/>
    <path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8"/>
    <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5"/>
  </svg>`,

  de: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="32" height="8" fill="#000"/>
    <rect y="8" width="32" height="8" fill="#D00"/>
    <rect y="16" width="32" height="8" fill="#FFCE00"/>
  </svg>`,

  es: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="32" height="6" fill="#AA151B"/>
    <rect y="6" width="32" height="12" fill="#F1BF00"/>
    <rect y="18" width="32" height="6" fill="#AA151B"/>
  </svg>`,

  it: `<svg class="flag-icon" width="32" height="24" viewBox="0 0 32 24">
    <rect width="10.67" height="24" fill="#009246"/>
    <rect x="10.67" width="10.67" height="24" fill="#FFFFFF"/>
    <rect x="21.33" width="10.67" height="24" fill="#CE2B37"/>
  </svg>`,
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * EXPORT POUR UTILISATION GLOBALE
 * ═══════════════════════════════════════════════════════════════════════
 */

// Rend disponible globalement
if (typeof window !== "undefined") {
  window.I18nSystem = I18nSystem;
  window.FLAGS = FLAGS;
}
