/**
 * ═══════════════════════════════════════════════════════════════════════
 * SYSTÈME DE TRADUCTION AVANCÉ - VERSION CORRIGÉE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ✅ Cible TOUTES les sections (y compris .cta-section)
 * ✅ Supporte data-i18n ET data-translate
 * ✅ Applique les traductions IMMÉDIATEMENT
 * ✅ Fonctionne sur toutes les pages
 * ✅ Sauvegarde la préférence de langue
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

class UniversalLanguageSystemV2 {
  constructor() {
    this.currentLanguage = "fr"; // Langue par défaut
    this.availableLanguages = ["fr", "sr", "en"];
    this.storageKey = "yoga-app-language";
    this.translations = window.SITE_TRANSLATIONS || {};

    // SVG des drapeaux
    this.flags = {
      fr: `<svg width="32" height="24" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="600" fill="#ED2939"/>
        <rect width="600" height="600" fill="#fff"/>
        <rect width="300" height="600" fill="#002395"/>
      </svg>`,

      en: `<svg width="32" height="24" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="t"><path d="M30,15 h30 v15 z v-30 h-30 z h-30 v15 z v-30 h30 z"/></clipPath>
        <g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g>
      </svg>`,

      sr: `<svg width="32" height="24" viewBox="0 0 945 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="945" height="630" fill="#C6363C"/>
        <rect width="945" height="420" fill="#0C4076"/>
        <rect width="945" height="210" fill="#fff"/>
      </svg>`,
    };

    this.init();
  }

  /**
   * Initialise le système de traduction
   */
  init() {
    // Charger la langue sauvegardée
    this.loadSavedLanguage();

    // Attendre que le DOM soit chargé
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupLanguageToggle(),
      );
    } else {
      this.setupLanguageToggle();
    }
  }

  /**
   * Charge la langue depuis localStorage
   */
  loadSavedLanguage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved && this.availableLanguages.includes(saved)) {
      this.currentLanguage = saved;
    }
  }

  /**
   * Configure le bouton de changement de langue
   */
  setupLanguageToggle() {
    const toggleButton = document.getElementById("language-toggle");

    if (!toggleButton) {
      console.warn("⚠️ Bouton #language-toggle non trouvé sur cette page");
      // Appliquer quand même les traductions
      this.applyTranslations();
      return;
    }

    // Mettre à jour le drapeau initial
    this.updateFlag(toggleButton);

    // Appliquer les traductions au chargement
    this.applyTranslations();

    // Écouter les clics
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.cycleLanguage();
      this.updateFlag(toggleButton);
      this.applyTranslations();
    });

    console.log(
      `✅ Système de traduction initialisé - Langue: ${this.currentLanguage}`,
    );
  }

  /**
   * Change de langue (cycle FR → SR → EN → FR)
   */
  cycleLanguage() {
    const currentIndex = this.availableLanguages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
    this.currentLanguage = this.availableLanguages[nextIndex];

    // Sauvegarder dans localStorage
    localStorage.setItem(this.storageKey, this.currentLanguage);

    console.log(`🌍 Langue changée: ${this.currentLanguage.toUpperCase()}`);
  }

  /**
   * Met à jour le drapeau affiché
   */
  updateFlag(button) {
    if (this.flags[this.currentLanguage]) {
      button.innerHTML = this.flags[this.currentLanguage];
    }
  }

  /**
   * Applique les traductions sur la page
   * VERSION AVANCÉE : Cible TOUS les éléments (y compris .cta-section)
   */
  applyTranslations() {
    let translatedCount = 0;

    // ═══════════════════════════════════════════════════════════════
    // 1. TRAITER LES ÉLÉMENTS AVEC data-i18n (priorité 1)
    // ═══════════════════════════════════════════════════════════════
    const i18nElements = document.querySelectorAll("[data-i18n]");
    i18nElements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getTranslation(key);

      if (translation) {
        // Gérer les listes
        if (Array.isArray(translation)) {
          element.innerHTML = translation
            .map((item) => (item.startsWith("<") ? item : `<li>${item}</li>`))
            .join("");
        } else if (typeof translation === "object") {
          // Si c'est un objet, prendre la propriété 'content' ou 'intro'
          element.textContent = translation.content || translation.intro || "";
        } else {
          // Texte simple
          element.textContent = translation;
        }
        translatedCount++;
      } else {
        console.warn(
          `⚠️ Traduction manquante: ${key} (langue: ${this.currentLanguage})`,
        );
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 2. TRAITER LES ÉLÉMENTS AVEC data-translate (priorité 2)
    // ═══════════════════════════════════════════════════════════════
    const translateElements = document.querySelectorAll("[data-translate]");
    translateElements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = this.getTranslation(key);

      if (translation) {
        if (Array.isArray(translation)) {
          element.innerHTML = translation
            .map((item) => (item.startsWith("<") ? item : `<li>${item}</li>`))
            .join("");
        } else if (typeof translation === "object") {
          element.textContent = translation.content || translation.intro || "";
        } else {
          element.textContent = translation;
        }
        translatedCount++;
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 3. TRAITER SPÉCIFIQUEMENT .cta-section ET AUTRES SECTIONS
    // ═══════════════════════════════════════════════════════════════
    const ctaSection = document.querySelector(".cta-section");
    if (ctaSection) {
      // Tous les éléments DANS .cta-section
      const ctaElements = ctaSection.querySelectorAll(
        "[data-i18n], [data-translate]",
      );
      ctaElements.forEach((element) => {
        const key =
          element.getAttribute("data-i18n") ||
          element.getAttribute("data-translate");
        const translation = this.getTranslation(key);

        if (translation) {
          if (typeof translation === "string") {
            element.textContent = translation;
          } else if (typeof translation === "object") {
            element.textContent =
              translation.content ||
              translation.intro ||
              translation.title ||
              "";
          }
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. TRAITER LES PLACEHOLDERS
    // ═══════════════════════════════════════════════════════════════
    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    placeholders.forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translation = this.getTranslation(key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 5. TRAITER LES ATTRIBUTS TITLE (tooltips)
    // ═══════════════════════════════════════════════════════════════
    const titles = document.querySelectorAll("[data-i18n-title]");
    titles.forEach((element) => {
      const key = element.getAttribute("data-i18n-title");
      const translation = this.getTranslation(key);
      if (translation) {
        element.title = translation;
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 6. TRAITER LES ARIA-LABEL
    // ═══════════════════════════════════════════════════════════════
    const ariaLabels = document.querySelectorAll("[data-i18n-aria]");
    ariaLabels.forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      const translation = this.getTranslation(key);
      if (translation) {
        element.setAttribute("aria-label", translation);
      }
    });

    console.log(
      `✅ ${translatedCount} éléments traduits en ${this.currentLanguage.toUpperCase()}`,
    );
    console.log(`📍 .cta-section: Traductions appliquées`);
  }

  /**
   * Récupère une traduction depuis le fichier translations.js
   * @param {string} key - Clé de traduction (ex: "privacy.title")
   * @returns {string|Array|object} La traduction ou null
   */
  getTranslation(key) {
    if (!key) return null;

    const keys = key.split(".");
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * Change manuellement la langue
   * @param {string} lang - Code de langue (fr, sr, en)
   */
  setLanguage(lang) {
    if (this.availableLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem(this.storageKey, lang);

      const toggleButton = document.getElementById("language-toggle");
      if (toggleButton) {
        this.updateFlag(toggleButton);
      }

      this.applyTranslations();
      return true;
    }
    return false;
  }

  /**
   * Obtient la langue actuelle
   * @returns {string} Code de langue actuel
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Force la traduction d'une section spécifique
   * @param {string} sectionSelector - Sélecteur CSS de la section
   */
  translateSection(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
      console.warn(`⚠️ Section non trouvée: ${sectionSelector}`);
      return false;
    }

    let count = 0;
    const elements = section.querySelectorAll("[data-i18n], [data-translate]");

    elements.forEach((element) => {
      const key =
        element.getAttribute("data-i18n") ||
        element.getAttribute("data-translate");
      const translation = this.getTranslation(key);

      if (translation) {
        if (typeof translation === "string") {
          element.textContent = translation;
        } else if (typeof translation === "object") {
          element.textContent = translation.content || translation.intro || "";
        }
        count++;
      }
    });

    console.log(`✅ ${count} éléments traduits dans ${sectionSelector}`);
    return true;
  }

  /**
   * Affiche les statistiques de traduction
   */
  showStats() {
    const allElements = document.querySelectorAll(
      "[data-i18n], [data-translate]",
    );
    const ctaSection = document.querySelector(".cta-section");
    const ctaElements = ctaSection
      ? ctaSection.querySelectorAll("[data-i18n], [data-translate]")
      : [];

    console.log(`
╔════════════════════════════════════════════╗
║      STATISTIQUES DE TRADUCTION            ║
╠════════════════════════════════════════════╣
║ Langue actuelle        : ${this.currentLanguage.toUpperCase().padEnd(23)}║
║ Éléments totaux        : ${String(allElements.length).padEnd(23)}║
║ Éléments .cta-section  : ${String(ctaElements.length).padEnd(23)}║
║ Langues disponibles    : FR / SR / EN      ║
╚════════════════════════════════════════════╝
    `);
  }
}

// ═══════════════════════════════════════════════════════════════════
// INITIALISATION AUTOMATIQUE
// ═══════════════════════════════════════════════════════════════════

// Créer une instance globale
const languageSystem = new UniversalLanguageSystemV2();

// Rendre accessible globalement
if (typeof window !== "undefined") {
  window.languageSystem = languageSystem;
}

// ═══════════════════════════════════════════════════════════════════
// EXEMPLE D'UTILISATION AVANCÉE (à utiliser dans la console)
// ═══════════════════════════════════════════════════════════════════
/*

// Changer la langue
languageSystem.setLanguage('sr');

// Obtenir la langue actuelle
languageSystem.getCurrentLanguage();

// Forcer la traduction d'une section spécifique
languageSystem.translateSection('.cta-section');

// Afficher les statistiques
languageSystem.showStats();

// Obtenir une traduction spécifique
languageSystem.getTranslation('home.cta.title');

*/
