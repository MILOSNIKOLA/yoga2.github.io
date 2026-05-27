# Audit auth - étape 1

## Décision d'architecture

- Frontend principal officiel : HTML/CSS/JS statique à la racine.
- Backend principal officiel : `server/`.
- React `client/` : prototype secondaire temporaire, à garder aligné sur les routes backend canoniques.
- `yoga2-app/` et `yoga2-server/` : prototypes hérités, non sources de vérité.

## Où on crée un user

- Site statique : `js/auth.js`, fonction `register`.
- React : `client/src/services/authService.js`, méthode `register`.
- Backend : `server/routes/auth.js`, route `POST /api/auth/register`.
- Admin backend : `server/routes/auth.js`, route `POST /api/auth/users`, admin uniquement.

## Où on lit un user

- Site statique : `js/auth.js`, fonction `getCurrentUser`.
- Dashboard : `js/dashboard.js`, fonction `getDashboardUser`.
- Progression : `js/progress.js`, via `getCurrentUser`.
- Sessions : `js/sessions.js`, fonction `isPremiumUser`.
- Player : `js/player.js`, contrôle premium avant lecture.
- React : `client/src/services/authService.js`, `getCurrentUser` et `getUserData`.
- Backend : `server/routes/auth.js`, `GET /api/auth/me` et `GET /api/auth/users/:firebaseUid`.

## Où on stocke le user

- Court terme site statique :
  - `authToken`
  - `userId`
  - `firebaseUid`
  - `userName`
  - `userRole`
  - `userPremium`
- Compatibilité locale :
  - `users`
  - `sessionHistory`
- React :
  - `authToken`
  - `user`

## Où on décide premium/admin

- Source de vérité serveur :
  - `server/models/User.js`
  - `server/middleware/auth.js`
  - `server/routes/auth.js`
  - `server/routes/content.js`
  - `server/routes/subscription.js`
  - `server/server.js` pour le webhook Stripe
- Frontend :
  - affiche et masque seulement selon l'état reçu ou stocké ;
  - ne doit pas accorder un droit définitif.

## Où on redirige après login

- `login.html` redirige vers `dashboard.html`.
- `register.html` redirige vers `dashboard.html`.
- `js/auth.js` redirige vers `login.html` si `requireAuth` échoue.
- `js/auth.js` redirige vers `dashboard.html` si `requireAdmin` échoue.
- `js/auth.js` redirige vers `index.html` après logout.

## Choix auth étape 1

Choix court terme : auth serveur simple avec JWT, déjà branchée sur le site statique.

Trajectoire recommandée : Firebase Auth côté client + backend qui vérifie les ID tokens Firebase avant de produire/mettre à jour le profil applicatif. Cette migration doit remplacer progressivement le fallback localStorage.
