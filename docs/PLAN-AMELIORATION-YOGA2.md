# Plan d'amélioration Yoga2

Date : 24 mai 2026  
Projet : Yoga2  
Objectif : avoir une feuille de route claire, priorisée et exploitable pour faire évoluer le site proprement.

---

## 0. Décision validée

Décision prise le 24 mai 2026 :

- frontend principal : HTML / CSS / JS
- backend principal : `server/`
- `client/` React : mis en pause pour plus tard

---

## 1. Résumé simple

Aujourd'hui, Yoga2 a une bonne base produit, mais il faut d'abord corriger la structure technique avant d'ajouter trop de nouvelles fonctionnalités.

Le plus important :

1. **Unifier l'architecture**
2. **Refaire l'authentification proprement**
3. **Sécuriser le backend et les accès premium/admin**
4. **Corriger les incohérences de données**
5. **Stabiliser Stripe**
6. **Nettoyer i18n, SEO et structure du projet**

---

## 2. Ce qu'il faut changer en premier

### Priorité absolue — à faire en premier

### 2.1 Choisir une seule architecture

Le projet mélange actuellement :

- un site statique HTML/CSS/JS à la racine,
- un client React dans `client/`,
- un backend Node/Express dans `server/`.

Ça crée :

- de la duplication,
- des bugs de cohérence,
- une maintenance compliquée,
- des comportements différents selon les pages.

### Décision à prendre

Tu dois choisir **une seule direction principale** :

#### Option recommandée

**Garder le site HTML/CSS/JS comme base principale à court terme**, puis le stabiliser.

Pourquoi :

- il semble être la partie la plus avancée et la plus utilisée,
- beaucoup de pages existent déjà,
- le React semble plus partiel/incomplet,
- ça te permet d'avancer plus vite sans tout réécrire maintenant.

#### Alternative

Migrer vraiment vers React + backend propre.  
Mais ça demande plus de temps.

### Action concrète

- décider si `client/` devient le futur vrai frontend ou non,
- si non, le mettre de côté comme prototype,
- continuer le travail principal sur la version HTML/JS,
- ne plus développer deux frontends en parallèle.

---

## 3. Ordre de travail recommandé

Voici l'ordre que je te conseille pour démarrer.

### Phase 1 — Stabilisation critique

1. choisir l'architecture principale,
2. corriger l'authentification,
3. corriger le modèle utilisateur,
4. sécuriser les accès premium/admin,
5. corriger Stripe/webhook.

### Phase 2 — Nettoyage technique

6. simplifier i18n,
7. nettoyer le code dupliqué,
8. réduire l'usage de `innerHTML`,
9. nettoyer l'organisation du projet.

### Phase 3 — Qualité produit

10. améliorer SEO,
11. améliorer performance,
12. améliorer accessibilité,
13. ajouter vrais tests.

### Phase 4 — Évolutions futures

14. refonte React si souhaitée,
15. analytics,
16. fonctionnalités premium avancées,
17. mobile/app.

---

## 4. Liste complète des améliorations

## A. Architecture

### Problème

Le projet a plusieurs couches qui ne sont pas totalement alignées.

### Impacts

- bugs difficiles à diagnostiquer,
- logique métier dupliquée,
- auth incohérente,
- plusieurs vérités différentes selon la page.

### À faire

- définir clairement le frontend principal,
- documenter l'architecture finale,
- arrêter les doublons de logique entre HTML/JS et React,
- séparer clairement `prod`, `prototype`, `docs`, `tests`.

### Fichiers / zones concernées

