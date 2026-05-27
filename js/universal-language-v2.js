/**
 * Compatibilité i18n legacy.
 * Ce fichier délègue désormais au système central js/i18n-manager.js.
 */
(function () {
  function attachCompatibilityApi() {
    if (!window.i18n) return false;

    window.translatePage = (lang) => window.i18n.setLanguage(lang);
    window.getCurrentLanguage = () => window.i18n.currentLanguage;
    window.setLanguage = (lang) => window.i18n.setLanguage(lang);
    window.applyTranslations = (...args) => window.i18n.applyTranslations(...args);
    return true;
  }

  function boot() {
    if (attachCompatibilityApi()) {
      return;
    }

    if (!document.querySelector('script[src="js/i18n-manager.js"], script[src$="/js/i18n-manager.js"]')) {
      const script = document.createElement("script");
      script.src = "js/i18n-manager.js";
      script.defer = true;
      script.onload = () => attachCompatibilityApi();
      document.head.appendChild(script);
      return;
    }

    document.addEventListener("i18nReady", () => {
      attachCompatibilityApi();
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
