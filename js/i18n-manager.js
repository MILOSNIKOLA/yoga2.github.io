/**
 * Système multilingue centralisé - i18n System
 * ✅ STABLE - Sans rechargement, sans boucle
 * ✅ Initialisation unique
 * ✅ Application dynamique des traductions
 */

class I18nSystem {
  constructor() {
    this.initialized = false;
    this.currentLanguage = "fr";
    this.translations = {};
    this.supportedLanguages = ["fr", "en", "sr"];
    this.storageKey = "site_language";
    this.DEBUG = true; // Activer les logs de debug pour diagnostiquer le problème
  }

  /**
   * Initialiser le système i18n (une seule fois)
   */
  async init() {
    // Bloquer la double initialisation
    if (this.initialized) return;
    this.initialized = true;

    try {
      // 1️⃣ Charger les traductions JSON
      await this.loadTranslations();

      // 2️⃣ Récupérer la langue sauvegardée (ou français par défaut)
      this.restoreLanguage();

      // 3️⃣ Appliquer les traductions au DOM initial
      this.applyTranslations();

      // 4️⃣ Mettre à jour l'attribut lang du document
      document.documentElement.lang = this.currentLanguage;

      // 5️⃣ Initialiser le bouton de langue (une seule fois)
      this.setupLanguageToggle();

      // 6️⃣ Initialiser MutationObserver pour les éléments ajoutés dynamiquement
      this.setupMutationObserver();

      this.log("✅ i18n System initialisé avec succès");
    } catch (error) {
      console.error("❌ Erreur d'initialisation i18n:", error);
    }
  }

