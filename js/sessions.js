/* ========================================
   SESSIONS PAGE - JAVASCRIPT
   ======================================== */

let allSessions = [];
let filteredSessions = [];

document.addEventListener("DOMContentLoaded", () => {
  initializeSessionsPage();
});

function initializeSessionsPage() {
  // Load sessions from localStorage
  loadSessions();

  // Mettre à jour l'affichage du logout dans la navbar
  updateNavbarAuth();

  // Setup event listeners
  setupEventListeners();

  const grid = document.getElementById("sessions-grid");
  const hasGrid = !!grid;

  // S'assurer que les traductions de sessions sont initialisées
  // Attendre que window.i18n et les traductions soient disponibles
  let waitAttempts = 0;
  const maxWaitAttempts = 40; // 40 * 50ms = 2 secondes max

  function waitForTranslationsAndRender() {
    waitAttempts++;

    const translationsReady =
      window.i18n &&
      window.i18n.translations &&
      window.i18n.translations.fr &&
      window.i18n.translations.fr.sessions &&
      window.i18n.translations.fr.sessions.cards &&
      window.i18n.translations.fr.sessions.cards.session_41;

    if (translationsReady) {
      console.log("✅ Traductions de sessions chargées, rendu des cartes...");
      if (hasGrid) {
        renderSessions(allSessions);
      }
      updateResultsCount(allSessions.length);
      updateLevelCounts(allSessions);
    } else if (waitAttempts >= maxWaitAttempts) {
      console.warn("⚠️ Timeout: rendu des cartes sans traductions complètes");
      if (hasGrid) {
        renderSessions(allSessions);
      }
      updateResultsCount(allSessions.length);
      updateLevelCounts(allSessions);
    } else {
      console.log(
        `⏳ En attente des traductions... (${waitAttempts}/${maxWaitAttempts})`,
      );
      setTimeout(waitForTranslationsAndRender, 50);
    }
  }

  waitForTranslationsAndRender();

  document.addEventListener("languageChanged", () => {
    updateLevelCounts(allSessions);
  });
}

function updateNavbarAuth() {
  const logoutBtn = document.getElementById("logout-btn");
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (logoutBtn) {
    if (userId) {
      logoutBtn.classList.remove("hidden");
    } else {
      logoutBtn.classList.add("hidden");
    }
  }
}

/* ========================================
   LOAD SESSIONS
   ======================================== */

function loadSessions() {
  const sessions = localStorage.getItem("sessions");

  if (sessions) {
    allSessions = JSON.parse(sessions);

    // Ajouter les sessions supplémentaires si pas déjà présentes
    addExtraSessions();

    allSessions = allSessions.filter((session) =>
      /^[0-9]+$/.test(String(session.id)),
    );

    // Vérifier si l'utilisateur est connecté
    const userId =
      sessionStorage.getItem("userId") || localStorage.getItem("userId");
    const isLoggedIn = !!userId;

    // Si non connecté, limiter à 15% des sessions (environ 5 sessions sur 30)
    if (!isLoggedIn) {
      const limitedCount = Math.ceil(allSessions.length * 0.15);
      allSessions = allSessions.slice(0, limitedCount);
    }

    filteredSessions = [...allSessions];
  } else {
    console.error("Aucune séance trouvée dans localStorage");
    allSessions = [];
    filteredSessions = [];
  }
}

