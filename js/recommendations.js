/* ========================================
   RECOMMENDATIONS - RECOMMANDATIONS INTELLIGENTES
   ======================================== */

function getRecommendedSessions(allSessions) {
  const progressData = JSON.parse(localStorage.getItem("progress")) || {
    completedSessions: [],
  };
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  // Sessions complétées récemment
  const lastSessions = progressData.completedSessions
    .slice(-5)
    .map((s) => s.id);

  // Filtrer et scorer les sessions
  return allSessions
    .filter((s) => !lastSessions.includes(s.id))
    .map((session) => {
      let score = 0;

      // 1. Priorité au niveau actuel
      if (user && session.level === user.level) {
        score += 3;
      } else if (session.level === "beginner") {
        score += 1;
      }

      // 2. Bonus pour diversité d'objectifs
      if (session.objectives && session.objectives.includes("mobilité")) {
        score += 2;
      }
      if (session.objectives && session.objectives.includes("détente")) {
        score += 1;
      }

      // 3. Bonus pour sessions courtes
      if (session.duration <= 15) {
        score += 1;
      }

      return { ...session, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...session }) => session);
}

function renderRecommendations() {
  const container = document.getElementById("recommended-sessions");
  if (!container) return;

  const allSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const recommended = getRecommendedSessions(allSessions);

  container.innerHTML = recommended
    .map((session) => {
      const levelText =
        session.level === "beginner"
          ? "Débutant"
          : session.level === "intermediate"
            ? "Intermédiaire"
            : "Avancé";

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
        <div class="session-card recommendation-card" data-level="${session.level}" data-session-id="${session.id}">
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
              <span class="session-level-badge ${session.level}">${levelText}</span>
            </div>
            <h3 class="session-card-title" data-i18n="sessions.cards.session_${session.id}.title">${session.title}</h3>
            <p class="session-card-description" data-i18n="sessions.cards.session_${session.id}.description">${session.description}</p>
          </div>
          <div class="session-card-footer">
            <button class="session-card-button recommendation-button" onclick="startRecommendedSession('${session.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
              </svg>
              Commencer
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  // Add click listeners
  document.querySelectorAll(".recommendation-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
}

function startRecommendedSession(sessionId) {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  window.location.href = `session-player.html?id=${sessionId}`;
}
