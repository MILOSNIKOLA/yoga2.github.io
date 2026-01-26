# 🧘 Architecture Complète - Application Yoga 2026

## 📊 Diagramme d'Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │          │
│  │  (HTML/CSS)  │  │ (React Native│  │   (Secure)   │          │
│  │  JavaScript  │  │  Expo Router)│  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway    │
                    │  (Auth Check)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│ Authentication │  │  Session Mgmt   │  │  User Progress │
│    Service     │  │    Service      │  │    Service     │
│  - Register    │  │  - CRUD         │  │  - Tracking    │
│  - Login       │  │  - Filters      │  │  - Stats       │
│  - JWT/Token   │  │  - Search       │  │  - Streaks     │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   DATA LAYER    │
                    │                 │
                    │  ┌───────────┐  │
                    │  │LocalStorage│ │ (Phase 1 - MVP)
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │  IndexedDB │ │ (Phase 2 - Offline)
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │   Backend  │ │ (Phase 3 - Production)
                    │  │  Firebase/ │ │
                    │  │  Supabase  │ │
                    │  └───────────┘  │
                    └─────────────────┘
```

---

## 🗂️ Structure des Fichiers

```
Yoga2/
│
├── 📄 index.html              # Page d'accueil
├── 📄 login.html              # Connexion
├── 📄 register.html           # Inscription
├── 📄 dashboard.html          # Dashboard utilisateur
├── 📄 sessions.html           # Liste des séances
├── 📄 session-player.html     # Lecteur de séance
├── 📄 breathing.html          # Exercices respiration
├── 📄 learning.html           # Section apprentissage
├── 📄 progress.html           # Progression utilisateur
├── 📄 admin.html              # Dashboard admin
│
├── 📁 css/
│   ├── styles.css             # Styles principaux
│   ├── themes.css             # Thèmes clair/sombre
│   ├── components.css         # Composants réutilisables
│   └── mobile.css             # Styles mobile
│
├── 📁 js/
│   ├── app.js                 # Point d'entrée principal
│   ├── auth.js                # Système d'authentification
│   ├── theme.js               # Gestion thème clair/sombre
│   ├── sessions.js            # Gestion des séances
│   ├── player.js              # Lecteur de séance
│   ├── breathing.js           # Module respiration
│   ├── progress.js            # Suivi progression
│   ├── admin.js               # Interface admin
│   ├── router.js              # Navigation SPA
│   ├── storage.js             # Gestion du stockage
│   └── utils.js               # Fonctions utilitaires
│
├── 📁 assets/
│   ├── 📁 images/             # Images, icônes
│   ├── 📁 sounds/             # Sons pour respiration
│   └── 📁 videos/             # Vidéos de postures
│
├── 📁 data/
│   ├── sessions.json          # Données de séances par défaut
│   ├── poses.json             # Base de données des postures
│   └── content.json           # Contenu pédagogique
│
├── 📁 mobile/                 # Application mobile (Expo)
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx      # Accueil mobile
│   │   │   ├── sessions.tsx   # Liste séances
│   │   │   ├── breathing.tsx  # Respiration
│   │   │   └── progress.tsx   # Progression
│   │   ├── session/
│   │   │   └── [id].tsx       # Player mobile
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   └── _layout.tsx        # Layout principal
│   ├── components/            # Composants React Native
│   ├── hooks/                 # Hooks personnalisés
│   ├── services/              # Services API
│   ├── styles/                # Styles mobiles
│   ├── package.json
│   └── app.json
│
├── 📁 docs/
│   ├── ARCHITECTURE.md        # Ce fichier
│   ├── SECURITY.md            # Documentation sécurité
│   ├── PROMPTS.md             # Prompts pour développement
│   └── API.md                 # Documentation API
│
└── 📄 README.md               # Documentation principale
```

---

## 🔒 Architecture de Sécurité

### Niveaux de Sécurité par Feature

```
┌────────────────────────────────────────────────────────────┐
│                     NIVEAU 1: PUBLIC                        │
│  - Page d'accueil                                          │
│  - Présentation du yoga                                    │
│  - Pages statiques                                         │
│  Sécurité: Aucune authentification requise                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  NIVEAU 2: AUTHENTIFIÉ                      │
│  - Dashboard utilisateur                                   │
│  - Séances de yoga                                         │
│  - Exercices de respiration                                │
│  - Progression personnelle                                 │
│  Sécurité:                                                 │
│    ✓ JWT Token / Session                                   │
│    ✓ Validation côté client                                │
│    ✓ Données chiffrées (localStorage)                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    NIVEAU 3: ADMIN                          │
│  - Dashboard admin                                         │
│  - Ajout/modification de séances                           │
│  - Gestion des utilisateurs                                │
│  Sécurité:                                                 │
│    ✓ Rôle "admin" vérifié                                  │
│    ✓ Double authentification recommandée                   │
│    ✓ Logs d'activité admin                                 │
│    ✓ Protection CSRF                                       │
└────────────────────────────────────────────────────────────┘
```

### Mesures de Sécurité Implémentées

1. **Authentification**
   - Hachage des mots de passe (bcrypt/SHA-256)
   - Tokens JWT avec expiration
   - Refresh tokens
   - Protection contre brute force

2. **Données**
   - Chiffrement localStorage (crypto-js)
   - Validation des inputs
   - Sanitization XSS
   - Protection SQL injection (backend)

3. **Session**
   - Timeout automatique (30 min)
   - Déconnexion sur inactivité
   - One device policy (optionnel)

4. **Admin**
   - Whitelist d'emails admin
   - Logs de toutes actions
   - Confirmation pour actions critiques

---

## 🎨 Système de Thème (Clair/Sombre)

### Variables CSS

```css
:root {
  /* Theme Light */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fc;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --accent: #6b46c1;
  --border: #e2e8f0;
}

