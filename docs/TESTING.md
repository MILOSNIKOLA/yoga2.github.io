# ✅ CHECKLIST DE TEST - APPLICATION YOGA

## 🧪 Tests à effectuer

### 1. Test du Thème Clair/Sombre

- [ ] **Bouton visible en haut à droite** sur toutes les pages
- [ ] **Click sur le bouton** change le thème instantanément
- [ ] **Transition douce** (0.3s) entre les thèmes
- [ ] **Icône change** : ☀️ en mode clair → 🌙 en mode sombre
- [ ] **Préférence sauvegardée** : recharger la page garde le thème choisi
- [ ] **Contraste suffisant** en mode sombre (texte lisible)
- [ ] **Toutes les couleurs adaptées** (pas de blanc sur blanc ou noir sur noir)

### 2. Test de l'Inscription

- [ ] **Formulaire d'inscription** accessible depuis index.html
- [ ] **Validation email** : refuse les emails invalides
- [ ] **Validation mot de passe** : minimum 8 caractères, 1 majuscule, 1 chiffre
- [ ] **Indicateur de force** du mot de passe change en temps réel
- [ ] **Confirmation du mot de passe** : vérifie que les deux correspondent
- [ ] **Choix du niveau** : débutant, intermédiaire, avancé
- [ ] **Message d'erreur** si un champ est invalide
- [ ] **Compte créé avec succès** → redirection vers dashboard
- [ ] **Email déjà utilisé** → message d'erreur clair
- [ ] **Compte admin** : tester avec email `admin@yoga-app.com`

### 3. Test de la Connexion

- [ ] **Formulaire de connexion** accessible
- [ ] **Login avec bon mot de passe** → succès
- [ ] **Login avec mauvais mot de passe** → erreur
- [ ] **Message d'erreur générique** (pas "email invalide" ou "mot de passe invalide" séparément)
- [ ] **5 tentatives échouées** → blocage temporaire (5 minutes)
- [ ] **Option "Se souvenir"** : cocher → token dans localStorage (pas seulement sessionStorage)
- [ ] **Redirection** après login vers dashboard.html
- [ ] **Bouton "Mot de passe oublié"** présent (même si pas fonctionnel)

### 4. Test de l'Authentification

- [ ] **Accès à index.html** : OK sans authentification
- [ ] **Accès à dashboard.html sans login** → redirection vers login.html
- [ ] **Token expiré** (après 30 min) → déconnexion automatique
- [ ] **Inactivité (30 min)** → message + déconnexion
- [ ] **Bouton déconnexion** : clear session + redirect index.html
- [ ] **Fermer onglet puis rouvrir** :
  - Si "Se souvenir" coché → resté connecté
  - Sinon → déconnecté

### 5. Test des Données d'Exemple

- [ ] **Au premier chargement** : 5 séances créées automatiquement
- [ ] **Séances visibles** sur la page d'accueil (section "Séances populaires")
- [ ] **Chaque séance** a :
  - Titre
  - Description
  - Durée (en minutes)
  - Niveau (badge coloré)
  - Objectifs (tags)
- [ ] **Niveaux variés** : débutant, intermédiaire, avancé
- [ ] **Types variés** : hatha, vinyasa, yin
- [ ] **Click sur une séance** → devrait aller vers session-player.html?id=xxx

### 6. Test du localStorage

- [ ] **Ouvrir DevTools** → Application → Local Storage
- [ ] **Clé `users`** existe et contient array
- [ ] **Clé `sessions`** existe avec 5 séances
- [ ] **Clé `theme`** existe ("light" ou "dark")
- [ ] **Mot de passe haché** : pas en clair dans localStorage
- [ ] **Créer un compte** → nouveau user dans localStorage.users
- [ ] **Vider localStorage** → séances recréées au prochain chargement

### 7. Test du sessionStorage

- [ ] **Après connexion** : sessionStorage contient :
  - `authToken`
  - `userId`
  - `userName`
  - `userRole`
- [ ] **Token format** : ressemble à JWT (3 parties séparées par des points)
- [ ] **Déconnexion** → sessionStorage vidé

### 8. Test du Responsive

**Mobile (< 480px)** :

- [ ] **Menu hamburger** (si implémenté)
- [ ] **Boutons pleine largeur** (width: 100%)
- [ ] **Grid 1 colonne** pour features et séances
- [ ] **Hero title lisible** (taille réduite mais pas trop petit)
- [ ] **Formulaires** : inputs pleine largeur
- [ ] **Bouton thème** : toujours visible et cliquable

**Tablette (480-768px)** :

- [ ] **Grid 2 colonnes** pour sessions
- [ ] **Navigation horizontale** (pas de hamburger)
- [ ] **Espacement adapté**

**Desktop (> 768px)** :

- [ ] **Grid 3-4 colonnes** selon la section
- [ ] **Container max-width** : 1200px
- [ ] **Marges latérales** suffisantes
- [ ] **Pas de scroll horizontal**

