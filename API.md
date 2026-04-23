# API Documentation - Yoga2 SaaS

## 📡 Vue d'ensemble API

API RESTful pour la plateforme Yoga2 avec authentification Firebase et gestion des abonnements Stripe.

## 🔗 Base URL

```
Production: https://api.yoga2.com
Development: http://localhost:5000
```

## 🔐 Authentification

Toutes les requêtes nécessitent un token Firebase ID Token dans le header Authorization.

```bash
Authorization: Bearer <firebase-id-token>
```

### Obtenir un token Firebase

```javascript
import { getAuth } from "firebase/auth";

const auth = getAuth();
const token = await auth.currentUser.getIdToken();
```

## 📋 Endpoints API

### Authentification

#### Créer/Mettre à jour un utilisateur

```http
POST /api/auth/users
```

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "firebaseUid": "firebase-user-id",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "message": "Utilisateur créé/mis à jour",
  "user": {
    "_id": "mongo-object-id",
    "firebaseUid": "firebase-user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "premium": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Récupérer un utilisateur

```http
GET /api/auth/users/:firebaseUid
```

**Response (200):**

```json
{
  "user": {
    "_id": "mongo-object-id",
    "firebaseUid": "firebase-user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "premium": true
  }
}
```

#### Mettre à jour le statut premium

```http
PATCH /api/auth/users/:firebaseUid/premium
```

**Body:**

```json
{
  "premium": true
}
```

**Response (200):**

```json
{
  "message": "Statut premium mis à jour",
  "user": {
    "premium": true
  }
}
```

### Contenu

#### Lister le contenu

```http
GET /api/content
```

**Query Parameters:**

- `type` (optional): yoga, meditation, breathing
- `category` (optional): beginner, intermediate, advanced
- `premium` (optional): true, false
- `limit` (optional): number (default: 20)
- `offset` (optional): number (default: 0)

**Response (200):**

```json
{
  "content": [
    {
      "_id": "content-id",
      "title": "Séance débutant",
      "description": "Introduction au yoga",
      "type": "yoga",
      "category": "beginner",
      "duration": 15,
      "premium": false,
      "content": {
        "instructions": ["Posture 1", "Posture 2"],
        "videoUrl": "https://...",
        "imageUrl": "https://..."
      }
    }
  ],
  "total": 50,
  "hasMore": true
}
```

#### Récupérer un contenu spécifique

```http
GET /api/content/:id
```

**Response (200):**

```json
{
  "content": {
    "_id": "content-id",
    "title": "Séance débutant",
    "description": "Introduction au yoga",
    "type": "yoga",
    "category": "beginner",
    "duration": 15,
    "premium": false,
    "content": {
      "instructions": ["Posture 1", "Posture 2"],
      "videoUrl": "https://...",
      "imageUrl": "https://..."
    }
  }
}
```

#### Créer du contenu (Admin)

```http
POST /api/content
```

**Body:**

```json
{
  "title": "Nouvelle séance",
  "description": "Description détaillée",
  "type": "yoga",
  "category": "intermediate",
  "duration": 20,
  "premium": true,
  "content": {
    "instructions": ["Étape 1", "Étape 2"],
    "videoUrl": "https://video-url",
    "imageUrl": "https://image-url"
  }
}
```

#### Mettre à jour du contenu (Admin)

```http
PUT /api/content/:id
```

**Body:** Même structure que POST

#### Supprimer du contenu (Admin)

```http
DELETE /api/content/:id
```

**Response (200):**

```json
{
  "message": "Contenu supprimé"
}
```

### Abonnements

#### Créer une session de checkout Stripe

```http
POST /api/subscription/create-checkout-session
```

**Body:**

```json
{
  "userId": "firebase-user-id"
}
```

**Response (200):**

```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

#### Webhook Stripe

```http
POST /api/subscription/webhook
```

**Headers:**

```
Content-Type: application/json
Stripe-Signature: t=1234567890,v1=signature...
```

**Body:** (Envoyé par Stripe)

```json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": {
        "userId": "firebase-user-id"
      }
    }
  }
}
```

## ⚠️ Codes d'erreur

### Erreurs communes

```json
// 400 Bad Request
{
  "error": "Données invalides",
  "details": "L'email est requis"
}

// 401 Unauthorized
{
  "error": "Token invalide"
}

// 403 Forbidden
{
  "error": "Accès non autorisé"
}

// 404 Not Found
{
  "error": "Ressource non trouvée"
}

// 500 Internal Server Error
{
  "error": "Erreur serveur"
}
```

### Erreurs spécifiques

```json
// Contenu premium sans abonnement
{
  "error": "Contenu premium requis",
  "message": "Abonnez-vous pour accéder à ce contenu"
}

// Limite de taux dépassée
{
  "error": "Trop de requêtes",
  "retryAfter": 60
}
```

## 🔒 Sécurité API

### Rate Limiting

- **Authentifié** : 1000 requêtes/heure
- **Non authentifié** : 100 requêtes/heure
- **Admin** : 10000 requêtes/heure

### Validation

- **Input sanitization** : Nettoyage automatique
- **Schema validation** : Joi/Mongoose
- **CORS** : Origines autorisées uniquement

### Headers de sécurité

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 📊 Monitoring API

### Métriques collectées

- **Response time** : Temps de réponse moyen
- **Error rate** : Taux d'erreur par endpoint
- **Request count** : Nombre de requêtes
- **User activity** : Activité par utilisateur

### Logs

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "method": "GET",
  "url": "/api/content",
  "statusCode": 200,
  "responseTime": 150,
  "userId": "firebase-user-id",
  "ip": "192.168.1.1"
}
```

## 🧪 Tests API

### Postman Collection

```json
{
  "info": {
    "name": "Yoga2 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{firebase-token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"firebaseUid\":\"test-uid\",\"email\":\"test@example.com\",\"name\":\"Test User\"}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "users"]
            }
          }
        }
      ]
    }
  ]
}
```

### Tests automatisés

```javascript
// tests/api.test.js
const request = require("supertest");
const app = require("../server");

describe("API Tests", () => {
  test("GET /api/content - succès", async () => {
    const response = await request(app)
      .get("/api/content")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("content");
  });
});
```

## 🔄 Versioning API

### Version actuelle: v1

- Base path: `/api/`
- Version stable

### Évolution future

```http
# Version future
GET /api/v2/content
Accept: application/vnd.yoga2.v2+json
```

## 📈 Performance API

### Optimisations

- **Database indexing** : Index sur champs fréquemment utilisés
- **Caching** : Redis pour données statiques
- **Pagination** : Limitation résultats
- **Compression** : Gzip automatique

### Benchmarks

- **Response time** : < 200ms (moyenne)
- **Throughput** : 1000 req/sec
- **Availability** : 99.9% SLA

---

**API robuste = Expérience utilisateur fluide ⚡**
