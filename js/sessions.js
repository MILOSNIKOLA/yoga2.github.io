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
      renderSessions(allSessions);
      updateResultsCount(allSessions.length);
    } else if (waitAttempts >= maxWaitAttempts) {
      console.warn("⚠️ Timeout: rendu des cartes sans traductions complètes");
      renderSessions(allSessions);
      updateResultsCount(allSessions.length);
    } else {
      console.log(
        `⏳ En attente des traductions... (${waitAttempts}/${maxWaitAttempts})`,
      );
      setTimeout(waitForTranslationsAndRender, 50);
    }
  }

  waitForTranslationsAndRender();
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
  searchInput.addEventListener("input", debounce(handleFiltersChange, 300));

  // Filter selects
  const levelFilter = document.getElementById("level-filter");
  const durationFilter = document.getElementById("duration-filter");
  const typeFilter = document.getElementById("type-filter");
  const goalFilter = document.getElementById("goal-filter");

  levelFilter.addEventListener("change", handleFiltersChange);
  durationFilter.addEventListener("change", handleFiltersChange);
  typeFilter.addEventListener("change", handleFiltersChange);
  goalFilter.addEventListener("change", handleFiltersChange);

  // Reset filters button
  const resetButton = document.getElementById("reset-filters");
  resetButton.addEventListener("click", resetFilters);
}

/* ========================================
   FILTER LOGIC
   ======================================== */

function handleFiltersChange() {
  const filters = {
    search: document.getElementById("search-input").value.toLowerCase(),
    level: document.getElementById("level-filter").value,
    duration: document.getElementById("duration-filter").value,
    type: document.getElementById("type-filter").value,
    goal: document.getElementById("goal-filter").value,
  };

  filteredSessions = filterSessions(filters);
  renderSessions(filteredSessions);
  updateResultsCount(filteredSessions.length);

  // Show/hide empty state
  const emptyState = document.getElementById("empty-state");
  const grid = document.getElementById("sessions-grid");

  if (filteredSessions.length === 0) {
    grid.style.display = "none";
    emptyState.classList.remove("hidden");
  } else {
    grid.style.display = "block";
    emptyState.classList.add("hidden");
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

  if (sessions.length === 0) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = sessions
    .map((session) => createSessionCard(session))
    .join("");

  groupSessionsByLevel();

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
    grid.innerHTML += loginCard;
  }

  // Add click listeners to cards
  sessions.forEach((session) => {
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

function groupSessionsByLevel() {
  const grid = document.getElementById("sessions-grid");
  const cards = Array.from(grid.querySelectorAll(".session-card"));

  if (!cards.length) return;

  grid.innerHTML = "";

  const levels = [
    { key: "beginner", i18n: "sessions.level.beginner" },
    { key: "intermediate", i18n: "sessions.level.intermediate" },
    { key: "advanced", i18n: "sessions.level.advanced" },
  ];

  levels.forEach((level) => {
    const group = document.createElement("div");
    group.className = "level-group";
    group.dataset.level = level.key;

    const title = document.createElement("h2");
    title.className = "level-title";
    title.setAttribute("data-i18n", level.i18n);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "level-cards";

    cards
      .filter((card) => card.dataset.level === level.key)
      .forEach((card) => cardsContainer.appendChild(card));

    if (cardsContainer.children.length > 0) {
      group.appendChild(title);
      group.appendChild(cardsContainer);
      grid.appendChild(group);
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

  if (count === totalCount) {
    resultsCount.textContent = `${totalCount} séance${totalCount > 1 ? "s" : ""} disponible${totalCount > 1 ? "s" : ""}`;
  } else {
    resultsCount.textContent = `${count} séance${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""} sur ${totalCount}`;
  }
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
