/* ========================================
   APP.JS - MAIN APPLICATION LOGIC
   ======================================== */

// Translations object (will be loaded from i18n-manager)
let TRANSLATIONS = {};

// Load translations from i18n-manager (global instance)
function loadTranslations() {
  try {
    // Try to get translations from the global i18n instance
    if (window.i18n && window.i18n.translations) {
      TRANSLATIONS = window.i18n.translations;
      return;
    }
  } catch (e) {
    console.warn("Could not load translations from i18n");
  }

  // Fallback translations - these will be overwritten when i18n is ready
  TRANSLATIONS = {
    fr: {
      badges: {
        free: "Gratuit",
        premium: "Premium",
      },
      filter: {
        level: {
          beginner: "Débutant",
          intermediate: "Intermédiaire",
          advanced: "Avancé",
        },
        goal: {
          relaxation: "Détente",
          mobility: "Mobilité",
          strength: "Renforcement",
          energy: "Énergie",
        },
      },
    },
    en: {
      badges: {
        free: "Free",
        premium: "Premium",
      },
      filter: {
        level: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced",
        },
        goal: {
          relaxation: "Relaxation",
          mobility: "Mobility",
          strength: "Strength",
          energy: "Energy",
        },
      },
    },
    sr: {
      badges: {
        free: "Besplatno",
        premium: "Premium",
      },
      filter: {
        level: {
          beginner: "Početnik",
          intermediate: "Srednji",
          advanced: "Napredni",
        },
        goal: {
          relaxation: "Opuštanje",
          mobility: "Mobilnost",
          strength: "Jačanje",
          energy: "Energija",
        },
      },
    },
  };
}

// Get current language
function getCurrentLanguage() {
  // Try to get from i18n system first
  if (window.i18n && window.i18n.currentLanguage) {
    return window.i18n.currentLanguage;
  }
  const htmlLang = document.documentElement.lang || "fr";
  return htmlLang.toLowerCase();
}

// Get translation value
function getTranslation(key, defaultValue = "") {
  const lang = getCurrentLanguage();
  const keys = key.split(".");
  let value = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }

  return value || defaultValue;
}

document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for i18n to be initialized
  setTimeout(() => {
    loadTranslations();
    initializeApp();
  }, 100);

  // Listen for language changes
  document.addEventListener("languageChanged", (event) => {
    loadTranslations();
    refreshSessionCards();
  });
});

function initializeApp() {
  // Check if user is logged in
  updateAuthUI();

  // Load popular sessions on homepage
  if (document.getElementById("popular-sessions")) {
    loadPopularSessions();
  }

  // Initialize sample data if needed
  initializeSampleData();
}

// Refresh session cards when language changes
function refreshSessionCards() {
  const container = document.getElementById("popular-sessions");
  if (!container) return;

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const popular = sessions.slice(0, 3);

  renderSessionCards(container, popular);
}

function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderSimpleMessage(container, text) {
  clearElement(container);
  const message = document.createElement("p");
  message.style.textAlign = "center";
  message.style.color = "var(--text-secondary)";
  message.textContent = text;
  container.appendChild(message);
}

function renderSessionCards(container, sessions) {
  clearElement(container);
  sessions.forEach((session) => {
    container.insertAdjacentHTML("beforeend", createSessionCard(session));
  });

  container.querySelectorAll(".session-card").forEach((card) => {
    card.addEventListener("click", () => {
      const sessionId = card.dataset.sessionId;
      window.location.href = `session-player.html?id=${sessionId}`;
    });
  });
}

/* ========================================
   AUTH UI MANAGEMENT
   ======================================== */

function updateAuthUI() {
  const authSection = document.getElementById("auth-section");
  const userMenu = document.getElementById("user-menu");
  const logoutBtn = document.getElementById("logout-btn");
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (userId) {
    // User is logged in
    if (authSection) authSection.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  } else {
    // User is not logged in
    if (authSection) authSection.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
  }
}

