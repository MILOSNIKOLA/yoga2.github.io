# 🚀 TEMPLATE RAPIDE - Implémentation en 5 minutes

## ⚡ QUICK START

### Étape 1 : Inclure les scripts (2 lignes)

Dans votre HTML, avant `</body>` :

```html
<script src="js/translations.js"></script>
<script src="js/universal-language.js"></script>
```

---

### Étape 2 : Ajouter le bouton (copier-coller)

```html
<!-- Language Toggle Button -->
<button id="language-toggle" aria-label="Change language">
  <svg width="32" height="24" viewBox="0 0 32 24">
    <rect width="32" height="24" fill="#012169" />
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4" />
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5" />
    <path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8" />
    <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5" />
  </svg>
</button>
```

---

### Étape 3 : Style du bouton (copier-coller dans `<style>`)

```css
#language-toggle {
  position: fixed;
  top: 20px;
  right: 80px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #7c3aed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#language-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

#language-toggle svg {
  border-radius: 50%;
}
```

---

### Étape 4 : Marquer les éléments à traduire

Ajoutez `data-i18n` sur vos éléments :

```html
<!-- AVANT -->
<h1>Mon titre</h1>

<!-- APRÈS -->
<h1 data-i18n="mapage.titre">Mon titre</h1>
```

---

### Étape 5 : Créer les traductions

Dans `js/translations.js`, ajoutez votre page :

```javascript
const SITE_TRANSLATIONS = {
  fr: {
    // Vos pages existantes...

    // NOUVELLE PAGE
    mapage: {
      titre: "Mon titre en français",
      description: "Ma description en français",
    },
  },

  sr: {
    mapage: {
      titre: "Мој наслов на српском",
      description: "Мој опис на српском",
    },
  },

  en: {
    mapage: {
      titre: "My title in English",
      description: "My description in English",
    },
  },
};
```

---

## ✅ C'EST FAIT !

Ouvrez votre page et cliquez sur le bouton de langue. Le contenu change instantanément ! 🎉

---

## 📋 CHECKLIST

- [ ] Scripts inclus (translations.js + universal-language.js)
- [ ] Bouton #language-toggle ajouté
- [ ] Style CSS du bouton ajouté
- [ ] Attributs data-i18n ajoutés aux éléments
- [ ] Traductions créées dans translations.js (3 langues)
- [ ] Testé en cliquant sur le bouton

---

## 🎯 EXEMPLES DE CLÉS

### Bonnes conventions :

```html
<h1 data-i18n="sessions.title">Séances</h1>
<p data-i18n="sessions.intro">Introduction...</p>
<button data-i18n="sessions.filters.all">Toutes</button>
<span data-i18n="sessions.duration.short">5-10 min</span>
```

### Structure :

```
page.section.element
```

---

## 🔧 TYPES D'ATTRIBUTS

### Texte (`data-i18n`)

```html
<h1 data-i18n="page.titre">Titre</h1>
<p data-i18n="page.texte">Paragraphe</p>
```

### Placeholder (`data-i18n-placeholder`)

```html
<input data-i18n-placeholder="form.email" placeholder="Email" />
```

### Tooltip (`data-i18n-title`)

```html
<button data-i18n-title="tooltip.save" title="Sauvegarder">💾</button>
```

### Aria-label (`data-i18n-aria`)

```html
<button data-i18n-aria="aria.close" aria-label="Fermer">×</button>
```

---

## 📦 TEMPLATE COMPLET

Copiez ce template pour créer une nouvelle page :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma Page - Yoga App</title>
    <link rel="stylesheet" href="css/styles.css" />
    <style>
      #language-toggle {
        position: fixed;
        top: 20px;
        right: 80px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        border: 2px solid #7c3aed;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      #language-toggle:hover {
        transform: scale(1.1);
      }
      #language-toggle svg {
        border-radius: 50%;
      }
    </style>
  </head>
  <body>
    <!-- Language Toggle -->
    <button id="language-toggle" aria-label="Change language">
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect width="32" height="24" fill="#012169" />
        <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4" />
        <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5" />
        <path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8" />
        <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5" />
      </svg>
    </button>

    <!-- Votre contenu -->
    <main>
      <h1 data-i18n="mapage.titre">Mon Titre</h1>
      <p data-i18n="mapage.description">Ma description...</p>
      <button data-i18n="mapage.cta">Mon bouton</button>
    </main>

    <!-- Scripts (IMPORTANT : à la fin) -->
    <script src="js/translations.js"></script>
    <script src="js/universal-language.js"></script>
  </body>
