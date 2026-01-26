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

  // Setup event listeners
  setupEventListeners();

  // Initial render
  renderSessions(allSessions);
  updateResultsCount(allSessions.length);
}

/* ========================================
   LOAD SESSIONS
   ======================================== */

function loadSessions() {
  const sessions = localStorage.getItem("sessions");

  if (sessions) {
    allSessions = JSON.parse(sessions);
    filteredSessions = [...allSessions];
  } else {
    console.error("Aucune séance trouvée dans localStorage");
    allSessions = [];
    filteredSessions = [];
  }
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
    grid.style.display = "grid";
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

function createSessionCard(session) {
  const levelText =
    session.level === "beginner"
      ? "Débutant"
      : session.level === "intermediate"
        ? "Intermédiaire"
        : "Avancé";

  const premiumBadge = session.isPremium
    ? '<span class="premium-badge-card">Premium</span>'
    : "";

  const goalsHTML = session.goals
    ? session.goals
        .map((goal) => `<span class="session-goal-chip">${goal}</span>`)
        .join("")
    : "";

  return `
    <div id="session-${session.id}" class="session-card-full">
      <div class="session-card-header">
        <div class="session-icon">🧘‍♀️</div>
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
          <span class="session-level-badge ${session.level}">${levelText}</span>
          ${premiumBadge}
        </div>
        <h3 class="session-card-title">${session.title}</h3>
        <p class="session-card-description">${session.description}</p>
        ${goalsHTML ? `<div class="session-goals">${goalsHTML}</div>` : ""}
      </div>
      <div class="session-card-footer">
        <button class="session-card-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
          Commencer
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
