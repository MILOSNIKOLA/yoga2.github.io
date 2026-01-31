# 🎨 Architecture Visuelle - Système de Traduction

## 📐 Diagramme d'Architecture Complète

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          🌐 YOGA APP - SYSTÈME I18N                         │
└────────────────────────────────────────────────────────────────────────────┘

                                NAVIGATEUR
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─────────────────────────┐                                              │
│  │   INDEX.HTML            │                                              │
│  │  <html lang="fr">       │                                              │
│  └──────────┬──────────────┘                                              │
│             │ Charge les scripts                                          │
│             ├──────────────────┬──────────────────┬──────────────────┐    │
│             ▼                  ▼                  ▼                  ▼    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ translations.js  │ │  language.js     │ │ footer-     │ │ theme.js │ │
│  │ (BASE DE DONNÉE)│ │  (MOTEUR I18N)   │ │ loader.js   │ │          │ │
│  └──────────────────┘ └──────────────────┘ └─────────────┘ └──────────┘ │
│           │                    │                    │                     │
│           │ Expose             │ Utilise            │ Charge              │
│           ▼                    ▼                    ▼                     │
│  ┌────────────────────────────────────────────────────────────┐          │
│  │          window.SITE_TRANSLATIONS                          │          │
│  │  ┌──────────┬──────────┬──────────┐                       │          │
│  │  │    FR    │    SR    │    EN    │                       │          │
│  │  ├──────────┼──────────┼──────────┤                       │          │
│  │  │ footer:  │ footer:  │ footer:  │                       │          │
│  │  │  brand   │  brand   │  brand   │                       │          │
│  │  │  explore │  explore │  explore │                       │          │
│  │  │  account │  account │  account │                       │          │
│  │  │  legal   │  legal   │  legal   │                       │          │
│  │  └──────────┴──────────┴──────────┘                       │          │
│  └────────────────────────────────────────────────────────────┘          │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────┐          │
│  │                  FOOTER.HTML (Chargé via footer-loader)    │          │
│  │                                                             │          │
│  │  <h4 data-i18n="footer.brand.title">Yoga App</h4>         │          │
│  │  <p data-i18n="footer.brand.tagline">Votre compagnon...</p>│         │
│  │  <h4 data-i18n="footer.explore.title">Explorer</h4>       │          │
│  │  <a data-i18n="footer.explore.sessions">Séances</a>       │          │
│  │  ...                                                        │          │
│  └────────────────────────────────────────────────────────────┘          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données Détaillé

```
ÉTAPE 1 : CHARGEMENT INITIAL
═══════════════════════════════════════════════════════════════

┌──────────────┐
│ Page HTML    │
│ se charge    │
└──────┬───────┘
       │
       ├─► translations.js chargé
       │   ├─► SITE_TRANSLATIONS disponible globalement
       │   └─► Structure { fr, sr, en } prête
       │
       ├─► language.js chargé
       │   ├─► Lecture localStorage: langue préférée ?
       │   ├─► Par défaut: "fr"
       │   └─► Initialisation: initLanguageSystem()
       │
       ├─► footer-loader.js chargé
       │   ├─► Charge includes/footer.html via fetch()
       │   ├─► Injecte dans #footer-container ou <body>
       │   └─► Émet événement: window.dispatchEvent('footerLoaded')
       │
       └─► language.js écoute 'footerLoaded'
           └─► Traduction immédiate du footer


ÉTAPE 2 : INTERACTION UTILISATEUR (Changement de langue)
═══════════════════════════════════════════════════════════════

┌─────────────────┐
│ Clic sur        │
│ bouton drapeau  │  🇫🇷 → 🇷🇸
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ language.js                            │
│ addEventListener('click', ...)         │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ switchToNextLanguage()                 │
│ ├─► Langue actuelle: "fr"             │
│ ├─► Index: 0                           │
│ ├─► Prochain index: (0+1) % 3 = 1     │
│ └─► Nouvelle langue: "sr"             │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ setLanguage('sr')                      │
│ ├─► localStorage.setItem('lang', 'sr')│
│ ├─► document.lang = 'sr'              │
│ └─► applyTranslations('sr')           │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ applyTranslations('sr')                                    │
│                                                             │
│ 1. Récupération des traductions:                           │
│    translationSource = SITE_TRANSLATIONS['sr']             │
│                                                             │
│ 2. Sélection des éléments:                                 │
│    elements = document.querySelectorAll('[data-i18n]')     │
│    Résultat: [<h4>, <p>, <a>, <a>, ...] (14 éléments)     │
│                                                             │
│ 3. Pour CHAQUE élément:                                    │
│    ┌─────────────────────────────────────────┐            │
│    │ Élément: <h4 data-i18n="footer.brand.title">        │
│    │                                          │            │
│    │ a) Lecture clé:                         │            │
│    │    key = "footer.brand.title"           │            │
│    │                                          │            │
│    │ b) Résolution hiérarchique:             │            │
│    │    resolveTranslationKey(               │            │
│    │      SITE_TRANSLATIONS['sr'],           │            │
│    │      "footer.brand.title"               │            │
│    │    )                                     │            │
│    │    ├─► parts = ["footer", "brand", "title"]         │
│    │    ├─► SITE_TRANSLATIONS['sr']['footer']            │
│    │    ├─► ['footer']['brand']              │            │
│    │    └─► ['brand']['title'] = "Yoga App"  │            │
│    │                                          │            │
│    │ c) Application:                          │            │
│    │    element.textContent = "Yoga App"     │            │
│    └─────────────────────────────────────────┘            │
│                                                             │
│ 4. Résultat:                                                │
│    ✅ 14 éléments traduits                                  │
│    ✅ Durée totale: < 10ms                                  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Interface mise à jour                  │
│ ✅ Footer en serbe                     │
│ ✅ Bouton drapeau: 🇷🇸                 │
│ ✅ Aucun rechargement de page          │
└────────────────────────────────────────┘
```

