# 🔧 QUICK REFERENCE - i18n

## ⚡ Commandes rapides (Console)

```javascript
// Changer de langue
translatePage("en"); // → Anglais
translatePage("sr"); // → Serbe
translatePage("fr"); // → Français

// Récupérer infos
getCurrentLanguage(); // → Code: 'fr', 'sr', ou 'en'
getCurrentLanguageName(); // → Nom: 'Français', 'Srpski', 'English'

// Traductions
SITE_TRANSLATIONS.fr; // → Objet FR complet
SITE_TRANSLATIONS.en; // → Objet EN complet
SITE_TRANSLATIONS.sr; // → Objet SR complet

// localStorage
localStorage.getItem("site_language"); // → Récupérer langue sauvegardée
localStorage.setItem("site_language", "en"); // → Sauvegarder anglais
localStorage.removeItem("site_language"); // → Effacer
```

---

## 📝 Ajouter une traduction

### 1️⃣ Ajouter clé en HTML

```html
<!-- Ajouter data-i18n="clé.unique" -->
<h2 data-i18n="mySection.title">Texte par défaut</h2>
```

### 2️⃣ Ajouter traductions en translations.js

```javascript
// Français
fr: {
  mySection: {
    title: "Mon titre en français";
  }
}

// Serbe
sr: {
  mySection: {
    title: "Moj naslov na srpskom";
  }
}

// Anglais
en: {
  mySection: {
    title: "My title in English";
  }
}
```

### 3️⃣ Recharger

```
Page reload (Ctrl+R) → Traductions appliquées ✅
```

---

## 📋 Ajouter attribut traduit

### 1️⃣ HTML avec data-i18n-\*

```html
<!-- Placeholder -->
<input data-i18n-placeholder="form.email" />

<!-- Tooltip -->
<button data-i18n-title="button.save">Save</button>

<!-- Image alt -->
<img data-i18n-alt="image.yoga" src="yoga.jpg" />

<!-- Aria-label -->
<button data-i18n-aria-label="common.aria.close">✕</button>
```

### 2️⃣ Traductions

```javascript
fr: {
  form: { email: "Votre email" },
  button: { save: "Enregistrer" },
  image: { yoga: "Pose de yoga" },
  common: { aria: { close: "Fermer" } }
}
```

---

## 🌍 Ajouter une nouvelle langue

### 1️⃣ Ajouter code langue

```javascript
// languages (language.js)
const languages = {
  en: { name: "English", svg: "..." },
  fr: { name: "Français", svg: "..." },
  sr: { name: "Српски", svg: "..." },
  de: { name: "Deutsch", svg: "..." }, // ← Nouveau
};

// languageOrder
const languageOrder = ["fr", "sr", "en", "de"]; // ← Ajouter
```

### 2️⃣ Ajouter traductions

```javascript
// translations.js
const SITE_TRANSLATIONS = {
  fr: {
    /* ... */
  },
  sr: {
    /* ... */
  },
  en: {
    /* ... */
  },
  de: {
    /* Copier de FR et traduire */
  }, // ← Nouveau
};
```

### 3️⃣ Ajouter SVG drapeau

```javascript
const languages = {
  de: {
    name: "Deutsch",
    svg: `<svg class="flag-icon" width="32" height="24">
      <rect width="32" height="24" fill="#000"/>
      <rect y="8" width="32" height="8" fill="#D00"/>
      <rect y="16" width="32" height="8" fill="#FFCE00"/>
    </svg>`,
  },
};
```

---

## 🐛 Dépanner rapidement

### ❌ Rien ne se traduit

```javascript
// Étape 1: Vérifier SITE_TRANSLATIONS
window.SITE_TRANSLATIONS;
// ✅ Si objet → OK | ❌ Si undefined → translations.js pas chargé

// Étape 2: Vérifier langue
getCurrentLanguage();
// ✅ Si 'fr', 'sr', 'en' → OK | ❌ Si autre → problema

// Étape 3: Vérifier éléments
document.querySelectorAll("[data-i18n]").length;
// ✅ Si > 0 → OK | ❌ Si 0 → aucun élément à traduire

// Étape 4: Vérifier clé
SITE_TRANSLATIONS.fr["monCle"];
// ✅ Si texte → OK | ❌ Si undefined → clé manquante
```

### ❌ Console pleine d'erreurs

```javascript
// Vérifier ordre scripts en Network tab (F12)
// ✅ BON:   translations.js → language.js → footer.js → app.js
// ❌ MAUVAIS: language.js → translations.js

// Vérifier SITE_TRANSLATIONS créé avant language.js
// ✅ BON:   <script defer src="translations.js">
//           <script defer src="language.js">
```

