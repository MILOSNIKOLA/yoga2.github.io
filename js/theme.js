/* ========================================
   THEME MANAGEMENT - LIGHT/DARK MODE
   ======================================== */

class ThemeManager {
  constructor() {
    this.themeToggleBtn = document.getElementById("theme-toggle");
    this.currentTheme = localStorage.getItem("theme") || "light";

    // Initialize theme
    this.applyTheme(this.currentTheme);

    // Setup event listeners
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);

    // Update toggle button icons
    if (this.themeToggleBtn) {
      const sunIcon = this.themeToggleBtn.querySelector(".sun-icon");
      const moonIcon = this.themeToggleBtn.querySelector(".moon-icon");

      if (theme === "dark") {
        sunIcon?.classList.add("hidden");
        moonIcon?.classList.remove("hidden");
      } else {
        sunIcon?.classList.remove("hidden");
        moonIcon?.classList.add("hidden");
      }
    }
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