function addExtraSessions() {
  const existingIds = new Set(allSessions.map((s) => s.id));

  const extraSessions = [
    /* ================= DÉBUTANT ================= */
    {
      id: 41,
      title: "Étirements matinaux doux",
      description: "Réveillez votre corps en douceur",
      level: "beginner",
      duration: 10,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 42,
      title: "Yoga respiration profonde",
      description: "Techniques respiratoires apaisantes",
      level: "beginner",
      duration: 8,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 43,
      title: "Yoga anti-stress",
      description: "Techniques pour réduire le stress",
      level: "beginner",
      duration: 15,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 44,
      title: "Mobilité hanches débutant",
      description: "Assouplir les hanches en douceur",
      level: "beginner",
      duration: 12,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 45,
      title: "Yoga dos sensible",
      description: "Soulager et renforcer le dos",
      level: "beginner",
      duration: 20,
      type: "hatha",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 46,
      title: "Yoga du soir relaxant",
      description: "Préparation au sommeil réparateur",
      level: "beginner",
      duration: 15,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 47,
      title: "Flow lent débutant",
      description: "Enchaînement doux et fluide",
      level: "beginner",
      duration: 18,
      type: "flow",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 48,
      title: "Yoga posture de base",
      description: "Apprentissage des postures fondamentales",
      level: "beginner",
      duration: 20,
      type: "hatha",
      free: true,
      objectives: ["énergie"],
    },
    {
      id: 49,
      title: "Souplesse jambes débutant",
      description: "Étirements et flexibilité des jambes",
      level: "beginner",
      duration: 15,
      type: "yin",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 50,
      title: "Yoga détente express",
      description: "Relaxation courte et efficace",
      level: "beginner",
      duration: 5,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 71,
      title: "Réveil articulaire doux",
      description: "Mobiliser tout le corps sans effort",
      level: "beginner",
      duration: 8,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 72,
      title: "Yoga respiration carré",
      description: "Respiration guidée pour calmer l'esprit",
      level: "beginner",
      duration: 6,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 73,
      title: "Souplesse du dos débutant",
      description: "Déverrouiller la colonne en douceur",
      level: "beginner",
      duration: 12,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 74,
      title: "Flow débutant posture debout",
      description: "Bases des postures debout en flow",
      level: "beginner",
      duration: 15,
      type: "flow",
      free: true,
      objectives: ["énergie"],
    },
    {
      id: 75,
      title: "Yoga hanches ouvertures",
      description: "Ouvrir les hanches sans forcer",
      level: "beginner",
      duration: 14,
      type: "yin",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 76,
      title: "Relaxation guidée débutant",
      description: "Relâcher le corps et le mental",
      level: "beginner",
      duration: 10,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 77,
      title: "Mobilité épaules facile",
      description: "Assouplir la ceinture scapulaire",
      level: "beginner",
      duration: 9,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 78,
      title: "Étirements du soir",
      description: "Étirements lents pour mieux dormir",
      level: "beginner",
      duration: 12,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 79,
      title: "Yoga équilibre simple",
      description: "Stabilité et confiance en douceur",
      level: "beginner",
      duration: 13,
      type: "hatha",
      free: true,
      objectives: ["renforcement"],
    },
    {
      id: 80,
      title: "Flow matin vitalité",
      description: "Réactiver l'énergie au réveil",
      level: "beginner",
      duration: 10,
      type: "flow",
      free: true,
      objectives: ["énergie"],
    },
    {
      id: 81,
      title: "Yoga jambes légères",
      description: "Détendre et alléger les jambes",
      level: "beginner",
      duration: 11,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 82,
      title: "Hatha débutant complet",
      description: "Pratique complète, lente et sécurisée",
      level: "beginner",
      duration: 20,
      type: "hatha",
      free: true,
      objectives: ["renforcement"],
    },
    {
      id: 83,
      title: "Respiration profonde + étirements",
      description: "Allonger le souffle et relâcher",
      level: "beginner",
      duration: 8,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 84,
      title: "Yin doux pour débuter",
      description: "Tenues confortables et apaisantes",
      level: "beginner",
      duration: 16,
      type: "yin",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 85,
      title: "Yoga pause bureau",
      description: "Décontraction rapide après écran",
      level: "beginner",
      duration: 7,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },

    /* ================= INTERMÉDIAIRE ================= */
    {
      id: 51,
      title: "Vinyasa énergie",
      description: "Flow dynamique pour l'énergie",
      level: "intermediate",
      duration: 25,
      type: "vinyasa",
      free: false,
      objectives: ["énergie"],
    },
    {
      id: 52,
      title: "Renforcement centre du corps",
      description: "Renforcer les abdominaux et le core",
      level: "intermediate",
      duration: 20,
      type: "flow",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 53,
      title: "Yoga mobilité épaules",
      description: "Ouvrir et mobiliser les épaules",
      level: "intermediate",
      duration: 18,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 54,
      title: "Flow équilibre",
      description: "Travail de l'équilibre et de la stabilité",
      level: "intermediate",
      duration: 22,
      type: "flow",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 55,
      title: "Vinyasa fluide",
      description: "Enchaînement fluide et harmonieux",
      level: "intermediate",
      duration: 30,
      type: "vinyasa",
      free: false,
      objectives: ["énergie"],
    },
    {
      id: 56,
      title: "Yoga force douce",
      description: "Renforcement progressif et en douceur",
      level: "intermediate",
      duration: 25,
      type: "hatha",
      free: true,
      objectives: ["renforcement"],
    },
    {
      id: 57,
      title: "Flow cardio léger",
      description: "Cardio sans impact avec le yoga",
      level: "intermediate",
      duration: 20,
      type: "flow",
      free: true,
      objectives: ["énergie"],
    },
    {
      id: 58,
      title: "Yoga mobilité globale",
      description: "Mobilité complète du corps",
      level: "intermediate",
      duration: 30,
      type: "hatha",
      free: true,
      objectives: ["mobilité"],
    },
    {
      id: 59,
      title: "Vinyasa respiration",
      description: "Synchronisation respiration-mouvements",
      level: "intermediate",
      duration: 18,
      type: "vinyasa",
      free: true,
      objectives: ["détente"],
    },
    {
      id: 60,
      title: "Flow endurance",
      description: "Construire votre endurance",
      level: "intermediate",
      duration: 35,
      type: "flow",
      free: false,
      objectives: ["renforcement"],
    },

    /* ================= AVANCÉ ================= */
    {
      id: 61,
      title: "Vinyasa intense",
      description: "Flow puissant et exigeant",
      level: "advanced",
      duration: 45,
      type: "vinyasa",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 62,
      title: "Flow force complète",
      description: "Renforcement complet du corps",
      level: "advanced",
      duration: 40,
      type: "flow",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 63,
      title: "Yoga équilibre avancé",
      description: "Poses d'équilibre complexes",
      level: "advanced",
      duration: 30,
      type: "hatha",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 64,
      title: "Vinyasa cardio",
      description: "Vinyasa avec cardio intensif",
      level: "advanced",
      duration: 35,
      type: "vinyasa",
      free: false,
      objectives: ["énergie"],
    },
    {
      id: 65,
      title: "Flow explosif",
      description: "Flow puissant et explosif",
      level: "advanced",
      duration: 45,
      type: "flow",
      free: false,
      objectives: ["énergie"],
    },
    {
      id: 66,
      title: "Yoga force bras",
      description: "Renforcement intensif des bras",
      level: "advanced",
      duration: 30,
      type: "hatha",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 67,
      title: "Vinyasa avancé long",
      description: "Vinyasa complet d'une heure",
      level: "advanced",
      duration: 60,
      type: "vinyasa",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 68,
      title: "Flow endurance avancé",
      description: "Test d'endurance ultime",
      level: "advanced",
      duration: 50,
      type: "flow",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 69,
      title: "Yoga puissance jambes",
      description: "Renforcement intensif des jambes",
      level: "advanced",
      duration: 35,
      type: "hatha",
      free: false,
      objectives: ["renforcement"],
    },
    {
      id: 70,
      title: "Flow maîtrise totale",
      description: "Maîtrise totale du flow",
      level: "advanced",
      duration: 45,
      type: "flow",
      free: false,
      objectives: ["énergie"],
    },
  ];

  // Ajouter les sessions supplémentaires si elles n'existent pas
  extraSessions.forEach((session) => {
    if (!existingIds.has(session.id)) {
      session.createdAt = new Date().toISOString();
      allSessions.push(session);
    }
  });

  // Mettre à jour localStorage
  localStorage.setItem("sessions", JSON.stringify(allSessions));
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById("search-input");
  const levelFilter = document.getElementById("level-filter");
  const durationFilter = document.getElementById("duration-filter");
  const typeFilter = document.getElementById("type-filter");
  const goalFilter = document.getElementById("goal-filter");
  const resetButton = document.getElementById("reset-filters");

  if (
    !searchInput ||
    !levelFilter ||
    !durationFilter ||
    !typeFilter ||
    !goalFilter ||
    !resetButton
  ) {
    return;
  }

  searchInput.addEventListener("input", debounce(handleFiltersChange, 300));

  levelFilter.addEventListener("change", handleFiltersChange);
  durationFilter.addEventListener("change", handleFiltersChange);
  typeFilter.addEventListener("change", handleFiltersChange);
  goalFilter.addEventListener("change", handleFiltersChange);

  resetButton.addEventListener("click", resetFilters);
}

