// Progress Page Logic
(function () {
  "use strict";

  // Check authentication
  requireAuth();

  // State
  let currentPeriod = 7;
  let sessionHistory = [];
  let currentUser = null;

  // Initialize
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    currentUser = getCurrentUser();
    if (!currentUser) return;

    sessionHistory = getSessionHistory(currentUser.id);

    setupEventListeners();
    loadStats();
    renderChart();
    renderTimeline();
    updateGoalProgress();
  }

  function setupEventListeners() {
    // Period toggle
    const periodButtons = document.querySelectorAll(".period-btn");
    periodButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        periodButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentPeriod =
          btn.dataset.period === "all"
            ? Infinity
            : parseInt(btn.dataset.period);
        loadStats();
        renderChart();
      });
    });

    // Export button
    const exportBtn = document.getElementById("export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportData);
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  }

  function loadStats() {
    const filteredHistory = filterByPeriod(sessionHistory);
    const allHistory = getSessionHistory(currentUser.id);

    // Total sessions in period
    const totalSessions = filteredHistory.length;
    document.getElementById("total-sessions").textContent = totalSessions;
    document.getElementById("sessions-evolution").textContent =
      `+${totalSessions} cette période`;

    // Total time in period
    const totalMinutes = filteredHistory.reduce(
      (sum, s) => sum + (s.duration || 0),
      0,
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    document.getElementById("total-time").textContent =
      hours > 0
        ? `${hours}h${minutes > 0 ? minutes + "m" : ""}`
        : `${minutes}m`;
    document.getElementById("time-evolution").textContent =
      `+${Math.floor(totalMinutes / 60)}h cette période`;

    // Current streak
    const currentStreak = calculateStreak(allHistory);
    document.getElementById("current-streak").textContent = currentStreak;

    // Best streak
    const bestStreak = calculateBestStreak(allHistory);
    document.getElementById("best-streak").textContent = bestStreak;
  }

  function filterByPeriod(history) {
    if (currentPeriod === Infinity) return history;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - currentPeriod);

    return history.filter((session) => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= cutoffDate;
    });
  }

  function calculateStreak(history) {
    if (history.length === 0) return 0;

    // Sort by date (most recent first)
    const sorted = [...history].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sorted) {
      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate - sessionDate) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
        streak++;
        currentDate = new Date(sessionDate);
      } else {
        break;
      }
    }

    return streak;
  }

  function calculateBestStreak(history) {
    if (history.length === 0) return 0;

    // Sort by date
    const sorted = [...history].sort(
      (a, b) => new Date(a.completedAt) - new Date(b.completedAt),
    );

    let maxStreak = 1;
    let currentStreak = 1;
    let lastDate = new Date(sorted[0].completedAt);
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sorted.length; i++) {
      const sessionDate = new Date(sorted[i].completedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (sessionDate - lastDate) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (daysDiff > 1) {
        currentStreak = 1;
      }

      lastDate = sessionDate;
    }

    return maxStreak;
  }

  function renderChart() {
    const canvas = document.getElementById("activity-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const filteredHistory = filterByPeriod(sessionHistory);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Group by day
    const dayData = groupByDay(filteredHistory);
    const days = Object.keys(dayData).sort();

    if (days.length === 0) {
      // Show empty state
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-secondary")
        .trim();
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(
        "Aucune donnée pour cette période",
        canvas.width / 2,
        canvas.height / 2,
      );
      return;
    }

    // Draw bars
    const barWidth = canvas.width / days.length - 10;
    const maxSessions = Math.max(...Object.values(dayData));
    const barHeightRatio = (canvas.height - 60) / (maxSessions || 1);

    days.forEach((day, index) => {
      const sessions = dayData[day];
      const barHeight = sessions * barHeightRatio;
      const x = index * (barWidth + 10);
      const y = canvas.height - barHeight - 40;

      // Draw bar
      const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
      gradient.addColorStop(0, "#9b59b6");
      gradient.addColorStop(1, "#8e44ad");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-secondary")
        .trim();
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      const date = new Date(day);
      const label = date.getDate() + "/" + (date.getMonth() + 1);
      ctx.fillText(label, x + barWidth / 2, canvas.height - 20);

      // Draw value
      if (sessions > 0) {
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--text-primary")
          .trim();
        ctx.font = "bold 12px system-ui";
        ctx.fillText(sessions, x + barWidth / 2, y - 5);
      }
    });
  }

  function groupByDay(history) {
    const grouped = {};

    history.forEach((session) => {
      const date = new Date(session.completedAt);
      const dayKey = date.toISOString().split("T")[0];
      grouped[dayKey] = (grouped[dayKey] || 0) + 1;
    });

    return grouped;
  }

  function renderTimeline() {
    const container = document.getElementById("timeline-container");
    const emptyState = document.getElementById("empty-timeline");

    if (!container) return;

    if (sessionHistory.length === 0) {
      container.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    container.style.display = "block";
    emptyState.style.display = "none";

    // Sort by date (most recent first)
    const sorted = [...sessionHistory].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
    );

    // Show only last 10
    const recent = sorted.slice(0, 10);

    container.innerHTML = recent
      .map((session) => {
        const date = new Date(session.completedAt);
        const formattedDate = formatDate(date);
        const duration = session.duration || 0;
        const level = session.level || "beginner";

        return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-date">${formattedDate}</span>
                        </div>
                        <h3 class="timeline-title">${session.sessionTitle || "Séance"}</h3>
                        <div class="timeline-meta">
                            <span class="timeline-badge ${level}">
                                ${
                                  level === "beginner"
                                    ? "Débutant"
                                    : level === "intermediate"
                                      ? "Intermédiaire"
                                      : "Avancé"
                                }
                            </span>
                            <span>⏱️ ${duration} min</span>
                            <span>🧘‍♀️ ${session.poses?.length || 0} postures</span>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function updateGoalProgress() {
    const weeklyGoal = 3; // 3 séances par semaine
    const thisWeek = getThisWeekSessions();
    const progress = Math.min((thisWeek / weeklyGoal) * 100, 100);

    document.getElementById("goal-progress-text").textContent =
      `${thisWeek}/${weeklyGoal}`;
    document.getElementById("goal-progress-fill").style.width = `${progress}%`;

    // Message
    const messageEl = document.getElementById("goal-message");
    if (thisWeek >= weeklyGoal) {
      messageEl.textContent = "🎉 Objectif atteint ! Vous êtes incroyable !";
    } else if (thisWeek >= weeklyGoal - 1) {
      messageEl.textContent =
        "💪 Plus qu'une séance pour atteindre votre objectif !";
    } else {
      messageEl.textContent = `Encore ${weeklyGoal - thisWeek} séance${weeklyGoal - thisWeek > 1 ? "s" : ""} cette semaine. Vous pouvez le faire !`;
    }
  }

  function getThisWeekSessions() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    return sessionHistory.filter((session) => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= startOfWeek;
    }).length;
  }

  function exportData() {
    const data = {
      user: {
        name: currentUser.name,
        email: currentUser.email,
        createdAt: currentUser.createdAt,
      },
      stats: {
        totalSessions: sessionHistory.length,
        totalMinutes: sessionHistory.reduce(
          (sum, s) => sum + (s.duration || 0),
          0,
        ),
        currentStreak: calculateStreak(sessionHistory),
        bestStreak: calculateBestStreak(sessionHistory),
      },
      sessions: sessionHistory,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yoga-progress-${currentUser.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Données exportées avec succès ! 📥");
  }

  function getSessionHistory(userId) {
    try {
      const history = localStorage.getItem("sessionHistory");
      if (!history) return [];

      const allHistory = JSON.parse(history);
      return allHistory.filter((session) => session.userId === userId);
    } catch (error) {
      console.error("Error loading session history:", error);
      return [];
    }
  }

  function showToast(message) {
    // Simple toast notification
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
})();
