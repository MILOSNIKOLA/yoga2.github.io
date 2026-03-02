# 🧘‍♀️ Yoga App - Application Web Complète (Vanilla JavaScript)

Une application de yoga moderne et **100% complète** développée en **vanilla JavaScript**, avec authentification, gestion de séances, exercices de respiration, suivi de progression, dashboard admin et articles d'apprentissage.

**✅ PROJET TERMINÉ** : Toutes les 8 sections principales sont implémentées et fonctionnelles !

---

## ✨ Fonctionnalités Complètes

### 🔐 Authentification

- ✅ Inscription avec validation email/mot de passe
- ✅ Connexion sécurisée avec hash SHA-256
- ✅ Gestion sessions (sessionStorage + localStorage)
- ✅ Rôles utilisateur (user / admin)
- ✅ Mode démo rapide

### 📊 Dashboard Utilisateur

- ✅ 4 statistiques personnalisées (séances, temps, streak, niveau)
- ✅ Calcul automatique du niveau (Débutant/Intermédiaire/Avancé)
- ✅ Suggestion intelligente "Continuer ma pratique"
- ✅ Séances récentes avec historique
- ✅ Graphique de la semaine (barres)
- ✅ Messages encourageants adaptatifs

### 🧘 Séances de Yoga

- ✅ 12+ séances pré-configurées
- ✅ **5 filtres avancés** : niveau, durée, type, objectif, recherche temps réel
- ✅ Player interactif avec **timer circulaire SVG**
- ✅ Navigation entre postures avec instructions détaillées
- ✅ Sons de transition (Web Audio API)
- ✅ Sauvegarde automatique historique
- ✅ Système premium/paywall

### 🌬️ Exercices de Respiration

- ✅ **4 exercices guidés** :
  - ❤️ Cohérence cardiaque (5-5)
  - 📦 Box Breathing (4-4-4-4)
  - 😌 4-7-8 (relaxation profonde)
  - ⚡ Énergisant (3-6)
- ✅ **Animation SVG fluide** (cercle qui pulse)
- ✅ **Sons adaptatifs** par phase (Web Audio API)
- ✅ **Vibrations haptiques** (Vibration API)
- ✅ Compteur de cycles et timer total

### 📈 Progression

- ✅ Stats détaillées avec **graphique Canvas API** (barres par jour)
- ✅ Toggle période (7 jours / 30 jours / Tout)
- ✅ Timeline des 10 dernières séances
- ✅ Calcul streak actuel et meilleure série
- ✅ **Objectif hebdomadaire** avec barre de progression
- ✅ **Export données JSON** complet (RGPD)

### 🔧 Dashboard Admin

- ✅ **CRUD complet** des séances
- ✅ **Modal en 2 étapes** :
  1. Infos générales (titre, durée, niveau, type, objectifs)
  2. Gestion dynamique des postures
- ✅ Recherche temps réel dans la table
- ✅ Confirmation de suppression
- ✅ Logs de toutes les actions admin
- ✅ Validation complète des formulaires

### 📚 Apprentissage

- ✅ **5 articles complets** inclus :
  1. 🧘 Qu'est-ce que le yoga ? (Bases)
  2. 🌬️ Pourquoi respirer par le nez ? (Pranayama)
  3. ☯️ La philosophie du yoga (Yamas/Niyamas)
  4. 🤸 Les postures de base (Asanas)
  5. 🧠 Méditation pour débutants
- ✅ Recherche et filtres par catégorie
- ✅ Modal lecture fullscreen responsive
- ✅ **Tracking articles lus** par utilisateur (localStorage)
- ✅ Contenu HTML riche et formaté

### 🎨 Thèmes

- ✅ Mode clair / sombre avec toggle
- ✅ Persistance du choix (localStorage)
- ✅ Transitions fluides
- ✅ Variables CSS custom

---

## 🚀 Installation et Utilisation

### Prérequis

- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Un serveur web local (recommandé)

### Méthode 1 : Serveur Local

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx serve

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : `http://localhost:8000`

### Méthode 2 : Extension VS Code

1. Installer l'extension **Live Server**
2. Clic droit sur `index.html` > **Open with Live Server**

### Méthode 3 : Double-clic

Ouvrir directement `index.html` dans le navigateur (certaines fonctionnalités peuvent être limitées)

---

## 👤 Comptes de Test

### Utilisateur Standard

- **Email** : `user@yoga.com`
- **Mot de passe** : `password123`
- **Accès** : Dashboard, séances, respiration, progression, apprentissage

### Administrateur