- `index.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `sessions.html`
- `js/`
- `client/`
- `server/`

---

## B. Authentification

### Problème

L'auth actuelle côté site statique repose sur `localStorage` / `sessionStorage`, avec logique sensible côté client.  
Le React utilise Firebase, mais les appels backend ne correspondent pas au serveur.

### Exemples repérés

- `client/src/services/authService.js` appelle `/api/users/...`
- le backend expose `/api/auth/users/...`
- le frontend React envoie `uid`
- le backend attend `firebaseUid`
- le frontend statique crée des utilisateurs en localStorage

### Risques

- connexions incohérentes,
- comptes différents selon la partie du site,
- sécurité faible,
- bugs premium / dashboard.

### À faire

- choisir une seule méthode d'auth,
- idéalement : Firebase Auth côté client + backend qui vérifie les tokens,
- supprimer progressivement la gestion des comptes dans `localStorage`,
- unifier les routes et les noms de champs,
- protéger les routes backend.

### Fichiers / zones concernées

- `js/auth.js`
- `login.html`
- `register.html`
- `client/src/services/authService.js`
- `server/routes/auth.js`

---

## C. Modèle utilisateur et cohérence des données

### Problème

Les propriétés utilisateur ne sont pas cohérentes partout.

### Exemples repérés

- un endroit utilise `name`
- un autre lit `fullName`
- un endroit utilise `premium`
- un autre lit `isPremium`

### Risques

- dashboard cassé,
- affichages faux,
- premium mal détecté,
- bugs silencieux.

### À faire

- définir un schéma utilisateur unique,
- utiliser les mêmes noms partout,
- faire une passe complète sur les lectures/écritures utilisateur.

### Schéma conseillé

```js
{
  id,
  firebaseUid,
  name,
  email,
  premium,
  createdAt,
  lastLogin
}
```

### Fichiers / zones concernées

- `js/auth.js`
- `js/dashboard.js`
- `js/sessions.js`
- `client/src/services/authService.js`
- `server/models/User.js`
- `server/routes/auth.js`

---

## D. Sécurité

### Problème

Il y a plusieurs éléments sensibles gérés côté client ou insuffisamment protégés côté serveur.

### Risques

- faux login,
- contournement premium,
- modification client facile,
- routes sensibles ouvertes,
- fuite de logique admin.

### À faire

- enlever la logique sensible du frontend,
- vérifier l'identité côté backend,
- restreindre CORS,
- valider les entrées,
- protéger les routes admin et premium,
- éviter toute décision de sécurité basée sur le seul localStorage.

### Fichiers / zones concernées

- `js/auth.js`
- `js/dashboard.js`
- `server/server.js`
- `server/routes/auth.js`
- `server/routes/content.js`
- `server/routes/subscription.js`

---

## E. Stripe / abonnement

### Problème

Le checkout est présent, mais le flux complet n'est pas encore assez robuste.

### Point important

Le webhook Stripe doit recevoir le body brut correctement.  
Avec `express.json()` global, il peut y avoir un problème de signature sur `/webhook`.

### À faire

- isoler correctement la route webhook,
- tester un vrai paiement en mode test,
- mettre à jour le statut premium après succès,
- stocker `subscriptionId`,
- prévoir la gestion annulation / renouvellement / échec paiement.

### Fichiers / zones concernées

- `server/server.js`
- `server/routes/subscription.js`
- `server/models/User.js`
- `js/dashboard.js`

---

## F. i18n / langues

### Problème

Il y a plusieurs systèmes langues dans le projet.

### Fichiers repérés

- `js/i18n-manager.js`
- `js/language.js`
- `js/universal-language.js`
- `js/universal-language-v2.js`

### Risques

- logique dupliquée,
- conflits,
- bugs difficiles à tracer,
- maintenance lourde.

### À faire

- garder un seul système,
- supprimer ou archiver les variantes anciennes,
- désactiver les logs debug en production,
- vérifier toutes les pages principales une par une.

### Priorité

Importante, mais après auth/sécurité/architecture.

---

## G. Dashboard et logique métier

### Problème

Le dashboard dépend encore beaucoup du `localStorage` et de noms de champs incohérents.

### À faire

- corriger la structure des données,
- centraliser la lecture utilisateur,
- préparer une vraie source de vérité backend quand prêt,
- fiabiliser :
  - progression,
  - historique,
  - statut premium,
  - message de bienvenue.

### Fichiers / zones concernées

- `dashboard.html`
- `js/dashboard.js`
- `js/progress.js`
- `js/player.js`

---

## H. Rendu DOM / sécurité front

### Problème

Le projet utilise souvent `innerHTML`.

### Risques

- XSS si contenu dynamique,
- DOM plus fragile,
- bugs lors des traductions ou re-rendus.

### À faire

- utiliser `textContent` quand possible,
- créer les éléments proprement pour le contenu dynamique,
- réserver `innerHTML` au HTML strictement maîtrisé.

### Fichiers / zones concernées

- `js/app.js`
- `js/dashboard.js`
- `js/learning.js`
- `js/player.js`
- `js/sessions.js`
- `js/recommendations.js`
- `js/admin.js`

---

## I. SEO

### Problème

Le home a déjà une base SEO, mais l'ensemble du site n'est pas homogène.

### À faire

- un `title` unique par page,
- une `meta description` par page,
- balises Open Graph homogènes,
- `canonical`,
- meilleure structure sémantique,
- vérification pages clés :
  - accueil,
  - sessions,
  - respiration,
  - learning,
  - login/register si utile.

### Fichiers / zones concernées

- `index.html`
- `sessions.html`
- `respirer.html`
- `learning.html`
- `contact.html`
- `confidentialite.html`
- `cgu.html`

---

## J. Accessibilité

### À améliorer

- vérifier les labels des formulaires,
- contraste couleurs,
- navigation clavier,
- focus visible,
- structure heading (`h1`, `h2`, `h3`),
- messages d'erreur accessibles,
- textes alternatifs si images significatives,
- cohérence des boutons d'action.

### Priorité

Moyenne, mais très utile après stabilisation technique.

---

## K. Performance

### À améliorer

- vérifier le poids des images,
- éviter les ressources inutiles,
- réduire scripts inutilisés,
- nettoyer anciens fichiers non utilisés,
- charger seulement ce qui est nécessaire,
- vérifier les images externes aléatoires type Unsplash.

### Point repéré

Des URLs `source.unsplash.com` sont utilisées dynamiquement dans `js/app.js`.  
Ce n'est pas idéal pour stabilité, performance et cohérence visuelle.

### À faire

- remplacer progressivement par des assets maîtrisés,
- compresser et servir des images fixes optimisées.

---

## L. Nettoyage projet

### Constat

Le repo contient beaucoup de :

- docs,
- démos,
- tests HTML,
- variantes,
- prototypes.

### À faire

- isoler les fichiers de démonstration,
- archiver les vieux essais,
- identifier clairement les pages de prod,
- organiser le projet avec dossiers plus lisibles.

### Structure cible suggérée

```text
Yoga2/
  app/ ou site/
  server/
  docs/
  archive/
  tests/
  assets/
