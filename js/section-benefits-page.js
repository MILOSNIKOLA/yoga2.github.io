(function () {
  const PAYLOAD_STORAGE_KEY = "selectedYogaBenefitsPayload";

  const titleElement = document.getElementById("details-title");
  const benefitsContainer = document.getElementById("details-benefits");
  if (!titleElement || !benefitsContainer) {
    return;
  }

  let payload = null;
  try {
    const raw = sessionStorage.getItem(PAYLOAD_STORAGE_KEY);
    payload = raw ? JSON.parse(raw) : null;
  } catch (_error) {
    payload = null;
  }

  if (
    payload &&
    Array.isArray(payload.articlesHtml) &&
    payload.articlesHtml.length
  ) {
    if (typeof payload.titleText === "string" && payload.titleText.trim()) {
      titleElement.textContent = payload.titleText.trim();
    }
    benefitsContainer.innerHTML = payload.articlesHtml.join("\n");
  } else {
    titleElement.textContent = "Articles de yoga";
    benefitsContainer.innerHTML = [
      '<article class="benefit-item">',
      "  <h3>Aucun article a afficher</h3>",
      "  <p>Cliquez sur un titre de section depuis la page d'accueil.</p>",
      "</article>",
    ].join("\n");
  }
})();
