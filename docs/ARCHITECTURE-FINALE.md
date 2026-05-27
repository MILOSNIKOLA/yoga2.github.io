# Architecture finale Yoga2

## Source de vérité

Le backend principal est `server/`.

Il est responsable de :

- l'identité applicative et les JWT serveur ;
- le modèle utilisateur MongoDB ;
- les droits `premium` et `admin` ;
- les contenus protégés ;
- les abonnements Stripe et webhooks.

Le frontend principal actuel est le site statique à la racine :

- `index.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `sessions.html`
- `js/`
- `css/`

Le dossier `client/` est un prototype React secondaire temporaire. Il doit appeler les mêmes routes backend et utiliser le même schéma utilisateur. Il ne doit pas introduire une seconde logique métier.

Les dossiers `yoga2-app/` et `yoga2-server/` sont considérés comme prototypes tant qu'ils ne sont pas explicitement promus.

## Schéma utilisateur canonique

```json
{
  "id": "mongodb-id",
  "firebaseUid": "external-or-local-uid",
  "name": "Nom affiché",
  "email": "user@example.com",
  "premium": false,
  "role": "user",
  "level": "beginner",
  "createdAt": "ISO date",
  "lastLogin": "ISO date"
}
```

À éviter dans le code neuf :

- `fullName` au lieu de `name`
- `isPremium` au lieu de `premium`
- `uid` sans conversion vers `firebaseUid`
- décisions de sécurité basées uniquement sur `localStorage`

## Routes backend canoniques

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `GET /api/auth/users/:firebaseUid`
- `PATCH /api/auth/users/:firebaseUid/premium` admin uniquement
- `POST /api/subscription/create-checkout-session` authentifié
- `POST /webhook` Stripe avec body brut
- `GET /api/content`
- `GET /api/content/:id` authentifié si contenu premium
- `POST|PUT|DELETE /api/content` admin uniquement

## Règles de sécurité

- Le frontend peut afficher l'état courant, mais ne décide pas des droits.
- Le statut premium est écrit par Stripe/webhook ou par une route admin protégée.
- Le rôle admin est attribué côté serveur via configuration `ADMIN_EMAILS`.
- Les routes sensibles exigent un JWT serveur.
- Les entrées sont normalisées côté serveur avant écriture.

## Auth retenue

Court terme retenu pour stabiliser le produit : auth serveur simple avec JWT applicatif.

Firebase reste la cible propre si React devient le frontend principal : le client récupérera un ID token Firebase, le backend le vérifiera, puis chargera le profil applicatif MongoDB. Cette étape ne doit pas réintroduire de décisions premium/admin côté navigateur.

## Organisation cible

Structure visée à terme :

```text
Yoga2/
  site/
  server/
  docs/
  tests/
  archive/
  assets/
```

Migration recommandée :

1. Garder le site statique racine comme production actuelle.
2. Déplacer les démos et tests HTML manuels vers `archive/` ou `tests/manual/`.
3. Promouvoir `client/` seulement après remplacement complet des pages statiques.
4. Supprimer ou archiver les prototypes `yoga2-app/` et `yoga2-server/` après validation.

## i18n

Système à conserver : `js/i18n-manager.js`.

Les fichiers `js/language.js`, `js/universal-language.js` et `js/universal-language-v2.js` doivent être traités comme héritage jusqu'à migration. Les nouvelles pages ne doivent pas les importer.

## Tests minimum

À maintenir avant chaque release :

- syntaxe serveur avec `npm test` dans `server/` ;
- login/register ;
- accès dashboard authentifié ;
- refus accès admin non-admin ;
- création checkout Stripe en mode test ;
- changement de langue sur les pages principales.