</html>
```

Et dans `js/translations.js` :

```javascript
const SITE_TRANSLATIONS = {
  fr: {
    mapage: {
      titre: "Mon Titre",
      description: "Ma description...",
      cta: "Mon bouton",
    },
  },
  sr: {
    mapage: {
      titre: "Мој наслов",
      description: "Мој опис...",
      cta: "Моје дугме",
    },
  },
  en: {
    mapage: {
      titre: "My Title",
      description: "My description...",
      cta: "My button",
    },
  },
};
```

---

## 🎓 EXEMPLES PAR TYPE DE PAGE

### 📄 Page de contenu (ex: learning.html)

```javascript
learning: {
  title: "Apprendre le Yoga",
  intro: "Découvrez les bases...",
  sections: {
    theory: "Théorie",
    practice: "Pratique",
    benefits: "Bienfaits"
  }
}
```

### 📝 Page formulaire (ex: contact.html)

```javascript
contact: {
  title: "Contactez-nous",
  form: {
    name: "Votre nom",
    email: "Votre email",
    message: "Votre message",
    submit: "Envoyer"
  }
}
```

### 🎮 Page dashboard (ex: dashboard.html)

```javascript
dashboard: {
  welcome: "Bienvenue",
  stats: {
    sessions: "Séances complétées",
    time: "Temps total",
    streak: "Série actuelle"
  },
  actions: {
    start: "Commencer une séance",
    browse: "Parcourir",
    settings: "Paramètres"
  }
}
```

### 🔐 Page auth (ex: login.html)

```javascript
login: {
  title: "Se connecter",
  email: "Email",
  password: "Mot de passe",
  submit: "Connexion",
  forgot: "Mot de passe oublié ?",
  register: "Créer un compte"
}
```

---

## ⚡ RACCOURCIS

### Traduire un titre + paragraphe + bouton

```html
<h1 data-i18n="page.title">Titre</h1>
<p data-i18n="page.text">Texte</p>
<button data-i18n="page.cta">Action</button>
```

### Traduire une liste

```html
<ul data-i18n="page.list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

### Traduire un formulaire

```html
<input data-i18n-placeholder="form.name" placeholder="Nom" />
<input data-i18n-placeholder="form.email" placeholder="Email" />
<button data-i18n="form.submit">Envoyer</button>
```

---

## 🔍 TROUVER LES TEXTES À TRADUIRE

### Méthode 1 : Recherche dans le fichier

Recherchez tous les textes visibles :

- Titres `<h1>`, `<h2>`, `<h3>`
- Paragraphes `<p>`
- Boutons `<button>`
- Liens `<a>`
- Labels `<label>`
- Placeholders `placeholder="..."`

### Méthode 2 : Inspection visuelle

Ouvrez la page et notez tous les textes affichés.

### Méthode 3 : Console

Utilisez ce script dans la console :

```javascript
// Trouver tous les textes non traduits
document.querySelectorAll("h1, h2, h3, p, button, a, label").forEach((el) => {
  if (!el.hasAttribute("data-i18n")) {
    console.log("Non traduit:", el.textContent.trim());
  }
});
```

---

## 📱 RESPONSIVE

Le bouton s'adapte automatiquement sur mobile. Ajoutez ce media query :

```css
@media (max-width: 768px) {
  #language-toggle {
    top: 10px;
    right: 60px;
    width: 35px;
    height: 35px;
  }
}
```

---

## 🐛 DEBUG RAPIDE

### Vérifier si le système est actif :

Ouvrez la console (F12) :

```javascript
// Langue actuelle
languageSystem.getCurrentLanguage();

// Changer manuellement
languageSystem.setLanguage("sr");

// Tester une traduction
languageSystem.getTranslation("privacy.title");
```

### Compter les éléments traduits :

```javascript
document.querySelectorAll("[data-i18n]").length;
```

---

## ✨ ASTUCES

### 1. Testez sur une petite page d'abord

Commencez par une page simple (contact.html) avant d'attaquer les grosses pages.

### 2. Utilisez des noms de clés cohérents

```
page.section.element
sessions.filters.all
dashboard.stats.time
```

### 3. Gardez le texte par défaut dans le HTML

```html
<h1 data-i18n="page.title">Titre par défaut</h1>
```

Si les traductions ne chargent pas, le texte par défaut s'affiche.

### 4. Groupez les traductions par section

```javascript
contact: {
  form: { /* tous les champs du formulaire */ },
  info: { /* toutes les infos de contact */ }
}
```

---

## 🎯 TEMPS ESTIMÉ PAR PAGE

| Type de page          | Temps     | Éléments |
| --------------------- | --------- | -------- |
| Simple (contact)      | 5-10 min  | 10-15    |
| Moyenne (sessions)    | 10-20 min | 20-30    |
| Complexe (dashboard)  | 20-30 min | 30-50    |
| Très complexe (admin) | 30-45 min | 50+      |

---

## 📞 BESOIN D'AIDE ?

1. Consultez `GUIDE-IMPLEMENTATION-UNIVERSEL.md`
2. Testez avec `test-universel.html`
3. Regardez `confidentialite-UPDATED.html` comme exemple
4. Ouvrez la console (F12) pour les messages de debug

---

**Bon courage ! 🚀**  
Le système est fait pour être **simple** et **rapide**. 💪