/* ========================================
   LOAD POPULAR SESSIONS
   ======================================== */

function loadPopularSessions() {
  const container = document.getElementById("popular-sessions");
  if (!container) return;

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  // Get 3 most popular sessions
  const popular = sessions.slice(0, 3);

  if (popular.length === 0) {
    renderSimpleMessage(container, "Aucune séance disponible pour le moment");
    return;
  }

  renderSessionCards(container, popular);
}

function getSessionImageUrl(title) {
  const query = encodeURIComponent(title.toLowerCase());
  return `https://source.unsplash.com/800x600/?yoga,${query}`;
}

function getFallbackImageUrl(title) {
  const query = encodeURIComponent(title.toLowerCase());
  return `https://source.unsplash.com/800x600/?relaxation,${query}`;
}

function getLocalizedSessionDescription(session, lang) {
  if (session.descriptionTranslations?.[lang]) {
    return session.descriptionTranslations[lang];
  }

  const descriptionMap = {
    "Flow doux du matin": {
      en: "Gently wake your body with smooth, flowing poses",
      sr: "Lagano razbudite telo kroz meke, tečne položaje",
    },
    "Vinyasa énergisant": {
      en: "Dynamic flow to boost your energy",
      sr: "Dinamičan tok za podizanje energije",
    },
    "Yin relaxant du soir": {
      en: "Long-held poses for deep release",
      sr: "Dugo zadržani položaji za duboko opuštanje",
    },
  };

  return descriptionMap[session.title]?.[lang] || session.description;
}

function createSessionCard(session) {
  const lang = getCurrentLanguage();

  // Get level label from translations
  const levelLabels =
    TRANSLATIONS[lang]?.filter?.level || TRANSLATIONS["fr"].filter.level;
  const badgeLabels = TRANSLATIONS[lang]?.badges || TRANSLATIONS["fr"].badges;
  const goalLabels =
    TRANSLATIONS[lang]?.filter?.goal || TRANSLATIONS["fr"].filter.goal;

  const freeOrPremium = session.free
    ? `<span class="free-badge">${badgeLabels.free}</span>`
    : `<span class="premium-badge">${badgeLabels.premium}</span>`;

  const imageUrl = getSessionImageUrl(session.title);
  const fallbackUrl = getFallbackImageUrl(session.title);

  // Translate objectives
  const translatedObjectives = session.objectives.map((obj) => {
    // Map French objective names to translation keys
    const objKeyMap = {
      détente: "relaxation",
      relaxation: "relaxation",
      mobilité: "mobility",
      mobility: "mobility",
      renforcement: "strength",
      strength: "strength",
      énergie: "energy",
      energy: "energy",
      // For unmapped values, return as-is
      calme: "relaxation", // maps to relaxation
      sommeil: "relaxation", // maps to relaxation
      équilibre: "mobility", // maps to mobility
      force: "strength", // maps to strength
      repos: "relaxation", // maps to relaxation
      soulagement: "mobility", // maps to mobility
      focus: "relaxation", // maps to relaxation
    };
    const objKey = objKeyMap[obj.toLowerCase()] || obj.toLowerCase();
    return goalLabels[objKey] || obj;
  });

  return `
        <div class="session-card" data-session-id="${session.id}">
            <div class="session-image">
                <img src="${imageUrl}" alt="${session.title}" loading="lazy" onerror="this.src='${fallbackUrl}'; this.onerror=function(){this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');};" />
                <span class="session-fallback hidden" aria-hidden="true">🧘‍♀️</span>
            </div>
            <div class="session-content">
                <div class="session-header">
                    <div class="badges">
                        ${freeOrPremium}
                        <span class="session-badge">${levelLabels[session.level] || session.level}</span>
                    </div>
                    <span class="session-duration">${session.duration} min</span>
                </div>
                <h3 class="session-title">${session.title}</h3>
                <p class="session-description">${getLocalizedSessionDescription(session, lang)}</p>
                <div class="session-footer">
                    ${translatedObjectives.map((obj) => `<span class="session-tag">${obj}</span>`).join("")}
                </div>
            </div>
        </div>
    `;
}

