# 📋 EXEMPLE DE HTML GÉNÉRÉ - SESSION CARD AVEC TRADUCTIONS

## 🎯 Session Exemple: ID 41 (Étirements matinaux doux)

### ✅ HTML GÉNÉRÉ PAR `createSessionCard()`

```html
<div
  id="session-41"
  class="session-card-full session-card"
  data-level="beginner"
>
  <!-- En-tête avec icône et durée -->
  <div class="session-card-header">
    <div class="session-icon">🕉️</div>
    <div class="session-duration">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      10 min
    </div>
  </div>

  <!-- Corps de la carte -->
  <div class="session-card-body">
    <!-- Badge niveau -->
    <div class="session-badge-container">
      <span
        class="session-level-badge beginner"
        data-i18n="sessions.level.beginner"
      >
        Débutant
      </span>
    </div>

    <!-- TITRE - Traduit via data-i18n -->
    <h3 class="session-card-title" data-i18n="session_41.title">
      Étirements matinaux doux
    </h3>

    <!-- DESCRIPTION - Traduit via data-i18n -->
    <p class="session-card-description" data-i18n="session_41.description">
      Réveillez votre corps en douceur
    </p>

    <!-- OBJECTIFS - Traduits via data-i18n -->
    <div class="session-goals">
      <span
        class="session-goal-chip"
        data-i18n="sessions.goals.mobilite"
      ></span>
    </div>
  </div>

  <!-- Pied de la carte -->
  <div class="session-card-footer">
    <button class="session-card-button">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
      </svg>
      <!-- BOUTON - Traduit via data-i18n -->
      <span class="button-text" data-i18n="sessions.actions.start">
        Commencer
      </span>
    </button>
  </div>
</div>
```

---

## 🌐 AFFICHAGE APRÈS TRADUCTIONS APPLIQUÉES

### 🇫🇷 EN FRANÇAIS (par défaut)

```
┌─────────────────────────────────┐
│  🕉️                        10 min │
├─────────────────────────────────┤
│ [Débutant]                      │
│                                 │
│ Étirements matinaux doux        │
│                                 │
│ Réveillez votre corps en        │
│ douceur                         │
│                                 │
│ [Mobilité]                      │
├─────────────────────────────────┤
│ ▶️  Commencer                   │
└─────────────────────────────────┘
```

### 🇬🇧 EN ANGLAIS (après clic sur language-toggle → EN)

```
┌─────────────────────────────────┐
│  🕉️                        10 min │
├─────────────────────────────────┤
│ [Beginner]                      │
│                                 │
│ Gentle Morning Stretch          │
│                                 │
│ Wake up your body gently        │
│                                 │
│ [Mobility]                      │
├─────────────────────────────────┤
│ ▶️  Start                       │
└─────────────────────────────────┘
```

### 🇷🇸 EN SERBE (après clic sur language-toggle → SR)

```
┌─────────────────────────────────┐
│  🕉️                        10 min │
├─────────────────────────────────┤
│ [Početnik]                      │
│                                 │
│ Lagano jutarnje istezanje       │
│                                 │
│ Lagano razbudite telo           │
│                                 │
│ [Mobilnost]                     │
├─────────────────────────────────┤
│ ▶️  Počni                       │
└─────────────────────────────────┘
```

---

## 🔍 COMMENT ÇA FONCTIONNE

### Avant Traductions (HTML brut)

```
data-i18n="session_41.title" → (vide, en attente)
data-i18n="session_41.description" → (vide, en attente)
data-i18n="sessions.goals.mobilite" → (vide, en attente)
data-i18n="sessions.actions.start" → (vide, en attente)
```

### Lors du Chargement (applyTranslations)

```
[i18n] Cherche dans i18n.translations.fr:
  - session_41.title → "Étirements matinaux doux"
  - session_41.description → "Réveillez votre corps en douceur"
  - sessions.goals.mobilite → "Mobilité"
  - sessions.actions.start → "Commencer"

[i18n] Remplit le DOM avec textContent
  ✅ Titre s'affiche
  ✅ Description s'affiche
  ✅ Badge s'affiche
  ✅ Objectif s'affiche
  ✅ Bouton s'affiche
```

### Lors du Changement de Langue (language-toggle → EN)

```
[i18n] changeLanguage("en")
[i18n] Cherche dans i18n.translations.en:
  - session_41.title → "Gentle Morning Stretch"
  - session_41.description → "Wake up your body gently"
  - sessions.goals.mobilite → "Mobility"
  - sessions.actions.start → "Start"

[i18n] applyTranslations() remplace tout le contenu
  ✅ Titre change
  ✅ Description change
  ✅ Badge change
  ✅ Objectif change
  ✅ Bouton change
```

---

## 📊 TRADUCTIONS POUR CETTE SESSION

### 🔑 Clés i18n utilisées:

| Clé                       | FR                               | EN                       | SR                        |
| ------------------------- | -------------------------------- | ------------------------ | ------------------------- |
| `session_41.title`        | Étirements matinaux doux         | Gentle Morning Stretch   | Lagano jutarnje istezanje |
| `session_41.description`  | Réveillez votre corps en douceur | Wake up your body gently | Lagano razbudite telo     |
| `sessions.level.beginner` | Débutant                         | Beginner                 | Početnik                  |
| `sessions.goals.mobilite` | Mobilité                         | Mobility                 | Mobilnost                 |
| `sessions.actions.start`  | Commencer                        | Start                    | Počni                     |

---

## 🎯 POINTS CLÉS

✅ **HTML pur** - Pas de JavaScript pour générer le texte
✅ **Sémantique correcte** - Chaque élément a une clé unique
✅ **Performance** - Une seule traduction par langue au chargement
✅ **Scalabilité** - Ajouter une session = ajouter 5 traductions (1 titre + 1 desc + 3 pour autres langues)
✅ **Maintenabilité** - Les traductions sont centralisées dans `i18n/translations.json`
✅ **Accessibilité** - Les éléments sont structurés correctement avec les bonnes balises

---

## 🔧 DÉBOGAGE

Si une traduction n'apparaît pas:

```javascript
// Dans la console (F12):

// 1. Vérifier que l'élément a le bon data-i18n
const titleElem = document.querySelector(".session-card-title");
titleElem.getAttribute("data-i18n");
// → "session_41.title" ✅

// 2. Vérifier que la traduction existe
i18n.getTranslation("session_41.title");
// → "Étirements matinaux doux" ✅

// 3. Vérifier que textContent est défini
titleElem.textContent;
// → "Étirements matinaux doux" ✅

// 4. Si rien ne s'affiche, forcer une traduction
i18n.applyTranslations();
// Devrait remplir tous les [data-i18n] du DOM
```

---

## ✨ RÉSULTAT FINAL

L'utilisateur voit une **carte de session complètement traduite** dans sa langue préférée, et quand il clique sur le flag 🌐, **TOUS les textes changent instantanément** sans rechargement de page.
