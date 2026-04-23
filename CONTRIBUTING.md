# Guide de Contribution - Yoga2 SaaS

## 🤝 Comment Contribuer

Bienvenue ! Nous sommes ravis que vous souhaitiez contribuer à Yoga2. Ce guide explique comment participer au développement.

## 📋 Code de Conduite

### Comportement attendu

- **Respect** : Traitez tout le monde avec respect et bienveillance
- **Inclusivité** : Encouragez la diversité et l'inclusion
- **Collaboration** : Travaillez ensemble pour atteindre nos objectifs
- **Qualité** : Produisez du code de haute qualité

### Comportement non toléré

- Discriminations de tout type
- Harcèlement ou intimidation
- Commentaires offensants
- Violations de la vie privée

## 🚀 Premiers Pas

### 1. Prérequis

```bash
# Node.js 18+
node --version

# Git
git --version

# MongoDB (local ou Atlas)
mongod --version
```

### 2. Configuration du projet

```bash
# Cloner le repository
git clone https://github.com/your-org/yoga2.git
cd yoga2

# Installer les dépendances
cd server && npm install
cd ../client && npm install

# Configuration des variables d'environnement
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# Lancer en développement
cd server && npm run dev &
cd client && npm start
```

### 3. Branches

```bash
# Créer une branche pour votre feature
git checkout -b feature/nom-de-la-feature

# Ou pour un bug fix
git checkout -b fix/nom-du-bug

# Branches principales
# main - Code de production
# develop - Développement actif
# release/v1.x - Versions releases
```

## 🛠️ Workflow de Développement

### 1. Choisir une tâche

- Vérifier les [issues GitHub](https://github.com/your-org/yoga2/issues)
- Les issues sont labellisées par priorité et type
- Commenter sur l'issue pour indiquer votre intérêt

### 2. Développement

```bash
# Récupérer les dernières modifications
git pull origin develop

# Créer votre branche
git checkout -b feature/amazing-feature

# Développement...
# Commits fréquents avec messages descriptifs
git commit -m "feat: add amazing feature"

# Pousser votre branche
git push origin feature/amazing-feature
```

### 3. Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e

# Vérification du code
npm run lint
npm run format
```

### 4. Pull Request

```markdown
## Description

Courte description des changements

## Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation
- [ ] Refactoring

## Tests

- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests d'intégration passent
- [ ] Tests E2E passent

## Checklist

- [ ] Code review effectué
- [ ] Documentation mise à jour
- [ ] Migration DB si nécessaire
- [ ] Variables d'environnement vérifiées
```

## 📝 Standards de Code

### JavaScript/React

```javascript
// Nommage
const userName = "John"; // camelCase pour variables
const UserProfile = () => {}; // PascalCase pour composants
const getUserData = () => {}; // camelCase pour fonctions

// Composants React
const UserCard = ({ user, onSelect }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onSelect(user.id)}>Sélectionner</button>
    </div>
  );
};

// Hooks personnalisés
const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Logique d'authentification
  }, []);

  return { user, login, logout };
};
```

### Node.js

```javascript
// Structure des contrôleurs
const userController = {
  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req, res) {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  },
};

module.exports = userController;
```

### CSS

```css
/* BEM Methodology */
.user-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.user-card__title {
  font-size: 1.2rem;
  font-weight: bold;
}

.user-card__button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.user-card__button:hover {
  background: var(--primary-dark);
}
```

## 🧪 Tests

### Tests Unitaires

```javascript
// Component test
import { render, screen, fireEvent } from "@testing-library/react";
import UserCard from "./UserCard";

test("affiche le nom de l'utilisateur", () => {
  const user = { id: 1, name: "John Doe" };
  render(<UserCard user={user} onSelect={() => {}} />);

  expect(screen.getByText("John Doe")).toBeInTheDocument();
});

test("appelle onSelect quand cliqué", () => {
  const mockOnSelect = jest.fn();
  const user = { id: 1, name: "John Doe" };

  render(<UserCard user={user} onSelect={mockOnSelect} />);
  fireEvent.click(screen.getByText("Sélectionner"));

  expect(mockOnSelect).toHaveBeenCalledWith(1);
});
```

### Tests d'API

```javascript
// API test
const request = require("supertest");
const app = require("../server");