/* ========================================
   INITIALIZE SAMPLE DATA
   ======================================== */

function initializeSampleData() {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  if (sessions.length === 0) {
    const sampleSessions = [
      {
        id: crypto.randomUUID(),
        title: "Flow doux du matin",
        description:
          "Réveillez votre corps en douceur avec des postures fluides",
        duration: 15,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["détente", "mobilité"],
        poses: [
          {
            name: "Posture de l'enfant",
            duration: 60,
            instructions:
              "Asseyez-vous sur les talons, front au sol, bras étendus.",
          },
          {
            name: "Chien tête en bas",
            duration: 60,
            instructions:
              "Poussez les talons vers le sol, colonne vertébrale étirée.",
          },
          {
            name: "Guerrier I",
            duration: 45,
            instructions: "Pied avant plié, bras levés, regard vers le haut.",
          },
          {
            name: "Étirement du chat",
            duration: 45,
            instructions: "À quatre pattes, alternez dos rond et dos creux.",
          },
          {
            name: "Savasana",
            duration: 180,
            instructions: "Allongé sur le dos, relâchez complètement.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Vinyasa énergisant",
        description: "Enchaînement dynamique pour booster votre énergie",
        duration: 30,
        level: "intermediate",
        type: "vinyasa",
        free: false,
        objectives: ["renforcement", "énergie"],
        poses: [
          {
            name: "Salutation au soleil A",
            duration: 120,
            instructions:
              "Enchaînez les postures en synchronisant avec la respiration.",
          },
          {
            name: "Salutation au soleil B",
            duration: 120,
            instructions: "Variation avec guerrier I.",
          },
          {
            name: "Planche",
            duration: 60,
            instructions: "Corps aligné, gainage abdominal.",
          },
          {
            name: "Guerrier II",
            duration: 60,
            instructions: "Jambes écartées, bras à l'horizontale.",
          },
          {
            name: "Triangle",
            duration: 60,
            instructions: "Jambes écartées, main au sol, regard vers le haut.",
          },
          {
            name: "Relaxation",
            duration: 180,
            instructions: "Allongé sur le dos, intégrez la pratique.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Yin relaxant du soir",
        description: "Postures tenues longuement pour un relâchement profond",
        duration: 20,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["détente", "calme"],
        poses: [
          {
            name: "Papillon",
            duration: 180,
            instructions:
              "Assis, plantes des pieds jointes, penchez-vous en avant.",
          },
          {
            name: "Pigeon",
            duration: 120,
            instructions: "Jambe pliée devant, allongez-vous sur la cuisse.",
          },
          {
            name: "Sphinx",
            duration: 120,
            instructions: "Sur le ventre, avant-bras au sol, poitrine ouverte.",
          },
          {
            name: "Torsion allongée",
            duration: 120,
            instructions: "Sur le dos, genoux d'un côté, bras en croix.",
          },
          {
            name: "Savasana",
            duration: 240,
            instructions: "Relaxation complète, abandonnez-vous.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Mobilité du dos",
        description: "Soulagez les tensions et renforcez votre dos",
        duration: 20,
        level: "beginner",
        type: "hatha",
        free: false,
        objectives: ["mobilité", "soulagement"],
        poses: [
          {
            name: "Chat-vache",
            duration: 60,
            instructions: "Alternez flexion et extension de la colonne.",
          },
          {
            name: "Torsion assise",
            duration: 60,
            instructions: "Assis, tournez le buste d'un côté puis l'autre.",
          },
          {
            name: "Posture de l'enfant étendu",
            duration: 90,
            instructions: "Bras étendus, front au sol, relâchez le dos.",
          },
          {
            name: "Pont",
            duration: 60,
            instructions: "Allongé, pieds au sol, soulevez les hanches.",
          },
          {
            name: "Genou-poitrine",
            duration: 90,
            instructions: "Sur le dos, ramenez les genoux vers vous.",
          },
          {
            name: "Relaxation",
            duration: 180,
            instructions: "Laissez le dos se détendre complètement.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Quick stretch - 10 min",
        description: "Étirements rapides pour une pause bien-être",
        duration: 10,
        level: "beginner",
        type: "hatha",
        objectives: ["mobilité", "détente"],
        poses: [
          {
            name: "Étirement latéral",
            duration: 45,
            instructions:
              "Debout, bras au-dessus de la tête, penchez sur le côté.",
          },
          {
            name: "Torsion debout",
            duration: 45,
            instructions: "Pieds ancrés, tournez le buste.",
          },
          {
            name: "Pince debout",
            duration: 60,
            instructions: "Jambes tendues, penchez-vous vers l'avant.",
          },
          {
            name: "Ouverture de hanches",
            duration: 60,
            instructions: "Fente basse, ouvrez les hanches.",
          },
          {
            name: "Étirement du cou",
            duration: 45,
            instructions: "Inclinez doucement la tête de chaque côté.",
          },
          {
            name: "Respiration",
            duration: 120,
            instructions: "Debout, respirez profondément.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Pilates et force",
        description: "Renforcement musculaire profond avec Pilates",
        duration: 25,
        level: "intermediate",
        type: "flow",
        free: false,
        objectives: ["renforcement"],
        poses: [
          {
            name: "Crunches",
            duration: 60,
            instructions: "Abdominaux contrôlés.",
          },
          {
            name: "Superman",
            duration: 45,
            instructions: "Allongé, bras et jambes levés.",
          },
          {
            name: "Planche latérale",
            duration: 60,
            instructions: "Corps aligné.",
          },
          { name: "Pont", duration: 60, instructions: "Soulevez les hanches." },
          { name: "Relaxation", duration: 180, instructions: "Récupération." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Détente du soir - sommeil",
        description: "Préparez votre corps au sommeil réparateur",
        duration: 20,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["détente", "sommeil"],
        poses: [
          { name: "Jambes en l'air", duration: 120, instructions: "Allongé." },
          {
            name: "Papillon",
            duration: 150,
            instructions: "Détente profonde.",
          },
          { name: "Torsion", duration: 120, instructions: "Libération." },
          { name: "Savasana", duration: 300, instructions: "Sommeil profond." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Hatha classique 45 min",
        description: "Pratique complète et équilibrée",
        duration: 45,
        level: "intermediate",
        type: "hatha",
        free: true,
        objectives: ["équilibre", "force"],
        poses: [
          { name: "Échauffement", duration: 300, instructions: "Préparation." },
          { name: "Guerriers", duration: 600, instructions: "Force." },
          { name: "Flexions", duration: 300, instructions: "Mobilité." },
          { name: "Relaxation", duration: 300, instructions: "Récupération." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Flow puissant - Avancé",
        description: "Enchaînement dynamique pour les yogis expérimentés",
        duration: 50,
        level: "advanced",
        type: "vinyasa",
        free: false,
        objectives: ["renforcement", "énergie"],
        poses: [
          {
            name: "Salutations soleil",
            duration: 300,
            instructions: "Dynamique.",
          },
          { name: "Équilibres", duration: 600, instructions: "Concentration." },
          { name: "Inversions", duration: 300, instructions: "Courage." },
          { name: "Récupération", duration: 180, instructions: "Intégration." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Relaxation des yeux",
        description: "Reposez vos yeux et votre esprit",
        duration: 12,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["détente", "repos"],
        poses: [
          { name: "Palming", duration: 180, instructions: "Reposez vos yeux." },
          {
            name: "Voyages mentaux",
            duration: 300,
            instructions: "Relaxation.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Nidra - Sommeil profond",
        description: "Méditation guidée pour la relaxation profonde",
        duration: 30,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["détente", "sommeil"],
        poses: [
          {
            name: "Positionnement",
            duration: 60,
            instructions: "Installation.",
          },
          { name: "Nidra", duration: 1800, instructions: "Sommeil yogique." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Respiration & Pranayama",
        description: "Techniques de respiration pour calmer l'esprit",
        duration: 15,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["calme", "détente"],
        poses: [
          {
            name: "Respiration nosale",
            duration: 300,
            instructions: "Équilibrage.",
          },
          {
            name: "Respiration abdominale",
            duration: 300,
            instructions: "Calme.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Flexibilité progressive",
        description: "Augmentez votre amplitude de mouvement",
        duration: 35,
        level: "intermediate",
        type: "hatha",
        free: true,
        objectives: ["mobilité"],
        poses: [
          {
            name: "Grandes ouvertures",
            duration: 600,
            instructions: "Progressive.",
          },
          { name: "Étirements", duration: 600, instructions: "Relaxation." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Énergisant quotidien",
        description: "Activez votre corps et esprit",
        duration: 20,
        level: "intermediate",
        type: "flow",
        free: false,
        objectives: ["énergie", "renforcement"],
        poses: [
          { name: "Dynamique", duration: 600, instructions: "Puissance." },
          { name: "Finition", duration: 300, instructions: "Énergisant." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Méditation guidée",
        description: "Calmer l'esprit et cultiver la conscience",
        duration: 18,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["calme", "focus"],
        poses: [
          { name: "Assise", duration: 60, instructions: "Positionnement." },
          { name: "Méditation", duration: 900, instructions: "Conscience." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Mobilité cervicale",
        description: "Soulagez les tensions du cou et des épaules",
        duration: 15,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["soulagement", "mobilité"],
        poses: [
          {
            name: "Mobilité cou",
            duration: 300,
            instructions: "Doux mouvements.",
          },
          { name: "Épaules", duration: 300, instructions: "Relâchement." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Ouverture des hanches",
        description: "Ouvrez vos hanches et relâchez les tensions",
        duration: 28,
        level: "intermediate",
        type: "hatha",
        free: true,
        objectives: ["mobilité", "soulagement"],
        poses: [
          {
            name: "Ouvertures progressives",
            duration: 600,
            instructions: "Étapes.",
          },
          { name: "Relaxation", duration: 300, instructions: "Repos." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Force intense",
        description: "Yoga intensif pour la force et l'endurance",
        duration: 40,
        level: "advanced",
        type: "vinyasa",
        free: false,
        objectives: ["renforcement", "énergie"],
        poses: [
          { name: "Enchaînement", duration: 900, instructions: "Puissant." },
          { name: "Repos", duration: 300, instructions: "Récupération." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Récupération post-accouchement",
        description: "Retrouvez votre corps après l'accouchement",
        duration: 22,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["renforcement", "récupération"],
        poses: [
          {
            name: "Doux mouvements",
            duration: 300,
            instructions: "Récupération.",
          },
          { name: "Respiration", duration: 300, instructions: "Calme." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Préparation à la grossesse",
        description: "Préparez votre corps à la grossesse",
        duration: 24,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["mobilité", "préparation"],
        poses: [
          { name: "Adaptations", duration: 300, instructions: "Sécurité." },
          { name: "Respiration", duration: 300, instructions: "Préparation." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Acro - Duo connecté",
        description: "Yoga en duo - amusant et connecteur",
        duration: 35,
        level: "intermediate",
        type: "flow",
        free: false,
        objectives: ["renforcement", "connexion"],
        poses: [
          { name: "Partenariat", duration: 600, instructions: "Ensemble." },
          { name: "Poses duos", duration: 600, instructions: "Confiance." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Alignement mural",
        description: "Utilisez le mur pour des poses mieux alignées",
        duration: 26,
        level: "intermediate",
        type: "hatha",
        free: true,
        objectives: ["alignement", "force"],
        poses: [
          { name: "Appuis muraux", duration: 600, instructions: "Support." },
          { name: "Étirements", duration: 300, instructions: "Ouverture." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Postures assises",
        description: "Pratique complète depuis une chaise",
        duration: 17,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["mobilité", "accessibilité"],
        poses: [
          { name: "Assis", duration: 300, instructions: "Accessible." },
          { name: "Étirements", duration: 300, instructions: "Flexibilité." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Force des pieds",
        description: "Renforcez et étirez vos pieds et chevilles",
        duration: 13,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["mobilité", "force"],
        poses: [
          { name: "Mobilité", duration: 300, instructions: "Souplesse." },
          { name: "Renforcement", duration: 300, instructions: "Force." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Mobilité des poignets",
        description: "Protégez vos poignets et améliorez la mobilité",
        duration: 11,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["mobilité", "prévention"],
        poses: [
          { name: "Rotations", duration: 300, instructions: "Mobilité." },
          { name: "Renforcement", duration: 300, instructions: "Stabilité." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Force des mains",
        description: "Renforcement et détente des mains et bras",
        duration: 14,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["force", "flexibilité"],
        poses: [
          { name: "Mobilité main", duration: 300, instructions: "Souplesse." },
          { name: "Force bras", duration: 300, instructions: "Renforcement." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Relief articulaire",
        description: "Pratique douce pour soulager les articulations",
        duration: 23,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["soulagement", "mobilité"],
        poses: [
          {
            name: "Mouvements doux",
            duration: 600,
            instructions: "Progressif.",
          },
          { name: "Relaxation", duration: 300, instructions: "Soulagement." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Relief migraines",
        description: "Techniques pour prévenir et soulager les migraines",
        duration: 19,
        level: "beginner",
        type: "yin",
        free: true,
        objectives: ["soulagement", "prévention"],
        poses: [
          { name: "Inversions douces", duration: 400, instructions: "Relief." },
          { name: "Relaxation", duration: 400, instructions: "Repos." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Stimulation digestive",
        description: "Stimulez votre système digestif avec le yoga",
        duration: 16,
        level: "beginner",
        type: "hatha",
        free: true,
        objectives: ["digestion", "santé"],
        poses: [
          { name: "Torsions", duration: 300, instructions: "Stimulation." },
          { name: "Flexions", duration: 300, instructions: "Activation." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Boost immunitaire",
        description: "Booste ton système immunitaire",
        duration: 27,
        level: "intermediate",
        type: "flow",
        free: true,
        objectives: ["santé", "énergie"],
        poses: [
          { name: "Dynamique", duration: 600, instructions: "Activation." },
          { name: "Respiration", duration: 300, instructions: "Immunité." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Libération émotionnelle",
        description: "Libérez vos émotions et trouvez l'équilibre",
        duration: 32,
        level: "intermediate",
        type: "hatha",
        free: true,
        objectives: ["émotions", "bien-être"],
        poses: [
          {
            name: "Poses ouvertes",
            duration: 600,
            instructions: "Libération.",
          },
          { name: "Récupération", duration: 300, instructions: "Intégration." },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Rire et joie",
        description: "Yoga ludique pour le bien-être et la joie",
        duration: 21,
        level: "beginner",
        type: "flow",
        free: true,
        objectives: ["joie", "bien-être"],
        poses: [
          {
            name: "Exercices du rire",
            duration: 300,
            instructions: "Amusant.",
          },
          { name: "Respiration", duration: 300, instructions: "Joie." },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("sessions", JSON.stringify(sampleSessions));
    console.log("Sample sessions initialized");
  }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-primary);
        border: 2px solid var(--${type === "error" ? "error" : type === "success" ? "success" : "accent"});
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Hero background slideshow
const heroImages = [
  "img/y1.jpg",
  "img/y2.jpg",
  "img/y3.jpg",
  "img/y4.jpg",
  "img/y5.jpg",
  "img/y6.jpg",
  "img/y7.jpg",
  "img/y8.jpg",
  "img/y9.jpg",
  "img/y10.jpg",
  "img/y11.jpg",
  "img/y12.jpg",
  "img/y13.jpg",
  "img/y14.jpg",
  "img/y15.jpg",
  "img/y16.jpg",
  "img/y17.jpg",
  "img/y18.jpg",
  "img/y19.jpg",
  "img/y20.jpg",
  "img/y21.jpg",
  "img/y22.jpg",
];

let currentImageIndex = 0;
const hero = document.querySelector(".hero");

function changeHeroBackground() {
  if (hero) {
    hero.style.backgroundImage = `url('${heroImages[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
  }
}

// Hero background slideshow with fade
let currentBgIndex = 0;
const heroBg1 = document.getElementById("hero-bg1");
const heroBg2 = document.getElementById("hero-bg2");

function changeHeroBackground() {
  const nextImage = heroImages[currentImageIndex];
  const currentBg = currentBgIndex === 0 ? heroBg1 : heroBg2;
  const nextBg = currentBgIndex === 0 ? heroBg2 : heroBg1;

  // Set the next image on the hidden bg
  nextBg.style.backgroundImage = `url('${nextImage}')`;
  nextBg.style.opacity = "1";

  // Fade out the current bg
  setTimeout(() => {
    currentBg.style.opacity = "0";
  }, 100); // Small delay to start fade

  currentBgIndex = 1 - currentBgIndex;
  currentImageIndex = (currentImageIndex + 1) % heroImages.length;
}

// Start slideshow, change every 10 seconds
setInterval(changeHeroBackground, 10000);

// Initial background
if (heroBg1) {
  heroBg1.style.backgroundImage = `url('${heroImages[0]}')`;
  heroBg1.style.opacity = "1";
}

// Navbar message rotation
const navbarMessage = document.getElementById("navbar-message");
let messages = [];

function loadNavbarMessages() {
  const lang = getCurrentLanguage();
  if (
    TRANSLATIONS[lang] &&
    TRANSLATIONS[lang].navbar &&
    TRANSLATIONS[lang].navbar.messages
  ) {
    messages = TRANSLATIONS[lang].navbar.messages.map((text) => ({
      text,
      duration: 5000,
    }));
  } else {
    // Fallback
    messages = [
      {
        text: "5 minutes de yoga par jour, 100% en ligne et à ton rythme",
        duration: 5000,
      },
      {
        text: "Accède à ton espace yoga personnel, sans coach, où tu veux, quand tu veux.",
        duration: 5000,
      },
      {
        text: "Yoga en ligne par abonnement, simple et autonome",
        duration: 5000,
      },
      {
        text: "Une plateforme de yoga en ligne, accessible 24h/24",
        duration: 5000,
      },
      {
        text: "Une nouvelle façon de pratiquer le yoga : simple, digitale et libre",
        duration: 5000,
      },
      {
        text: "La plateforme de yoga en ligne, pensée pour ton autonomie",
        duration: 5000,
      },
    ];
  }
}

let currentMessageIndex = 0;
let messageInterval;

function rotateMessage() {
  if (navbarMessage && messages.length > 0) {
    navbarMessage.textContent = messages[currentMessageIndex].text;
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
  }
}

function startMessageRotation() {
  if (messageInterval) {
    clearInterval(messageInterval);
  }
  messageInterval = setInterval(rotateMessage, 5000);
}

function setupStickyNavbar() {
  const navbar = document.getElementById("mainNavbar");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li a");

  if (!navbar) {
    return;
  }

  const updateNavbarState = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState);

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-active");
        burger.classList.remove("toggle");
      });
    });
  }
}

// Load initial messages and start rotation
loadNavbarMessages();
startMessageRotation();
setupStickyNavbar();

// Listen for language change
document.addEventListener("languageChanged", (e) => {
  loadNavbarMessages();
  currentMessageIndex = 0; // Reset to first message
  rotateMessage(); // Show first message immediately
  startMessageRotation(); // Restart interval
});
