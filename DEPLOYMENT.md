# Déploiement - Yoga2 SaaS

## 🚀 Stratégie de Déploiement

Déploiement automatisé et sécurisé pour production avec CI/CD et monitoring.

## 🏗️ Environnements

### 1. Développement (Development)

```bash
# Variables locales
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/yoga2-dev
FIREBASE_PROJECT_ID=yoga2-dev
STRIPE_SECRET_KEY=sk_test_...
```

### 2. Staging (Pré-production)

```bash
# Variables staging
NODE_ENV=staging
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/yoga2-staging
FIREBASE_PROJECT_ID=yoga2-staging
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Production (Production)

```bash
# Variables production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/yoga2-prod
FIREBASE_PROJECT_ID=yoga2-prod
STRIPE_SECRET_KEY=sk_live_...
```

## ☁️ Plateformes de Déploiement

### Frontend - Vercel

```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.yoga2.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://api.yoga2.com",
    "REACT_APP_FIREBASE_API_KEY": "@firebase-api-key",
    "REACT_APP_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
  }
}
```

### Backend - Railway

```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
```

### Alternative - Render

```yaml
# render.yaml
services:
  - type: web
    name: yoga2-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://...
      - key: FIREBASE_PROJECT_ID
        value: yoga2-prod
      - key: STRIPE_SECRET_KEY
        value: sk_live_...
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
            -H "Content-Type: application/json" \
            https://backboard.railway.app/graphql \
            -d '{"query":"mutation { deploy }"}'
```

## 🔒 Gestion des Secrets

### Variables d'environnement

```bash
# Fichier .env.example (committé)
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
JWT_SECRET=your-super-secret-jwt-key
```

### GitHub Secrets

```
# Repository Secrets
VERCEL_TOKEN=vercel-deploy-token
VERCEL_ORG_ID=vercel-org-id
VERCEL_PROJECT_ID=vercel-project-id
RAILWAY_TOKEN=railway-api-token
MONGODB_URI_PROD=mongodb-production-uri
STRIPE_SECRET_PROD=stripe-live-secret
FIREBASE_CONFIG_PROD=firebase-prod-config
```

## 🗄️ Base de Données

### MongoDB Atlas

```javascript
// Configuration production
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Connexions max
  serverSelectionTimeoutMS: 5000, // Timeout
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0,
});
```

### Migrations

```javascript
// scripts/migrate.js
const mongoose = require("mongoose");

async function migrate() {
  // Migration logic
  console.log("Migration completed");
}

migrate().then(() => process.exit(0));
```

## 🔍 Monitoring et Logging

### Application Monitoring

```javascript
// server/middleware/monitoring.js
const responseTime = require("response-time");
const logger = require("../utils/logger");