---

## 🔍 Résolution de Clé Imbriquée (DÉTAIL)

```
INPUT: key = "footer.explore.sessions"
       lang = "sr"

┌──────────────────────────────────────────────────────────────┐
│ resolveTranslationKey(SITE_TRANSLATIONS['sr'], key)          │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ ÉTAPE 1: Split de la clé                                     │
│ parts = key.split('.')                                       │
│ Résultat: ["footer", "explore", "sessions"]                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ ÉTAPE 2: Parcours itératif                                   │
│                                                               │
│ value = SITE_TRANSLATIONS['sr']  (objet racine)              │
│                                                               │
│ ┌─ ITERATION 1 (part = "footer") ────────────────┐          │
│ │ value['footer'] existe ?                       │          │
│ │ ✅ Oui                                          │          │
│ │ value = value['footer']                         │          │
│ │ → value est maintenant l'objet footer          │          │
│ └─────────────────────────────────────────────────┘          │
│                                                               │
│ ┌─ ITERATION 2 (part = "explore") ────────────────┐         │
│ │ value['explore'] existe ?                       │          │
│ │ ✅ Oui                                          │          │
│ │ value = value['explore']                        │          │
│ │ → value est maintenant l'objet explore         │          │
│ └─────────────────────────────────────────────────┘          │
│                                                               │
│ ┌─ ITERATION 3 (part = "sessions") ────────────────┐        │
│ │ value['sessions'] existe ?                       │         │
│ │ ✅ Oui                                          │          │
│ │ value = value['sessions']                        │          │
│ │ → value est maintenant une STRING               │          │
│ └─────────────────────────────────────────────────┘          │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ ÉTAPE 3: Vérification du type                                │
│ typeof value === 'string' ?                                  │
│ ✅ Oui                                                        │
│ return value                                                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
OUTPUT: "Сесије" (traduction serbe de "Séances")


STRUCTURE DE DONNÉES VISUELLE:
═══════════════════════════════════════════════════════════════

SITE_TRANSLATIONS['sr']
  │
  ├─ footer                              ← parts[0]
  │   │
  │   ├─ brand
  │   │   ├─ title: "Yoga App"
  │   │   └─ tagline: "..."
  │   │
  │   ├─ explore                         ← parts[1]
  │   │   ├─ title: "Истражите"
  │   │   ├─ sessions: "Сесије"          ← parts[2] ✅ TROUVÉ
  │   │   ├─ breathing: "Дисање"
  │   │   └─ learning: "Учити"
  │   │
  │   ├─ account
  │   │   └─ ...
  │   │
  │   └─ legal
  │       └─ ...
  │
  └─ home
      └─ ...
```

---

## 🎯 Mapping Complet (Clé → Traduction)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE CORRESPONDANCE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HTML Element                 data-i18n Key              Values │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  <h4>                 → footer.brand.title                      │
│                         ├─ FR: "Yoga App"                       │
│                         ├─ SR: "Yoga App"                       │
│                         └─ EN: "Yoga App"                       │
│                                                                  │
│  <p>                  → footer.brand.tagline                    │
│                         ├─ FR: "Votre compagnon..."             │
│                         ├─ SR: "Ваш свакодневни..."             │
│                         └─ EN: "Your daily..."                  │
│                                                                  │
│  <h4>                 → footer.explore.title                    │
│                         ├─ FR: "Explorer"                       │
│                         ├─ SR: "Истражите"                      │
│                         └─ EN: "Explore"                        │
│                                                                  │
│  <a>                  → footer.explore.sessions                 │
│                         ├─ FR: "Séances"                        │
│                         ├─ SR: "Сесије"                         │
│                         └─ EN: "Sessions"                       │
│                                                                  │
│  <a>                  → footer.explore.breathing                │
│                         ├─ FR: "Respiration"                    │
│                         ├─ SR: "Дисање"                         │
│                         └─ EN: "Breathing"                      │
│                                                                  │
│  <a>                  → footer.explore.learning                 │
│                         ├─ FR: "Apprendre"                      │
│                         ├─ SR: "Учити"                          │
│                         └─ EN: "Learn"                          │
│                                                                  │
│  ... (8 autres éléments suivent le même pattern)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Chronologie d'exécution (Timeline)