- **Email** : `admin@yoga.com`
- **Mot de passe** : `admin123`
- **Accès** : Tout + Dashboard Admin (CRUD séances)

### Mode Démo Rapide

Cliquer sur **"Essayer en mode démo"** sur la page d'accueil (utilisateur temporaire)

---

## 🏗️ Structure du Projet

```
Yoga2/
├── index.html              # Page d'accueil
├── login.html              # Connexion
├── register.html           # Inscription
├── dashboard.html          # Dashboard utilisateur ✅
├── sessions.html           # Liste des séances ✅
├── session-player.html     # Lecteur de séance ✅
├── respirer.html           # Exercices de respiration ✅
├── progress.html           # Progression ✅
├── admin.html              # Dashboard admin ✅
├── learning.html           # Apprentissage ✅
│
├── css/                    # Tous les styles
├── js/                     # Toute la logique
└── docs/                   # Documentation complète
```

---

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Flexbox, Grid, Custom Properties, Animations
- **JavaScript ES6+** : Modules, Classes, Arrow Functions
- **Web APIs** :
  - LocalStorage (persistance données)
  - SessionStorage (sessions utilisateur)
  - Canvas API (graphiques)
  - Web Audio API (sons de transition et respiration)
  - Vibration API (feedback haptique)
  - Crypto API (hash SHA-256 passwords)
  - requestAnimationFrame (animations fluides)

**Aucune librairie externe** : 100% vanilla JavaScript !

---

## 📱 Responsive Design

✅ **Mobile First** : Optimisé pour tous les écrans

### Breakpoints Standards

- **xs** : 0-575px (mobile)
- **sm** : 576-767px (mobile landscape)
- **md** : 768-991px (tablette)
- **lg** : 992-1199px (desktop)
- **xl** : 1200px+ (large desktop)

### Optimisations Incluses

- Grids adaptatifs (1 / 2 / 3 colonnes selon écran)
- Padding/margins responsive
- Modals fullscreen sur mobile
- Touch targets 44x44px minimum
- Animations performantes

**Pour améliorations supplémentaires** : Consulter [REACT-MIGRATION.md](docs/REACT-MIGRATION.md) (menu burger mobile, swipe gestures, etc.)

---

## 🎯 Fonctionnalités Avancées

### Calcul Automatique du Niveau

```
< 10 séances complétées    → Débutant
10-29 séances complétées   → Intermédiaire
30+ séances complétées     → Avancé
```

### Système de Streak

Calcul intelligent des jours consécutifs de pratique (détecte les pauses)

### Suggestion Intelligente

L'algorithme "Continuer ma pratique" évite les séances récemment complétées pour varier l'entraînement

### Export RGPD

Bouton export dans la page Progression → fichier JSON avec toutes les données utilisateur

### Logs Admin

Toutes les actions admin (création, modification, suppression) sont enregistrées avec timestamp dans localStorage

---

## 🔒 Sécurité

✅ **Authentification**

- Hash SHA-256 des mots de passe (Web Crypto API)
- Validation email/mot de passe côté client
- Sanitization des inputs contre XSS

✅ **Autorisations**

- Vérification rôle admin sur chaque page admin
- Redirect automatique si non autorisé
- Sessions sécurisées (sessionStorage)

✅ **Données**

- Conformité RGPD (export données complet)
- Pas de données sensibles en clair
- LocalStorage chiffré pour mots de passe

---

Au premier lancement, créez un compte avec un de ces emails :

- `admin@yoga-app.com`
- `admin@example.com`

Le compte sera automatiquement admin.

---

## 📁 Structure du Projet

```
Yoga2/
├── 📄 index.html              # Page d'accueil
├── 📄 login.html              # Connexion
├── 📄 register.html           # Inscription
├── 📄 dashboard.html          # Dashboard utilisateur
├── 📄 sessions.html           # Liste des séances
├── 📄 session-player.html     # Lecteur de séance
├── 📄 breathing.html          # Exercices respiration
├── 📄 admin.html              # Dashboard admin
│
├── 📁 css/
│   ├── styles.css             # Styles principaux
│   └── themes.css             # Thèmes clair/sombre + auth
│
├── 📁 js/
│   ├── app.js                 # Point d'entrée principal
│   ├── auth.js                # Système d'authentification
│   ├── theme.js               # Gestion thème clair/sombre
│   ├── sessions.js            # Gestion des séances (à créer)
│   ├── player.js              # Lecteur de séance (à créer)
│   ├── breathing.js           # Module respiration (à créer)
│   └── admin.js               # Interface admin (à créer)
│
├── 📁 docs/
│   ├── ARCHITECTURE.md        # Architecture complète
│   ├── SECURITY.md            # Guide de sécurité
│   └── PROMPTS.md             # Prompts de développement
│
└── 📄 README.md               # Ce fichier
```

