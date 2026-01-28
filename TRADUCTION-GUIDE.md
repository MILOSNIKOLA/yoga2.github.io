# 🌍 Système de Traduction Multi-Langues

## 📋 Vue d'ensemble

Ce système permet de traduire automatiquement votre site web en trois langues :

- 🇫🇷 **Français (fr)** - Langue par défaut
- 🇷🇸 **Serbe (sr)**
- 🇬🇧 **Anglais (en)**

## ✨ Fonctionnalités

✅ **Changement instantané** - Pas de rechargement de page  
✅ **Sauvegarde automatique** - La préférence est enregistrée dans localStorage  
✅ **Interface intuitive** - Clic sur le drapeau pour changer de langue  
✅ **Ordre cyclique** - FR → SR → EN → FR...  
✅ **SEO-friendly** - Attribut `lang` mis à jour automatiquement  
✅ **Extensible** - Facile d'ajouter de nouvelles traductions

## 🚀 Utilisation

### Pour l'utilisateur

1. Cliquez sur le drapeau en haut à gauche de la page
2. La langue change automatiquement dans l'ordre : Français → Serbe → Anglais
3. Votre choix est sauvegardé et sera restauré à votre prochaine visite

### Pour le développeur

#### 1. Ajouter une traduction à un élément HTML

Ajoutez l'attribut `data-i18n` avec la clé de traduction :

```html
<h1 data-i18n="hero.title">Prenez 15 minutes pour vous</h1>
<p data-i18n="hero.subtitle">Retrouvez calme et bien-être</p>
<button data-i18n="auth.login">Se connecter</button>
```

#### 2. Définir les traductions dans JavaScript

Dans `js/language.js`, ajoutez vos traductions dans l'objet `translations` :

```javascript
const translations = {
  fr: {
    "hero.title": "Prenez 15 minutes pour vous",
    "hero.subtitle": "Retrouvez calme et bien-être",
    "auth.login": "Se connecter",
  },
  sr: {
    "hero.title": "Odvojite 15 minuta za sebe",
    "hero.subtitle": "Pronađite mir i dobrobit",
    "auth.login": "Prijavite se",
  },
  en: {
    "hero.title": "Take 15 Minutes for Yourself",
    "hero.subtitle": "Find calm and well-being",
    "auth.login": "Log In",
  },
};
```

#### 3. Convention de nommage des clés

Utilisez une structure hiérarchique pour organiser vos traductions :

```
section.element.propriété
```

Exemples :

- `hero.title` - Titre de la section hero
- `features.understand.title` - Titre de la carte "Comprendre"
- `auth.login` - Bouton de connexion
- `aria.language` - Label ARIA pour accessibilité

## 📁 Structure des fichiers

```
/
├── index.html              # Page principale avec attributs data-i18n
├── demo-traduction.html    # Page de démonstration du système
├── js/
│   └── language.js         # Système de traduction complet
└── css/
    └── styles.css          # Styles du bouton de langue
```

## 🔧 Architecture technique

### Fichier : `js/language.js`

**Fonctions principales :**

- `initLanguage()` - Initialise la langue au chargement (depuis localStorage ou FR par défaut)
- `setLanguage(lang)` - Change la langue active et applique les traductions
- `applyTranslations(lang)` - Parcourt le DOM et remplace les textes
- `setupLanguageToggle()` - Configure le bouton de changement de langue
- `getCurrentLanguage()` - Retourne la langue actuellement active

**Objets de données :**

- `languages` - Configuration des langues avec SVG des drapeaux
- `translations` - Toutes les traductions organisées par langue
- `languageOrder` - Ordre de rotation des langues

### Processus de traduction

1. L'utilisateur clique sur le bouton `#language-toggle`
2. `setLanguage()` est appelée avec la nouvelle langue
3. La langue est sauvegardée dans `localStorage.setItem('preferred-language', lang)`
4. L'attribut `lang` du HTML est mis à jour : `<html lang="fr">`
5. Le drapeau du bouton est changé
6. `applyTranslations()` parcourt tous les éléments `[data-i18n]`
7. Le texte de chaque élément est remplacé par la traduction correspondante

## 🎨 Personnalisation

### Changer l'ordre des langues

Dans `js/language.js`, modifiez :

```javascript
const languageOrder = ["fr", "sr", "en"]; // Ordre actuel
// Pour commencer par l'anglais :
const languageOrder = ["en", "fr", "sr"];
```

### Changer la langue par défaut

Dans `js/language.js`, ligne 43 :

```javascript
function initLanguage() {
  const savedLang = localStorage.getItem("preferred-language") || "fr"; // Changez "fr"
  setLanguage(savedLang);
}
```

### Ajouter une nouvelle langue

1. Ajoutez le drapeau dans l'objet `languages` :

```javascript
const languages = {
  // ...langues existantes
  de: {
    name: "Deutsch",
    svg: `<svg><!-- SVG du drapeau allemand --></svg>`,
  },
};
```

2. Ajoutez l'ordre de la langue :

```javascript
const languageOrder = ["fr", "sr", "en", "de"];
```

3. Ajoutez toutes les traductions :

```javascript
const translations = {
  // ...traductions existantes
  de: {
    "hero.title": "Nehmen Sie sich 15 Minuten für sich selbst",
    // ...toutes les autres clés
  },
};
```

## 📱 Compatibilité

- ✅ Tous les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Support mobile complet
- ✅ localStorage supporté depuis IE8+
- ✅ Accessible (ARIA labels traduits)

## 🧪 Tester le système

1. Ouvrez `demo-traduction.html` dans votre navigateur
2. Cliquez sur le drapeau pour tester les changements de langue
3. Rechargez la page pour vérifier la persistance
4. Ouvrez la console pour voir les logs de changement de langue

## 💡 Bonnes pratiques

### ✅ À faire

- Toujours définir une traduction pour toutes les langues
- Utiliser des clés descriptives et organisées
- Garder le texte HTML original (pour le fallback)
- Traduire aussi les aria-label pour l'accessibilité
- Tester avec du contenu long (responsive)

### ❌ À éviter

- Ne pas mélanger du texte traduit et non traduit
- Ne pas utiliser d'emojis dans les clés de traduction
- Ne pas oublier de traductions (vérifier la console)
- Ne pas traduire les noms propres ou marques
- Ne pas imbriquer du HTML dans les traductions simples

## 🐛 Débogage

Si les traductions ne s'appliquent pas :

1. **Vérifier la console** - Des erreurs s'affichent si une clé est manquante
2. **Vérifier l'attribut data-i18n** - Assurez-vous qu'il correspond à une clé existante
3. **Vérifier localStorage** - Ouvrez DevTools > Application > Local Storage
4. **Vérifier l'ordre des scripts** - `language.js` doit être chargé avant utilisation

```javascript
// Pour vider le cache de langue :
localStorage.removeItem("preferred-language");
```

## 📊 Statistiques

- **Lignes de code JavaScript** : ~180 lignes
- **Nombre de traductions** : 20+ clés × 3 langues = 60+ traductions
- **Poids du fichier JS** : ~8 Ko (non compressé)
- **Performance** : Changement instantané (< 50ms)

## 🔗 Ressources

- [MDN - localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
- [MDN - data-\* attributes](https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes)
- [W3C - HTML lang attribute](https://www.w3.org/International/questions/qa-html-language-declarations)

## 📝 License

Libre d'utilisation et de modification pour vos projets.

---

**Créé avec ❤️ pour une expérience multilingue fluide**
