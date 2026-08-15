(function () {
  const CLICKED_STORAGE_KEY = "clickedSectionTitles";
  const PAYLOAD_STORAGE_KEY = "selectedYogaBenefitsPayload";
  const TARGET_PAGE = "section-benefits.html";
  const MENU_SELECTOR = "a[data-benefits-topic]";

  const sectionTitles = Array.from(
    document.querySelectorAll(".yoga-section h2.section-title"),
  );
  if (!sectionTitles.length) {
    return;
  }

  function getTitleKey(titleElement) {
    return (
      titleElement.getAttribute("data-i18n") ||
      titleElement.textContent.replace(/\s+/g, " ").trim()
    );
  }

  function readClickedKeys() {
    try {
      const raw = localStorage.getItem(CLICKED_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (_error) {
      return new Set();
    }
  }

  function writeClickedKeys(keysSet) {
    localStorage.setItem(
      CLICKED_STORAGE_KEY,
      JSON.stringify(Array.from(keysSet)),
    );
  }

  function getCurrentLanguage() {
    return (
      window.i18n?.currentLanguage ||
      localStorage.getItem("yogaAppLanguage") ||
      localStorage.getItem("site_language") ||
      "fr"
    );
  }

  function syncMenuLinks() {
    const lang = getCurrentLanguage();
    document.querySelectorAll(MENU_SELECTOR).forEach((link) => {
      const topic = link.getAttribute("data-benefits-topic");
      if (!topic) return;
      link.href = `${TARGET_PAGE}?topic=${encodeURIComponent(topic)}&lang=${encodeURIComponent(lang)}`;
    });
  }

  function findArticlesForTitle(titleElement) {
    const section = titleElement.closest("section");
    let articles = [];

    if (section) {
      articles = Array.from(section.querySelectorAll(".yoga-benefits article"));
    }

    if (!articles.length) {
      articles = Array.from(
        document.querySelectorAll(".yoga-benefits article"),
      );
    }

    return articles;
  }

  const clickedKeys = readClickedKeys();
  syncMenuLinks();

  sectionTitles.forEach((title) => {
    const key = getTitleKey(title);

    title.classList.add("section-title-clickable");
    title.setAttribute("role", "link");
    title.setAttribute("tabindex", "0");

    if (clickedKeys.has(key)) {
      title.classList.add("is-clicked");
    }

    const openSectionBenefitsPage = function () {
      clickedKeys.add(key);
      writeClickedKeys(clickedKeys);
      title.classList.add("is-clicked");

      const articles = findArticlesForTitle(title);
      const payload = {
        titleText: title.textContent.replace(/\s+/g, " ").trim(),
        titleKey: key,
        articlesHtml: articles.map((article) => article.outerHTML),
        timestamp: Date.now(),
      };

      sessionStorage.setItem(PAYLOAD_STORAGE_KEY, JSON.stringify(payload));
      window.location.href = TARGET_PAGE;
    };

    title.addEventListener("click", openSectionBenefitsPage);
    title.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSectionBenefitsPage();
      }
    });
  });

  document.addEventListener("languageChanged", syncMenuLinks);
})();
