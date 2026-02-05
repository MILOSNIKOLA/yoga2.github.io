/**
 * Session translations manager
 * Gère l'intégration des traductions de sessions avec i18n-manager.js
 *
 * STRATEGY: Les traductions statiques (niveau, objectifs, actions) viennent du JSON
 * Les traductions dynamiques (cartes de sessions) sont générées depuis localStorage
 */

// Comprehensive dictionary for fallback translations
const TRANSLATION_DICTIONARY = {
  // Session titles
  "Flow doux du matin": {
    en: "Gentle Morning Flow",
    sr: "Lagani jutarnji tok",
  },
  "Réveillez votre corps en douceur": {
    en: "Wake up your body gently",
    sr: "Lagano razbudite telo",
  },
  "Vinyasa énergisant": {
    en: "Energizing Vinyasa",
    sr: "Energizujući Vinjasa",
  },
  "Enchaînement dynamique pour booster votre énergie": {
    en: "Dynamic flow to boost your energy",
    sr: "Dinamičan tok da pojačate energiju",
  },
  "Yin relaxant du soir": {
    en: "Relaxing Evening Yin",
    sr: "Opuštajući večernji Jin",
  },
  "Postures tenues longuement pour un relâchement profond": {
    en: "Long-held poses for deep release",
    sr: "Poze koje se dugotrajno drže za duboku oslobodu",
  },
  "Mobilité du dos": { en: "Back Mobility", sr: "Mobilnost leđa" },
  "Soulagez les tensions et renforcez votre dos": {
    en: "Relieve tension and strengthen your back",
    sr: "Ublažite napetost i ojačajte leđa",
  },
  // Generic descriptions - handle common patterns
  "Pratique complète et équilibrée": {
    en: "Complete and balanced practice",
    sr: "Kompletna i ujednačena praksa",
  },
  "Enchaînement dynamique pour les yogis expérimentés": {
    en: "Dynamic flow for experienced yogis",
    sr: "Dinamičan tok za iskusne jogiije",
  },
  "Préparez votre corps au sommeil réparateur": {
    en: "Prepare your body for restorative sleep",
    sr: "Pripremite telo za obnavljajući san",
  },
  "Renforcement musculaire profond": {
    en: "Deep muscle strengthening",
    sr: "Duboko ojačavanje mišića",
  },
  "Étirements rapides pour une pause bien-être": {
    en: "Quick stretches for a wellness break",
    sr: "Brza istezanja za pauzu za wellness",
  },
};

function translateSessionContent(text, lang) {
  if (!text || lang === "fr") return text;

  // Direct lookup
  const direct = TRANSLATION_DICTIONARY[text]?.[lang];
  if (direct) return direct;

  // Partial match for common patterns
  for (const [fr, translations] of Object.entries(TRANSLATION_DICTIONARY)) {
    if (text && text.includes(fr.substring(0, 10))) {
      const translated = translations[lang];
      if (translated) return translated;
    }
  }

  // Fallback: return original text
  return text;
}
// Build SESSION_TRANSLATIONS dynamically from localStorage
function buildSessionTranslations() {
  const SESSION_TRANSLATIONS = {};

  try {
    const sessions = localStorage.getItem("sessions");
    if (sessions) {
      const parsedSessions = JSON.parse(sessions);

      parsedSessions.forEach((session) => {
        const sessionKey = session.id || session.title;

        // Only add translation if we have meaningful data
        if (session.title && session.title.trim()) {
          SESSION_TRANSLATIONS[sessionKey] = {
            fr: {
              title: session.title || "",
              description: session.description || "",
            },
            en: {
              title: translateSessionContent(session.title, "en"),
              description: session.description
                ? translateSessionContent(session.description, "en")
                : "",
            },
            sr: {
              title: translateSessionContent(session.title, "sr"),
              description: session.description
                ? translateSessionContent(session.description, "sr")
                : "",
            },
          };
        }
      });

      console.log(
        `✅ SESSION_TRANSLATIONS générées dynamiquement: ${Object.keys(SESSION_TRANSLATIONS).length} sessions`,
      );
      return SESSION_TRANSLATIONS;
    }
  } catch (e) {
    console.warn(
      "⚠️ Erreur lors de la génération dynamique de SESSION_TRANSLATIONS:",
      e,
    );
  }

  return {};
}

let SESSION_TRANSLATIONS = buildSessionTranslations();

window.addEventListener("storage", () => {
  SESSION_TRANSLATIONS = buildSessionTranslations();
});

// Initialize translations
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 50;

function initializeSessionTranslations() {
  initAttempts++;

  if (!window.i18n || !window.i18n.translations) {
    if (initAttempts < MAX_INIT_ATTEMPTS) {
      console.log(
        `⏳ Tentative ${initAttempts}/${MAX_INIT_ATTEMPTS}: window.i18n non disponible, réessai...`,
      );
      setTimeout(initializeSessionTranslations, 100);
    } else {
      console.error("❌ ERREUR: window.i18n non disponible après 5 secondes");
    }
    return;
  }

  console.log(
    "🔄 Fusion des traductions de sessions dans window.i18n.translations...",
  );

  // Merge SESSION_TRANSLATIONS into window.i18n
  Object.keys(SESSION_TRANSLATIONS).forEach((sessionKey) => {
    const translations = SESSION_TRANSLATIONS[sessionKey];

    Object.keys(translations).forEach((lang) => {
      if (!window.i18n.translations[lang]) {
        window.i18n.translations[lang] = {};
      }
      if (!window.i18n.translations[lang].sessions) {
        window.i18n.translations[lang].sessions = {};
      }
      if (!window.i18n.translations[lang].sessions.cards) {
        window.i18n.translations[lang].sessions.cards = {};
      }

      window.i18n.translations[lang].sessions.cards[sessionKey] =
        translations[lang];
    });
  });

  console.log(
    `✅ ${Object.keys(SESSION_TRANSLATIONS).length} sessions traduites et intégrées`,
  );

  // Verify static translations exist
  ["fr", "en", "sr"].forEach((lang) => {
    const levelOk = window.i18n.translations[lang]?.sessions?.level?.beginner;
    const goalsOk = window.i18n.translations[lang]?.sessions?.goals?.mobilite;
    const actionsOk = window.i18n.translations[lang]?.sessions?.actions?.start;

    console.log(
      `✅ Vérification ${lang.toUpperCase()}: level=${!!levelOk}, goals=${!!goalsOk}, actions=${!!actionsOk}`,
    );
  });
}

console.log(
  "🚀 [SESSION-TRANSLATIONS] Script chargé, readyState:",
  document.readyState,
);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSessionTranslations);
} else {
  initializeSessionTranslations();
}
