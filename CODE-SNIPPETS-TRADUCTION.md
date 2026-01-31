# 💻 Code Snippets - Système de Traduction

## 📋 Exemples Prêts à l'Emploi

### 1. Ajouter un élément traduisible

#### HTML

```html
<!-- Ajouter data-i18n avec une clé unique -->
<h4 data-i18n="footer.newSection.title">Titre par défaut</h4>
<p data-i18n="footer.newSection.description">Description par défaut</p>
```

#### JavaScript (translations.js)

```javascript
const SITE_TRANSLATIONS = {
  fr: {
    footer: {
      // ... sections existantes
      newSection: {
        title: "Nouveau Titre",
        description: "Nouvelle description en français",
      },
    },
  },
  sr: {
    footer: {
      newSection: {
        title: "Нови наслов",
        description: "Нови опис на српском",
      },
    },
  },
  en: {
    footer: {
      newSection: {
        title: "New Title",
        description: "New description in English",
      },
    },
  },
};
```

---

### 2. Changer de langue programmatiquement

#### Via l'API publique

```javascript
// Dans la console (F12) ou dans votre code

// Passer en serbe
translatePage("sr");

// Passer en anglais
translatePage("en");

// Retour au français
translatePage("fr");

// Vérifier la langue actuelle
console.log(getCurrentLanguage()); // "fr", "sr" ou "en"
```

#### Changer la langue au clic sur un bouton personnalisé

```html
<!-- HTML -->
<button onclick="changerVersSerbe()">🇷🇸 Српски</button>
<button onclick="changerVersAnglais()">🇬🇧 English</button>
<button onclick="changerVersFrancais()">🇫🇷 Français</button>

<script>
  // JavaScript
  function changerVersSerbe() {
    translatePage("sr");
  }

  function changerVersAnglais() {
    translatePage("en");
  }

  function changerVersFrancais() {
    translatePage("fr");
  }
</script>
```

---

### 3. Détecter la langue du navigateur

#### Détection automatique au chargement

```javascript
// Dans language.js ou app.js

function detectBrowserLanguage() {
  // Récupère la langue du navigateur (ex: "fr-FR", "en-US", "sr-RS")
  const browserLang = navigator.language || navigator.userLanguage;

  // Extrait le code langue (2 lettres)
  const langCode = browserLang.split("-")[0]; // "fr", "en", "sr"

  // Vérifie si la langue est supportée
  const supportedLanguages = ["fr", "sr", "en"];

  if (supportedLanguages.includes(langCode)) {
    return langCode;
  } else {
    return "fr"; // Langue par défaut
  }
}

// Utilisation au chargement
document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si l'utilisateur a déjà une préférence sauvegardée
  let userLang = localStorage.getItem("language");

  // Si pas de préférence, détecte la langue du navigateur
  if (!userLang) {
    userLang = detectBrowserLanguage();
    localStorage.setItem("language", userLang);
  }

  // Applique la langue
  translatePage(userLang);

  console.log(`🌍 Langue initialisée: ${userLang}`);
});
```

---

### 4. Traduire des attributs HTML (placeholder, aria-label, title)

#### HTML avec attributs personnalisés

```html
<!-- Placeholder -->
<input
  type="text"
  data-i18n-placeholder="form.email.placeholder"
  placeholder="Votre email"
/>

<!-- Aria-label -->
<button data-i18n-aria="button.close.aria" aria-label="Fermer">✕</button>

<!-- Title (tooltip) -->
<a href="#" data-i18n-title="link.help.title" title="Besoin d'aide ?"> ❓ </a>
```

#### JavaScript (ajout dans language.js)

```javascript
/**
 * Traduit les attributs HTML (placeholder, aria-label, title)
 */
function translateAttributes(lang) {
  const translations = window.SITE_TRANSLATIONS
    ? window.SITE_TRANSLATIONS[lang]
    : {};

  // Traduire les placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const translation = resolveTranslationKey(translations, key);

    if (translation) {
      element.placeholder = translation;
    }
  });

  // Traduire les aria-label
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria");
    const translation = resolveTranslationKey(translations, key);

    if (translation) {
      element.setAttribute("aria-label", translation);
    }
  });

  // Traduire les title
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    const translation = resolveTranslationKey(translations, key);

    if (translation) {
      element.setAttribute("title", translation);
    }
  });
}

// Appeler dans applyTranslations()
function applyTranslations(lang) {
  // ... code existant pour textContent

  // Ajouter la traduction des attributs
  translateAttributes(lang);
}
```

