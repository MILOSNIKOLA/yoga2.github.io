# Guide de Développement - Yoga2 SaaS

## 🛠️ Configuration du Développement

### 1. Installation

```bash
# Cloner le projet
git clone <repository-url>
cd yoga2

# Installer les dépendances
cd server && npm install
cd ../client && npm install
```

### 2. Configuration

#### Backend

```bash
cd server
cp .env.example .env
# Éditer .env avec vos clés de développement
```

#### Frontend

```bash
cd client
# Créer .env.local avec les variables Firebase
```

### 3. Lancement en Développement

#### Terminal 1 - Backend

```bash
cd server
npm run dev
# Serveur sur http://localhost:5000
```

#### Terminal 2 - Frontend

```bash
cd client
npm start
# Application sur http://localhost:3000
```

## 📁 Structure du Code

### Frontend (React)

```
client/src/
├── components/     # Composants réutilisables
│   ├── Navbar.jsx
│   └── Navbar.css
├── pages/         # Pages principales
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── *.css
├── services/      # Services API
│   └── authService.js
├── App.js         # Routing principal
├── App.css        # Styles globaux
└── index.js       # Point d'entrée
```

### Backend (Node.js)

```
server/
├── models/        # Modèles MongoDB
│   ├── User.js
│   └── Content.js
├── routes/        # Routes API
│   ├── auth.js
│   ├── subscription.js
│   └── content.js
├── server.js      # Point d'entrée serveur
├── package.json
└── .env.example
```

## 🔧 Scripts Disponibles

### Frontend

```bash
npm start          # Lancement développement
npm run build      # Build production
npm test           # Tests
npm run eject      # Éjection CRA
```

### Backend

```bash
npm start          # Production
npm run dev        # Développement (nodemon)
```

## 🎨 Design System

### Couleurs

```css
--primary: #22c55e; /* Vert principal */
--primary-dark: #16a34a; /* Vert foncé */
--secondary: #1e293b; /* Bleu nuit */
--accent: #3b82f6; /* Bleu accent */
--bg-dark: #0f172a; /* Fond sombre */
--bg-card: #1e293b; /* Cartes */
--text-light: #f8fafc; /* Texte clair */
--text-muted: #94a3b8; /* Texte secondaire */
--border: #334155; /* Bordures */
```

### Composants

#### Boutons

```jsx
// Bouton primaire
<button className="btn btn-primary">Action</button>

// Bouton secondaire
<button className="btn btn-secondary">Action</button>
```

#### Cartes

```jsx
<div className="card">
  <h3>Titre</h3>
  <p>Description</p>
</div>
```

### Animations (Framer Motion)

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Contenu animé
</motion.div>;
```

## 🔐 Authentification

### Firebase Auth

```javascript
import { authService } from "../services/authService";

// Connexion
await authService.login(email, password);

// Inscription
await authService.register(email, password, name);

// Déconnexion
await authService.logout();

// État utilisateur
const user = authService.getCurrentUser();
```

## 💰 Intégration Stripe

### Créer une session de checkout

```javascript
// Dans un composant React
const handleUpgrade = async () => {
  try {
    const response = await axios.post(
      "/api/subscription/create-checkout-session",
      {
        userId: user.uid,
      },
    );
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Erreur paiement:", error);
  }
};
```

### Webhook backend

```javascript
// server/routes/subscription.js
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      // Activer l'abonnement
      await User.findOneAndUpdate(
        { firebaseUid: session.metadata.userId },
        { premium: true },
      );
    }
  },
);
```

## 📊 API Endpoints

### Authentification

- `POST /api/auth/users` - Créer/Mettre à jour utilisateur
- `GET /api/auth/users/:firebaseUid` - Récupérer utilisateur
- `PATCH /api/auth/users/:firebaseUid/premium` - Mettre à jour statut premium

### Abonnements

- `POST /api/subscription/create-checkout-session` - Créer session Stripe

### Contenu

- `GET /api/content` - Liste du contenu (avec filtres)
- `GET /api/content/:id` - Contenu spécifique
- `POST /api/content` - Créer du contenu
- `PUT /api/content/:id` - Mettre à jour
- `DELETE /api/content/:id` - Supprimer

## 🧪 Tests

### Tests Frontend

```bash
cd client
npm test
```

### Tests API (Postman/Insomnia)

```json
// Test connexion
POST http://localhost:5000/api/auth/users
{
  "firebaseUid": "test-uid",
  "email": "test@example.com",
  "name": "Test User"
}
```

## 🚀 Déploiement

### Développement

- Frontend : `npm start` (localhost:3000)
- Backend : `npm run dev` (localhost:5000)

### Production

- Frontend : Vercel
- Backend : Render/Railway
- Base de données : MongoDB Atlas

## 🔍 Debugging

### Console Logs

```javascript
// Frontend
console.log("État utilisateur:", user);
console.log("Erreur API:", error);

// Backend
console.log("Requête reçue:", req.body);
console.log("Utilisateur trouvé:", user);
```

### Outils

- **React DevTools** : Inspection composants
- **Redux DevTools** : État application
- **Postman** : Test API
- **Stripe Dashboard** : Paiements
- **Firebase Console** : Authentification

## 📝 Bonnes Pratiques

### Code

- Composants fonctionnels avec hooks
- Gestion d'erreur avec try/catch
- Validation des props
- Commentaires pour logique complexe

### Sécurité

- Validation côté serveur
- Sanitisation des entrées
- Gestion des secrets
- CORS configuré

### Performance

- Lazy loading des composants
- Optimisation des images
- Code splitting
- Memoization des calculs

### UX

- États de chargement
- Messages d'erreur clairs
- Feedback visuel
- Accessibilité (ARIA labels)

---

## 🎯 Checklist Développement

- [ ] Environnement configuré
- [ ] API fonctionnelles
- [ ] Authentification opérationnelle
- [ ] Paiements Stripe intégrés
- [ ] Interface responsive
- [ ] Tests passés
- [ ] Code review effectué
- [ ] Documentation à jour

**Prêt pour le développement ! 🚀**
