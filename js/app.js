/* ========================================
   APP.JS - MAIN APPLICATION LOGIC
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
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

/* ========================================
   AUTH UI MANAGEMENT
   ======================================== */

function updateAuthUI() {
  const authSection = document.getElementById("auth-section");
  const userMenu = document.getElementById("user-menu");
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (userId) {
    // User is logged in
    if (authSection) authSection.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
  } else {
    // User is not logged in
    if (authSection) authSection.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
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
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">Aucune séance disponible pour le moment</p>';
    return;
  }

  container.innerHTML = popular
    .map((session) => createSessionCard(session))
    .join("");

  // Add click handlers
  container.querySelectorAll(".session-card").forEach((card) => {
    card.addEventListener("click", () => {
      const sessionId = card.dataset.sessionId;
      window.location.href = `session-player.html?id=${sessionId}`;
    });
  });
}

function createSessionCard(session) {
  const levelLabels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  const freeOrPremium = session.free
    ? '<span class="free-badge">Gratuit</span>'
    : '<span class="premium-badge">Premium</span>';

  return `
        <div class="session-card" data-session-id="${session.id}">
            <div class="session-image">🧘‍♀️</div>
            <div class="session-content">
                <div class="session-header">
                    <div class="badges">
                        ${freeOrPremium}
                        <span class="session-badge">${levelLabels[session.level] || session.level}</span>
                    </div>
                    <span class="session-duration">${session.duration} min</span>
                </div>
                <h3 class="session-title">${session.title}</h3>
                <p class="session-description">${session.description}</p>
                <div class="session-footer">
                    ${session.objectives.map((obj) => `<span class="session-tag">${obj}</span>`).join("")}
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
        title: "Yoga pour le dos",
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