---

## 🎨 Fonctionnalités

### ✅ Implémentées

1. **Page d'accueil**
   - Hero avec appel à l'action
   - Accès rapides (Séance du jour, Respiration, Étirements)
   - Section features (4 piliers)
   - Aperçu séances populaires

2. **Authentification**
   - Inscription avec validation
   - Connexion sécurisée
   - Protection brute force (5 tentatives max)
   - Hachage SHA-256 des mots de passe
   - Session timeout (30 min)
   - Auto-logout sur inactivité

3. **Thème clair/sombre**
   - Bouton toggle en haut à droite
   - Transition douce (0.3s)
   - Sauvegarde préférence
   - Icons animés (soleil/lune)

4. **Données d'exemple**
   - 5 séances prédéfinies au premier lancement
   - Niveaux variés (débutant à avancé)
   - Types différents (Hatha, Vinyasa, Yin)

### 🚧 À compléter

5. **Dashboard utilisateur** (fichier HTML à créer)
6. **Liste des séances** (fichier HTML à créer)
7. **Lecteur de séances** (fichier HTML à créer)
8. **Respiration guidée** (fichier HTML à créer)
9. **Dashboard admin** (fichier HTML à créer)
10. **Application mobile** (structure Expo Router à créer)

---

## 🔐 Sécurité

### Implémentée

- ✅ Hachage des mots de passe (SHA-256)
- ✅ Validation inputs (email, nom, mot de passe)
- ✅ Protection brute force (rate limiting)
- ✅ Session management (JWT-like tokens)
- ✅ Auto-logout sur inactivité (30 min)
- ✅ Rôles utilisateurs (user/admin)
- ✅ Logs d'activité

### À ajouter (Phase 2)

- 🔄 Backend réel (Firebase/Supabase)
- 🔄 Vraie signature JWT
- 🔄 HTTPS forcé
- 🔄 CSP headers
- 🔄 2FA pour admin

Voir [SECURITY.md](docs/SECURITY.md) pour tous les détails.

---

## 🎯 Utilisation

### En tant qu'utilisateur

1. **S'inscrire**
   - Aller sur `register.html`
   - Remplir le formulaire
   - Choisir son niveau

2. **Se connecter**
   - Email + mot de passe
   - Option "Se souvenir de moi"

3. **Pratiquer**
   - Parcourir les séances
   - Filtrer par niveau/durée/objectif
   - Démarrer une séance
   - Suivre sa progression

### En tant qu'admin

1. **Se connecter avec email admin**
   - `admin@yoga-app.com` (à créer au premier lancement)

2. **Accéder au dashboard admin**
   - Ajouter des séances en 2 clics
   - Modifier/supprimer des séances
   - Voir les statistiques

---

## 🛠️ Développement

### Technologies

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Storage** : localStorage / sessionStorage (Phase 1)
- **Mobile** : React Native + Expo Router (Phase 2)
- **Backend** : Firebase/Supabase (Phase 3)

### Ajouter une nouvelle page

Voir [PROMPTS.md](docs/PROMPTS.md) pour les prompts copier-coller.

Exemple pour créer la page dashboard :

```
Je veux créer le dashboard utilisateur (dashboard.html) avec :
- Navbar avec logo et menu
- Section de bienvenue avec nom de l'utilisateur
- Stats (séances complétées, temps total, streak)
- Séances récentes
- Bouton "Nouvelle séance"
Utilise le même style que les autres pages (themes.css + styles.css).
```

---

## 📱 Version Mobile (Expo Router)

### Structure

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Accueil
│   │   ├── sessions.tsx       # Séances
│   │   ├── breathing.tsx      # Respiration
│   │   └── progress.tsx       # Progression
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── session/
│       └── [id].tsx           # Player
├── package.json
└── app.json
```

### Installation mobile

```bash
cd mobile
npm install
npx expo start
```

Voir [ARCHITECTURE.md](docs/ARCHITECTURE.md) pour tous les détails.

---

## 🎨 Personnalisation

### Changer les couleurs

Éditer `css/themes.css` :

```css
:root {
  --accent: #6b46c1; /* Violet par défaut */
  --accent-hover: #553c9a;
  /* ... */
}
```

### Ajouter une séance

Via l'interface admin (quand implémentée) ou manuellement :

```javascript
const newSession = {
  id: crypto.randomUUID(),
  title: "Ma séance",
  description: "Description",
  duration: 20,
  level: "beginner",
  type: "hatha",
  objectives: ["détente"],
  poses: [{ name: "Posture 1", duration: 60, instructions: "..." }],
  createdAt: new Date().toISOString(),
};