  /**
   * Charger les traductions depuis le JSON
   */
  async loadTranslations() {
    try {
      const basePath = this.getBasePath();
      const response = await fetch(`${basePath}/i18n/translations.json`);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Impossible de charger les traductions`,
        );
      }

      this.translations = await response.json();
      this.log("✅ Traductions chargées");
    } catch (error) {
      console.error("❌ Erreur de chargement JSON:", error);
      throw error;
    }
  }

  /**
   * Obtenir le chemin de base pour les fichiers statiques
   */
  getBasePath() {
    // Gérer les chemins relatifs et absolus
    const pathname = window.location.pathname;
    if (pathname.includes("/")) {
      return pathname.substring(0, pathname.lastIndexOf("/"));
    }
    return "";
  }

  /**
   * Restaurer la langue depuis localStorage
   */
  restoreLanguage() {
    const savedLang = localStorage.getItem(this.storageKey);
    const legacyLang = localStorage.getItem("language");

    // Utiliser la langue sauvegardée ou le français par défaut
    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      this.currentLanguage = savedLang;
    } else if (legacyLang && this.supportedLanguages.includes(legacyLang)) {
      this.currentLanguage = legacyLang;
      localStorage.setItem(this.storageKey, legacyLang);
    } else {
      this.currentLanguage = "fr";
      localStorage.setItem(this.storageKey, "fr");
    }

    this.log(`🌍 Langue restaurée: ${this.currentLanguage}`);
  }

  /**
   * Configurer le bouton de langue (une seule fois)
   */
  setupLanguageToggle() {
    const toggle = document.getElementById("language-toggle");
    if (!toggle) {
      this.log("⚠️ Bouton #language-toggle non trouvé");
      return;
    }

    // Supprimer tous les anciens event listeners (sécurité)
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    // Ajouter le nouvel event listener (une seule fois)
    newToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.switchLanguage();
    });

    // Afficher le drapeau initial
    this.updateFlagDisplay();

    this.log("✅ Bouton de langue configuré");
  }

  /**
   * Changer la langue (cycle: fr → en → sr → fr)
   * ✅ Sans rechargement, sans reload
   */
  switchLanguage() {
    const currentIndex = this.supportedLanguages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % this.supportedLanguages.length;
    const nextLanguage = this.supportedLanguages[nextIndex];

    this.log(`🔄 Changement: ${this.currentLanguage} → ${nextLanguage}`);
    this.setLanguage(nextLanguage);
  }

  /**
   * Définir une langue spécifique
   */
  setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`⚠️ Langue non supportée: ${lang}`);
      return;
    }

    this.currentLanguage = lang;

    // Sauvegarder dans localStorage
    localStorage.setItem(this.storageKey, lang);

    // Mettre à jour l'attribut lang du document
    document.documentElement.lang = lang;

    // Appliquer les traductions (uniquement si le JSON est chargé)
    if (Object.keys(this.translations).length > 0) {
      this.applyTranslations();
      this.updateFlagDisplay();

      // Dispatcher un événement personnalisé pour notifier les autres scripts
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);

      this.log(`✅ Langue changée: ${lang}`);
    }
  }

  /**
   * Appliquer les traductions au DOM (dynamiquement, sans reload)
   */
  applyTranslations() {
    if (!this.translations[this.currentLanguage]) {
      this.log(`⚠️ Traductions manquantes pour: ${this.currentLanguage}`);
      return;
    }

    let translatedCount = 0;
    let failedCount = 0;

    // Appliquer data-i18n
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const text = this.getTranslation(key);
      if (text !== null) {
        element.textContent = text;
        translatedCount++;
        if (this.DEBUG && key.includes("session_41")) {
          console.log(`🔄 Traduit: ${key} → "${text}"`);
        }
      } else {
        failedCount++;
        if (this.DEBUG && key.includes("session")) {
          console.warn(
            `⚠️ Clé non trouvée: ${key} (langue: ${this.currentLanguage})`,
          );
        }
      }
    });

    // Appliquer data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const text = this.getTranslation(key);
      if (text !== null) {
        element.placeholder = text;
      }
    });

    // Appliquer data-i18n-aria-label
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria-label");
      const text = this.getTranslation(key);
      if (text !== null) {
        element.setAttribute("aria-label", text);
      }
    });

    // Appliquer les traductions d'attributs via data-i18n-attr-*
    this.applyAttributeTranslations();

    if (this.DEBUG) {
      console.log(
        `✅ Traductions appliquées: ${translatedCount} éléments traduits, ${failedCount} échoués (langue: ${this.currentLanguage})`,
      );
    }
    this.log("✅ Traductions appliquées au DOM");
  }

  /**
   * Appliquer les traductions d'attributs (data-i18n-attr-*)
   * Exemple: data-i18n-attr-title="key.title"
   */
  applyAttributeTranslations() {
    document.querySelectorAll("*").forEach((element) => {
      const attributes = element.getAttributeNames();
      attributes.forEach((attrName) => {
        if (!attrName.startsWith("data-i18n-attr-")) return;

        const targetAttr = attrName.replace("data-i18n-attr-", "");
        if (!targetAttr) return;

        const key = element.getAttribute(attrName);
        const text = this.getTranslation(key);
        if (text !== null) {
          element.setAttribute(targetAttr, text);
        }
      });
    });
  }

  /**
   * Récupérer une traduction par clé (support des clés imbriquées)
   * Exemple: "hero.title", "features.understand.desc"
   */
  getTranslation(key) {
    if (!key || typeof key !== "string") return null;

    const translation = this.translations[this.currentLanguage];
    if (!translation) return null;

    const keys = key.split(".");
    let value = translation;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Clé manquante: afficher un avertissement en mode DEBUG
        if (this.DEBUG) {
          console.warn(
            `⚠️ Traduction manquante: ${key} (langue: ${this.currentLanguage})`,
          );
        }
        return null;
      }
    }

    return typeof value === "string" ? value : null;
  }

  /**
   * Mettre à jour le drapeau du bouton (dynamiquement)
   */
  updateFlagDisplay() {
    const toggle = document.getElementById("language-toggle");
    if (!toggle) return;

    // Supprimer tous les SVG existants
    toggle.querySelectorAll("svg").forEach((svg) => svg.remove());

    // Créer et insérer le nouveau SVG
    const svgHtml = this.createFlagSVG(this.currentLanguage);
    toggle.insertAdjacentHTML("afterbegin", svgHtml);

    // Mettre à jour l'aria-label du bouton
    const ariaLabel = this.getTranslation("common.aria.language");
    if (ariaLabel) {
      toggle.setAttribute("aria-label", ariaLabel);
    }

    this.log(`🚩 Drapeau mis à jour: ${this.currentLanguage}`);
  }

  /**
   * Créer un SVG du drapeau selon la langue
   */
  createFlagSVG(lang) {
    const w = 32;
    const h = 24;
    const w3 = w / 3;

    const flags = {
      fr: `<svg class="flag-icon" data-lang="fr" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <rect width="${w3}" height="${h}" fill="#002395"/>
        <rect x="${w3}" width="${w3}" height="${h}" fill="#FFFFFF"/>
        <rect x="${w3 * 2}" width="${w3}" height="${h}" fill="#ED2939"/>
      </svg>`,

      en: `<svg class="flag-icon" data-lang="en" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <rect width="${w}" height="${h}" fill="#012169"/>
        <!-- Diagonales blanches (St Andrew) -->
        <polygon points="0,0 4,0 32,20 32,24 28,24 0,4" fill="#FFFFFF"/>
        <polygon points="32,0 28,0 0,20 0,24 4,24 32,4" fill="#FFFFFF"/>
        <!-- Diagonales rouges (St Patrick) -->
        <polygon points="0,0 2.5,0 32,18.5 32,20.5 29.5,20.5 0,2" fill="#C8102E"/>
        <polygon points="32,0 29.5,0 0,18.5 0,20.5 2.5,20.5 32,2" fill="#C8102E"/>
        <!-- Croix blanche (St George fond) -->
        <rect x="13" width="6" height="24" fill="#FFFFFF"/>
        <rect y="9" width="32" height="6" fill="#FFFFFF"/>
        <!-- Croix rouge (St George) -->
        <rect x="14" width="4" height="24" fill="#C8102E"/>
        <rect y="10" width="32" height="4" fill="#C8102E"/>
      </svg>`,

      sr: `<svg class="flag-icon" data-lang="sr" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <rect width="${w}" height="8" fill="#C6363C"/>
        <rect y="8" width="${w}" height="8" fill="#0C4076"/>
        <rect y="16" width="${w}" height="8" fill="#FFFFFF"/>
      </svg>`,
    };

    return flags[lang] || flags["fr"];
  }

  /**
   * Obtenir la langue actuelle
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Configuration du MutationObserver pour traduire les nouveaux éléments
   * Observe l'ajout de nouveaux nœuds au DOM
   */
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Parcourir les nœuds ajoutés
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Node.ELEMENT_NODE
              // Vérifier si le nœud lui-même a data-i18n
              if (node.hasAttribute && node.hasAttribute("data-i18n")) {
                const key = node.getAttribute("data-i18n");
                const text = this.getTranslation(key);
                if (text !== null) {
                  node.textContent = text;
                }
              }

              // Vérifier tous les descendants qui ont data-i18n
              if (node.querySelectorAll) {
                node.querySelectorAll("[data-i18n]").forEach((el) => {
                  const key = el.getAttribute("data-i18n");
                  const text = this.getTranslation(key);
                  if (text !== null) {
                    el.textContent = text;
                  }
                });
              }
            }
          });
        }
      });
    });

    // Démarrer l'observation du document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.log("✅ MutationObserver configuré pour les traductions dynamiques");
  }

  /**
   * Log de debug (désactivable)
   */
  log(message) {
    if (this.DEBUG) {
      console.log(`[i18n] ${message}`);
    }
  }
}

// ✅ Initialisation UNIQUE du système
const i18n = new I18nSystem();

// Exposer i18n globalement pour les autres scripts
window.i18n = i18n;

// Attendre que le DOM soit prêt
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => i18n.init());
} else {
  // Le DOM est déjà chargé
  i18n.init();
}
