# Architecture complète – Application Yoga Next.js

## 1. Diagramme d'architecture (vue globale)

```
UTILISATEUR (Web / PWA / Mobile Expo)
    ↓
Next.js 14 (App Router)
    ↓
Middleware (Auth / Paywall)
    ↓
Pages & Components React
    ↓
Hooks (Timer, Breath, User)
    ↓
Zustand (UI / Player / Filters)
    ↓
TanStack Query (cache data)
```

### API Routes Next.js

- `/api/sessions`
- `/api/history`
- `/api/checkout`
- `/api/webhooks/stripe`

### Services externes

- **Supabase** (PostgreSQL + Auth + RLS)
- **Stripe** (Checkout + Subscriptions)
- **Sentry** (Monitoring)
- **Vercel** (Hosting + Edge)

### PWA

- **Workbox** (cache statique + sessions gratuites)
- **Web Push** (V3)

---

## 2. Sécurité – feature par feature

### Authentification

- Next-Auth (Google / Apple)
- Cookies httpOnly
- Middleware Next.js : protection routes privées
- Supabase RLS : accès par user_id uniquement

### Séances gratuites / premium

- Champ `free` côté DB
- Vérification subscription côté API
- **Jamais de logique premium uniquement côté front**

### Player

- Timer 100 % client
- POST `/api/history` validé par session utilisateur
- Rate limiting (anti spam)

### Paiement

- Stripe Checkout (aucune donnée carte côté app)
- Webhook Stripe obligatoire
- Mise à jour subscription uniquement via webhook

### Offline

- Cache seulement contenu gratuit
- Pas de cache données utilisateur sensibles

---

## 3. Prompts "copier-coller" pour coder chaque page

### Home (index.tsx)

```
Créer une page Home mobile-first avec :
- Hero (phrase d'intention aléatoire)
- 3 QuickAccess cards
- Bottom navigation fixe
- Animation douce Framer Motion
- Aucun texte culpabilisant
```

### Pratiquer (pratiquer.tsx)

```
Créer une page liste de séances avec :
- FilterBar sticky
- Fetch via TanStack Query /api/sessions
- Cards cliquables
- Badge Gratuit / Premium
- Skeleton loading
```

### Séance Player (seance/[id].tsx)

```
Créer un player de séance avec :
- Timer circulaire SVG
- Audio Web Audio API
- Bouton Pause / Reprendre
- Fin de séance → POST history
- Paywall si premium non abonné
```

### Respirer (respirer.tsx)

```
Créer une page respiration avec :
- BreathCircle animé
- Choix type respiration
- Son + vibration optionnels
- Aucun score
```

### Philosophie (philosophie.tsx)

```
Créer une grille de cartes mini-articles :
- 2 min lecture max
- Lecture agréable
- Pas de scroll infini
```

### Profil (profil.tsx)

```
Créer une page profil avec :
- Stats douces
- Streak non compétitif
- Gestion abonnement
```

---

## 4. Priorisation stricte – jour par jour

### Semaine 1 – Fondations

- **Jour 1** : Repo Next.js + Tailwind + layout
- **Jour 2** : Supabase + Auth
- **Jour 3** : Modèle DB + import séances
- **Jour 4** : Liste séances + filtres
- **Jour 5** : Player gratuit + timer

### Semaine 2 – Valeur utilisateur

- **Jour 6** : Respiration solo
- **Jour 7** : Audio + animations
- **Jour 8** : Historique utilisateur
- **Jour 9** : Profil + stats
- **Jour 10** : Nettoyage UX + accessibilité

### Semaine 3 – Monétisation

- **Jour 11** : Stripe Checkout
- **Jour 12** : Webhooks + subscriptions
- **Jour 13** : Paywall
- **Jour 14** : Tests Playwright
- **Jour 15** : Déploiement Vercel

---

## 5. Règle directrice

Chaque feature doit :

- être simple
- respecter le souffle
- ne jamais forcer

**C'est une application de présence, pas de performance.**

---

## 6. PROMPTS DÉTAILLÉS – APPROFONDISSEMENT COMPLET

### 6.1 Prompt maître – Architecture globale

```
Tu es un architecte logiciel senior spécialisé Next.js 14, Supabase et Stripe.

Objectif : construire une application de yoga PWA sécurisée, performante et mobile-first.

Contraintes :
- Next.js App Router
- Auth via Next-Auth (Google + Apple)
- DB PostgreSQL (Supabase) avec RLS strict
- Monétisation freemium (gratuit / premium)
- UX calme, non culpabilisante

Produis :
1) l'architecture technique détaillée
2) les flux de données front → API → DB
3) les points de sécurité critiques
4) les décisions techniques justifiées
```