#### Traductions (translations.js)

```javascript
fr: {
  form: {
    email: {
      placeholder: "Votre adresse email"
    }
  },
  button: {
    close: {
      aria: "Fermer la fenêtre"
    }
  },
  link: {
    help: {
      title: "Obtenir de l'aide"
    }
  }
}
```

---

### 5. Afficher un sélecteur de langue (dropdown)

#### HTML

```html
<select id="language-selector" onchange="changerLangue(this.value)">
  <option value="fr">🇫🇷 Français</option>
  <option value="sr">🇷🇸 Српски</option>
  <option value="en">🇬🇧 English</option>
</select>
```

#### JavaScript

```javascript
function changerLangue(langCode) {
  translatePage(langCode);

  // Feedback visuel
  console.log(`Langue changée vers: ${langCode}`);
}

// Initialiser le sélecteur avec la langue active
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("language-selector");
  const currentLang = getCurrentLanguage();

  if (selector) {
    selector.value = currentLang;
  }
});
```

---

### 6. Ajouter une animation de transition

#### CSS

```css
/* Animation de fondu lors du changement de langue */
[data-i18n] {
  transition: opacity 0.3s ease;
}

[data-i18n].translating {
  opacity: 0.5;
}

[data-i18n].translated {
  opacity: 1;
}
```

#### JavaScript

```javascript
function applyTranslationsWithAnimation(lang) {
  const elements = document.querySelectorAll("[data-i18n]");

  // Phase 1: Ajouter classe "translating" (fondu out)
  elements.forEach((el) => el.classList.add("translating"));

  // Phase 2: Après 150ms, changer le texte
  setTimeout(() => {
    const translations = window.SITE_TRANSLATIONS
      ? window.SITE_TRANSLATIONS[lang]
      : {};

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = resolveTranslationKey(translations, key);

      if (translation) {
        element.textContent = translation;
      }
    });

    // Phase 3: Retirer "translating", ajouter "translated" (fondu in)
    elements.forEach((el) => {
      el.classList.remove("translating");
      el.classList.add("translated");
    });

    // Phase 4: Nettoyer après l'animation
    setTimeout(() => {
      elements.forEach((el) => el.classList.remove("translated"));
    }, 300);
  }, 150);
}
```

---

### 7. Logger les traductions manquantes

#### JavaScript (amélioration applyTranslations)

```javascript
function applyTranslations(lang) {
  const translations = window.SITE_TRANSLATIONS
    ? window.SITE_TRANSLATIONS[lang]
    : {};

  const missingKeys = [];
  let translatedCount = 0;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = resolveTranslationKey(translations, key);

    if (translation) {
      element.textContent = translation;
      translatedCount++;
    } else {
      missingKeys.push(key);
      console.warn(`⚠️ Traduction manquante [${lang}]: ${key}`);
    }
  });

  // Rapport final
  console.log(`✅ ${translatedCount} traductions appliquées`);

  if (missingKeys.length > 0) {
    console.error(
      `❌ ${missingKeys.length} traductions manquantes:`,
      missingKeys,
    );

    // Générer le code manquant pour copier-coller
    console.group("📋 Code à ajouter dans translations.js:");
    missingKeys.forEach((key) => {
      const parts = key.split(".");
      const lastKey = parts[parts.length - 1];
      console.log(`${lastKey}: "TODO: Ajouter traduction",`);
    });
    console.groupEnd();
  }
}
```

---

### 8. Exporter/Importer les traductions (JSON)

#### Export

```javascript
/**
 * Exporte toutes les traductions en fichier JSON
 */
function exportTranslations() {
  const data = JSON.stringify(window.SITE_TRANSLATIONS, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "translations-backup.json";
  link.click();

  console.log("✅ Traductions exportées");
}

// Appel: exportTranslations()
```

#### Import

```javascript
/**
 * Importe des traductions depuis un fichier JSON
 */
function importTranslations(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      window.SITE_TRANSLATIONS = data;
      console.log("✅ Traductions importées:", data);

      // Re-traduire la page
      const currentLang = getCurrentLanguage();
      translatePage(currentLang);
    } catch (error) {
      console.error("❌ Erreur lors de l'import:", error);
    }
  };

  reader.readAsText(file);
}

// HTML: <input type="file" onchange="importTranslations(this.files[0])" />
```

---

### 9. Compter les traductions par langue

#### JavaScript

