# 🌍 Guide d'Utilisation - Système i18n Générique

## 📋 Table des Matières

1. [Installation](#installation)
2. [Utilisation Basique](#utilisation-basique)
3. [Configuration Avancée](#configuration-avancée)
4. [Attributs HTML](#attributs-html)
5. [Exemples Pratiques](#exemples-pratiques)
6. [API Complète](#api-complète)
7. [FAQ](#faq)

---

## 🚀 Installation

### Étape 1 : Inclure les fichiers

Ajoutez ces fichiers dans votre projet :

```html
<!-- CSS -->
<link rel="stylesheet" href="i18n-system.css" />

<!-- JavaScript -->
<script src="i18n-system.js"></script>
```

### Étape 2 : Ajouter le bouton

```html
<button
  id="language-toggle"
  class="i18n-toggle"
  aria-label="Change language"
></button>
```

### Étape 3 : Initialiser

```html
<script>
  const i18n = new I18nSystem({
    defaultLang: "fr",
    languages: {
      fr: { code: "fr", name: "Français", flag: FLAGS.fr },
      en: { code: "en", name: "English", flag: FLAGS.en },
    },
    translations: {
      fr: { hello: "Bonjour" },
      en: { hello: "Hello" },
    },
  });
</script>
```

---

## 💡 Utilisation Basique

### 1. Marquer les éléments à traduire

Ajoutez l'attribut `data-i18n` avec une clé unique :

```html
<h1 data-i18n="page.title">Mon Site</h1>
<p data-i18n="page.description">Ceci est la description</p>
<button data-i18n="actions.submit">Envoyer</button>
```

### 2. Définir les traductions

```javascript
const i18n = new I18nSystem({
  translations: {
    fr: {
      page: {
        title: "Mon Site",
        description: "Ceci est la description",
      },
      actions: {
        submit: "Envoyer",
      },
    },
    en: {
      page: {
        title: "My Website",
        description: "This is the description",
      },
      actions: {
        submit: "Submit",
      },
    },
  },
});
```

### 3. C'est tout ! ✨

Le système gère automatiquement :

- Le changement de langue au clic
- La sauvegarde de la préférence
- La mise à jour des textes

---

## ⚙️ Configuration Avancée

### Options disponibles

```javascript
const i18n = new I18nSystem({
  // Langue par défaut
  defaultLang: "fr",

  // ID du bouton de langue
  toggleButtonId: "language-toggle",

  // Clé de stockage localStorage
  storageKey: "site-language",

  // Configuration des langues
  languages: {
    fr: {
      code: "fr",
      name: "Français",
      flag: FLAGS.fr, // SVG du drapeau
    },
    // ... autres langues
  },

  // Toutes les traductions
  translations: {
    fr: {
      /* ... */
    },
    en: {
      /* ... */
    },
  },

  // Callback lors du changement (optionnel)
  onLanguageChange: (lang, langConfig) => {
    console.log(`Langue: ${langConfig.name}`);
    // Votre code personnalisé ici
  },
});
```

---

## 📝 Attributs HTML

### 1. `data-i18n` - Texte

Traduit le contenu textuel de l'élément :

```html
<h1 data-i18n="title">Titre par défaut</h1>
```

### 2. `data-i18n-placeholder` - Placeholder

Traduit l'attribut `placeholder` des inputs :

```html
<input type="text" data-i18n-placeholder="form.name" placeholder="Nom" />
```

### 3. `data-i18n-title` - Title

Traduit l'attribut `title` (tooltip) :

```html
<button data-i18n-title="tooltip.save" title="Sauvegarder">💾</button>
```

---

## 🎯 Exemples Pratiques

### Exemple 1 : Site Simple

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <link rel="stylesheet" href="i18n-system.css" />
  </head>
  <body>
    <!-- Bouton de langue -->
    <button id="language-toggle" class="i18n-toggle"></button>

    <!-- Contenu -->
    <h1 data-i18n="welcome">Bienvenue</h1>
    <p data-i18n="description">Description du site</p>

    <!-- Scripts -->
    <script src="i18n-system.js"></script>
    <script>
      const i18n = new I18nSystem({
        defaultLang: "fr",
        languages: {
          fr: { code: "fr", name: "Français", flag: FLAGS.fr },
          en: { code: "en", name: "English", flag: FLAGS.en },
        },
        translations: {
          fr: {
            welcome: "Bienvenue",
            description: "Description du site",
          },
          en: {
            welcome: "Welcome",
            description: "Website description",
          },
        },
      });
    </script>
  </body>
</html>
```

### Exemple 2 : Formulaire

```html
<form>
  <label data-i18n="form.name">Nom</label>
  <input type="text" data-i18n-placeholder="form.name.placeholder" />

  <label data-i18n="form.email">Email</label>
  <input type="email" data-i18n-placeholder="form.email.placeholder" />

  <button data-i18n="form.submit">Envoyer</button>
</form>

<script>
  const i18n = new I18nSystem({
    translations: {
      fr: {
        form: {
          name: "Nom",
          email: "Email",
          submit: "Envoyer",
          name: { placeholder: "Entrez votre nom" },
          email: { placeholder: "votre@email.com" },
        },
      },
      en: {
        form: {
          name: "Name",
          email: "Email",
          submit: "Submit",
          name: { placeholder: "Enter your name" },
          email: { placeholder: "your@email.com" },
        },
      },
    },
  });
</script>
```

### Exemple 3 : Menu de Navigation

```html
<nav>
  <a href="/" data-i18n="nav.home">Accueil</a>
  <a href="/about" data-i18n="nav.about">À propos</a>
  <a href="/contact" data-i18n="nav.contact">Contact</a>
</nav>

<script>
  const i18n = new I18nSystem({
    translations: {
      fr: {
        nav: {
          home: "Accueil",
          about: "À propos",
          contact: "Contact",
        },
      },
      en: {
        nav: {
          home: "Home",
          about: "About",
          contact: "Contact",
        },
      },
    },
  });
</script>
```

---

## 🔧 API Complète

### Méthodes de l'instance

```javascript
const i18n = new I18nSystem(config);

// Changer de langue manuellement
i18n.setLanguage("en");

// Obtenir la langue actuelle
const currentLang = i18n.getCurrentLanguage(); // 'fr'

// Traduire une clé
const text = i18n.translate("welcome"); // "Bienvenue"

// Ajouter une nouvelle langue
i18n.addLanguage(
  "de",
  {
    code: "de",
    name: "Deutsch",
    flag: FLAGS.de,
  },
  {
    welcome: "Willkommen",
  },
);

// Ajouter des traductions à une langue existante
i18n.addTranslations("fr", {
  newSection: {
    title: "Nouveau titre",
  },
});
```

---

## 🎨 Personnalisation du Style

### Position du bouton

```html
<!-- En haut à gauche -->
<button id="language-toggle" class="i18n-toggle top-left"></button>

<!-- En bas à droite -->
<button id="language-toggle" class="i18n-toggle bottom-right"></button>

<!-- En bas à gauche -->
<button id="language-toggle" class="i18n-toggle bottom-left"></button>
```

### Bouton avec texte

```html
<button id="language-toggle" class="i18n-toggle-with-text">
  <span class="flag"></span>
  <span class="text">Français</span>
</button>
```

### Menu déroulant

```html
<div class="i18n-dropdown">
  <select id="language-select">
    <option value="fr">🇫🇷 Français</option>
    <option value="en">🇬🇧 English</option>
    <option value="sr">🇷🇸 Српски</option>
  </select>
</div>

<script>
  document.getElementById("language-select").addEventListener("change", (e) => {
    i18n.setLanguage(e.target.value);
  });
</script>
```

---

## 🌐 Drapeaux Disponibles

Le système inclut des drapeaux SVG pour :

- `FLAGS.fr` - 🇫🇷 Français
- `FLAGS.en` - 🇬🇧 Anglais
- `FLAGS.sr` - 🇷🇸 Serbe
- `FLAGS.de` - 🇩🇪 Allemand
- `FLAGS.es` - 🇪🇸 Espagnol
- `FLAGS.it` - 🇮🇹 Italien

### Ajouter votre propre drapeau

```javascript
const customFlag = `<svg>...</svg>`;

const i18n = new I18nSystem({
  languages: {
    custom: {
      code: "custom",
      name: "Ma Langue",
      flag: customFlag,
    },
  },
});
```

---

## 💾 Stockage

### localStorage

Par défaut, la langue est sauvegardée dans `localStorage` avec la clé `site-language`.

```javascript
// Lire
const lang = localStorage.getItem("site-language");

// Modifier
localStorage.setItem("site-language", "en");

// Supprimer (retour au défaut)
localStorage.removeItem("site-language");
```

### Personnaliser la clé

```javascript
const i18n = new I18nSystem({
  storageKey: "mon-site-langue", // Clé personnalisée
});
```

---

## 🔍 Débogage

### Activer les logs

Le système affiche automatiquement des logs dans la console :

```
[i18n] Système initialisé avec la langue: fr
[i18n] Langue changée: Français
```

### Vérifier les traductions manquantes

Si une clé n'a pas de traduction :

```
[i18n] Traduction manquante pour la clé "missing.key" en langue "fr"
```

---

## ❓ FAQ

### Q: Comment ajouter plus de langues ?

```javascript
i18n.addLanguage(
  "de",
  {
    code: "de",
    name: "Deutsch",
    flag: FLAGS.de,
  },
  {
    // Traductions allemandes
  },
);
```

### Q: Comment charger les traductions depuis un fichier JSON ?

```javascript
fetch("translations.json")
  .then((res) => res.json())
  .then((translations) => {
    const i18n = new I18nSystem({
      translations: translations,
    });
  });
```

### Q: Est-ce compatible avec React/Vue/Angular ?

Oui ! Mais il est recommandé d'utiliser les solutions natives :

- React: `react-i18next`
- Vue: `vue-i18n`
- Angular: `@ngx-translate`

Ce système est idéal pour les sites statiques ou Vanilla JS.

### Q: Comment traduire du contenu dynamique ?

```javascript
// Lors de l'ajout de contenu dynamique
const newElement = document.createElement("p");
newElement.setAttribute("data-i18n", "dynamic.text");
newElement.textContent = i18n.translate("dynamic.text");
document.body.appendChild(newElement);
```

### Q: Peut-on détecter la langue du navigateur ?

```javascript
const browserLang = navigator.language.split("-")[0]; // 'fr', 'en', etc.

const i18n = new I18nSystem({
  defaultLang: browserLang, // Utilise la langue du navigateur
});
```

---

## 🎯 Checklist d'Intégration

- [ ] Fichiers `i18n-system.js` et `i18n-system.css` inclus
- [ ] Bouton avec ID `#language-toggle` ajouté
- [ ] Attributs `data-i18n` sur tous les textes
- [ ] Configuration des langues définie
- [ ] Toutes les traductions ajoutées
- [ ] Tests sur tous les navigateurs
- [ ] Vérification du responsive mobile
- [ ] Tests de changement de langue
- [ ] Vérification du localStorage

---

## 🚀 Exemple Complet Minimal

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="i18n-system.css" />
  </head>
  <body>
    <button id="language-toggle" class="i18n-toggle"></button>
    <h1 data-i18n="title">Titre</h1>

    <script src="i18n-system.js"></script>
    <script>
      new I18nSystem({
        languages: {
          fr: { code: "fr", name: "FR", flag: FLAGS.fr },
          en: { code: "en", name: "EN", flag: FLAGS.en },
        },
        translations: {
          fr: { title: "Mon Site" },
          en: { title: "My Website" },
        },
      });
    </script>
  </body>
</html>
```

---

## 📚 Ressources

- **Fichier complet d'exemple** : `exemple-complet.html`
- **Démo en ligne** : Ouvrez `exemple-complet.html` dans votre navigateur
- **Code source** : `i18n-system.js`

---

**🎉 Votre site est maintenant multilingue ! 🌍**