### 6.2 Prompt – Sécurité feature par feature

```
Agis comme un expert sécurité web.

Analyse chaque feature suivante et propose :
- risques potentiels
- protections nécessaires
- règles Supabase RLS
- validations côté API

Features :
- Authentification utilisateur
- Accès séances gratuites / premium
- Player (timer + history)
- Paiement Stripe
- Mode offline PWA

Contraintes :
- Aucune logique premium uniquement côté client
- Principe du moindre privilège
- UX fluide, pas de messages anxiogènes
```

### 6.3 Prompt – Génération page par page (template)

**Prompt générique :**

```
Tu es un développeur front-end senior.

Crée la page suivante en Next.js 14 App Router.

Respecte :
- Tailwind CSS
- HeadlessUI
- Framer Motion
- Accessibilité AA

Page : [NOM_DE_LA_PAGE]

Fonctionnalités attendues :
- [LISTE]

Retour attendu :
- structure JSX complète
- hooks utilisés
- logique data fetching
- commentaires clairs
```

**Exemple – Home :**

```
Crée la page Home d'une application de yoga.

Fonctions :
- Afficher une phrase d'intention aléatoire (FR/EN)
- 3 accès rapides
- Navigation bottom fixe
- Animations douces
- Aucun vocabulaire de performance

Retour : fichier index.tsx complet.
```

**Exemple – Player séance :**

```
Crée un player de séance de yoga.

Contraintes :
- Timer circulaire SVG
- Web Audio API (sons générés)
- Pause / reprise fiable
- Fin de séance → POST /api/history
- Vérification premium avant démarrage

Retour :
- component Player.tsx
- hook useTimer
- logique paywall
```

### 6.4 Prompt – API Routes

```
Agis comme un backend engineer Next.js.

Crée l'API route suivante : /api/sessions

Fonctions :
- Filtrer par level, duration, goal, type
- Ne retourner les séances premium que si abonnement actif
- Sécuriser via session utilisateur

Retour :
- code TypeScript
- validation des paramètres
- commentaires sécurité
```

### 6.5 Prompt – Supabase & RLS

```
Tu es un expert Supabase.

Propose :
- schéma SQL final
- règles Row Level Security complètes
- policies SELECT / INSERT / UPDATE

Objectif :
- un utilisateur ne peut accéder qu'à ses données
- seules les séances gratuites sont publiques
- premium conditionné à subscription active
```

### 6.6 Prompt – Stripe & abonnements

```
Agis comme un expert Stripe.

Implémente :
- Checkout Session (one-time + subscription)
- Webhook sécurisé
- Mise à jour Supabase subscription

Contraintes :
- aucune confiance dans le client
- idempotence webhook
- gestion paiement échoué
```

### 6.7 Prompt – PWA & Offline

```
Agis comme un expert PWA.

Configure Workbox pour :
- cache assets statiques
- cache séances gratuites
- ne jamais stocker données sensibles

Retour :
- stratégie cache détaillée
- règles invalidation
```

### 6.8 Prompt – Performance & monitoring

```
Agis comme un lead performance.

Analyse l'application et propose :
- optimisations Next.js
- lazy loading
- gestion audio performante
- intégration Sentry

Objectif : Lighthouse > 90 mobile.
```

### 6.9 Prompt – Tests

```
Agis comme un QA engineer.

Écris :
- tests Playwright E2E
- tests hooks critiques

Scénarios :
- utilisateur gratuit
- utilisateur premium
- paiement réussi / échoué
```

### 6.10 Prompt – Planification jour par jour

```
Agis comme un chef de projet agile.

Découpe le développement en tâches quotidiennes.

Contraintes :
- solo developer
- 6 h / jour
- priorité valeur utilisateur

Retour : planning détaillé jour par jour.
```

---

## 7. RÈGLE FINALE

Si une feature :

- ajoute du stress
- ajoute de la complexité inutile
- pousse à la performance

**Alors elle n'a pas sa place.**

Cette application invite. Elle n'exige jamais.

---

## Notes d'implémentation

Ce document sert de référence pour une future migration vers Next.js 14.

Le projet actuel (Yoga2) utilise HTML/CSS/JavaScript vanilla et implémente déjà plusieurs concepts clés :

- ✅ Page Respiration avec animations
- ✅ Système gratuit/premium
- ✅ Player de séance avec timer SVG
- ✅ Dashboard avec stats douces
- ✅ Authentification localStorage
- ✅ Historique de pratique

La migration vers Next.js apporterait :

- Authentification robuste (Next-Auth)
- Base de données scalable (Supabase)
- Paiements sécurisés (Stripe)
- PWA complète
- Performance optimale
- SEO amélioré