### 9. Test de Sécurité

- [ ] **Inspection du code** : pas de secrets/API keys dans le code
- [ ] **localStorage** : mot de passe haché (pas en clair)
- [ ] **Console** : pas d'erreurs JavaScript
- [ ] **XSS** : tenter d'insérer `<script>alert('XSS')</script>` dans un input → doit être sanitisé
- [ ] **Logs d'activité** : actions enregistrées dans localStorage.activityLogs
- [ ] **Logs admin** : si admin, actions dans localStorage.adminLogs

### 10. Test Admin (si email admin)

- [ ] **S'inscrire avec `admin@yoga-app.com`**
- [ ] **Vérifier rôle** : sessionStorage.userRole = "admin"
- [ ] **Accès à admin.html** : OK
- [ ] **Accès à admin.html en tant que user** : redirection vers dashboard

### 11. Test de Performance

- [ ] **Chargement initial** : < 3 secondes (sans images)
- [ ] **Animations fluides** : 60 FPS (pas de lag)
- [ ] **Transition thème** : douce et sans flash
- [ ] **Pas de memory leaks** : ouvrir/fermer pages plusieurs fois

### 12. Test d'Accessibilité

- [ ] **Navigation au clavier** : Tab pour naviguer, Enter pour cliquer
- [ ] **Focus visible** : outlines visibles sur les éléments
- [ ] **Contraste** : ratio 4.5:1 minimum (vérifier avec outil)
- [ ] **Textes alternatifs** : si images (pour l'instant seulement emojis)
- [ ] **Labels sur inputs** : tous les inputs ont un label
- [ ] **Bouton thème** : aria-label="Toggle theme"

### 13. Test Cross-Browser

- [ ] **Chrome** : tout fonctionne
- [ ] **Firefox** : tout fonctionne
- [ ] **Safari** : tout fonctionne (attention aux CSS variables)
- [ ] **Edge** : tout fonctionne

### 14. Test des Erreurs

- [ ] **Erreur 404** : page inexistante → comportement ?
- [ ] **localStorage désactivé** : message d'erreur ?
- [ ] **JavaScript désactivé** : message "Activer JavaScript" ?
- [ ] **Connexion internet** : tout fonctionne en offline (Phase 1)

### 15. Test de l'Expérience Utilisateur

- [ ] **Page d'accueil accueillante** : message clair, design zen
- [ ] **Inscription intuitive** : tous les champs clairs
- [ ] **Pas de friction** : inscription/connexion rapide
- [ ] **Feedback visuel** : loading states, messages de succès/erreur
- [ ] **Cohérence** : même style partout
- [ ] **Typo lisible** : pas trop petite, bon contraste

---

## 📊 Résultats des Tests

| Test               | Statut | Notes    |
| ------------------ | ------ | -------- |
| Thème clair/sombre | ⏳     | À tester |
| Inscription        | ⏳     | À tester |
| Connexion          | ⏳     | À tester |
| Authentification   | ⏳     | À tester |
| Données d'exemple  | ⏳     | À tester |
| localStorage       | ⏳     | À tester |
| sessionStorage     | ⏳     | À tester |
| Responsive         | ⏳     | À tester |
| Sécurité           | ⏳     | À tester |
| Admin              | ⏳     | À tester |
| Performance        | ⏳     | À tester |
| Accessibilité      | ⏳     | À tester |
| Cross-browser      | ⏳     | À tester |
| Erreurs            | ⏳     | À tester |
| UX globale         | ⏳     | À tester |

**Légende** :

- ✅ Validé
- ❌ Échoué
- ⏳ Pas encore testé
- ⚠️ Problème mineur

---

## 🐛 Bugs Découverts

_À remplir pendant les tests_

| #   | Description | Sévérité | Page | Statut |
| --- | ----------- | -------- | ---- | ------ |
| 1   |             |          |      |        |
| 2   |             |          |      |        |
| 3   |             |          |      |        |

**Sévérité** :

- 🔴 Critique (bloquant)
- 🟠 Majeur (important)
- 🟡 Mineur (cosmétique)

---

## 📝 Notes de Test

### Session de test du [DATE]

**Testeur** : [NOM]
**Environnement** :

- OS : Windows / macOS / Linux
- Navigateur : Chrome / Firefox / Safari
- Taille écran : Desktop / Mobile / Tablette

**Observations** :

-
-
-

**Bugs trouvés** :

-
-

**Suggestions d'amélioration** :

-
-

---

## 🚀 Checklist avant Déploiement

- [ ] Tous les tests passent ✅
- [ ] Aucun bug critique
- [ ] Performance validée (< 3s load)
- [ ] Accessibilité WCAG 2.1 AA
- [ ] Responsive testé sur 3 devices min
- [ ] Documentation à jour
- [ ] README.md complet
- [ ] Sécurité auditée
- [ ] Backup des données possible
- [ ] Plan de rollback en place

---

**Bon testing ! 🧪**

_Checklist créée le 23 janvier 2026_