```

---

## M. Tests

### Problème

Il y a peu de garanties automatiques sur les flux importants.

### À faire

Ajouter au minimum des tests sur :

- login,
- register,
- accès dashboard,
- passage premium,
- lecture session,
- changement de langue.

### Priorité

Après stabilisation principale.

---

## 5. Plan de démarrage concret

## Semaine / étape 1

### Tâche 1 — Décision d'architecture

Décider officiellement :

- frontend principal = HTML/JS actuel
- React = prototype secondaire temporaire

### Tâche 2 — Audit de l'auth

Lister :

- où on crée un user,
- où on lit un user,
- où on stocke le user,
- où on décide premium/admin,
- où on redirige après login.

### Tâche 3 — Unifier le modèle utilisateur

Corriger tous les champs incohérents :

- `fullName` → `name`
- `isPremium` → `premium`
- autres divergences similaires

### Tâche 4 — Corriger dashboard

Faire marcher proprement :

- bienvenue,
- email,
- membre depuis,
- premium,
- historique,
- déconnexion.

### Tâche 5 — Préparer vraie auth serveur

Choisir si tu veux :

- version simple court terme,
- ou vraie intégration Firebase/backend propre.

---

## 6. Ce que je te conseille de faire tout de suite

### Commence par ceci

#### 1. Figer l'architecture

Décide :

- **on continue sur le site HTML/JS en premier**

#### 2. Corriger la cohérence utilisateur

Avant toute autre chose, corrige les noms de champs incohérents.

#### 3. Corriger le dashboard

Parce que c'est l'endroit où les incohérences vont se voir immédiatement.

#### 4. Ensuite seulement, refaire l'auth proprement

Parce qu'une auth propre sur une structure incohérente crée encore plus de confusion.

---

## 7. Ordre de correction fichier par fichier

### En premier

1. `js/auth.js`
2. `js/dashboard.js`
3. `login.html`
4. `register.html`
5. `server/routes/auth.js`
6. `server/models/User.js`
7. `server/server.js`
8. `server/routes/subscription.js`

### En deuxième

9. `js/i18n-manager.js`
10. `js/language.js`
11. `js/universal-language.js`
12. `js/universal-language-v2.js`
13. `js/app.js`
14. `js/sessions.js`
15. `js/player.js`

### En troisième

16. `index.html`
17. `sessions.html`
18. `respirer.html`
19. `learning.html`
20. `contact.html`
21. `confidentialite.html`
22. `cgu.html`

---

## 8. Backlog priorisé

## P0 — critique

- choisir l'architecture principale,
- corriger auth,
- corriger modèle utilisateur,
- sécuriser backend,
- corriger Stripe webhook.

## P1 — important

- simplifier i18n,
- nettoyer dashboard/progression,
- réduire `innerHTML`,
- nettoyer l'organisation du repo.

## P2 — amélioration qualité

- SEO,
- accessibilité,
- performance,
- tests.

## P3 — évolution

- vraie migration React,
- mobile,
- analytics,
- nouvelles offres premium.

---

## 9. Comment reprendre demain

Quand on reviendra sur le projet, on pourra repartir de ce fichier.

Ordre recommandé demain :

1. ouvrir ce document,
2. valider ensemble l'architecture choisie,
3. commencer par `js/auth.js` et `js/dashboard.js`,
4. faire les corrections une par une,
5. mettre à jour ce plan au fur et à mesure.

---

## 9.1 Avancement réalisé le 24 mai 2026

Déjà corrigé :

- tests de cohérence exécutés : 8/8 checks OK sur auth/login/register/dashboard/webhook Stripe

- legacy i18n (`language.js`, `universal-language.js`, `universal-language-v2.js`) remplacés par des shims vers `i18n-manager.js`
- décision d'architecture validée : HTML/CSS/JS + `server/`
- `js/auth.js` : normalisation des utilisateurs (`name`, `premium`)
- `js/dashboard.js` : correction lecture user + premium
- `login.html` : nettoyage email + gestion erreur plus propre
- `register.html` : nettoyage nom/email + validations niveau/conditions
- `server/routes/auth.js` : alignement `uid` / `firebaseUid`, validations et réponses cohérentes
- `server/models/User.js` : ajout `role`, `level`, normalisation email/trim
- `server/server.js` : webhook Stripe replacé avant `express.json()`, CORS mieux cadré, health enrichi
- `server/routes/subscription.js` : alignement identifiants utilisateur et URLs de retour `.html`

Reste prioritaire ensuite :

- tester le flux complet en local
- `server/routes/content.js` : validations, sérialisation cohérente, contrôle ID/query
- nettoyer progressivement `innerHTML`
- simplifier i18n

---

## 10. Recommandation finale

Si tu veux avancer vite et bien :

### Direction recommandée

- **court terme** : stabiliser la version HTML/JS actuelle,
- **moyen terme** : nettoyer backend + auth + premium,
- **long terme** : décider si on migre totalement vers React.

### Premier vrai chantier

Le **tout premier chantier** que je te recommande :

> **corriger la cohérence des utilisateurs et du dashboard, puis remettre l'auth à plat**

Parce que c'est le nœud principal du projet.


## Note complémentaire

- nettoyage progressif de `innerHTML` commencé sur `js/dashboard.js`, `js/app.js` et `js/sessions.js`
- il reste encore des usages de rendu HTML dans `js/sessions.js` à traiter plus tard, mais les cas les plus simples et exposés ont été réduits
