# 🌍 Système i18n Générique - Multilingue pour Tous Sites Web

Un système de traduction **léger, flexible et facile à utiliser** pour ajouter le support multilingue à n'importe quel site web.

## ✨ Caractéristiques

✅ **Universel** - Fonctionne sur n'importe quel site web  
✅ **Léger** - ~8 Ko de JavaScript  
✅ **Sans dépendances** - Vanilla JavaScript pur  
✅ **Instantané** - Changement sans rechargement  
✅ **Persistant** - Sauvegarde dans localStorage  
✅ **Extensible** - Facile d'ajouter des langues  
✅ **Responsive** - Adapté mobile  
✅ **Accessible** - Support ARIA

---

## 🚀 Démarrage Rapide (3 étapes)

### 1️⃣ Inclure les fichiers

```html
<link rel="stylesheet" href="i18n-system.css" />
<script src="i18n-system.js"></script>
```

### 2️⃣ Ajouter le bouton

```html
<button id="language-toggle" class="i18n-toggle"></button>
```

### 3️⃣ Initialiser

```html
<h1 data-i18n="title">Mon Site</h1>

<script>
  new I18nSystem({
    languages: {
      fr: { code: "fr", name: "Français", flag: FLAGS.fr },
      en: { code: "en", name: "English", flag: FLAGS.en },
    },
    translations: {
      fr: { title: "Mon Site" },
      en: { title: "My Website" },
    },
  });
</script>
```

**C'est tout ! Votre site est multilingue ! 🎉**

---

## 📁 Fichiers du Projet

```
📦 Système i18n Générique
│
├── 📄 i18n-system.js              # Système principal (classe I18nSystem)
├── 🎨 i18n-system.css             # Styles du bouton de langue
├── 🌐 exemple-complet.html        # Exemple complet fonctionnel
├── 📖 GUIDE-UTILISATION-GENERIQUE.md  # Documentation complète
└── 📝 README-GENERIQUE.md         # Ce fichier
```

---

## 📖 Documentation

### 📘 [GUIDE-UTILISATION-GENERIQUE.md](GUIDE-UTILISATION-GENERIQUE.md)

Documentation complète avec :

- Installation détaillée
- Configuration avancée
- Tous les attributs HTML
- Exemples pratiques
- API complète
- FAQ

### 🌐 [exemple-complet.html](exemple-complet.html)

Exemple fonctionnel complet avec :

- 3 langues (FR, SR, EN)
- Formulaire traduit
- Boutons d'action
- Placeholders traduits
- Style responsive

---

## 💡 Exemples d'Utilisation

### Exemple Minimal

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="i18n-system.css" />
  </head>
  <body>
    <!-- Bouton de langue -->
    <button id="language-toggle" class="i18n-toggle"></button>

    <!-- Contenu à traduire -->
    <h1 data-i18n="welcome">Bienvenue</h1>
    <p data-i18n="description">Ceci est mon site web</p>

    <!-- Scripts -->
    <script src="i18n-system.js"></script>
    <script>
      new I18nSystem({
        defaultLang: "fr",
        languages: {
          fr: { code: "fr", name: "Français", flag: FLAGS.fr },
          en: { code: "en", name: "English", flag: FLAGS.en },
        },
        translations: {
          fr: {
            welcome: "Bienvenue",
            description: "Ceci est mon site web",
          },
          en: {
            welcome: "Welcome",
            description: "This is my website",
          },
        },
      });
    </script>
  </body>
</html>
```

### Avec Formulaire

```html
<form>
  <label data-i18n="form.email">Email</label>
  <input type="email" data-i18n-placeholder="form.email.placeholder" />
  <button data-i18n="form.submit">Envoyer</button>
</form>

<script>
  new I18nSystem({
    translations: {
      fr: {
        form: {
          email: "Adresse e-mail",
          submit: "Envoyer",
          email: { placeholder: "votre@email.com" },
        },
      },
      en: {
        form: {
          email: "Email address",
          submit: "Submit",
          email: { placeholder: "your@email.com" },
        },
      },
    },
  });
</script>
```

---

## 🎨 Personnalisation

### Changer la position du bouton

```html
<!-- En haut à gauche -->
<button id="language-toggle" class="i18n-toggle top-left"></button>

<!-- En bas à droite -->
<button id="language-toggle" class="i18n-toggle bottom-right"></button>
```

### Personnaliser les couleurs (CSS)

```css
.i18n-toggle {
  background: #your-color;
  border-color: #your-border;
}

.i18n-toggle:hover {
  background: #your-hover-color;
}
```

### Ajouter une nouvelle langue

```javascript
const i18n = new I18nSystem({
  languages: {
    fr: { code: "fr", name: "Français", flag: FLAGS.fr },
    en: { code: "en", name: "English", flag: FLAGS.en },
    de: { code: "de", name: "Deutsch", flag: FLAGS.de }, // Allemand
  },
  translations: {
    fr: {
      /* traductions FR */
    },
    en: {
      /* traductions EN */
    },
    de: {
      /* traductions DE */
    }, // Nouvelles traductions
  },
});
```

---

## 🔧 API JavaScript

### Créer une instance

```javascript
const i18n = new I18nSystem(config);
```

### Méthodes disponibles

```javascript
// Changer de langue
i18n.setLanguage("en");

// Obtenir la langue actuelle
const lang = i18n.getCurrentLanguage(); // 'fr'

// Traduire une clé
const text = i18n.translate("welcome"); // "Bienvenue"

// Ajouter une langue
i18n.addLanguage("de", langConfig, translations);

