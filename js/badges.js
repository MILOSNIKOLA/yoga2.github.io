/* ========================================
   BADGES - BADGES & STREAK SYSTEM
   ======================================== */

function getBadges() {
  const progressData = JSON.parse(localStorage.getItem("progress")) || {
    completedSessions: [],
    streak: 0,
  };

  const badges = [];

  // Streak badges
  if (progressData.streak >= 3) {
    badges.push({
      icon: "🔥",
      text: `${progressData.streak} jours consécutifs`,
      type: "streak",
    });
  }
  if (progressData.streak >= 7) {
    badges.push({
      icon: "🏆",
      text: "7 jours sans arrêt",
      type: "milestone",
    });
  }
  if (progressData.streak >= 14) {
    badges.push({
      icon: "⭐",
      text: "2 semaines de suite",
      type: "milestone",
    });
  }
  if (progressData.streak >= 30) {
    badges.push({
      icon: "👑",
      text: "30 jours consécutifs",
      type: "milestone",
    });
  }

  // Session count badges
  const count = progressData.completedSessions.length;

  if (count >= 1) {
    badges.push({
      icon: "🎯",
      text: "Première séance complétée",
      type: "starter",
    });
  }
  if (count >= 5) {
    badges.push({
      icon: "💪",
      text: "5 séances complétées",
      type: "progress",
    });
  }
  if (count >= 10) {
    badges.push({
      icon: "🎖️",
      text: "10 séances",
      type: "progress",
    });
  }
  if (count >= 30) {
    badges.push({
      icon: "💎",
      text: "30 séances",
      type: "elite",
    });
  }
  if (count >= 50) {
    badges.push({
      icon: "👑",
      text: "50 séances",
      type: "elite",
    });
  }
  if (count >= 100) {
    badges.push({
      icon: "🌟",
      text: "100 séances",
      type: "legendary",
    });
  }

  return badges;
}

function renderBadges() {
  const list = document.getElementById("badges-list");
  if (!list) return;

  const badges = getBadges();
  list.innerHTML = "";

  if (badges.length === 0) {
    list.innerHTML =
      '<li class="badge-empty">Commencez une séance pour obtenir votre premier badge</li>';
    return;
  }

  badges.forEach((badge) => {
    const li = document.createElement("li");
    li.className = `badge badge-${badge.type}`;
    li.innerHTML = `<span class="badge-icon">${badge.icon}</span> <span class="badge-text">${badge.text}</span>`;
    list.appendChild(li);
  });
}

function getStreakInfo() {
  const progressData = JSON.parse(localStorage.getItem("progress")) || {
    streak: 0,
  };

  return {
    streak: progressData.streak,
    nextMilestone: getNextStreakMilestone(progressData.streak),
  };
}

function getNextStreakMilestone(currentStreak) {
  const milestones = [3, 7, 14, 30];
  return milestones.find((m) => m > currentStreak) || null;
}

function displayStreakWidget() {
  const widget = document.getElementById("streak-widget");
  if (!widget) return;

  const { streak, nextMilestone } = getStreakInfo();

  widget.innerHTML = `
    <div class="streak-display">
      <div class="streak-number">${streak}</div>
      <div class="streak-label">jours</div>
    </div>
    ${nextMilestone ? `<div class="streak-milestone">Objectif: ${nextMilestone} jours 🎯</div>` : ""}
  `;
}