describe("User API", () => {
  test("GET /api/users retourne la liste des utilisateurs", async () => {
    const response = await request(app).get("/api/users").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/users crée un nouvel utilisateur", async () => {
    const newUser = {
      firebaseUid: "test-uid",
      email: "test@example.com",
      name: "Test User",
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty("email", "test@example.com");
  });
});
```

## 📚 Documentation

### JSDoc pour les fonctions

```javascript
/**
 * Récupère un utilisateur par son ID
 * @param {string} userId - L'ID Firebase de l'utilisateur
 * @returns {Promise<User>} L'utilisateur trouvé
 * @throws {Error} Si l'utilisateur n'existe pas
 */
async function getUserById(userId) {
  const user = await User.findOne({ firebaseUid: userId });
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
  return user;
}
```

### README pour les composants

````markdown
# UserCard Component

Affiche les informations d'un utilisateur avec un bouton d'action.

## Props

| Prop     | Type     | Required | Description                            |
| -------- | -------- | -------- | -------------------------------------- |
| user     | Object   | ✅       | Objet utilisateur avec id, name, email |
| onSelect | Function | ✅       | Fonction appelée lors de la sélection  |

## Exemple

```jsx
<UserCard
  user={{ id: 1, name: "John", email: "john@example.com" }}
  onSelect={(id) => console.log("Selected:", id)}
/>
```
````

````

## 🔄 Process de Review

### Checklist de Review
- [ ] Code fonctionnel et testé
- [ ] Respect des standards de code
- [ ] Tests présents et passant
- [ ] Documentation à jour
- [ ] Performance optimisée
- [ ] Sécurité vérifiée
- [ ] Accessibilité respectée

### Feedback Constructif
```markdown
## ✅ Points positifs
- Bonne structure du code
- Tests complets
- Documentation claire

## 🔄 Améliorations suggérées
- Ajouter une gestion d'erreur plus spécifique
- Optimiser la requête DB avec un index
- Ajouter des tests pour les cas d'erreur

## ❓ Questions
- Cette approche est-elle compatible avec l'architecture existante ?
- Y a-t-il des considérations de performance ?
````

## 🚨 Gestion des Versions

### Semantic Versioning

- **MAJOR.MINOR.PATCH** (ex: 1.2.3)
- **MAJOR** : Changements breaking
- **MINOR** : Nouvelles fonctionnalités
- **PATCH** : Corrections de bugs

### Release Process

```bash
# Créer une branche release
git checkout -b release/v1.2.0

# Mettre à jour la version
npm version minor

# Merge vers main
git checkout main
git merge release/v1.2.0

# Tag et push
git tag v1.2.0
git push origin main --tags
```

## 🐛 Reporting des Bugs

### Template de bug report

```markdown
## Description

Description claire et concise du bug

## Reproduction

Étapes pour reproduire :

1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement attendu

Ce qui devrait se passer

## Screenshots

Si applicable, ajouter des captures d'écran

## Environnement

- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.2.3]

## Contexte supplémentaire

Toute information supplémentaire utile
```

## 💡 Proposition de Features

### Template de feature request

```markdown
## Résumé

Brève description de la fonctionnalité

## Problème

Quel problème cela résout ?

## Solution proposée

Description détaillée de la solution

## Alternatives

Autres solutions envisagées

## Impact

Impact sur les utilisateurs et le système

## Priorité

- [ ] Haute
- [ ] Moyenne
- [ ] Basse
```

## 🎉 Reconnaissance

### Contributors

- Liste des contributeurs actifs
- Badges pour les contributions spéciales
- Mention dans les releases

### Communication

- **Slack/Discord** : Discussion quotidienne
- **GitHub Issues** : Bugs et features
- **Pull Requests** : Code review
- **Newsletter** : Mises à jour majeures

---

**Merci de contribuer à Yoga2 ! 🙏**