```javascript
/**
 * Compte le nombre de clés traduites par langue
 */
function countTranslations() {
  const stats = {};

  Object.keys(window.SITE_TRANSLATIONS).forEach((lang) => {
    stats[lang] = countKeys(window.SITE_TRANSLATIONS[lang]);
  });

  console.table(stats);
  return stats;
}

function countKeys(obj) {
  let count = 0;

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      count++;
    } else if (typeof obj[key] === "object") {
      count += countKeys(obj[key]);
    }
  }

  return count;
}

// Appel: countTranslations()
// Résultat:
// ┌─────────┬────────┐
// │ (index) │ Values │
// ├─────────┼────────┤
// │   fr    │   142  │
// │   sr    │   142  │
// │   en    │   142  │
// └─────────┴────────┘
```

---

### 10. Tester toutes les traductions

#### JavaScript

```javascript
/**
 * Teste que toutes les clés existent dans toutes les langues
 */
function testTranslationsCompleteness() {
  const languages = ["fr", "sr", "en"];
  const allKeys = new Set();
  const missingKeys = {};

  // Collecte toutes les clés de toutes les langues
  languages.forEach((lang) => {
    const keys = getAllKeys(window.SITE_TRANSLATIONS[lang]);
    keys.forEach((key) => allKeys.add(key));
  });

  // Vérifie que chaque langue a toutes les clés
  languages.forEach((lang) => {
    missingKeys[lang] = [];

    allKeys.forEach((key) => {
      if (!hasKey(window.SITE_TRANSLATIONS[lang], key)) {
        missingKeys[lang].push(key);
      }
    });
  });

  // Affiche le rapport
  console.group("🧪 Test de complétude des traductions");

  languages.forEach((lang) => {
    if (missingKeys[lang].length === 0) {
      console.log(`✅ ${lang.toUpperCase()}: Complet (${allKeys.size} clés)`);
    } else {
      console.error(
        `❌ ${lang.toUpperCase()}: ${missingKeys[lang].length} clés manquantes`,
        missingKeys[lang],
      );
    }
  });

  console.groupEnd();

  return missingKeys;
}

function getAllKeys(obj, prefix = "") {
  const keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "string") {
      keys.push(fullKey);
    } else if (typeof obj[key] === "object") {
      keys.push(...getAllKeys(obj[key], fullKey));
    }
  }

  return keys;
}

function hasKey(obj, keyPath) {
  const parts = keyPath.split(".");
  let current = obj;

  for (const part of parts) {
    if (current && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }

  return typeof current === "string";
}

// Appel: testTranslationsCompleteness()
```

---

## 🧪 Console de Test

### Commandes utiles dans la console navigateur (F12)

```javascript
// 1. Changer de langue
translatePage("sr");

// 2. Voir la langue actuelle
getCurrentLanguage();

// 3. Voir toutes les traductions
console.log(window.SITE_TRANSLATIONS);

// 4. Voir les traductions du footer en serbe
console.log(window.SITE_TRANSLATIONS.sr.footer);

// 5. Compter les éléments avec data-i18n
document.querySelectorAll("[data-i18n]").length;

// 6. Lister tous les data-i18n du footer
Array.from(document.querySelectorAll(".footer [data-i18n]")).map((el) =>
  el.getAttribute("data-i18n"),
);

// 7. Tester une résolution de clé
resolveTranslationKey(window.SITE_TRANSLATIONS.sr, "footer.explore.sessions");

// 8. Forcer une retraduction
applyTranslations(getCurrentLanguage());

// 9. Compter les traductions
countTranslations();

// 10. Test de complétude
testTranslationsCompleteness();
```

---

## 🎯 Raccourcis Clavier (Bookmarklets)

### Créer des raccourcis pour changer de langue

1. Créer un nouveau marque-page dans votre navigateur
2. Dans l'URL, coller le code suivant :

#### Français

```javascript
javascript: (function () {
  translatePage("fr");
})();
```

#### Serbe

```javascript
javascript: (function () {
  translatePage("sr");
})();
```

#### Anglais

```javascript
javascript: (function () {
  translatePage("en");
})();
```

#### Cycle entre langues

```javascript
javascript: (function () {
  const langs = ["fr", "sr", "en"];
  const current = getCurrentLanguage();
  const index = langs.indexOf(current);
  const next = langs[(index + 1) % langs.length];
  translatePage(next);
})();
```

---

**💻 Fin des code snippets - Système de traduction Yoga App**

**Tous les codes sont prêts à copier-coller et fonctionnels !**
