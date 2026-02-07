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
  "Réveil articulaire doux": {
    en: "Gentle Joint Wake-Up",
    sr: "Nežno razgibavanje zglobova",
  },
  "Mobiliser tout le corps sans effort": {
    en: "Mobilize the whole body without strain",
    sr: "Pokrenite celo telo bez napora",
  },
  "Yoga respiration carré": {
    en: "Box Breathing Yoga",
    sr: "Joga disanje u kvadratu",
  },
  "Respiration guidée pour calmer l'esprit": {
    en: "Guided breathing to calm the mind",
    sr: "Vođeno disanje za smirivanje uma",
  },
  "Souplesse du dos débutant": {
    en: "Beginner Back Flexibility",
    sr: "Početnička fleksibilnost leđa",
  },
  "Déverrouiller la colonne en douceur": {
    en: "Gently unlock the spine",
    sr: "Nežno opustite kičmu",
  },
  "Flow débutant posture debout": {
    en: "Beginner Standing Flow",
    sr: "Početnički flow u stojećim pozama",
  },
  "Bases des postures debout en flow": {
    en: "Basics of standing poses in flow",
    sr: "Osnove stojećih poza u flow-u",
  },
  "Yoga hanches ouvertures": {
    en: "Hip Opening Yoga",
    sr: "Joga otvaranja kukova",
  },
  "Ouvrir les hanches sans forcer": {
    en: "Open the hips without forcing",
    sr: "Otvorite kukove bez forsiranja",
  },
  "Relaxation guidée débutant": {
    en: "Beginner Guided Relaxation",
    sr: "Vođena relaksacija za početnike",
  },
  "Relâcher le corps et le mental": {
    en: "Release body and mind",
    sr: "Otpustite telo i um",
  },
  "Mobilité épaules facile": {
    en: "Easy Shoulder Mobility",
    sr: "Laka pokretljivost ramena",
  },
  "Assouplir la ceinture scapulaire": {
    en: "Loosen the shoulder girdle",
    sr: "Omekšajte rameni pojas",
  },
  "Étirements du soir": {
    en: "Evening Stretches",
    sr: "Večernja istezanja",
  },
  "Étirements lents pour mieux dormir": {
    en: "Slow stretches for better sleep",
    sr: "Spora istezanja za bolji san",
  },
  "Yoga équilibre simple": {
    en: "Simple Balance Yoga",
    sr: "Jednostavna joga ravnoteže",
  },
  "Stabilité et confiance en douceur": {
    en: "Stability and confidence, gently",
    sr: "Stabilnost i samopouzdanje, nežno",
  },
  "Flow matin vitalité": {
    en: "Morning Vitality Flow",
    sr: "Jutarnji flow vitalnosti",
  },
  "Réactiver l'énergie au réveil": {
    en: "Reignite energy on waking",
    sr: "Ponovo probudite energiju pri buđenju",
  },
  "Yoga jambes légères": {
    en: "Light Legs Yoga",
    sr: "Joga za lagane noge",
  },
  "Détendre et alléger les jambes": {
    en: "Relax and lighten the legs",
    sr: "Opustite i olakšajte noge",
  },
  "Hatha débutant complet": {
    en: "Complete Beginner Hatha",
    sr: "Potpuni hatha za početnike",
  },
  "Pratique complète, lente et sécurisée": {
    en: "Complete, slow, safe practice",
    sr: "Potpuna, spora i bezbedna praksa",
  },
  "Respiration profonde + étirements": {
    en: "Deep Breathing + Stretching",
    sr: "Duboko disanje + istezanja",
  },
  "Allonger le souffle et relâcher": {
    en: "Lengthen the breath and release",
    sr: "Produžite dah i otpustite",
  },
  "Yin doux pour débuter": {
    en: "Gentle Yin to Start",
    sr: "Nežni yin za početak",
  },
  "Tenues confortables et apaisantes": {
    en: "Comfortable, soothing holds",
    sr: "Udobna i umirujuća zadržavanja",
  },
  "Yoga pause bureau": {
    en: "Desk Break Yoga",
    sr: "Joga pauza za kancelariju",
  },
  "Décontraction rapide après écran": {
    en: "Quick release after screen time",
    sr: "Brzo opuštanje posle ekrana",
  },
};

const STATIC_LEVEL_TRANSLATIONS = {
  fr: {
    desc: {
      beginner: "Séances douces pour bien commencer",
      intermediate: "Renforcer et approfondir la pratique",
      advanced: "Débloqué après 30 séances complétées",
    },
    count: {
      one: "séance",
      many: "séances",
    },
    gamification: {
      progress: "0/10 séances complétées",
      streak: "0 jours !",
      completed: "complétées",
      streakLabel: {
        one: "jour",
        many: "jours",
      },
      badges: {
        first: "Premier jour ✓",
        week: "Semaine complète ✓",
        level: "Niveau fini ✓",
      },
    },
  },
  en: {
    desc: {
      beginner: "Gentle sessions to start well",
      intermediate: "Strengthen and deepen your practice",
      advanced: "Unlocked after 30 sessions completed",
    },
    count: {
      one: "session",
      many: "sessions",
    },
    gamification: {
      progress: "0/10 sessions completed",
      streak: "0 days!",
      completed: "completed",
      streakLabel: {
        one: "day",
        many: "days",
      },
      badges: {
        first: "First day ✓",
        week: "Full week ✓",
        level: "Level complete ✓",
      },
    },
  },
  sr: {
    desc: {
      beginner: "Nežne sesije za dobar početak",
      intermediate: "Ojačajte i produbite praksu",
      advanced: "Otključano nakon 30 završenih sesija",
    },
    count: {
      one: "sesija",
      many: "sesije",
    },
    gamification: {
      progress: "0/10 završene sesije",
      streak: "0 dana!",
      completed: "završene",
      streakLabel: {
        one: "dan",
        many: "dana",
      },
      badges: {
        first: "Prvi dan ✓",
        week: "Puna sedmica ✓",
        level: "Nivo završen ✓",
      },
    },
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
        const sessionId = String(session.id || "");
        if (!/^[0-9]+$/.test(sessionId)) {
          return;
        }
        const sessionKey = `session_${sessionId}`;

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

  Object.keys(STATIC_LEVEL_TRANSLATIONS).forEach((lang) => {
    if (!window.i18n.translations[lang]) {
      window.i18n.translations[lang] = {};
    }
    if (!window.i18n.translations[lang].sessions) {
      window.i18n.translations[lang].sessions = {};
    }
    if (!window.i18n.translations[lang].sessions.level) {
      window.i18n.translations[lang].sessions.level = {};
    }
    if (!window.i18n.translations[lang].sessions.level.desc) {
      window.i18n.translations[lang].sessions.level.desc = {};
    }
    if (!window.i18n.translations[lang].sessions.level.count) {
      window.i18n.translations[lang].sessions.level.count = {};
    }
    if (!window.i18n.translations[lang].sessions.gamification) {
      window.i18n.translations[lang].sessions.gamification = {};
    }

    Object.assign(
      window.i18n.translations[lang].sessions.level.desc,
      STATIC_LEVEL_TRANSLATIONS[lang].desc,
    );

    Object.assign(
      window.i18n.translations[lang].sessions.level.count,
      STATIC_LEVEL_TRANSLATIONS[lang].count,
    );

    Object.assign(
      window.i18n.translations[lang].sessions.gamification,
      STATIC_LEVEL_TRANSLATIONS[lang].gamification,
    );
  });

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
