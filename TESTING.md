# Tests - Yoga2 SaaS

## 🧪 Stratégie de Test

Tests complets pour assurer la qualité de la plateforme Yoga2.

## 📋 Types de Tests

### 1. Tests Unitaires

#### Frontend (Jest + React Testing Library)

```bash
cd client
npm test
```

#### Backend (Jest)

```bash
cd server
npm test
```

### 2. Tests d'Intégration

#### API Tests

```javascript
// tests/auth.test.js
const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  test("POST /api/auth/users - créer utilisateur", async () => {
    const response = await request(app).post("/api/auth/users").send({
      firebaseUid: "test-uid",
      email: "test@example.com",
      name: "Test User",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email", "test@example.com");
  });
});
```

### 3. Tests End-to-End (E2E)

#### Cypress pour le frontend

```javascript
// cypress/integration/auth.spec.js
describe("Authentification", () => {
  it("devrait permettre l'inscription", () => {
    cy.visit("/register");
    cy.get("[data-cy=email]").type("test@example.com");
    cy.get("[data-cy=password]").type("password123");
    cy.get("[data-cy=submit]").click();
    cy.url().should("include", "/dashboard");
  });
});
```

## 🔧 Configuration des Tests

### Jest Configuration (Frontend)

```javascript
// client/src/setupTests.js
import "@testing-library/jest-dom";
```

### Jest Configuration (Backend)

```json
// server/package.json
{
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
  }
}
```

## 📊 Couverture de Code

### Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/serviceWorker.js",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Rapport de couverture

```bash
npm test -- --coverage
```

## 🏃‍♂️ Tests Automatisés

### CI/CD avec GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## 🔍 Tests de Performance

### Lighthouse

```bash
# Test performance frontend
npx lighthouse http://localhost:3000 --output=json --output-path=./report.json
```

### Load Testing (Artillery)

```yaml
# tests/load-test.yml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Test API performance"
    requests:
      - get:
          url: "/api/health"
```

## 🛡️ Tests de Sécurité

### OWASP ZAP

- Scan automatique des vulnérabilités
- Test des injections SQL
- Validation des headers de sécurité

### Tests d'authentification

```javascript
// tests/security.test.js
describe("Security Tests", () => {
  test("devrait rejeter les tokens invalides", async () => {
    const response = await request(app)
      .get("/api/content")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });
});
```

## 📱 Tests Mobile

### React Native Testing Library

```javascript
// mobile/__tests__/App-test.js
import React from "react";
import { render } from "@testing-library/react-native";
import App from "../App";

test("renders correctly", () => {
  const { getByText } = render(<App />);
  expect(getByText("Yoga2")).toBeTruthy();
});
```

## 🔄 Tests de Régression

### Tests de fumée

```bash
# scripts/smoke-test.sh
#!/bin/bash

# Test backend health
curl -f http://localhost:5000/api/health || exit 1

# Test frontend build
cd client && npm run build || exit 1

echo "✅ Tests de fumée passés"
```

## 📈 Métriques de Qualité

### Seuils minimums

- **Couverture de code** : 80%
- **Performance Lighthouse** : Score > 90
- **Temps de réponse API** : < 200ms
- **Taux de succès tests** : 100%

### Monitoring continu

- **SonarQube** : Analyse de code
- **Snyk** : Vulnérabilités dépendances
- **Dependabot** : Mises à jour automatiques

## 🐛 Debugging

### Logs structurés

```javascript
// Utiliser winston pour les logs
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Tests de debugging

```javascript
// tests/debug.test.js
describe("Debug Tests", () => {
  test("devrait logger les erreurs correctement", () => {
    const consoleSpy = jest.spyOn(console, "error");
    // Code qui génère une erreur
    expect(consoleSpy).toHaveBeenCalledWith("Erreur attendue");
  });
});
```

## 📋 Checklist Tests

### Avant chaque déploiement

- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tests E2E passent
- [ ] Couverture > 80%
- [ ] Performance Lighthouse > 90
- [ ] Sécurité OWASP OK
- [ ] Tests de régression OK

### Tests manuels

- [ ] Inscription/connexion
- [ ] Achat abonnement
- [ ] Accès contenu premium
- [ ] Responsive mobile
- [ ] Accessibilité

---

**Tests complets = Code de qualité ! 🧪**