/* ========================================
   FILTER LOGIC
   ======================================== */

function handleFiltersChange() {
  const searchInput = document.getElementById("search-input");
  const levelFilter = document.getElementById("level-filter");
  const durationFilter = document.getElementById("duration-filter");
  const typeFilter = document.getElementById("type-filter");
  const goalFilter = document.getElementById("goal-filter");

  if (
    !searchInput ||
    !levelFilter ||
    !durationFilter ||
    !typeFilter ||
    !goalFilter
  ) {
    return;
  }

  const filters = {
    search: searchInput.value.toLowerCase(),
    level: levelFilter.value,
    duration: durationFilter.value,
    type: typeFilter.value,
    goal: goalFilter.value,
  };

  filteredSessions = filterSessions(filters);
  renderSessions(filteredSessions);
  updateResultsCount(filteredSessions.length);

  // Show/hide empty state
  const emptyState = document.getElementById("empty-state");
  const grid = document.getElementById("sessions-grid");

  if (emptyState && grid) {
    if (filteredSessions.length === 0) {
      grid.style.display = "none";
      emptyState.classList.remove("hidden");
    } else {
      grid.style.display = "grid";
      emptyState.classList.add("hidden");
    }
  }
}

function filterSessions(filters) {
  return allSessions.filter((session) => {
    // Search filter (title + description)
    if (filters.search) {
      const searchText = filters.search;
      const titleMatch = session.title.toLowerCase().includes(searchText);
      const descMatch = session.description.toLowerCase().includes(searchText);
      if (!titleMatch && !descMatch) return false;
    }

    // Level filter
    if (filters.level && session.level !== filters.level) {
      return false;
    }

    // Duration filter
    if (filters.duration) {
      const duration = session.duration;
      switch (filters.duration) {
        case "5-10":
          if (duration < 5 || duration > 10) return false;
          break;
        case "10-20":
          if (duration < 10 || duration > 20) return false;
          break;
        case "20-45":
          if (duration < 20 || duration > 45) return false;
          break;
        case "45+":
          if (duration < 45) return false;
          break;
      }
    }

    // Type filter
    if (filters.type && session.type !== filters.type) {
      return false;
    }

    // Goal filter
    if (filters.goal) {
      if (!session.goals || !session.goals.includes(filters.goal)) {
        return false;
      }
    }

    return true;
  });
}

