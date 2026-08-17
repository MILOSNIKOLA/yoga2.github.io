/* ========================================
   THEME MANAGEMENT - LIGHT/DARK MODE
   ======================================== */

class ThemeManager {
  constructor() {
    this.themeToggleBtn = null;
    this.currentTheme = localStorage.getItem("theme") || "dark";

    // Initialize theme
    this.applyTheme(this.currentTheme);

    this.setupToggle(document.getElementById("theme-toggle"));
  }

  setupToggle(toggle) {
    if (!toggle || toggle === this.themeToggleBtn) return;

    this.themeToggleBtn = toggle;
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    this.updateToggleIcons();
  }

  updateToggleIcons() {
    if (!this.themeToggleBtn) return;

    const sunIcon = this.themeToggleBtn.querySelector(".sun-icon");
    const moonIcon = this.themeToggleBtn.querySelector(".moon-icon");

    if (this.currentTheme === "dark") {
      sunIcon?.classList.remove("hidden");
      moonIcon?.classList.add("hidden");
      this.themeToggleBtn.setAttribute("aria-label", "Passer au mode jour");
      this.themeToggleBtn.setAttribute("title", "Passer au mode jour");
    } else {
      sunIcon?.classList.add("hidden");
      moonIcon?.classList.remove("hidden");
      this.themeToggleBtn.setAttribute("aria-label", "Passer au mode sombre");
      this.themeToggleBtn.setAttribute("title", "Passer au mode sombre");
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);

    this.updateToggleIcons();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);

    // Add animation
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";

    // Track theme change (analytics)
    console.log(`Theme changed to: ${newTheme}`);
  }

  getTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