### ❌ localStorage ne sauvegarde pas

```javascript
// Vérifier localStorage activé
try {
  localStorage.setItem("test", "1");
  localStorage.removeItem("test");
  // ✅ Si OK → localStorage fonctionne
} catch (e) {
  // ❌ Erreur : session privée ou restriction
}
```

---

## 📊 Structure clés

```
hero
  title
  subtitle
  daily
  breathing
  gentle

features
  title
  understand.title, understand.desc
  practice.title, practice.desc
  progress.title, progress.desc
  feel.title, feel.desc

home
  cta.title, cta.description, cta.button

footer
  brand.title, brand.tagline
  explore.title, explore.sessions, explore.breathing, explore.learning
  account.title, account.login, account.register, account.dashboard
  legal.title, legal.privacy, legal.terms, legal.contact
  copyright

common
  aria.language
  aria.theme

newsletter
  title, description, placeholder, subscribe
```

---

## 🎯 Résolution clé détaillée

```javascript
// Format clé: "section.subsection.key"

// 1. Chercher dans SITE_TRANSLATIONS
resolveTranslationKey(SITE_TRANSLATIONS.fr, 'footer.legal.privacy')

// 2. Parcourir la structure
SITE_TRANSLATIONS.fr
  → footer
    → legal
      → privacy  ← Trouvé!

// Résultat: "Confidentialité" (en FR)
```

---

## 🔍 Afficher toutes les clés manquantes

```javascript
const missing = [];
const allKeys = new Set();

// Récupérer toutes les clés utilisées
document.querySelectorAll("[data-i18n]").forEach((el) => {
  const key = el.getAttribute("data-i18n");
  if (key) {
    allKeys.add(key);

    // Vérifier si existe
    const parts = key.split(".");
    let value = SITE_TRANSLATIONS.fr;
    for (const part of parts) {
      if (value && value[part]) {
        value = value[part];
      } else {
        missing.push(key);
        break;
      }
    }
  }
});

console.log("Clés manquantes:", missing);
```

---

## 🚀 Performance check

```javascript
// Temps de changement de langue
console.time("traduction");
translatePage("en");
console.timeEnd("traduction");

// Résultat attendu: < 100ms ✅
```

---

## 📱 Debug mobile

```javascript
// Vérifier langue détectée sur mobile
console.log("Navigator languages:", navigator.languages);
console.log("Language détecté:", getCurrentLanguage());

// Vérifier localStorage sur mobile
console.log("Saved lang:", localStorage.getItem("site_language"));

// Simuler changement langue
translatePage("en");
console.log("Nouvelle langue:", getCurrentLanguage());
```

---

## 🎓 Patterns

### Traduction d'élément unique

```javascript
const el = document.querySelector('[data-i18n="hero.title"]');
const key = el.getAttribute("data-i18n");
const translation = SITE_TRANSLATIONS.fr[key.split(".")[1]][key.split(".")[2]];
el.textContent = translation;
```

### Traduction de groupe

```javascript
document.querySelectorAll('[data-i18n*="footer"]').forEach((el) => {
  const key = el.getAttribute("data-i18n");
  // Traduire...
});
```

### Traduction avec fallback

```javascript
function getText(key, lang = "fr") {
  let value = SITE_TRANSLATIONS[lang];
  for (const part of key.split(".")) {
    value = value?.[part];
  }
  return value || `[Missing: ${key}]`;
}

getText("hero.title"); // ✅ Traduction
getText("unknown.key"); // ✅ "[Missing: unknown.key]"
```

---

## 🔗 Raccourcis

| Ressource     | Chemin                                    |
| ------------- | ----------------------------------------- |
| Guide complet | `docs/i18n-GUIDE.md`                      |
| Validation    | `docs/i18n-VALIDATION.js`                 |
| Audit         | `docs/i18n-AUDIT-COMPLET.md`              |
| Étapes        | `docs/VALIDATION-STEPS.md`                |
| Résumé        | `i18n-SUMMARY.md`                         |
| Référence     | `docs/QUICK-REFERENCE.md` ← Vous êtes ici |

---

## ✅ Checklist avant production

- [ ] Aucun [data-i18n] sans valeur en translations.js
- [ ] localStorage fonctionne (test manual)
- [ ] Changement langue < 100ms
- [ ] 0 erreur console (rouge)
- [ ] Mobile responsive
- [ ] Placeholder, alt, aria-labels traduits
- [ ] 3 langues testées (FR, SR, EN)
- [ ] Rechargement conserve langue choisie
- [ ] Footer traduit correctement

---

**Dernière mise à jour:** 29 janvier 2026  
**Quickref version:** 1.0