[data-theme="dark"] {
  /* Theme Dark */
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --text-primary: #f7fafc;
  --text-secondary: #cbd5e0;
  --accent: #9f7aea;
  --border: #4a5568;
}
```

### Implémentation

- Bouton toggle en haut à droite
- Sauvegarde préférence (localStorage)
- Transition douce (0.3s)
- Icônes soleil/lune animées

---

## 📱 Architecture Mobile (Expo Router)

### Structure Expo Router

```
mobile/app/
├── _layout.tsx              # Root layout
├── (tabs)/                  # Bottom navigation
│   ├── _layout.tsx
│   ├── index.tsx            # Accueil
│   ├── sessions.tsx         # Séances
│   ├── breathing.tsx        # Respiration
│   └── progress.tsx         # Progression
├── auth/
│   ├── _layout.tsx          # Auth layout
│   ├── login.tsx
│   └── register.tsx
├── session/
│   └── [id].tsx             # Lecteur dynamique
├── admin/
│   └── dashboard.tsx        # Admin mobile
└── +not-found.tsx           # 404
```

### Navigation

```typescript
// Tabs principales
Home → Sessions → Breathing → Progress

// Modal
Session Player (full screen)

// Stack Auth
Login ↔ Register

// Protected
Admin (role check)
```

---

## 🚀 Roadmap de Développement

### Phase 1 - MVP (Semaine 1-2)

- ✅ Structure HTML/CSS de base
- ✅ Système d'authentification
- ✅ Thème clair/sombre
- ✅ 5 séances de yoga prédéfinies
- ✅ Lecteur de séance basique
- ✅ 1 exercice de respiration
- ✅ LocalStorage pour stockage

### Phase 2 - Features Principales (Semaine 3-4)

- ✅ Dashboard admin complet
- ✅ Filtres avancés de séances
- ✅ Module respiration complet (3 exercices)
- ✅ Suivi de progression
- ✅ Section apprentissage
- ✅ Mode plein écran player

### Phase 3 - Mobile (Semaine 5-6)

- ✅ Setup Expo Router
- ✅ Adaptation UI mobile
- ✅ Synchronisation web ↔ mobile
- ✅ Notifications push
- ✅ Mode offline

### Phase 4 - Backend (Semaine 7-8)

- ✅ Migration vers backend (Firebase/Supabase)
- ✅ API REST
- ✅ Vraie authentification serveur
- ✅ Upload d'images/vidéos
- ✅ Analytics

### Phase 5 - Avancé (Semaine 9+)

- ✅ IA pour recommandations
- ✅ Vidéos des postures
- ✅ Mode en direct / livestream
- ✅ Communauté
- ✅ Paiements (premium)

---

## 🎯 Fonctionnalités Clés 2026

### 1. **Respiration Intelligente**

- Détection rythme cardiaque (si device compatible)
- Adaptation automatique du tempo
- Feedback temps réel

### 2. **Progression Gamifiée (sans pression)**

- Badges de régularité doux
- Graphiques de bien-être
- Journal de pratique

### 3. **IA Assistée**

- Suggestions de séances selon humeur
- Chatbot prof de yoga (conseil posture)
- Analyse de régularité

### 4. **Social Light**

- Partage de séance avec ami
- Pratique en duo (sync timer)
- Pas de likes/compétition

### 5. **Accessibilité**

- Mode contraste élevé
- Lecteur d'écran compatible
- Alternatives pour chaque posture
- Support multi-langues

---

## 📊 Modèle de Données

### User

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Marie",
  "password": "hashed",
  "role": "user|admin",
  "createdAt": "2026-01-23",
  "preferences": {
    "theme": "dark",
    "level": "beginner",
    "notifications": true
  },
  "stats": {
    "totalSessions": 15,
    "totalMinutes": 320,
    "currentStreak": 5,
    "longestStreak": 12
  }
}
```

