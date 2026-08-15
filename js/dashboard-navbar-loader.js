/**
 * Shared dashboard navbar loader.
 * Injects the reusable dashboard navbar on pages that do not already define one.
 */
(function loadDashboardNavbar() {
  const hasNavbar = document.querySelector(".dashboard-navbar");
  if (hasNavbar) return;

  const mount = () => {
    const target = document.body;
    if (!target) return;

    fetch("includes/dashboard-navbar.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load dashboard navbar: ${response.status}`,
          );
        }
        return response.text();
      })
      .then((html) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html.trim();
        const navbar = wrapper.firstElementChild;
        if (!navbar) return;

        target.insertBefore(navbar, target.firstChild);
        document.body.classList.add("has-sticky-navbar");

        const configureI18n = () => {
          if (!window.i18n || !Object.keys(window.i18n.translations).length) {
            return;
          }

          window.i18n.applyTranslations();
          window.i18n.setupLanguageToggle();
        };

        if (window.i18n && Object.keys(window.i18n.translations).length) {
          configureI18n();
        } else {
          document.addEventListener("i18nReady", configureI18n, { once: true });
        }
      })
      .catch((error) => {
        console.warn("Dashboard navbar loader failed:", error);
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
