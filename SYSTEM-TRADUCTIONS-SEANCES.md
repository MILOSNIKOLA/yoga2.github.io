# 🎯 SYSTÈME DE TRADUCTION DES SÉANCES - GUIDE D'INTÉGRATION

## ✅ Qu'est-ce qui a été implémenté

### 1️⃣ **Badges de niveau traduits et colorés**

- ✔ Badges avec couleurs solides (vert/orange/rouge)
- ✔ `data-i18n="sessions.level.beginner|intermediate|advanced"`
- ✔ Traductions automatiques via i18n-manager.js
- ✔ Styles hover pour meilleure UX

### 2️⃣ **Titres et descriptions traduits**

- ✔ Clés i18n dynamiques : `data-i18n="session_${id}.title"` et `.description`
- ✔ Système de traductions externalisées dans `session-translations.js`
- ✔ Compatible avec 3 langues (FR/EN/SR)

### 3️⃣ **Mise à jour automatique au changement de langue**

- ✔ i18n-manager.js gère tout automatiquement
- ✔ Aucune action supplémentaire requise
- ✔ MutationObserver surveille les changements

---

## 🔧 Fichiers modifiés/créés

| Fichier                      | Rôle                                    |
| ---------------------------- | --------------------------------------- |
| `js/sessions.js`             | Génération des cartes avec data-i18n    |
| `js/session-translations.js` | 📄 **NOUVEAU** - Base de traductions    |
| `css/sessions.css`           | Styles des badges colorés               |
| `sessions.html`              | Ajout du script session-translations.js |

---

## 📚 Comment ajouter une nouvelle session

### 1. Ajouter la session dans `addExtraSessions()` (sessions.js)

```javascript
{
  id: 71,
  title: "Ma nouvelle séance", // FR par défaut
  description: "Description courte",
  level: "beginner",
  duration: 20,
  type: "hatha",
  free: true,
  objectives: ["mobilité"]
}
```

### 2. Ajouter les traductions dans `session-translations.js`

```javascript
session_71: {
  fr: {
    title: "Ma nouvelle séance",
    description: "Description courte"
  },
  en: {
    title: "My New Session",
    description: "Short description"
  },
  sr: {
    title: "Moja nova sesija",
    description: "Kratka opis"
  }
}
```

### 3. ✅ C'est tout !

Les traductions sont automatiquement injectées et le badge de niveau est traduit.

---

## 🌐 Structure i18n utilisée

```json
{
  "fr": {
    "sessions": {
      "level": {
        "beginner": "Débutant",
        "intermediate": "Intermédiaire",
        "advanced": "Avancé"
      },
      "cards": {
        "session_41": {
          "title": "Étirements matinaux doux",
          "description": "Réveillez votre corps en douceur"
        }
      }
    }
  }
}
```

---

## 🎨 Badges de niveau - Couleurs

```css
.session-level-badge.beginner    → Vert (#4caf50)
.session-level-badge.intermediate → Orange (#ff9800)
.session-level-badge.advanced    → Rouge (#f44336)
```

---

## ✨ Exemple complet d'une session rendue

```html
<div class="session-card-full session-card" data-level="beginner">
  <!-- Badge traduit automatiquement -->
  <span
    class="session-level-badge beginner"
    data-i18n="sessions.level.beginner"
  >
    Débutant
  </span>

  <!-- Titre traduit automatiquement -->
  <h3 class="session-card-title" data-i18n="session_41.title">
    Étirements matinaux doux
  </h3>

  <!-- Description traduite automatiquement -->
  <p class="session-card-description" data-i18n="session_41.description">
    Réveillez votre corps en douceur
  </p>
</div>
```

Quand l'utilisateur change la langue via le bouton 🌐, tout est mis à jour automatiquement.

---

## 🚀 Compatibilité

✅ **100% compatible avec :**

- i18n-manager.js
- MutationObserver (traductions dynamiques)
- language-toggle button
- Tous les systèmes existants
- Accessibilité (ARIA labels)
- SEO

---

## 📝 Notes

- **session_key format** : `session_${session.id}`
- **Traductions cachées** : Stockées uniquement en JS, pas dans les fichiers .html
- **Fallback** : Les valeurs du HTML s'affichent si la traduction manque
- **Performance** : Traductions injectées au DOMContentLoaded

---

**Dernière mise à jour** : 5 février 2026