### Session (Séance)

```json
{
  "id": "uuid",
  "title": "Flow doux du matin",
  "description": "Réveillez votre corps en douceur",
  "duration": 15,
  "level": "beginner",
  "type": "hatha",
  "objectives": ["détente", "mobilité"],
  "poses": [
    {
      "name": "Chien tête en bas",
      "duration": 60,
      "image": "url",
      "instructions": "Poussez les talons vers le sol..."
    }
  ],
  "createdBy": "admin-id",
  "createdAt": "2026-01-15"
}
```

### Progress Entry

```json
{
  "userId": "uuid",
  "sessionId": "uuid",
  "completedAt": "2026-01-23T10:30:00",
  "duration": 15,
  "mood_before": "stressed",
  "mood_after": "calm",
  "rating": 5
}
```

---

## 🔄 Synchronisation Web ↔ Mobile

### Stratégie

1. **Offline-first** : données en local d'abord
2. **Sync périodique** : toutes les 5 min si connecté
3. **Conflict resolution** : last-write-wins
4. **Cache images** : préchargement intelligent

---

## 🎨 Principes UX/UI

### Zen Design Principles

1. **Espace** : beaucoup de blanc (ou noir si dark)
2. **Typographie** : grande, lisible, serif pour titres
3. **Couleurs** : palette apaisante (violet, bleu, vert doux)
4. **Animations** : lentes, fluides, jamais agressives
5. **Feedback** : doux, encourageant, non stressant

### Mobile-First

- Touch targets ≥ 44px
- Scroll naturel
- Gestures intuitifs (swipe pour changer séance)
- One-hand mode

---

## 📈 Analytics (Privacy-First)

### Métriques Trackées

- Sessions complétées (anonyme)
- Durée moyenne
- Taux de retention (7/30 jours)
- Features les plus utilisées
- **JAMAIS** : données personnelles sensibles

### Outils

- Plausible Analytics (privacy-friendly)
- Ou custom analytics simple

---

## 🌍 Internationalisation

### Langues Phase 1

- 🇫🇷 Français
- 🇬🇧 English

### Structure i18n

```javascript
{
  "fr": {
    "welcome": "Bienvenue",
    "start_session": "Commencer la séance"
  },
  "en": {
    "welcome": "Welcome",
    "start_session": "Start session"
  }
}
```

---

## 🧪 Tests & Qualité

### Tests à Implémenter

- Unit tests (fonctions auth, storage)
- E2E tests (Playwright)
- Accessibility tests (axe-core)
- Performance tests (Lighthouse)

### Standards de Code

- ESLint + Prettier
- Commits conventionnels
- Pre-commit hooks
- Documentation inline

---

## 📚 Ressources Techniques

### Stack Recommandée

- **Frontend** : HTML5, CSS3, Vanilla JS (ES6+)
- **Mobile** : React Native + Expo Router
- **Backend** : Firebase/Supabase (Phase 3)
- **Storage** : localStorage → IndexedDB → Cloud
- **Icons** : Lucide Icons
- **Animations** : CSS + GSAP (optionnel)

---

## ✅ Checklist Avant Lancement

- [ ] Tests sur iOS / Android / Web
- [ ] Validation accessibilité WCAG 2.1 AA
- [ ] Performance : < 3s load, 60fps animations
- [ ] Sécurité : audit complet
- [ ] Legal : RGPD, CGU, Politique confidentialité
- [ ] SEO : meta tags, sitemap, robots.txt
- [ ] Analytics configuré
- [ ] Monitoring erreurs (Sentry)
- [ ] Backup données automatique

---

**🧘‍♀️ Cette architecture est conçue pour évoluer sereinement, comme une pratique de yoga.**

_Document vivant - Mise à jour: 23 janvier 2026_