// Ajouter des traductions
i18n.addTranslations("fr", { newKey: "Nouvelle traduction" });
```

---

## 📝 Attributs HTML

### `data-i18n` - Texte de l'élément

```html
<h1 data-i18n="page.title">Titre</h1>
```

### `data-i18n-placeholder` - Placeholder des inputs

```html
<input data-i18n-placeholder="form.name" placeholder="Nom" />
```

### `data-i18n-title` - Attribut title (tooltip)

```html
<button data-i18n-title="tooltip.save" title="Sauvegarder">💾</button>
```

---

## 🌐 Langues Supportées (Drapeaux Inclus)

Le système inclut des drapeaux SVG pour :

| Langue   | Code | Drapeau |
| -------- | ---- | ------- |
| Français | `fr` | 🇫🇷      |
| Anglais  | `en` | 🇬🇧      |
| Serbe    | `sr` | 🇷🇸      |
| Allemand | `de` | 🇩🇪      |
| Espagnol | `es` | 🇪🇸      |
| Italien  | `it` | 🇮🇹      |

**Vous pouvez facilement ajouter vos propres drapeaux SVG !**

---

## ✅ Checklist d'Intégration

Utilisez cette checklist pour intégrer le système sur votre site :

- [ ] Télécharger `i18n-system.js` et `i18n-system.css`
- [ ] Inclure les fichiers dans votre HTML
- [ ] Ajouter le bouton `#language-toggle`
- [ ] Ajouter `data-i18n` sur tous les textes à traduire
- [ ] Configurer les langues dans le JavaScript
- [ ] Définir toutes les traductions
- [ ] Tester le changement de langue
- [ ] Vérifier le responsive mobile
- [ ] Tester la sauvegarde (recharger la page)

---

## 🎯 Cas d'Usage

### Site Portfolio

```javascript
new I18nSystem({
  translations: {
    fr: {
      nav: { home: "Accueil", projects: "Projets", contact: "Contact" },
      hero: { title: "Designer Web", subtitle: "Créatif & Passionné" },
    },
    en: {
      nav: { home: "Home", projects: "Projects", contact: "Contact" },
      hero: { title: "Web Designer", subtitle: "Creative & Passionate" },
    },
  },
});
```

### Site E-commerce

```javascript
new I18nSystem({
  translations: {
    fr: {
      product: {
        addCart: "Ajouter au panier",
        price: "Prix",
        stock: "En stock",
      },
      checkout: { total: "Total", pay: "Payer" },
    },
    en: {
      product: { addCart: "Add to cart", price: "Price", stock: "In stock" },
      checkout: { total: "Total", pay: "Pay" },
    },
  },
});
```

### Blog

```javascript
new I18nSystem({
  translations: {
    fr: {
      blog: {
        readMore: "Lire la suite",
        comments: "Commentaires",
        share: "Partager",
      },
    },
    en: {
      blog: { readMore: "Read more", comments: "Comments", share: "Share" },
    },
  },
});
```

---

## 💾 Sauvegarde de la Préférence

La langue choisie est **automatiquement sauvegardée** dans `localStorage`.

```javascript
// La clé par défaut
localStorage.getItem("site-language"); // 'fr', 'en', etc.

// Personnaliser la clé
new I18nSystem({
  storageKey: "mon-site-lang",
});
```

Lors de la prochaine visite, le site s'ouvrira directement dans la langue choisie ! ✨

---

## 🔍 Compatibilité

### Navigateurs

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile (iOS Safari, Chrome Mobile)

### Frameworks

Ce système est en **Vanilla JavaScript** et fonctionne avec :

- ✅ Sites statiques HTML/CSS/JS
- ✅ WordPress (via thème personnalisé)
- ✅ PHP (templates)
- ⚠️ React/Vue/Angular (préférez leurs solutions natives)

---

## 📊 Performance

| Métrique            | Valeur                    |
| ------------------- | ------------------------- |
| Taille JS           | ~8 Ko                     |
| Taille CSS          | ~3 Ko                     |
| Temps de changement | < 50ms                    |
| Dépendances         | 0                         |
| Impact SEO          | Positif (attribut `lang`) |

---

## 🐛 Débogage

### Vérifier dans la Console

Le système affiche des logs utiles :

```
[i18n] Système initialisé avec la langue: fr
[i18n] Langue changée: English
```

### Traductions manquantes

Si une clé n'a pas de traduction :

```
[i18n] Traduction manquante pour la clé "missing" en langue "fr"
```

---

## 🤝 Contribution

Ce système est **open source** et libre d'utilisation !

**Améliorations possibles :**

- Détection automatique de la langue du navigateur
- Chargement asynchrone des traductions
- Support RTL (Right-to-Left)
- Traduction des dates et nombres
- Plugin pour CMS populaires

---

## 📄 Licence

**MIT License** - Utilisable librement dans tous vos projets personnels et commerciaux.

---

## 🎉 Conclusion

Vous avez maintenant un **système de traduction professionnel** :

✅ Facile à installer (3 étapes)  
✅ Facile à utiliser (attributs `data-i18n`)  
✅ Facile à personnaliser (CSS et options)  
✅ Prêt pour la production

**🚀 Lancez-vous et rendez votre site multilingue ! 🌍**

---

## 📞 Support

Pour toute question :

1. 📖 Consultez [GUIDE-UTILISATION-GENERIQUE.md](GUIDE-UTILISATION-GENERIQUE.md)
2. 🌐 Testez [exemple-complet.html](exemple-complet.html)
3. 💻 Inspectez le code source dans [i18n-system.js](i18n-system.js)

---

**Créé avec ❤️ pour faciliter l'internationalisation de vos sites web**

_Version 2.0.0 - 28 Janvier 2026_
