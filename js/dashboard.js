/* ========================================
   DASHBOARD - JAVASCRIPT
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
});

function initializeDashboard() {
  // Check if user is logged in
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  // Load user data
  loadUserData(userId);

  // Load statistics
  loadStats(userId);

  // Load continue practice
  loadContinuePractice(userId);

  // Load recent sessions
  loadRecentSessions(userId);

  // Load week chart
  loadWeekChart(userId);

  // Logout handler
  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("userId");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
  });
}

/* ========================================
   LOAD USER DATA
   ======================================== */

function loadUserData(userId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Welcome message
  const firstName = user.fullName.split(" ")[0];
  document.getElementById("welcome-message").textContent =
    `Bienvenue ${firstName}`;

  // Account info
  document.getElementById("user-email").textContent = user.email;

  // Member since
  const memberSince = new Date(user.createdAt);
  const options = { year: "numeric", month: "long" };
  document.getElementById("member-since").textContent =
    memberSince.toLocaleDateString("fr-FR", options);

  // Premium status
  const premiumBadge = document.getElementById("premium-status");
  if (user.isPremium) {
    premiumBadge.textContent = "Premium";
    premiumBadge.classList.add("premium");
    premiumBadge.classList.remove("free");
  } else {
    premiumBadge.textContent = "Gratuit";
    premiumBadge.classList.add("free");
    premiumBadge.classList.remove("premium");
  }
}

/* ========================================
   LOAD STATISTICS
   ======================================== */

function loadStats(userId) {
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history.filter((h) => h.userId === userId);

  // Total sessions
  const totalSessions = userHistory.length;
  document.getElementById("total-sessions").textContent = totalSessions;

  // Total minutes
  const totalMinutes = userHistory.reduce((sum, h) => sum + h.duration, 0);
  document.getElementById("total-minutes").textContent = totalMinutes;

  // Current streak
  const streak = calculateStreak(userHistory);
  document.getElementById("current-streak").textContent = streak;

  // This week
  const thisWeek = getThisWeekCount(userHistory);
  document.getElementById("this-week").textContent = thisWeek;

  // User level
  const level = calculateUserLevel(totalSessions);
  document.getElementById("user-level").textContent = level;

  // Update streak message
  updateStreakMessage(streak, totalSessions);
}

function calculateStreak(history) {
  if (history.length === 0) return 0;

  // Sort by date, most recent first
  const sorted = [...history].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  for (const session of sorted) {
    const sessionDate = new Date(session.completedAt);
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (checkDate - sessionDate) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      checkDate = new Date(sessionDate);
    } else {
      break;
    }
  }

  return streak;
}

function getThisWeekCount(history) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  return history.filter((h) => {
    const sessionDate = new Date(h.completedAt);
    return sessionDate >= weekStart;
  }).length;
}

function calculateUserLevel(totalSessions) {
  if (totalSessions < 10) return "Débutant";
  if (totalSessions < 30) return "Intermédiaire";
  return "Avancé";
}

function updateStreakMessage(streak, totalSessions) {
  const streakMessage = document.getElementById("streak-message");
  const streakTitle = streakMessage.querySelector(".streak-title");
  const streakDesc = streakMessage.querySelector(".streak-desc");

  if (totalSessions === 0) {
    streakTitle.textContent = "Prêt à commencer ?";
    streakDesc.textContent = "Votre première séance vous attend.";
  } else if (streak === 0) {
    streakTitle.textContent = "Revenez quand vous voulez";
    streakDesc.textContent = "Il n'y a pas de mauvais moment pour reprendre.";
  } else if (streak === 1) {
    streakTitle.textContent = "Vous avez commencé !";
    streakDesc.textContent = "Chaque séance est une victoire.";
  } else if (streak < 7) {
    streakTitle.textContent = "Continuez à votre rythme";
    streakDesc.textContent = `${streak} jours de pratique, c'est déjà magnifique.`;
  } else {
    streakTitle.textContent = "Quelle régularité !";
    streakDesc.textContent = `${streak} jours consécutifs, vous inspirez le respect.`;
  }
}

/* ========================================
   LOAD CONTINUE PRACTICE
   ======================================== */

function loadContinuePractice(userId) {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history.filter((h) => h.userId === userId);

  const container = document.getElementById("continue-practice");

  // Get a suggested session (random or based on level)
  const availableSessions = sessions.filter(
    (s) => !s.isPremium || isPremiumUser(userId),
  );

  if (availableSessions.length === 0) {
    container.innerHTML = `
      <div class="empty-message">
        Aucune séance disponible pour le moment
      </div>
    `;
    return;
  }

  // Choose a session (preferably one not done recently)
  const recentSessionIds = userHistory.slice(0, 5).map((h) => h.sessionId);
  let suggestedSession = availableSessions.find(
    (s) => !recentSessionIds.includes(s.id),
  );

  if (!suggestedSession) {
    suggestedSession =
      availableSessions[Math.floor(Math.random() * availableSessions.length)];
  }

  const levelClass = suggestedSession.level;
  const levelText =
    levelClass === "beginner"
      ? "Débutant"
      : levelClass === "intermediate"
        ? "Intermédiaire"
        : "Avancé";

  container.innerHTML = `
    <div class="continue-card">
      <div class="continue-icon">🧘‍♀️</div>
      <div class="continue-content">
        <div class="continue-title">${suggestedSession.title}</div>
        <div class="continue-description">${suggestedSession.description}</div>
        <div class="continue-meta">
          <span class="continue-badge ${levelClass}">${levelText}</span>
          <span>⏱️ ${suggestedSession.duration} min</span>
        </div>
      </div>
      <div class="continue-action">
        <a href="session-player.html?id=${suggestedSession.id}" class="btn btn-primary">
          Commencer
        </a>
      </div>
    </div>
  `;
}

function isPremiumUser(userId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);
  return user && user.isPremium;
}

/* ========================================
   LOAD RECENT SESSIONS
   ======================================== */

function loadRecentSessions(userId) {
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 5); // Last 5 sessions

  const container = document.getElementById("recent-sessions");

  if (userHistory.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Aucune séance enregistrée pour le moment</p>';
    return;
  }

  container.innerHTML = userHistory
    .map((session) => createSessionItem(session))
    .join("");
}

function createSessionItem(session) {
  const date = new Date(session.completedAt);
  const options = {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("fr-FR", options);

  return `
    <div class="session-item">
      <div class="session-item-info">
        <div class="session-item-title">${session.sessionTitle}</div>
        <div class="session-item-date">${formattedDate}</div>
      </div>
      <div class="session-item-duration">${session.duration} min</div>
    </div>
  `;
}

/* ========================================
   LOAD WEEK CHART
   ======================================== */

function loadWeekChart(userId) {
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history.filter((h) => h.userId === userId);

  const today = new Date();
  const weekData = [];

  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" });
    const count = userHistory.filter((h) => {
      const sessionDate = new Date(h.completedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
    }).length;

    weekData.push({ day: dayName, count });
  }

  renderWeekChart(weekData);
}

function renderWeekChart(weekData) {
  const container = document.getElementById("week-chart");
  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  container.innerHTML = weekData
    .map((day) => {
      const height = day.count > 0 ? (day.count / maxCount) * 100 : 3;
      const emptyClass = day.count === 0 ? "empty" : "";

      return `
      <div class="week-day">
        <div class="week-bar-container">
          <div class="week-bar ${emptyClass}" style="height: ${height}%"></div>
        </div>
        <div class="week-day-label">${day.day}</div>
        <div class="week-day-count">${day.count > 0 ? day.count : "-"}</div>
      </div>
    `;
    })
    .join("");
}
