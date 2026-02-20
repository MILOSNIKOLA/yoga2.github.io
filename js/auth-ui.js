/* ========================================
   AUTH UI MANAGEMENT - SHARED
   S'exécute sur toutes les pages pour gérer l'affichage/masquage
   des éléments selon l'authentification
   ======================================== */

/**
 * Update authentication UI across all pages
 * - Masque #auth-section quand connecté
 * - Affiche #user-menu quand connecté
 * - Affiche/masque #logout-btn selon le statut
 */
function updateAuthUI() {
  const authSection = document.getElementById("auth-section");
  const userMenu = document.getElementById("user-menu");
  const logoutBtn = document.getElementById("logout-btn");
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (userId) {
    // User is logged in - show full content, hide login buttons
    if (authSection) authSection.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  } else {
    // User is not logged in - show login buttons
    if (authSection) authSection.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});

// Also listen for storage changes (e.g., from other tabs or login/logout)
window.addEventListener("storage", () => {
  updateAuthUI();
});
