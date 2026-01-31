# 🌍 Guide Complet du Système i18n (Internationalisation)

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Utilisation](#utilisation)
3. [Traduction du contenu](#traduction-du-contenu)
4. [Traduction des attributs](#traduction-des-attributs)
5. [Contenu dynamique](#contenu-dynamique)
6. [Dépannage](#dépannage)
7. [Bonnes pratiques](#bonnes-pratiques)

---

## 🏗️ Architecture

### Fichiers impliqués

- **`js/language.js`** — Moteur de traduction (détection, application, observer)
- **`js/translations.js`** — Dictionnaire multilingue (FR, SR, EN)
- **`js/footer-loader.js`** — Charge le footer et déclenche re-traduction
- **`js/app.js`** — Logique applicative

### Langues supportées

| Code | Langue   | Défaut |
| ---- | -------- | ------ |
| `fr` | Français | ✅ Oui |
| `sr` | Serbe    | -      |
| `en` | English  | -      |

### Flux d'initialisation

```
1. Chargement du DOM (defer sur tous les scripts)
2. Chargement de translations.js (SITE_TRANSLATIONS)
3. Initialisation language.js (initializeTranslations())
4. Détection langue: localStorage → navigator.languages → défaut
5. Application des traductions au DOM
6. Configuration du bouton de changement de langue
7. MutationObserver pour contenu dynamique
```

---

## 🚀 Utilisation

### Initialisation automatique

```javascript
// Automatique au chargement - pas besoin d'appel manuel
// language.js initialise l'i18n au DOMContentLoaded
```

### API publique (console ou scripts externes)

```javascript
// Changer de langue
window.translatePage("en"); // Français → Anglais
window.translatePage("sr"); // Anglais → Serbe
window.translatePage("fr"); // Retour au français

// Récupérer la langue actuelle
window.getCurrentLanguage(); // Retourne: 'fr', 'sr' ou 'en'
window.getCurrentLanguageName(); // Retourne: 'Français', 'Srpski', 'English'

// Forcer une langue (avancé)
window.setLanguage("en"); // Direct, sans localStorage
```

### Exemple en console

```javascript
// Dans la console du navigateur
translatePage("en");
// ✅ "🌐 Changement de langue: English (en)"
// Toute la page se traduit instantanément

getCurrentLanguage();
// ✅ "en"
```

---

## 📝 Traduction du contenu

### 1️⃣ Texte HTML statique - `data-i18n`

**HTML:**

```html
<h1 data-i18n="home.cta.title">Commencez votre voyage aujourd'hui</h1>
```

**Traductions (translations.js):**

```javascript
const SITE_TRANSLATIONS = {
  fr: {
    home: {
      cta: {
        title: "Commencez votre voyage aujourd'hui",
      },
    },
  },
  sr: {
    home: {
      cta: {
        title: "Започните своје путовање данас",
      },
    },
  },
  en: {
    home: {
      cta: {
        title: "Start Your Journey Today",
      },
    },
  },
};
```

**Résultat:**

```html
<!-- En français -->
<h1 data-i18n="home.cta.title">Commencez votre voyage aujourd'hui</h1>

<!-- En anglais (après changeLanguage('en')) -->
<h1 data-i18n="home.cta.title">Start Your Journey Today</h1>
```

### ✅ Toutes les clés utilisées

#### Accueil (index.html)

- `hero.title` — Titre principal
- `hero.subtitle` — Sous-titre
- `hero.daily` — Bouton "Séance du jour"
- `hero.breathing` — Bouton "Respiration rapide"
- `hero.gentle` — Bouton "Étirement doux"
- `auth.login` — "Se connecter"
- `auth.register` — "Créer un compte"
- `auth.demo` — "Demo"
- `auth.dashboard` — "Mon espace"
- `auth.logout` — "Déconnexion"
- `features.title` — "Un yoga fait pour vous"
- `features.understand.title` — "Comprendre"
- `features.understand.desc` — Description
- `features.practice.title` — "Pratiquer"
- `features.practice.desc` — Description
- `features.progress.title` — "Progresser"
- `features.progress.desc` — Description
- `features.feel.title` — "Ressentir"
- `features.feel.desc` — Description
- `yoga.title` — "Qu'est-ce que le yoga ?"
- `yoga.intro` — Description yoga
- `yoga.benefit1.title` — "Réduction du stress"
- `yoga.benefit1.desc` — Description
- `yoga.benefit2.title` — "Flexibilité accrue"
- `yoga.benefit2.desc` — Description
- `yoga.benefit3.title` — "Force physique"
- `yoga.benefit3.desc` — Description
- `sessions.title` — "Séances populaires"
- `sessions.viewAll` — "Voir toutes les séances"
- `home.cta.title` — "Commencez votre voyage..."
- `home.cta.description` — Description CTA
- `home.cta.button` — Bouton CTA
- `newsletter.title` — "Restez informé"
- `newsletter.description` — Description newsletter
- `newsletter.placeholder` → **voir attributs**
- `newsletter.subscribe` — "S'abonner"

#### Footer (includes/footer.html)

- `footer.brand.title` — "Yoga App"
- `footer.brand.tagline` — "Votre compagnon..."
- `footer.explore.title` — "Explorer"
- `footer.explore.sessions` — "Séances"
- `footer.explore.breathing` — "Respiration"
- `footer.explore.learning` — "Apprendre"
- `footer.account.title` — "Compte"
- `footer.account.login` — "Connexion"
- `footer.account.register` — "Inscription"
- `footer.account.dashboard` — "Mon espace"
- `footer.legal.title` — "Légal"
- `footer.legal.privacy` — "Confidentialité"
- `footer.legal.terms` — "CGU"
- `footer.legal.contact` — "Contact"
- `footer.copyright` — "© 2026 Yoga App..."

#### Commun

- `common.aria.language` — Aria-label bouton langue
- `common.aria.theme` — Aria-label bouton thème

---

## 🏷️ Traduction des attributs

### 2️⃣ Placeholder, Title, Alt - `data-i18n-*`

**Attributs supportés:**

- `data-i18n-placeholder` — Pour les `<input>`
- `data-i18n-title` — Pour les tooltips
- `data-i18n-alt` — Pour les images
- `data-i18n-aria-label` — Pour l'accessibilité

**HTML:**

```html
<!-- Input avec placeholder traduit -->
<input
  type="email"
  placeholder="Votre email"
  data-i18n-placeholder="newsletter.placeholder"
/>

<!-- Image avec alt traduit -->
<img src="yoga.jpg" alt="Pose de yoga" data-i18n-alt="yoga.image.alt" />

<!-- Bouton avec aria-label traduit -->
<button
  aria-label="Changer de langue"
  data-i18n-aria-label="common.aria.language"
>
  🌐
</button>
```

**Traductions (translations.js):**

```javascript
const SITE_TRANSLATIONS = {
  fr: {
    newsletter: {
      placeholder: "Votre email",
    },
    yoga: {
      image: {
        alt: "Pose de yoga relaxante",
      },
    },
    common: {
      aria: {
        language: "Changer de langue",
      },
    },
  },
  en: {
    newsletter: {
      placeholder: "Your email",
    },
    yoga: {
      image: {
        alt: "Relaxing yoga pose",
      },
    },
    common: {
      aria: {
        language: "Change language",
      },
    },
  },
};
```

**Résultat:**

```html
<!-- En français -->
<input placeholder="Votre email" ... />

<!-- En anglais -->
<input placeholder="Your email" ... />
```

---

## ⚙️ Contenu dynamique

### 3️⃣ JavaScript injecte du contenu - MutationObserver

**Problème:** Le contenu injecté via JavaScript n'est pas traduit automatiquement.

**Solution:** Language.js observe les changements du DOM et traduit automatiquement les nouveaux éléments avec `data-i18n`.

**Exemple:**

```javascript
// Votre code JavaScript
const newElement = document.createElement("h2");
newElement.setAttribute("data-i18n", "footer.explore.title");
newElement.textContent = "Explorer"; // Fallback
document.body.appendChild(newElement);

// ✅ MutationObserver détecte le nouvel élément
// ✅ Il est automatiquement traduit dans la langue actuelle
```

**Pour injection dynamique correcte:**

```javascript
// ✅ BON - Ajoute data-i18n
const element = document.createElement("h2");
element.setAttribute("data-i18n", "section.title");
element.textContent = "Texte par défaut";
document.body.appendChild(element);
// → Sera traduit automatiquement

// ✅ BON - Avec placeholder traduit
const input = document.createElement("input");
input.setAttribute("data-i18n-placeholder", "form.email");
input.placeholder = "Email (par défaut)";
document.body.appendChild(input);
// → Placeholder sera traduit automatiquement

// ❌ MAUVAIS - Pas de traduction
const element = document.createElement("h2");
element.textContent = "Titre non traduit";
document.body.appendChild(element);
// → Reste en français même après changement de langue
```

---

## 🔍 Dépannage

### ❌ Un texte ne se traduit pas

**Checklist:**

1. ✅ L'élément a-t-il `data-i18n="clé"`?
2. ✅ La clé existe-t-elle dans `translations.js`?
3. ✅ La structure JSON est-elle correcte?
4. ✅ Pas de typos dans la clé?

**Exemple d'erreur:**

```html
<!-- ❌ Clé manquante -->
<h2 data-i18n="home.missing.key">Titre</h2>
```

**Console:**

```
⚠️ Traduction manquante: "home.missing.key"
```

**Solution:**

```javascript
// Ajouter à translations.js
const SITE_TRANSLATIONS = {
  fr: {
    home: {
      missing: {
        key: "Titre traduit",
      },
    },
  },
};
```

### ❌ Les attributs (placeholder, alt) ne se traduisent pas

**Checklist:**

1. ✅ L'attribut utilise-t-il `data-i18n-*`?
2. ✅ Le format est correct? (`data-i18n-placeholder`, pas `data-i18n-title-placeholder`)

**Exemple d'erreur:**

```html
<!-- ❌ Mauvais format -->
<input data-i18n="email.placeholder" />

<!-- ✅ Bon format -->
<input data-i18n-placeholder="email.placeholder" />
```

### ❌ Le contenu injecté n'est pas traduit

**Checklist:**

1. ✅ L'élément injecté a-t-il `data-i18n`?
2. ✅ L'injection est-elle dans le `<body>`? (MutationObserver l'observe)
3. ✅ Y a-t-il une clé de traduction?

**Exemple d'erreur:**

```javascript
// ❌ Pas de clé
const el = document.createElement("h2");
el.textContent = "Texte";
document.body.appendChild(el);
// → Pas traduit

// ✅ Avec clé
const el = document.createElement("h2");
el.setAttribute("data-i18n", "section.title");
el.textContent = "Texte par défaut";
document.body.appendChild(el);
// → Traduit automatiquement
```

### ❌ Erreurs console

**`❌ Traductions introuvables pour "xx"`**

```
Cause: SITE_TRANSLATIONS n'est pas chargé ou langue invalide
Solution: Vérifier que translations.js est chargé avant language.js
```

**`⚠️ Traduction manquante: "clé"`**

```
Cause: La clé n'existe pas dans SITE_TRANSLATIONS
Solution: L'ajouter à translations.js
```

---

## 💡 Bonnes pratiques

### 1️⃣ Structure des clés

```javascript
// ✅ BON - Structure logique
{
  home: {
    hero: {
      title: "...",
      subtitle: "..."
    }
  }
}

// ❌ MAUVAIS - Clés plates
{
  "home.hero.title": "...",
  "home.hero.subtitle": "..."
}
```

### 2️⃣ Nommage des clés

```javascript
// ✅ BON - Descriptif
hero.title;
footer.legal.privacy;
newsletter.subscribe;

// ❌ MAUVAIS - Vague
title;
text;
button1;
```

### 3️⃣ Cohérence multi-langue

```javascript
// ✅ BON - Même structure dans toutes les langues
{
  fr: { home: { title: "..." } },
  sr: { home: { title: "..." } },
  en: { home: { title: "..." } }
}

// ❌ MAUVAIS - Clés différentes par langue
{
  fr: { home: { title: "..." } },
  en: { homepage: { main_title: "..." } }  // Clé différente!
}
```

### 4️⃣ Fallback texte

```html
<!-- ✅ BON - Texte par défaut en cas de traduction manquante -->
<h1 data-i18n="hero.title">Prenez 15 minutes pour vous</h1>

<!-- ❌ MAUVAIS - Pas de fallback -->
<h1 data-i18n="hero.title"></h1>
```

### 5️⃣ Ordre des scripts

```html
<!-- ✅ BON - translations.js AVANT language.js -->
<script defer src="js/translations.js"></script>
<script defer src="js/language.js"></script>

<!-- ❌ MAUVAIS - Ordre inversé -->
<script defer src="js/language.js"></script>
<script defer src="js/translations.js"></script>
```

### 6️⃣ Validation de la langue

```javascript
// ✅ BON - Vérifier avant d'utiliser
const lang = getCurrentLanguage();
if (["fr", "sr", "en"].includes(lang)) {
  // Sûr d'utiliser
}

// ❌ MAUVAIS - Supposer la langue
const lang = localStorage.getItem("lang");
applyTranslations(lang); // Peut crash si invalide
```

---

## 📊 Architecture MutationObserver

```javascript
// language.js observe automatiquement:

// 1. Ajout de nouveaux éléments [data-i18n]
const newEl = document.createElement("h2");
newEl.setAttribute("data-i18n", "new.key");
document.body.appendChild(newEl);
// ✅ Automatiquement traduit

// 2. Changement d'attributs data-i18n-*
input.setAttribute("data-i18n-placeholder", "new.placeholder.key");
// ✅ Automatiquement traduit

// 3. Sous-arbres du DOM (subtree: true)
const container = document.createElement("div");
const child = document.createElement("h2");
child.setAttribute("data-i18n", "child.title");
container.appendChild(child);
document.body.appendChild(container);
// ✅ Automatiquement traduit
```

---

## 🔄 Événement personnalisé

```javascript
// Écouter le changement de langue
document.addEventListener("languageChanged", (event) => {
  const lang = event.detail.language;
  console.log(`Langue changée: ${lang}`);
  // Votre code métier...
});

// Changer de langue
translatePage("en");
// → Déclenche l'événement 'languageChanged' avec { language: 'en' }
```

---

## ✅ Checklist de validation

- [ ] Aucun texte en langue source visible à l'écran
- [ ] Changement de langue instantané sans rechargement
- [ ] Console clean (aucun warning non-attendu)
- [ ] Placeholders, alt, aria-labels traduits
- [ ] Contenu dynamique traduit automatiquement
- [ ] localStorage sauvegarde la langue choisie
- [ ] Détection navigateur fonctionne (sans localStorage)
- [ ] Fallback vers français fonctionnel
- [ ] Responsive et mobile OK
- [ ] Code cohérent et maintenable

---

## 📚 Ressources

- [MDN - Internationalization](<https://developer.mozilla.org/en-US/docs/Glossary/Internationalization_(i18n)>)
- [navigator.languages](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

---

**Dernière mise à jour:** 29 janvier 2026
**Statut:** ✅ Production Ready
