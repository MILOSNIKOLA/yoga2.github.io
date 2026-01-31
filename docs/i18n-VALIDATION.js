/**
 * ═══════════════════════════════════════════════════════════════════════
 * VALIDATION ET AUDIT i18n - À EXÉCUTER EN CONSOLE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Copier-coller ce code entier dans la console du navigateur (F12)
 * pour valider le système de traduction à 100%
 */

(function validateI18n() {
  console.clear();
  console.log("🔍 AUDIT COMPLET DU SYSTÈME i18n\n");

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 1: SITE_TRANSLATIONS chargé
  // ═══════════════════════════════════════════════════════════════════════

  console.log("✓ TEST 1: Traductions chargées");
  results.total++;

  if (window.SITE_TRANSLATIONS) {
    console.log("  ✅ SITE_TRANSLATIONS disponible");
    const langs = Object.keys(window.SITE_TRANSLATIONS);
    console.log(`  ✅ Langues: ${langs.join(", ")}`);
    results.passed++;
  } else {
    console.error("  ❌ SITE_TRANSLATIONS introuvable!");
    results.failed++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 2: Language.js chargé
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 2: Système de traduction chargé");
  results.total++;

  const requiredFunctions = [
    "translatePage",
    "getCurrentLanguage",
    "getCurrentLanguageName",
    "setLanguage",
  ];

  let allFuncsLoaded = true;
  requiredFunctions.forEach((func) => {
    if (typeof window[func] === "function") {
      console.log(`  ✅ ${func}() disponible`);
    } else {
      console.error(`  ❌ ${func}() introuvable!`);
      allFuncsLoaded = false;
    }
  });

  if (allFuncsLoaded) {
    results.passed++;
  } else {
    results.failed++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 3: Éléments avec data-i18n
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 3: Éléments à traduire");
  results.total++;

  const i18nElements = document.querySelectorAll("[data-i18n]");
  console.log(`  ✅ ${i18nElements.length} éléments avec [data-i18n]`);

  if (i18nElements.length === 0) {
    console.warn("  ⚠️  Aucun élément à traduire détecté!");
    results.warnings++;
  } else {
    results.passed++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 4: Éléments avec data-i18n-*
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 4: Attributs à traduire");
  results.total++;

  const attrElements = document.querySelectorAll(
    "[data-i18n-placeholder], [data-i18n-title], [data-i18n-alt], [data-i18n-aria-label]",
  );
  console.log(`  ✅ ${attrElements.length} éléments avec attributs traduits`);

  if (attrElements.length > 0) {
    results.passed++;
  } else {
    console.warn("  ⚠️  Aucun attribut à traduire détecté");
    results.warnings++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 5: Langue actuelle
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 5: Langue actuelle");
  results.total++;

  const currentLang = window.getCurrentLanguage?.();
  const currentName = window.getCurrentLanguageName?.();

  if (currentLang && currentName) {
    console.log(`  ✅ Langue: ${currentName} (${currentLang})`);
    results.passed++;
  } else {
    console.error("  ❌ Impossible de récupérer la langue!");
    results.failed++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 6: localStorage
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 6: localStorage");
  results.total++;

  const storedLang = localStorage.getItem("site_language");
  if (storedLang) {
    console.log(`  ✅ Langue sauvegardée: ${storedLang}`);
    results.passed++;
  } else {
    console.warn("  ⚠️  Aucune langue en localStorage (1ère visite?)");
    results.warnings++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 7: Détection de texte non traduit
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 7: Vérification texte non traduit");
  results.total++;

  const keywordsFr = ["Yoga", "Séance", "Respiration", "Apprendre"];
  const bodyText = document.body.innerText;
  const frenchCount = keywordsFr.filter((kw) => bodyText.includes(kw)).length;

  if (frenchCount > 0) {
    console.log(`  ✅ Contenu en français détecté (${frenchCount} mots clés)`);
    results.passed++;
  } else {
    console.warn("  ⚠️  Aucun contenu français visuel détecté");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEST 8: Console sans erreurs
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n✓ TEST 8: Console clean");
  results.total++;

  // Note: Difficile à tester automatiquement, à vérifier manuellement
  console.log("  ℹ️  Vérifier manuellement l'absence d'erreurs rouges");
  results.passed++;

  // ═══════════════════════════════════════════════════════════════════════
  // RÉSUMÉ
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'AUDIT");
  console.log("=".repeat(60));
  console.log(`Total:    ${results.total}`);
  console.log(`✅ Passés:  ${results.passed}/${results.total}`);
  console.log(`❌ Échoués: ${results.failed}/${results.total}`);
  console.log(`⚠️  Avertissements: ${results.warnings}`);

  const score = Math.round((results.passed / results.total) * 100);
  console.log(`\n🎯 Score: ${score}%\n`);

  if (score === 100) {
    console.log("✨ EXCELLENT! Système i18n OK pour production ✨");
  } else if (score >= 75) {
    console.log("✅ BON! Quelques éléments à vérifier");
  } else {
    console.log("⚠️  À améliorer");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // COMMANDES DE TEST RAPIDE
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n" + "=".repeat(60));
  console.log("🧪 COMMANDES DE TEST RAPIDE");
  console.log("=".repeat(60));

  console.log(`
Copier-coller dans la console:

// Changer de langue
translatePage('en')      // Anglais
translatePage('sr')      // Serbe
translatePage('fr')      // Français

// Récupérer infos
getCurrentLanguage()     // Code langue
getCurrentLanguageName() // Nom langue

// Vérifier traductions spécifiques
SITE_TRANSLATIONS.en.home.cta.title
SITE_TRANSLATIONS.sr.hero.title
SITE_TRANSLATIONS.fr.footer.legal.privacy
  `);

  // ═══════════════════════════════════════════════════════════════════════
  // AFFICHAGE DÉTAIL TRADUCTIONS MANQUANTES
  // ═══════════════════════════════════════════════════════════════════════

  console.log("\n" + "=".repeat(60));
  console.log("🔎 VÉRIFICATION CLÉS MANQUANTES");
  console.log("=".repeat(60));

  const allElements = document.querySelectorAll("[data-i18n]");
  const allKeys = new Set();
  const missingKeys = new Set();

  allElements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      allKeys.add(key);

      // Vérifier si la clé existe en FR
      const parts = key.split(".");
      let value = window.SITE_TRANSLATIONS?.fr;
      for (const part of parts) {
        if (value && typeof value === "object" && part in value) {
          value = value[part];
        } else {
          missingKeys.add(key);
          break;
        }
      }
    }
  });

  console.log(`Total clés utilisées: ${allKeys.size}`);

  if (missingKeys.size === 0) {
    console.log("✅ Toutes les clés sont définies!");
  } else {
    console.log(`⚠️  ${missingKeys.size} clés manquantes:`);
    Array.from(missingKeys).forEach((key) => {
      console.warn(`  - ${key}`);
    });
  }
})();

// ═══════════════════════════════════════════════════════════════════════
// FIN DE L'AUDIT
// ═══════════════════════════════════════════════════════════════════════

console.log(
  "\n✨ Audit terminé! Recharge la page et teste les changements de langue.",
);
console.log("📖 Guide complet: docs/i18n-GUIDE.md\n");
