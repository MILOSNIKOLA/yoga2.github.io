/* ========================================
   DASHBOARD - JAVASCRIPT
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
});

function initializeDashboard() {
  const user = getDashboardUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadUserData(user);
  loadStats(user.id);
  loadContinuePractice(user.id);
  loadRecentSessions(user.id);
  loadWeekChart(user.id);

  const logoutButtons = document.querySelectorAll("#logout-btn, #account-logout-btn");
  logoutButtons.forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", () => {
      if (typeof logout === "function") {
        logout();
        return;
      }

      sessionStorage.removeItem("userId");
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    });
  });

  const upgradeBtn = document.getElementById("upgrade-btn");
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", async () => {
      const currentUser = getDashboardUser();

      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/subscription/create-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            userId: currentUser.firebaseUid || currentUser.uid || currentUser.id,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Erreur lors de la création du paiement");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur réseau");
      }
    });
  }
}

/* ========================================
   USER HELPERS
   ======================================== */

function getDashboardUser() {
  if (typeof getCurrentUser === "function") {
    const currentUser = getCurrentUser();
    if (currentUser) return currentUser;
  }

  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (!userId) return null;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  if (!user) return null;

  return {
    ...user,
    name: user.name || "",
    premium:
      typeof user.premium === "boolean"
        ? user.premium
        : false,
  };
}

function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderEmptyMessage(container, tag, text) {
  clearElement(container);
  container.appendChild(createTextElement(tag, "empty-message", text));
}

/* ========================================
   LOAD USER DATA
   ======================================== */

function loadUserData(user) {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const displayName = (user.name || "").trim();
  const firstName = displayName ? displayName.split(" ")[0] : "ami";
  document.getElementById("welcome-message").textContent =
    `Bienvenue ${firstName}`;

  document.getElementById("user-email").textContent = user.email || "-";

  const memberSince = user.createdAt ? new Date(user.createdAt) : null;
  const options = { year: "numeric", month: "long" };
  document.getElementById("member-since").textContent =
    memberSince && !Number.isNaN(memberSince.getTime())
      ? memberSince.toLocaleDateString("fr-FR", options)
      : "-";

  const premiumBadge = document.getElementById("premium-status");
  if (user.premium) {
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

  const totalSessions = userHistory.length;
  document.getElementById("total-sessions").textContent = totalSessions;

  const totalMinutes = userHistory.reduce(
    (sum, h) => sum + Number(h.duration || 0),
    0,
  );
  document.getElementById("total-minutes").textContent = totalMinutes;

  const streak = calculateStreak(userHistory);
  document.getElementById("current-streak").textContent = streak;

  const thisWeek = getThisWeekCount(userHistory);
  document.getElementById("this-week").textContent = thisWeek;

  const level = calculateUserLevel(totalSessions);
  document.getElementById("user-level").textContent = level;

  updateStreakMessage(streak, totalSessions);
}

function calculateStreak(history) {
  if (history.length === 0) return 0;

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
  weekStart.setDate(today.getDate() - today.getDay());
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
  const availableSessions = sessions.filter(
    (s) => !requiresPremiumAccess(s) || hasPremiumAccess(userId),
  );

  if (availableSessions.length === 0) {
    renderEmptyMessage(container, "div", "Aucune séance disponible pour le moment");
    return;
  }

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

  clearElement(container);

  const card = document.createElement("div");
  card.className = "continue-card";

  const icon = createTextElement("div", "continue-icon", "🧘‍♀️");
  const content = document.createElement("div");
  content.className = "continue-content";
  content.appendChild(createTextElement("div", "continue-title", suggestedSession.title));
  content.appendChild(
    createTextElement("div", "continue-description", suggestedSession.description),
  );

  const meta = document.createElement("div");
  meta.className = "continue-meta";
  meta.appendChild(createTextElement("span", `continue-badge ${levelClass}`, levelText));
  meta.appendChild(createTextElement("span", "", `⏱️ ${suggestedSession.duration} min`));
  content.appendChild(meta);

  const action = document.createElement("div");
  action.className = "continue-action";
  const link = document.createElement("a");
  link.href = `session-player.html?id=${suggestedSession.id}`;
  link.className = "btn btn-primary";
  link.textContent = "Commencer";
  action.appendChild(link);

  card.appendChild(icon);
  card.appendChild(content);
  card.appendChild(action);
  container.appendChild(card);
}

function hasPremiumAccess(userId) {
  const user = getDashboardUser();
  if (user && user.id === userId) {
    return Boolean(user.premium);
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const fallbackUser = users.find((u) => u.id === userId);
  return Boolean(fallbackUser && fallbackUser.premium);
}

function requiresPremiumAccess(session) {
  return Boolean(session.premium || session.free === false);
}

/* ========================================
   LOAD RECENT SESSIONS
   ======================================== */

function loadRecentSessions(userId) {
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 5);

  const container = document.getElementById("recent-sessions");

  if (userHistory.length === 0) {
    renderEmptyMessage(container, "p", "Aucune séance enregistrée pour le moment");
    return;
  }

  clearElement(container);
  userHistory.forEach((session) => {
    container.appendChild(createSessionItem(session));
  });
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

  const item = document.createElement("div");
  item.className = "session-item";

  const info = document.createElement("div");
  info.className = "session-item-info";
  info.appendChild(createTextElement("div", "session-item-title", session.sessionTitle));
  info.appendChild(createTextElement("div", "session-item-date", formattedDate));

  item.appendChild(info);
  item.appendChild(
    createTextElement("div", "session-item-duration", `${session.duration} min`),
  );
  return item;
}

/* ========================================
   LOAD WEEK CHART
   ======================================== */

function loadWeekChart(userId) {
  const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  const userHistory = history.filter((h) => h.userId === userId);

  const today = new Date();
  const weekData = [];

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

  clearElement(container);

  weekData.forEach((day) => {
    const height = day.count > 0 ? (day.count / maxCount) * 100 : 3;
    const emptyClass = day.count === 0 ? "empty" : "";

    const dayElement = document.createElement("div");
    dayElement.className = "week-day";

    const barContainer = document.createElement("div");
    barContainer.className = "week-bar-container";
    const bar = document.createElement("div");
    bar.className = `week-bar ${emptyClass}`.trim();
    bar.style.height = `${height}%`;
    barContainer.appendChild(bar);

    dayElement.appendChild(barContainer);
    dayElement.appendChild(createTextElement("div", "week-day-label", day.day));
    dayElement.appendChild(
      createTextElement("div", "week-day-count", day.count > 0 ? String(day.count) : "-"),
    );
    container.appendChild(dayElement);
  });
}
