# Sécurité - Yoga2 SaaS

## 🔒 Vue d'ensemble de la Sécurité

Plateforme sécurisée avec authentification Firebase, paiements Stripe, et protection des données personnelles.

## 🛡️ Architecture de Sécurité

### Authentification

- **Firebase Auth** : Gestion sécurisée des utilisateurs
- **JWT tokens** : Sessions temporaires
- **2FA recommandé** : Double authentification

### Autorisation

- **RBAC** : Contrôle d'accès basé sur les rôles
- **Middleware** : Validation des permissions API
- **Premium gating** : Accès contenu protégé

### Chiffrement

- **Données en transit** : TLS 1.3
- **Données au repos** : AES-256
- **Secrets** : Gestion via variables d'environnement

## 🔐 Configuration Firebase

### Règles Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs peuvent lire/écrire leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Contenu premium protégé
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Règles Storage

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images de profil
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Contenu média (premium seulement)
    match /content/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 💳 Sécurité des Paiements

### Intégration Stripe

- **PCI DSS compliant** : Normes de sécurité bancaires
- **Tokens temporaires** : Pas de stockage des données cartes
- **Webhooks sécurisés** : Signature HMAC

### Configuration Stripe

```javascript
// server/routes/subscription.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Webhook avec vérification signature
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    // Traiter l'événement
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

## 🗄️ Sécurité Base de Données

### MongoDB Atlas

- **Authentification** : Utilisateur + mot de passe
- **Réseau** : IP whitelist + VPC
- **Chiffrement** : TLS obligatoire
- **Backup** : Automatique quotidien

### Schéma sécurisé

```javascript
// server/models/User.js
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
      },
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
```

## 🌐 Sécurité Réseau

### Headers de sécurité

```javascript
// server/server.js
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});
```

### CORS

```javascript
// server/server.js
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://yoga2.com", "https://app.yoga2.com"]
      : ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

## 🔑 Gestion des Secrets

### Variables d'environnement

```bash
# .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yoga2
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-super-secret-jwt-key
```

### Gestion sécurisée

- **Pas de commits** : .env dans .gitignore
- **Rotation régulière** : Changement tous les 90 jours
- **Accès limité** : Uniquement équipe dev/ops

## 👤 Protection des Données

### RGPD Compliance

- **Consentement** : Opt-in pour emails marketing
- **Droit d'accès** : Export des données utilisateur
- **Droit à l'oubli** : Suppression complète des données
- **Portabilité** : Export JSON des données

### Cookies

```javascript
// Cookies sécurisés
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 24h
});
```

## 🚨 Monitoring et Alertes

### Logs de sécurité

```javascript
// server/middleware/security.js
const securityLogger = (req, res, next) => {
  const logData = {
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  };

  // Log suspicious activities
  if (req.url.includes("admin") && !req.user?.admin) {
    console.warn("Unauthorized admin access attempt:", logData);
  }

  next();
};
```

### Alertes

- **Tentatives de connexion échouées** : > 5 en 15 min
- **Accès non autorisé** : Contenu premium
- **Erreurs API** : Rate limiting dépassé
- **Paiements suspects** : Montants inhabituels

## 🧪 Tests de Sécurité

### OWASP Top 10

- [ ] Injection (SQL, NoSQL)
- [ ] Authentification rompue
- [ ] Exposition de données sensibles
- [ ] Entités externes XML
- [ ] Contrôle d'accès rompu
- [ ] Mauvaise configuration sécurité
- [ ] Cross-Site Scripting (XSS)
- [ ] Désérialisation non sécurisée
- [ ] Composants avec vulnérabilités
- [ ] Monitoring insuffisant

### Outils

```bash
# Scan de vulnérabilités
npm audit
snyk test

# Tests de pénétration
owasp-zap
burp-suite
```

## 📞 Plan de Réponse Incident

### 1. Détection

- Monitoring en temps réel
- Alertes automatiques
- Logs centralisés

### 2. Containment

- Isolation des systèmes compromis
- Blocage des accès suspects
- Sauvegarde des preuves

### 3. Eradication

- Suppression des menaces
- Patch des vulnérabilités
- Nettoyage des systèmes

### 4. Recovery

- Restauration des services
- Communication aux utilisateurs
- Analyse post-incident

### 5. Lessons Learned

- Mise à jour des procédures
- Formation équipe
- Amélioration sécurité

## 📋 Checklist Sécurité

### Développement

- [ ] Validation des entrées
- [ ] Échappement des sorties
- [ ] Authentification obligatoire
- [ ] Autorisation par couche
- [ ] Logs de sécurité

### Déploiement

- [ ] HTTPS obligatoire
- [ ] Headers de sécurité
- [ ] CORS configuré
- [ ] Secrets externalisés
- [ ] Firewall actif

### Maintenance

- [ ] Mises à jour régulières
- [ ] Scans de vulnérabilités
- [ ] Tests de pénétration
- [ ] Audits annuels
- [ ] Formation équipe

---

**Sécurité = Confiance utilisateur 🛡️**
