# Architecture - Yoga2 SaaS

## 🏗️ Vue d'ensemble Architecture

Plateforme SaaS moderne avec séparation frontend/backend, microservices, et scalabilité cloud.

## 📱 Architecture Générale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Base de       │
│   React SPA     │◄──►│   Node.js       │◄──►│   Données       │
│                 │    │   Express       │    │   MongoDB       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   Stripe        │    │   CDN/Storage   │
│   Auth          │    │   Payments      │    │   Firebase      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🖥️ Architecture Frontend

### Structure React

```
client/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── assets/
├── src/
│   ├── components/     # Composants réutilisables
│   │   ├── common/     # Boutons, modales, etc.
│   │   ├── layout/     # Navbar, footer
│   │   └── features/   # Composants métier
│   ├── pages/          # Pages principales
│   │   ├── auth/       # Login, register
│   │   ├── dashboard/  # Dashboard utilisateur
│   │   └── content/    # Pages de contenu
│   ├── services/       # Services externes
│   │   ├── api/        # Appels API
│   │   ├── auth/       # Firebase auth
│   │   └── payment/    # Stripe
│   ├── hooks/          # Hooks personnalisés
│   ├── utils/          # Utilitaires
│   ├── contexts/       # Context React
│   ├── styles/         # CSS/SCSS
│   └── App.js
```

### Patterns utilisés

- **Container/Presentational** : Séparation logique/UI
- **Custom Hooks** : Réutilisation logique
- **Context API** : État global
- **React Router** : Navigation
- **Framer Motion** : Animations

## 🚀 Architecture Backend

### Structure Node.js

```
server/
├── config/         # Configuration
├── controllers/    # Logique métier
├── middleware/     # Middleware Express
├── models/         # Modèles MongoDB
├── routes/         # Routes API
├── services/       # Services externes
├── utils/          # Utilitaires
├── tests/          # Tests
└── server.js       # Point d'entrée
```

### API RESTful

```
API Endpoints
├── /api/auth
│   ├── POST   /users              # Créer utilisateur
│   ├── GET    /users/:id          # Récupérer utilisateur
│   └── PATCH  /users/:id/premium  # Mettre à jour premium
├── /api/content
│   ├── GET    /                   # Liste contenu
│   ├── GET    /:id                # Contenu spécifique
│   ├── POST   /                   # Créer contenu
│   ├── PUT    /:id                # Mettre à jour
│   └── DELETE /:id                # Supprimer
└── /api/subscription
    ├── POST   /create-checkout-session  # Session Stripe
    └── POST   /webhook                  # Webhook paiement
```

## 🗄️ Architecture Base de Données

### Modèle de données

```javascript
// User Model
{
  _id: ObjectId,
  firebaseUid: String (unique, indexed),
  email: String (unique, validated),
  name: String,
  premium: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

// Content Model
{
  _id: ObjectId,
  title: String,
  description: String,
  type: Enum ['yoga', 'meditation', 'breathing'],
  category: Enum ['beginner', 'intermediate', 'advanced'],
  duration: Number (minutes),
  premium: Boolean (default: false),
  content: {
    instructions: [String],
    videoUrl: String,
    imageUrl: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Index MongoDB

```javascript
// Index pour performance
db.users.createIndex({ firebaseUid: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.content.createIndex({ type: 1, category: 1 });
db.content.createIndex({ premium: 1 });
```

## ☁️ Architecture Cloud

### Services AWS/GCP/Azure

```
Production Deployment
├── Frontend
│   ├── Vercel/Netlify     # Hosting SPA
│   └── CDN (CloudFlare)   # Cache global
├── Backend
│   ├── Railway/Render     # Hosting Node.js
│   └── Redis              # Cache sessions
├── Database
│   ├── MongoDB Atlas      # Base de données
│   └── Backup automatique
└── Services externes
    ├── Firebase Auth      # Authentification
    ├── Stripe             # Paiements
    └── Firebase Storage   # Médias
```

### Scalabilité

- **Horizontal scaling** : Multiple instances backend
- **CDN** : Distribution globale des assets
- **Cache** : Redis pour sessions/API
- **Load balancer** : Distribution charge

## 🔐 Architecture Sécurité

### Défense en profondeur

```
Sécurité Layers
├── Network
│   ├── HTTPS/TLS 1.3
│   ├── WAF (CloudFlare)
│   └── Rate limiting
├── Application
│   ├── Input validation
│   ├── Authentication (Firebase)
│   └── Authorization (RBAC)
├── Data
│   ├── Encryption at rest
│   ├── Encryption in transit
│   └── Backup encryption
└── Monitoring
    ├── Security logs
    ├── Intrusion detection
    └── Alert system
```

## 📊 Architecture Monitoring

### Observabilité

```
Monitoring Stack
├── Application Metrics
│   ├── Response times
│   ├── Error rates
│   └── User activity
├── Infrastructure
│   ├── CPU/Memory usage
│   ├── Database performance
│   └── Network latency
└── Business Metrics
    ├── User registrations
    ├── Subscription conversions
    └── Content engagement
```

### Outils

- **Frontend** : Google Analytics, Sentry
- **Backend** : Winston logs, PM2 monitoring
- **Database** : MongoDB Atlas monitoring
- **Infrastructure** : UptimeRobot, DataDog

## 🚀 Architecture Déploiement

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]

jobs:
  test:
    # Tests automatisés

  build-frontend:
    # Build React app

  build-backend:
    # Build Node.js app

  deploy:
    # Déploiement production
```

### Environnements

```
Environments
├── Development
│   ├── Local development
│   └── Feature branches
├── Staging
│   ├── Pre-production testing
│   └── User acceptance testing
└── Production
    ├── Live application
    └── Rollback capability
```

## 📱 Architecture Mobile

### React Native/Expo

```
mobile/
├── src/
│   ├── components/     # Composants partagés
│   ├── screens/        # Écrans navigation
│   ├── services/       # API calls
│   ├── utils/          # Utilitaires
│   └── navigation/     # React Navigation
├── assets/             # Images, fonts
├── app.json           # Configuration Expo
└── App.js
```

### Synchronisation

- **Offline-first** : SQLite local
- **Sync** : Background sync avec server
- **Push notifications** : Firebase Cloud Messaging

## 🔄 Architecture Évolutive

### Microservices futur

```
Future Architecture
├── API Gateway
├── Auth Service
├── Content Service
├── Payment Service
├── User Service
├── Notification Service
└── Analytics Service
```

### Technologies futures

- **GraphQL** : API plus flexible
- **Kubernetes** : Orchestration containers
- **Event sourcing** : Traçabilité complète
- **CQRS** : Séparation read/write
- **Machine Learning** : Recommandations personnalisées

## 📋 Architecture Decision Records (ADR)

### ADR 001: Choix React

**Contexte** : Framework frontend moderne
**Décision** : React 18 avec hooks
**Conséquences** : DX amélioré, performance, communauté

### ADR 002: Base de données

**Contexte** : Stockage données utilisateurs/contenu
**Décision** : MongoDB avec Mongoose
**Conséquences** : Flexibilité schéma, scalabilité

### ADR 003: Authentification

**Contexte** : Gestion utilisateurs sécurisée
**Décision** : Firebase Auth
**Conséquences** : Sécurité, facilité d'intégration

### ADR 004: Paiements

**Contexte** : Traitement paiements sécurisé
**Décision** : Stripe
**Conséquences** : Conformité PCI, simplicité

---

**Architecture évolutive = Croissance maîtrisée 🏗️**