app.use(
  responseTime((req, res, time) => {
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: time,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    });
  }),
);
```

### Health Checks

```javascript
// server/routes/health.js
router.get("/health", async (req, res) => {
  try {
    // Vérifier DB
    await mongoose.connection.db.admin().ping();

    // Vérifier services externes
    // await checkStripe();
    // await checkFirebase();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});
```

### Error Tracking

```javascript
// Sentry pour tracking erreurs
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

## 🚨 Rollback Strategy

### Déploiement Bleu/Vert

```bash
# Script de rollback
#!/bin/bash

# Basculer vers version précédente
kubectl set image deployment/yoga2-api api=yoga2-api:v1.0.0

# Vérifier santé
curl -f https://api.yoga2.com/health

# Si OK, supprimer ancienne version
kubectl delete deployment/yoga2-api-old
```

### Rollback Automatique

```javascript
// Vérification post-déploiement
async function verifyDeployment() {
  const health = await fetch("https://api.yoga2.com/health");

  if (!health.ok) {
    console.error("Health check failed, rolling back...");
    // Trigger rollback
    await rollback();
  }
}
```

## 📊 Métriques et Alertes

### Métriques à surveiller

- **Response Time** : < 200ms moyenne
- **Error Rate** : < 1%
- **CPU Usage** : < 70%
- **Memory Usage** : < 80%
- **Database Connections** : < 80% max
- **Uptime** : > 99.9%

### Alertes

```yaml
# Prometheus alerts
groups:
  - name: yoga2
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

## 🔧 Maintenance

### Tâches régulières

```bash
# Backup database
mongodump --db yoga2-prod --out /backup/$(date +%Y%m%d)

# Update dependencies
npm audit fix
npm update

# Rotate logs
logrotate /etc/logrotate.d/yoga2

# Clean old deployments
kubectl delete pods --field-selector=status.phase=Succeeded
```

### Maintenance Windows

- **Mises à jour mineures** : Mardi 02h00-04h00 UTC
- **Mises à jour majeures** : Dimanche 02h00-06h00 UTC
- **Maintenance d'urgence** : À tout moment avec préavis

## 🌍 CDN et Cache

### CloudFlare Configuration

```javascript
// Cache rules
{
  "rules": [
    {
      "description": "Cache static assets",
      "expression": "(http.request.uri.path.extension in {\"css\" \"js\" \"png\" \"jpg\" \"svg\"})",
      "action": "cache",
      "cache": {
        "ttl": 86400
      }
    },
    {
      "description": "Cache API responses",
      "expression": "(http.request.uri.path contains \"/api/content\")",
      "action": "cache",
      "cache": {
        "ttl": 300
      }
    }
  ]
}
```

## 📱 Déploiement Mobile

### Expo Application Services (EAS)

```json
// eas.json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-app-store-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

### Build et déploiement

```bash
# Build production
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## 📋 Checklist Déploiement

### Pré-déploiement

- [ ] Tests passent
- [ ] Code review approuvé
- [ ] Variables d'environnement configurées
- [ ] Backup database effectué
- [ ] Health checks opérationnels

### Pendant le déploiement

- [ ] Déploiement frontend réussi
- [ ] Déploiement backend réussi
- [ ] Health checks passent
- [ ] Métriques normales
- [ ] Rollback plan prêt

### Post-déploiement

- [ ] Tests de fumée passent
- [ ] Monitoring actif
- [ ] Alertes configurées
- [ ] Documentation mise à jour
- [ ] Communication utilisateurs

---

**Déploiement réussi = Service disponible 🚀** 5. **Déployer**

### 4. Configuration Stripe

1. **Webhooks :**
   - URL : `https://your-backend-domain.com/api/subscription/webhook`
   - Événements :
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`

2. **Produits :**
   - Créer un produit "Yoga2 Premium"
   - Prix : 9.99€/mois

### 5. Configuration Firebase

1. **Authentication :**
   - Activer Email/Password
   - Configurer les règles de sécurité

2. **Firestore (optionnel) :**
   - Créer une base de données
   - Configurer les règles

### 6. Configuration MongoDB

1. **MongoDB Atlas :**
   - Créer un cluster gratuit
   - Créer une base de données "yoga2"
   - Créer un utilisateur avec droits de lecture/écriture
   - Whitelister l'IP de Render (0.0.0.0/0 pour développement)

### 7. Vérifications Post-Déploiement

#### Backend

```bash
curl https://your-backend-domain.com/api/health
# Doit retourner : {"status":"OK","message":"Yoga2 API is running"}
```

#### Frontend

- Vérifier que la page d'accueil se charge
- Tester l'inscription/connexion
- Vérifier le bouton "Passer Premium" (Stripe)

#### Stripe

- Tester un paiement test
- Vérifier que le webhook active l'abonnement
- Vérifier l'accès au contenu premium

### 8. Monitoring

#### Logs

- **Render** : Dashboard > Logs
- **Vercel** : Dashboard > Functions > Logs
- **Stripe** : Dashboard > Événements

#### Métriques

- **Render** : Temps de réponse, utilisation CPU
- **Vercel** : Analytics, Core Web Vitals
- **Stripe** : Revenus, taux de conversion

### 9. Domaines Personnalisés

#### Backend (Render)

- Settings > Custom Domain
- Ajouter votre domaine
- Configurer DNS (CNAME)

#### Frontend (Vercel)

- Settings > Domains
- Ajouter votre domaine
- Configurer DNS

### 10. Sécurité

#### HTTPS

- Activé automatiquement sur Render/Vercel

#### Variables d'environnement

- Jamais commiter les vraies clés
- Utiliser des secrets dans les services de déploiement

#### CORS

- Configuré dans le backend pour accepter le domaine frontend

### 11. Optimisations

#### Performance

- Images optimisées
- Code splitting React
- Compression Gzip

#### SEO

- Meta tags configurés
- Open Graph pour partage social

#### Accessibilité

- Labels ARIA
- Navigation clavier
- Contraste des couleurs

---

## 🎯 Checklist Déploiement

- [ ] Variables d'environnement configurées
- [ ] Backend déployé et fonctionnel
- [ ] Frontend déployé et connecté
- [ ] Stripe configuré et testé
- [ ] Firebase configuré
- [ ] MongoDB connecté
- [ ] Domaines configurés
- [ ] HTTPS activé
- [ ] Tests end-to-end passés
- [ ] Monitoring configuré

**Votre plateforme Yoga2 SaaS est maintenant en ligne ! 🎉**