function resetFilters() {
  document.getElementById("search-input").value = "";
  document.getElementById("level-filter").value = "";
  document.getElementById("duration-filter").value = "";
  document.getElementById("type-filter").value = "";
  document.getElementById("goal-filter").value = "";

  handleFiltersChange();
}

/* ========================================
   RENDER SESSIONS
   ======================================== */

function renderSessions(sessions) {
  const grid = document.getElementById("sessions-grid");
  if (!grid) return;

  const levelFromPage = window.SESSIONS_LEVEL || null;
  const filtered = levelFromPage
    ? sessions.filter((session) => session.level === levelFromPage)
    : sessions;

  grid.innerHTML = "";

  if (filtered.length === 0) {
    const emptyState = document.getElementById("empty-state");
    if (emptyState) {
      grid.style.display = "none";
      emptyState.classList.remove("hidden");
    }
    return;
  }

  filtered.forEach((session) => {
    grid.insertAdjacentHTML("beforeend", createSessionCard(session));
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) {
    grid.style.display = "grid";
    emptyState.classList.add("hidden");
  }

  // Forcer l'application des traductions après le rendu
  // Utiliser un délai plus long pour s'assurer que le DOM est mis à jour
  setTimeout(() => {
    if (window.i18n && window.i18n.applyTranslations) {
      window.i18n.applyTranslations();
      console.log("✅ Traductions appliquées aux cartes de session");
    }
  }, 100);

  // Ajouter la carte de connexion si non connecté
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const isLoggedIn = !!userId;

  if (!isLoggedIn) {
    const loginCard = `
      <div class="session-card-full login-prompt-card">
        <div class="session-card-body" style="padding: 3rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
          <h3 class="session-card-title" data-i18n="sessions.loginPrompt.title">Accédez à toutes les séances</h3>
          <p class="session-card-description" style="margin-bottom: 1.5rem;" data-i18n="sessions.loginPrompt.description">
            Connectez-vous pour débloquer l'accès à toutes les séances disponibles
          </p>
          <a href="login.html" class="session-card-button" style="display: inline-block; text-decoration: none;" data-i18n="sessions.loginPrompt.button">
            Se connecter
          </a>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML("beforeend", loginCard);
  }

  // Add click listeners to cards
  filtered.forEach((session) => {
    const card = document.getElementById(`session-${session.id}`);
    if (card) {
      card.addEventListener("click", () => {
        // Check if user is logged in
        const userId =
          sessionStorage.getItem("userId") || localStorage.getItem("userId");

        if (!userId) {
          // Redirect to login
          window.location.href = "login.html";
          return;
        }

        // Check if premium session and user is not premium
        if (session.isPremium && !isPremiumUser(userId)) {
          alert(
            "Cette séance est réservée aux membres Premium.\n\nPassez à Premium pour accéder à toutes les séances exclusives !",
          );
          return;
        }

        // Redirect to session player
        window.location.href = `session-player.html?id=${session.id}`;
      });
    }
  });
}

function createSessionCard(session) {
  // Générer une clé unique pour la session (pour i18n)
  const sessionKey = `sessions.cards.session_${session.id}`;

  // Texte du badge (sera traduit automatiquement via i18n)
  const badgei18nKey = `sessions.level.${session.level}`;
  const badgeText =
    session.level === "beginner"
      ? "Débutant"
      : session.level === "intermediate"
        ? "Intermédiaire"
        : "Avancé";

  const premiumBadge = session.isPremium
    ? '<span class="premium-badge-card">Premium</span>'
    : "";

  const goalMap = {
    detente: "relaxation",
    mobilite: "mobilite",
    renforcement: "renforcement",
    energie: "energie",
    soulagement: "mobilite",
  };

  const goalsHTML = session.objectives
    ? session.objectives
        .map((goal, index) => {
          const normalizedGoal = String(goal)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          const goalKey = goalMap[normalizedGoal];

          if (!goalKey) return "";

          const chipClass =
            index === 0
              ? "session-goal-chip session-goal-chip-1"
              : index === 1
                ? "session-goal-chip session-goal-chip-2"
                : "session-goal-chip";

          return `
          <span 
            class="${chipClass}"
            data-i18n="sessions.goals.${goalKey}"
          >
            ${goal}
          </span>
        `;
        })
        .join("")
    : "";

  // Emoji par type de séance
  const iconMap = {
    hatha: "🕉️",
    vinyasa: "🌊",
    yin: "🌙",
    flow: "💨",
    pilates: "💪",
    pranayama: "🌬️",
    meditation: "🧠",
    restoration: "🌿",
    power: "⚡",
    acro: "🤝",
  };

  const sessionIcon = iconMap[session.type] || "🧘‍♀️";

  return `
    <div id="session-${session.id}" class="session-card-full session-card" data-level="${session.level}">
      <div class="session-card-header">
        <div class="session-icon">${sessionIcon}</div>
        <div class="session-duration">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${session.duration} min
        </div>
      </div>
      <div class="session-card-body">
        <div class="session-badge-container">
          <span 
            class="session-level-badge ${session.level}"
            data-i18n="${badgei18nKey}"
          >
            ${badgeText}
          </span>
          ${premiumBadge}
        </div>
        <h3 
          class="session-card-title"
          data-i18n="${sessionKey}.title"
        >
          ${session.title}
        </h3>
        <p 
          class="session-card-description"
          data-i18n="${sessionKey}.description"
        >
          ${session.description}
        </p>
        ${goalsHTML ? `<div class="session-goals">${goalsHTML}</div>` : ""}
      </div>
      <div class="session-card-footer">
        <button class="session-card-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
          <span class="button-text" data-i18n="sessions.actions.start">Commencer</span>
        </button>
      </div>
    </div>
  `;
}

/* ========================================
   HELPER FUNCTIONS
   ======================================== */

function updateResultsCount(count) {
  const resultsCount = document.getElementById("results-count");
  const totalCount = allSessions.length;

  if (!resultsCount) return;

  if (count === totalCount) {
    resultsCount.textContent = `${totalCount} séance${totalCount > 1 ? "s" : ""} disponible${totalCount > 1 ? "s" : ""}`;
  } else {
    resultsCount.textContent = `${count} séance${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""} sur ${totalCount}`;
  }
}

function getCurrentLanguage() {
  return (
    window.i18n?.currentLanguage ||
    localStorage.getItem("site_language") ||
    document.documentElement.lang ||
    "fr"
  );
}

function getLevelCountLabel(lang, count) {
  const labels = window.i18n?.translations?.[lang]?.sessions?.level?.count;
  if (labels) {
    return count === 1 ? labels.one : labels.many;
  }

  const fallback = {
    fr: { one: "séance", many: "séances" },
    en: { one: "session", many: "sessions" },
    sr: { one: "sesija", many: "sesije" },
  };

  const resolved = fallback[lang] || fallback.fr;
  return count === 1 ? resolved.one : resolved.many;
}

function updateLevelCounts(sessions) {
  handleAdvancedUnlock();

  const countElements = document.querySelectorAll(".level-count");
  if (!countElements.length) return;

  const counts = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };

  sessions.forEach((session) => {
    if (counts[session.level] !== undefined) {
      counts[session.level] += 1;
    }
  });

  const lang = getCurrentLanguage();

  countElements.forEach((element) => {
    const level = element.dataset.level;
    const count = counts[level] || 0;
    const label = getLevelCountLabel(lang, count);
    element.textContent = `${count} ${label}`;
  });

  updateGamificationUI(sessions);
}

const ADVANCED_UNLOCK_LIMIT = 30;

const LEVEL_GOAL = 10;

function handleAdvancedUnlock() {
  const advancedBox = document.getElementById("advanced-level");
  if (!advancedBox || !advancedBox.classList.contains("locked")) return;

  const history = getUserHistory();
  const totalCompleted = history.filter(
    (entry) => entry.completed !== false,
  ).length;
  const completedSessions = totalCompleted
    ? totalCompleted
    : Number(localStorage.getItem("completedSessions") || 0);

  if (completedSessions < ADVANCED_UNLOCK_LIMIT) return;

  advancedBox.classList.remove("locked");
  advancedBox.classList.add("unlocking");
  advancedBox.textContent = "";

  const link = document.createElement("a");
  link.href = "sessions-advanced.html";
  link.className = "level-box";

  const icon = document.createElement("div");
  icon.className = "level-icon";
  icon.textContent = "⚡";

  const title = document.createElement("h2");
  title.setAttribute("data-i18n", "sessions.level.advanced");
  title.textContent = "Avancé";

  const desc = document.createElement("p");
  desc.setAttribute("data-i18n", "sessions.level.desc.advanced");

  const count = document.createElement("span");
  count.className = "level-count";
  count.dataset.level = "advanced";

  const gamification = buildLevelGamificationElement("advanced");

  link.append(icon, title, desc, count, gamification);
  advancedBox.appendChild(link);

  if (window.i18n && window.i18n.applyTranslations) {
    window.i18n.applyTranslations();
  }

  updateGamificationUI(allSessions);

  setTimeout(() => {
    advancedBox.classList.remove("unlocking");
  }, 1200);
}

function getUserHistory() {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");
  if (!userId) return [];
  return JSON.parse(localStorage.getItem(`${userId}_history`) || "[]");
}

function buildSessionLevelMap(sessions) {
  const map = new Map();
  sessions.forEach((session) => {
    map.set(String(session.id), session.level);
  });
  return map;
}

function getCompletedByLevel(history, levelMap) {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };

  history.forEach((entry) => {
    if (entry.completed === false) return;
    const sessionId = String(entry.sessionId || "");
    const level = levelMap.get(sessionId);
    if (level && counts[level] !== undefined) {
      counts[level] += 1;
    }
  });

  return counts;
}

function getUniqueCompletionDates(history) {
  const dates = new Set();
  history.forEach((entry) => {
    if (entry.completed === false || !entry.date) return;
    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) return;
    dates.add(date.toISOString().slice(0, 10));
  });
  return dates;
}

function computeStreak(history) {
  const dates = getUniqueCompletionDates(history);
  if (dates.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  const current = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  while (true) {
    const key = current.toISOString().slice(0, 10);
    if (!dates.has(key)) break;
    streak += 1;
    current.setUTCDate(current.getUTCDate() - 1);
  }

  return streak;
}

function getStreakLabel(lang, count) {
  const labels =
    window.i18n?.translations?.[lang]?.sessions?.gamification?.streakLabel;
  if (labels) {
    return count === 1 ? labels.one : labels.many;
  }

  const fallback = {
    fr: { one: "jour", many: "jours" },
    en: { one: "day", many: "days" },
    sr: { one: "dan", many: "dana" },
  };

  const resolved = fallback[lang] || fallback.fr;
  return count === 1 ? resolved.one : resolved.many;
}

function updateGamificationUI(sessions) {
  const blocks = document.querySelectorAll(".level-gamification");
  if (!blocks.length) return;

  const history = getUserHistory();
  const levelMap = buildSessionLevelMap(sessions);
  const completedByLevel = getCompletedByLevel(history, levelMap);
  const streak = computeStreak(history);
  const lang = getCurrentLanguage();
  const completedLabel =
    window.i18n?.translations?.[lang]?.sessions?.gamification?.completed ||
    (lang === "en" ? "completed" : lang === "sr" ? "zavrsene" : "complétées");

  blocks.forEach((block) => {
    const level = block.dataset.level;
    const completed = completedByLevel[level] || 0;
    const percent = Math.min(100, Math.round((completed / LEVEL_GOAL) * 100));

    const bar = block.querySelector(".level-progress-bar");
    if (bar) {
      bar.style.width = `${percent}%`;
    }

    const progressText = block.querySelector(".level-progress-text");
    if (progressText) {
      const sessionLabel = getLevelCountLabel(lang, completed);
      progressText.textContent = `${completed}/${LEVEL_GOAL} ${sessionLabel} ${completedLabel}`;
    }

    const streakText = block.querySelector(".level-streak-text");
    if (streakText) {
      const streakLabel = getStreakLabel(lang, streak);
      streakText.textContent = `🔥 ${streak} ${streakLabel} !`;
    }

    const badgeFirst = block.querySelector('[data-badge="first"]');
    const badgeWeek = block.querySelector('[data-badge="week"]');
    const badgeLevel = block.querySelector('[data-badge="level"]');

    if (badgeFirst && completed >= 1) {
      badgeFirst.classList.add("is-unlocked");
    }
    if (badgeWeek && streak >= 7) {
      badgeWeek.classList.add("is-unlocked");
    }
    if (badgeLevel && completed >= LEVEL_GOAL) {
      badgeLevel.classList.add("is-unlocked");
    }
  });
}

function buildLevelGamificationElement(level) {
  const wrapper = document.createElement("div");
  wrapper.className = "level-gamification";
  wrapper.dataset.level = level;

  const progress = document.createElement("div");
  progress.className = "level-progress";

  const bar = document.createElement("div");
  bar.className = "level-progress-bar";
  bar.style.width = "0%";
  progress.appendChild(bar);

  const progressText = document.createElement("div");
  progressText.className = "level-progress-text";
  progressText.setAttribute("data-i18n", "sessions.gamification.progress");
  progressText.textContent = "0/10 séances complétées";

  const streak = document.createElement("div");
  streak.className = "level-streak";

  const streakBadge = document.createElement("span");
  streakBadge.className = "level-streak-badge";
  streakBadge.textContent = "🔥";

  const streakText = document.createElement("span");
  streakText.className = "level-streak-text";
  streakText.setAttribute("data-i18n", "sessions.gamification.streak");
  streakText.textContent = "0 jours !";

  streak.append(streakBadge, streakText);

  const badges = document.createElement("div");
  badges.className = "level-badges";

  const badgeFirst = document.createElement("span");
  badgeFirst.className = "level-badge";
  badgeFirst.dataset.badge = "first";
  badgeFirst.setAttribute("data-i18n", "sessions.gamification.badges.first");
  badgeFirst.textContent = "Premier jour ✓";

  const badgeWeek = document.createElement("span");
  badgeWeek.className = "level-badge";
  badgeWeek.dataset.badge = "week";
  badgeWeek.setAttribute("data-i18n", "sessions.gamification.badges.week");
  badgeWeek.textContent = "Semaine complète ✓";

  const badgeLevel = document.createElement("span");
  badgeLevel.className = "level-badge";
  badgeLevel.dataset.badge = "level";
  badgeLevel.setAttribute("data-i18n", "sessions.gamification.badges.level");
  badgeLevel.textContent = "Niveau fini ✓";

  badges.append(badgeFirst, badgeWeek, badgeLevel);
  wrapper.append(progress, progressText, streak, badges);

  return wrapper;
}

function isPremiumUser(userId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);
  return user && user.isPremium;
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
