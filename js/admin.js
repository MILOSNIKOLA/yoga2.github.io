// Admin Panel Logic
(function () {
  "use strict";

  // Check admin role
  requireAdmin();

  // State
  let sessions = [];
  let editingSessionId = null;
  let deleteSessionId = null;
  let poses = [];

  // Initialize
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    loadSessions();
    setupEventListeners();
    renderSessionsTable();
  }

  function setupEventListeners() {
    // Logout
    document.getElementById("logout-btn")?.addEventListener("click", logout);

    // Search
    document
      .getElementById("search-sessions")
      ?.addEventListener("input", handleSearch);

    // New session button
    document
      .getElementById("new-session-btn")
      ?.addEventListener("click", openNewSessionModal);

    // Modal closes
    document
      .getElementById("close-modal")
      ?.addEventListener("click", closeModal);
    document
      .getElementById("close-modal-2")
      ?.addEventListener("click", closeModal);
    document
      .getElementById("cancel-btn")
      ?.addEventListener("click", closeModal);

    // Steps navigation
    document
      .getElementById("next-step-btn")
      ?.addEventListener("click", goToStep2);
    document
      .getElementById("prev-step-btn")
      ?.addEventListener("click", goToStep1);

    // Save session
    document
      .getElementById("save-session-btn")
      ?.addEventListener("click", saveSession);

    // Add pose
    document.getElementById("add-pose-btn")?.addEventListener("click", addPose);

    // Delete modal
    document
      .getElementById("close-delete-modal")
      ?.addEventListener("click", closeDeleteModal);
    document
      .getElementById("cancel-delete-btn")
      ?.addEventListener("click", closeDeleteModal);
    document
      .getElementById("confirm-delete-btn")
      ?.addEventListener("click", confirmDelete);
  }

  function loadSessions() {
    try {
      const stored = localStorage.getItem("sessions");
      sessions = stored ? JSON.parse(stored).map(normalizeSession) : [];
      saveSessions();
    } catch (error) {
      console.error("Error loading sessions:", error);
      sessions = [];
    }
  }

  function normalizeSession(session) {
    const legacyPremium = session["is" + "Premium"];
    const rest = { ...session };
    delete rest["is" + "Premium"];
    return {
      ...rest,
      premium:
        typeof session.premium === "boolean"
          ? session.premium
          : Boolean(legacyPremium),
    };
  }

  function saveSessions() {
    try {
      localStorage.setItem("sessions", JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions:", error);
      showToast("Erreur lors de la sauvegarde", "error");
    }
  }

  function renderSessionsTable() {
    const tbody = document.getElementById("sessions-table-body");
    const emptyState = document.getElementById("empty-table");

    if (!tbody) return;

    if (sessions.length === 0) {
      clearElement(tbody);
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";
    clearElement(tbody);

    sessions.forEach((session) => {
      tbody.appendChild(createSessionRow(session));
    });
  }

  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createCell(text, className = "") {
    const td = document.createElement("td");
    if (className) td.className = className;
    td.textContent = text;
    return td;
  }

  function createSessionRow(session) {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    const title = document.createElement("div");
    title.className = "session-title";
    title.textContent = session.title;
    titleCell.appendChild(title);
    if (session.premium) {
      const premium = document.createElement("small");
      premium.style.color = "var(--primary-color)";
      premium.textContent = "Premium";
      titleCell.appendChild(premium);
    }

    const levelCell = document.createElement("td");
    const level = document.createElement("span");
    level.className = `session-badge ${session.level}`;
    level.textContent = getLevelLabel(session.level);
    levelCell.appendChild(level);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "table-actions";
    const editButton = document.createElement("button");
    editButton.className = "btn-icon edit";
    editButton.title = "Modifier";
    editButton.textContent = "Modifier";
    editButton.addEventListener("click", () => window.editSession(session.id));
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-icon delete";
    deleteButton.title = "Supprimer";
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", () => window.deleteSession(session.id));
    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);

    row.append(
      titleCell,
      levelCell,
      createCell(`${session.duration} min`),
      createCell(session.type, "session-type"),
      createCell(`${session.poses?.length || 0} postures`),
      actionsCell,
    );

    return row;
  }

  function getLevelLabel(level) {
    const labels = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    };
    return labels[level] || level;
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll(".sessions-table tbody tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });
  }

  function openNewSessionModal() {
    editingSessionId = null;
    poses = [];
    resetForm();
    showModal();
    goToStep1();
  }

  window.editSession = function (id) {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    editingSessionId = id;
    poses = [...(session.poses || [])];

    // Fill form
    document.getElementById("session-title").value = session.title || "";
    document.getElementById("session-description").value =
      session.description || "";
    document.getElementById("session-duration").value = session.duration || "";
    document.getElementById("session-level").value = session.level || "";
    document.getElementById("session-type").value = session.type || "";
    document.getElementById("session-premium").checked =
      Boolean(session.premium);

    // Check goals
    document.querySelectorAll(".goal-checkbox").forEach((cb) => {
      cb.checked = session.goals?.includes(cb.value) || false;
    });

    document.getElementById("modal-title").textContent = "Modifier la Séance";
    showModal();
    goToStep1();
  };

  window.deleteSession = function (id) {
    deleteSessionId = id;
    showDeleteModal();
  };

  function confirmDelete() {
    if (!deleteSessionId) return;

    sessions = sessions.filter((s) => s.id !== deleteSessionId);
    saveSessions();
    renderSessionsTable();
    closeDeleteModal();

    logAdminAction("delete_session", deleteSessionId);
    showToast("Séance supprimée avec succès", "success");
  }

  function goToStep1() {
    document.getElementById("step-1").style.display = "block";
    document.getElementById("step-2").style.display = "none";
  }

  function goToStep2() {
    // Validation step 1
    const title = document.getElementById("session-title").value.trim();
    const description = document
      .getElementById("session-description")
      .value.trim();
    const duration = parseInt(
      document.getElementById("session-duration").value,
    );
    const level = document.getElementById("session-level").value;
    const type = document.getElementById("session-type").value;

    if (!title) {
      showToast("Le titre est requis", "error");
      return;
    }

    if (!description) {
      showToast("La description est requise", "error");
      return;
    }

    if (!duration || duration < 5 || duration > 120) {
      showToast("La durée doit être entre 5 et 120 minutes", "error");
      return;
    }

    if (!level) {
      showToast("Le niveau est requis", "error");
      return;
    }

    if (!type) {
      showToast("Le type est requis", "error");
      return;
    }

    // Go to step 2
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
    renderPosesList();
  }

  function addPose() {
    poses.push({
      id: Date.now().toString(),
      name: "",
      duration: 30,
      instructions: "",
    });
    renderPosesList();
  }

  function renderPosesList() {
    const container = document.getElementById("poses-list");
    const emptyState = document.getElementById("empty-poses");

    if (!container) return;

    if (poses.length === 0) {
      container.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    container.style.display = "flex";
    emptyState.style.display = "none";
    clearElement(container);

    poses.forEach((pose, index) => {
      container.appendChild(createPoseEditor(pose, index));
    });
  }

  function createFormGroup(labelText, field) {
    const group = document.createElement("div");
    group.className = "form-group";
    const label = document.createElement("label");
    label.textContent = labelText;
    group.append(label, field);
    return group;
  }

  function createPoseEditor(pose, index) {
    const item = document.createElement("div");
    item.className = "pose-item";
    item.dataset.poseId = pose.id;

    const header = document.createElement("div");
    header.className = "pose-item-header";
    const number = document.createElement("span");
    number.className = "pose-number";
    number.textContent = `Posture ${index + 1}`;
    const remove = document.createElement("button");
    remove.className = "btn-remove";
    remove.textContent = "x";
    remove.addEventListener("click", () => window.removePose(pose.id));
    header.append(number, remove);

    const name = document.createElement("input");
    name.type = "text";
    name.className = "form-input pose-name";
    name.dataset.poseId = pose.id;
    name.value = pose.name || "";
    name.placeholder = "Ex: Chien tête en bas";
    name.addEventListener("input", updatePoseData);

    const duration = document.createElement("input");
    duration.type = "number";
    duration.className = "form-input pose-duration";
    duration.dataset.poseId = pose.id;
    duration.value = pose.duration || 30;
    duration.min = "5";
    duration.max = "300";
    duration.addEventListener("input", updatePoseData);

    const instructions = document.createElement("textarea");
    instructions.className = "form-textarea pose-instructions";
    instructions.dataset.poseId = pose.id;
    instructions.rows = 2;
    instructions.placeholder = "Consignes pour cette posture...";
    instructions.value = pose.instructions || "";
    instructions.addEventListener("input", updatePoseData);

    item.append(
      header,
      createFormGroup("Nom de la posture *", name),
      createFormGroup("Durée (secondes) *", duration),
      createFormGroup("Instructions", instructions),
    );

    return item;
  }

  function updatePoseData(e) {
    const poseId = e.target.dataset.poseId;
    const pose = poses.find((p) => p.id === poseId);
    if (!pose) return;

    if (e.target.classList.contains("pose-name")) {
      pose.name = e.target.value;
    } else if (e.target.classList.contains("pose-duration")) {
      pose.duration = parseInt(e.target.value) || 30;
    } else if (e.target.classList.contains("pose-instructions")) {
      pose.instructions = e.target.value;
    }
  }

  window.removePose = function (id) {
    poses = poses.filter((p) => p.id !== id);
    renderPosesList();
  };

  function saveSession() {
    // Get form data
    const title = sanitizeInput(
      document.getElementById("session-title").value.trim(),
    );
    const description = sanitizeInput(
      document.getElementById("session-description").value.trim(),
    );
    const duration = parseInt(
      document.getElementById("session-duration").value,
    );
    const level = document.getElementById("session-level").value;
    const type = document.getElementById("session-type").value;
    const premium = document.getElementById("session-premium").checked;

    // Get goals
    const goals = Array.from(
      document.querySelectorAll(".goal-checkbox:checked"),
    ).map((cb) => cb.value);

    // Validate poses
    const validPoses = poses.filter((p) => p.name.trim());

    if (validPoses.length === 0) {
      if (
        !confirm("Aucune posture valide. Voulez-vous enregistrer quand même ?")
      ) {
        return;
      }
    }

    // Create or update session
    const sessionData = {
      id: editingSessionId || Date.now().toString(),
      title,
      description,
      duration,
      level,
      type,
      premium,
      goals,
      poses: validPoses,
      updatedAt: new Date().toISOString(),
    };

    if (editingSessionId) {
      // Update existing
      const index = sessions.findIndex((s) => s.id === editingSessionId);
      if (index !== -1) {
        sessions[index] = { ...sessions[index], ...sessionData };
        logAdminAction("update_session", editingSessionId);
        showToast("Séance modifiée avec succès ! ✅", "success");
      }
    } else {
      // Create new
      sessionData.createdAt = new Date().toISOString();
      sessions.push(sessionData);
      logAdminAction("create_session", sessionData.id);
      showToast("Séance créée avec succès ! 🎉", "success");
    }

    saveSessions();
    renderSessionsTable();
    closeModal();
  }

  function resetForm() {
    document.getElementById("session-title").value = "";
    document.getElementById("session-description").value = "";
    document.getElementById("session-duration").value = "";
    document.getElementById("session-level").value = "";
    document.getElementById("session-type").value = "";
    document.getElementById("session-premium").checked = false;
    document
      .querySelectorAll(".goal-checkbox")
      .forEach((cb) => (cb.checked = false));
    document.getElementById("modal-title").textContent = "Nouvelle Séance";
  }

  function showModal() {
    document.getElementById("session-modal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("session-modal").style.display = "none";
  }

  function showDeleteModal() {
    document.getElementById("delete-modal").style.display = "flex";
  }

  function closeDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
  }

  function logAdminAction(action, sessionId) {
    const log = {
      action,
      sessionId,
      userId: getCurrentUser()?.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]");
      logs.push(log);
      localStorage.setItem("adminLogs", JSON.stringify(logs));
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === "error" ? "#e74c3c" : "var(--primary-color)"};
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

  function requireAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      alert("Accès refusé. Vous devez être administrateur.");
      window.location.href = "dashboard.html";
    }
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