```
T=0ms     │ Page HTML commence à se charger
          │
T=50ms    │ ┌─► translations.js chargé
          │ │   └─► window.SITE_TRANSLATIONS disponible
          │ │
          │ ├─► language.js chargé
          │ │   ├─► Lit localStorage: "fr"
          │ │   └─► Initialise le système
          │ │
          │ └─► footer-loader.js chargé
          │
T=100ms   │ footer-loader.js fetch includes/footer.html
          │
T=120ms   │ Footer HTML injecté dans le DOM
          │ Événement 'footerLoaded' émis
          │
T=125ms   │ language.js capte 'footerLoaded'
          │ applyTranslations('fr') lancé
          │
T=128ms   │ Sélection: querySelectorAll('[data-i18n]')
          │ 14 éléments trouvés
          │
T=130ms   │ Boucle forEach: 14 traductions appliquées
          │ ├─ Element 1: textContent = "Yoga App"
          │ ├─ Element 2: textContent = "Votre compagnon..."
          │ ├─ Element 3: textContent = "Explorer"
          │ └─ ... (11 autres)
          │
T=135ms   │ ✅ Traduction complète
          │ Footer affiché en français
          │
          │
─────────────────────── UTILISATEUR CLIQUE SUR DRAPEAU ──────────
          │
T=5000ms  │ Clic utilisateur sur bouton langue
          │
T=5001ms  │ Event listener déclenché
          │ switchToNextLanguage()
          │
T=5002ms  │ Calcul: "fr" → "sr"
          │ setLanguage('sr')
          │
T=5003ms  │ localStorage.setItem('language', 'sr')
          │ applyTranslations('sr')
          │
T=5005ms  │ Sélection: querySelectorAll('[data-i18n]')
          │ 14 éléments trouvés
          │
T=5007ms  │ Boucle: 14 traductions appliquées
          │ ├─ Element 1: textContent = "Yoga App"
          │ ├─ Element 2: textContent = "Ваш свакодневни..."
          │ ├─ Element 3: textContent = "Истражите"
          │ └─ ...
          │
T=5010ms  │ ✅ Re-traduction complète
          │ Footer maintenant en serbe
          │ Durée totale: 10ms ⚡
```

---

## 📦 Structure de Fichiers

```
Yoga2/
├─── includes/
│    └─── 📄 footer.html                  ← Éléments avec data-i18n
│
├─── js/
│    ├─── 📄 translations.js              ← Base de données (SITE_TRANSLATIONS)
│    ├─── 📄 language.js                  ← Moteur I18N (traduction + UI)
│    ├─── 📄 footer-loader.js             ← Chargement dynamique du footer
│    └─── 📄 theme.js                     ← Gestion thème clair/sombre
│
├─── 📄 index.html                         ← Page principale
├─── 📄 demo-traduction-footer.html        ← Démo interactive
│
├─── 📘 SYSTEME-TRADUCTION-FOOTER.md       ← Documentation technique complète
├─── 📗 QUICK-START-TRADUCTION.md          ← Guide de démarrage rapide
├─── 📙 LIVRAISON-FINALE-TRADUCTION.md     ← Résumé de livraison
└─── 📊 ARCHITECTURE-VISUELLE.md           ← Ce fichier (diagrammes)
```

---

## 🎨 Légende des symboles

```
┌─┐  Boîte de contenu
│ │
└─┘

├──  Branche (arborescence)
│
└──  Fin de branche

▼    Flux vers le bas
►    Flux vers la droite

🇫🇷   Drapeau français
🇷🇸   Drapeau serbe
🇬🇧   Drapeau anglais

✅   Succès / Validé
❌   Erreur / Échec
⚠️   Avertissement
💡   Information importante
🔍   Analyse / Debug
⚡   Rapidité / Performance
📦   Module / Package
🎯   Objectif / Cible
🔄   Cycle / Boucle
```

---

**🎨 Fin du guide visuel - Architecture système de traduction Yoga App**