const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
sessions.push(newSession);
localStorage.setItem("sessions", JSON.stringify(sessions));
```

---

## 🐛 Résolution de problèmes

### La page est blanche

1. Vérifier que vous utilisez un serveur local (pas `file://`)
2. Ouvrir la console (F12) pour voir les erreurs
3. Vider le cache et recharger (Ctrl+Shift+R)

### Le thème ne change pas

1. Vérifier que `theme.js` est chargé
2. Regarder la console pour erreurs
3. Essayer de vider localStorage : `localStorage.clear()`

### "Non authentifié" en boucle

1. Vérifier que vous êtes connecté
2. Regarder sessionStorage : `sessionStorage.getItem('authToken')`
3. Vous reconnecter

### Les séances ne s'affichent pas

1. Vérifier localStorage : `localStorage.getItem('sessions')`
2. Recharger la page (les séances d'exemple se créent au premier chargement)

---

## 📚 Documentation Complète

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture technique détaillée
- [SECURITY.md](docs/SECURITY.md) - Guide de sécurité complet
- [PROMPTS.md](docs/PROMPTS.md) - Prompts pour développement feature par feature

---

## 🗺️ Roadmap

### Phase 1 - MVP ✅ (En cours)

- [x] Structure HTML/CSS de base
- [x] Système d'authentification
- [x] Thème clair/sombre
- [x] 5 séances prédéfinies
- [ ] Dashboard utilisateur
- [ ] Lecteur de séance basique
- [ ] Module respiration
- [ ] Dashboard admin

### Phase 2 - Mobile (Prochaine)

- [ ] Setup Expo Router
- [ ] Pages principales mobile
- [ ] Synchronisation web ↔ mobile
- [ ] Notifications push

### Phase 3 - Backend

- [ ] Migration vers Firebase/Supabase
- [ ] API REST
- [ ] Upload d'images/vidéos
- [ ] Vraie authentification serveur

### Phase 4 - Avancé

- [ ] IA pour recommandations
- [ ] Vidéos des postures
- [ ] Communauté
- [ ] Mode premium

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus d'informations.

---

## 💬 Support

Pour toute question :

- Consulter la documentation dans `/docs`
- Ouvrir une issue sur GitHub
- Contact : yoga-app@example.com

---

## � Documentation Complète

- [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) : Vue d'ensemble architecture
- [**PROMPTS.md**](docs/PROMPTS.md) : Prompts de développement (8 sections ✅)
- [**REACT-MIGRATION.md**](docs/REACT-MIGRATION.md) : Guide migration React + Responsive
- [**SECURITY.md**](docs/SECURITY.md) : Détails sécurité
- [**TESTING.md**](docs/TESTING.md) : Tests et validation
- [**VISUAL-GUIDE.md**](docs/VISUAL-GUIDE.md) : Guide visuel

---

## 🚀 Prochaines Étapes (Phase 2)

1. **📱 Responsive** : Menu burger, swipe gestures (guide dans REACT-MIGRATION.md)
2. **⚛️ Migration React.js** : Guide complet étape par étape fourni
3. **📱 Mobile React Native/Expo** : Architecture documentée
4. **🔌 Backend API** : Node.js + Express + MongoDB
5. **🎯 Features** : Vidéos, musiques, social, gamification

Consulter [REACT-MIGRATION.md](docs/REACT-MIGRATION.md) pour tous les détails !

---

## ✅ Statut du Projet

### Pages : 8/8 ✅

1. ✅ Index + Auth
2. ✅ Dashboard
3. ✅ Sessions
4. ✅ Player
5. ✅ Respiration
6. ✅ Progression
7. ✅ Admin
8. ✅ Learning

**Projet 100% complet et fonctionnel !** 🎉

---

## 🙏 Remerciements

- Inspiration : philosophie du yoga
- Design : Material Design + iOS guidelines
- Icons : Lucide Icons
- Fonts : Inter + Playfair Display

---

**Prenez soin de vous. Pratiquez régulièrement. Respirez profondément.** 🧘‍♀️  
**Namaste 🙏**

_Dernière mise à jour : 24 janvier 2026_  
_Version : 1.0.0 - Vanilla JavaScript Complete_
