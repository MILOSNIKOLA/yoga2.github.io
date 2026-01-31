/**
 * ═══════════════════════════════════════════════════════════════════════
 * SYSTÈME D'INTERNATIONALISATION (i18n) - SIMPLE ET FONCTIONNEL
 * ═══════════════════════════════════════════════════════════════════════
 */

const LANGUAGES = ["fr", "sr", "en"];
const DEFAULT_LANGUAGE = "fr";
const STORAGE_KEY = "site_language";
let currentLanguage = DEFAULT_LANGUAGE;

function getCurrentLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.includes(saved)) return saved;
  } catch (e) {}
  return currentLanguage || DEFAULT_LANGUAGE;
}

function resolveTranslationKey(translations, key) {
  if (!translations || !key) return null;
  if (translations[key]) return translations[key];

  const parts = key.split(".");
  let value = translations;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = value[part];
    } else {
      return null;
    }
  }
  return typeof value === "string" ? value : null;
}

function applyTranslations(lang) {
  if (!LANGUAGES.includes(lang)) return;

  const translations = window.SITE_TRANSLATIONS?.[lang];
  if (!translations) {
    console.error("Traductions introuvables pour " + lang);
    return;
  }

  // Traduire tous les [data-i18n]
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const text = resolveTranslationKey(translations, key);
    if (text) el.textContent = text;
  });

  // Traduire tous les data-i18n-*
  document
    .querySelectorAll(
      "[data-i18n-placeholder], [data-i18n-title], [data-i18n-alt], [data-i18n-aria-label]",
    )
    .forEach((el) => {
      Array.from(el.attributes || []).forEach((attr) => {
        if (attr.name.startsWith("data-i18n-")) {
          const attrType = attr.name.replace("data-i18n-", "");
          const text = resolveTranslationKey(translations, attr.value);
          if (text) el.setAttribute(attrType, text);
        }
      });
    });

  console.log("Traductions appliquees: " + lang.toUpperCase());
}

function setLanguage(lang) {
  if (!LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;

  console.log("Langue: " + lang.toUpperCase());

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {}

  currentLanguage = lang;
  document.documentElement.lang = lang;
  applyTranslations(lang);

  const btn = document.getElementById("language-toggle");
  if (btn) {
    const flags = {
      fr: '<svg class="flag-icon" data-lang="fr" width="32" height="24" viewBox="0 0 32 24"><rect width="10.67" height="24" fill="#002395"/><rect x="10.67" width="10.67" height="24" fill="#FFFFFF"/><rect x="21.33" width="10.67" height="24" fill="#ED2939"/></svg>',
      sr: '<svg class="flag-icon" data-lang="sr" width="32" height="24" viewBox="0 0 32 24"><rect width="32" height="8" fill="#C6363C"/><rect y="8" width="32" height="8" fill="#0C4076"/><rect y="16" width="32" height="8" fill="#FFFFFF"/></svg>',
      en: '<svg class="flag-icon" data-lang="en" width="32" height="24" viewBox="0 0 32 24"><rect width="32" height="24" fill="#012169"/><path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4"/><path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5"/><path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8"/><path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5"/></svg>',
    };
    btn.innerHTML = flags[lang] || flags.fr;
  }
}

function initializeTranslations() {
  const checkTranslations = () => {
    if (!window.SITE_TRANSLATIONS) {
      setTimeout(checkTranslations, 100);
      return;
    }

    const lang = getCurrentLanguage();
    currentLanguage = lang;
    document.documentElement.lang = lang;
    applyTranslations(lang);

    const btn = document.getElementById("language-toggle");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = LANGUAGES.indexOf(currentLanguage);
        const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
        setLanguage(next);
      });
    }

    console.log("i18n initialisé");
  };

  checkTranslations();
}

if (typeof window !== "undefined") {
  window.translatePage = (lang) => setLanguage(lang);
  window.getCurrentLanguage = getCurrentLanguage;
  window.setLanguage = setLanguage;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTranslations);
} else {
  initializeTranslations();
}

document.addEventListener("footerLoaded", () => {
  applyTranslations(getCurrentLanguage());
});
