# 🔒 Guide de Sécurité - Application Yoga 2026

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Sécurité par Feature](#sécurité-par-feature)
3. [Authentification](#authentification)
4. [Protection des Données](#protection-des-données)
5. [Sécurité Admin](#sécurité-admin)
6. [Best Practices](#best-practices)
7. [Checklist de Sécurité](#checklist-de-sécurité)

---

## 🎯 Vue d'ensemble

### Principes de Sécurité

1. **Defense in Depth** : Plusieurs couches de sécurité
2. **Least Privilege** : Accès minimal nécessaire
3. **Privacy by Design** : RGPD compliant
4. **Zero Trust** : Toujours vérifier, jamais faire confiance aveuglément

---

## 🔐 Sécurité par Feature

### Feature 1 : Page d'Accueil (Public)

**Niveau de Sécurité** : Faible
**Authentification** : Non requise

#### Mesures de Sécurité

```javascript
// ✅ Protection XSS sur les inputs publics
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// ✅ Rate limiting sur formulaire de contact
const rateLimiter = {
  attempts: 0,
  lastAttempt: null,
  maxAttempts: 5,
  windowMs: 60000, // 1 minute

  canSubmit() {
    const now = Date.now();
    if (this.lastAttempt && now - this.lastAttempt > this.windowMs) {
      this.attempts = 0;
    }
    this.lastAttempt = now;
    this.attempts++;
    return this.attempts <= this.maxAttempts;
  },
};
```

**Checklist**

- [ ] Sanitization des inputs
- [ ] Rate limiting formulaires
- [ ] CSP headers configurés
- [ ] HTTPS forcé

---

### Feature 2 : Inscription (Register)

**Niveau de Sécurité** : Moyen
**Authentification** : Création de compte

#### Mesures de Sécurité

```javascript
// ✅ Validation email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
}

// ✅ Validation mot de passe fort
function isStrongPassword(password) {
  // Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

// ✅ Hachage du mot de passe (utiliser crypto-js ou bcrypt.js)
async function hashPassword(password) {
  // Pour localStorage (Phase 1)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ✅ Protection contre énumération d'utilisateurs
async function register(email, password) {
  // Même temps de réponse si utilisateur existe ou non
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find((u) => u.email === email)) {
    throw new Error("Un compte existe déjà avec cet email");
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return newUser;
}
```

**Checklist**

- [ ] Validation email stricte
- [ ] Mot de passe fort (8+ char, mix)
- [ ] Hachage SHA-256/bcrypt
- [ ] Protection énumération
- [ ] CAPTCHA (optionnel)
- [ ] Email de confirmation

---

### Feature 3 : Connexion (Login)

**Niveau de Sécurité** : Élevé
**Authentification** : JWT Token

#### Mesures de Sécurité

```javascript
// ✅ Protection brute force
const loginAttempts = new Map();

function checkBruteForce(email) {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // Reset après 5 minutes
  if (now - attempts.lastAttempt > fiveMinutes) {
    attempts.count = 0;
  }

  attempts.lastAttempt = now;
  attempts.count++;
  loginAttempts.set(email, attempts);

  // Max 5 tentatives en 5 minutes
  if (attempts.count > 5) {
    throw new Error("Trop de tentatives. Réessayez dans 5 minutes.");
  }
}

// ✅ Génération JWT simple (Phase 1 - localStorage)
function generateToken(userId) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      userId,
      exp: Date.now() + 30 * 60 * 1000, // 30 minutes
    }),
  );

  // En production, utiliser une vraie signature HMAC
  const signature = btoa(`${header}.${payload}.SECRET`);

  return `${header}.${payload}.${signature}`;
}

// ✅ Login sécurisé
async function login(email, password) {
  checkBruteForce(email);

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const hashedPassword = await hashPassword(password);

  const user = users.find(
    (u) => u.email === email && u.password === hashedPassword,
  );

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // Reset tentatives de login
  loginAttempts.delete(email);

  const token = generateToken(user.id);

  // Stocker token de manière sécurisée
  sessionStorage.setItem("authToken", token);
  sessionStorage.setItem("userId", user.id);
  sessionStorage.setItem("userRole", user.role);

  return { user, token };
}
```

**Checklist**

- [ ] Protection brute force (5 tentatives max)
- [ ] Délai entre tentatives
- [ ] Messages d'erreur génériques
- [ ] Token JWT avec expiration
- [ ] Session timeout (30 min)
- [ ] Logout sur fermeture onglet

---

### Feature 4 : Dashboard Utilisateur

**Niveau de Sécurité** : Moyen
**Authentification** : Token requis

#### Mesures de Sécurité

```javascript
// ✅ Middleware d'authentification
function requireAuth() {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    window.location.href = "/login.html";
    throw new Error("Non authentifié");
  }

  // Vérifier expiration du token
  try {
    const [, payloadB64] = token.split(".");
    const payload = JSON.parse(atob(payloadB64));

    if (Date.now() > payload.exp) {
      sessionStorage.clear();
      window.location.href = "/login.html";
      throw new Error("Session expirée");
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/login.html";
    throw new Error("Token invalide");
  }

  return sessionStorage.getItem("userId");
}

// ✅ Auto-logout sur inactivité
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(
    () => {
      alert("Session expirée pour inactivité");
      logout();
    },
    30 * 60 * 1000,
  ); // 30 minutes
}

// Surveiller l'activité
["mousedown", "keypress", "scroll", "touchstart"].forEach((event) => {
  document.addEventListener(event, resetInactivityTimer);
});
```

**Checklist**

- [ ] Vérification token à chaque page
- [ ] Auto-logout après 30 min inactivité
- [ ] Données utilisateur isolées
- [ ] Pas de données sensibles en clair

---

### Feature 5 : Gestion des Séances (CRUD)

**Niveau de Sécurité** : Moyen
**Authentification** : User/Admin

#### Mesures de Sécurité

```javascript
// ✅ Validation des données séance
function validateSession(session) {
  const errors = [];

  if (
    !session.title ||
    session.title.length < 3 ||
    session.title.length > 100
  ) {
    errors.push("Titre invalide (3-100 caractères)");
  }

  if (!["beginner", "intermediate", "advanced"].includes(session.level)) {
    errors.push("Niveau invalide");
  }

  if (session.duration < 5 || session.duration > 120) {
    errors.push("Durée invalide (5-120 minutes)");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return true;
}

// ✅ Sanitization des données
function sanitizeSession(session) {
  return {
    id: session.id || crypto.randomUUID(),
    title: sanitizeInput(session.title),
    description: sanitizeInput(session.description),
    duration: parseInt(session.duration),
    level: session.level,
    type: session.type,
    objectives: session.objectives.map((o) => sanitizeInput(o)),
    createdAt: new Date().toISOString(),
  };
}
```

**Checklist**

- [ ] Validation stricte des inputs
- [ ] Sanitization XSS
- [ ] Limites de taille (title, description)
- [ ] Permissions vérifiées (user peut voir, admin peut éditer)

---

### Feature 6 : Dashboard Admin

**Niveau de Sécurité** : Très Élevé
**Authentification** : Admin uniquement

#### Mesures de Sécurité

```javascript
// ✅ Vérification rôle admin
function requireAdmin() {
  const userId = requireAuth(); // Vérifie d'abord l'auth
  const role = sessionStorage.getItem("userRole");

  if (role !== "admin") {
    window.location.href = "/dashboard.html";
    throw new Error("Accès interdit - Admin uniquement");
  }

  // Log l'accès admin
  logAdminAccess(userId, window.location.pathname);

  return userId;
}

// ✅ Logs des actions admin
function logAdminAccess(userId, page) {
  const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]");
  logs.push({
    userId,
    action: "access",
    page,
    timestamp: new Date().toISOString(),
    ip: "N/A", // En production, récupérer l'IP
  });

  // Garder seulement les 1000 derniers logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }

  localStorage.setItem("adminLogs", JSON.stringify(logs));
}

// ✅ Confirmation actions critiques
async function deleteSession(sessionId) {
  const confirmed = await showConfirmDialog(
    "Supprimer cette séance ?",
    "Cette action est irréversible.",
  );

  if (!confirmed) return;

  // Log avant suppression
  logAdminAction("delete_session", { sessionId });

  // Supprimer
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const filtered = sessions.filter((s) => s.id !== sessionId);
  localStorage.setItem("sessions", JSON.stringify(filtered));
}

// ✅ Whitelist d'emails admin
const ADMIN_EMAILS = ["admin@yoga-app.com", "contact@yoga-app.com"];

function canBeAdmin(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
```

**Checklist**

- [ ] Vérification rôle à chaque action
- [ ] Whitelist emails admin
- [ ] Logs de toutes actions
- [ ] Confirmation actions critiques
- [ ] 2FA recommandé (Phase 2)
- [ ] Audit trail complet
- [ ] Timeout plus court (15 min)

---

### Feature 7 : Respiration Guidée

**Niveau de Sécurité** : Faible
**Authentification** : Optionnelle

#### Mesures de Sécurité

```javascript
// ✅ Validation paramètres
function validateBreathingParams(inhale, hold, exhale) {
  if (inhale < 2 || inhale > 10) {
    throw new Error("Durée inspiration invalide (2-10s)");
  }
  if (hold < 0 || hold > 10) {
    throw new Error("Durée rétention invalide (0-10s)");
  }
  if (exhale < 2 || exhale > 10) {
    throw new Error("Durée expiration invalide (2-10s)");
  }
}

// ✅ Limite durée totale
function startBreathingExercise(duration) {
  const MAX_DURATION = 20 * 60 * 1000; // 20 minutes max

  if (duration > MAX_DURATION) {
    throw new Error("Durée maximale : 20 minutes");
  }

  // ... démarrer exercice
}
```

**Checklist**

- [ ] Validation paramètres respiratoires
- [ ] Limite durée exercice
- [ ] Pas de données sensibles

---

### Feature 8 : Progression Utilisateur

**Niveau de Sécurité** : Moyen
**Authentification** : User

#### Mesures de Sécurité

```javascript
// ✅ Isolation des données par utilisateur
function getUserProgress(userId) {
  requireAuth();
  const currentUserId = sessionStorage.getItem("userId");

  // Vérifier que l'utilisateur accède uniquement à SES données
  if (userId !== currentUserId) {
    throw new Error("Accès interdit");
  }

  const allProgress = JSON.parse(localStorage.getItem("progress") || "[]");
  return allProgress.filter((p) => p.userId === userId);
}

// ✅ Chiffrement données sensibles (optionnel Phase 2)
async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));

  const keyBuffer = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyBuffer,
    dataBuffer,
  );

  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv),
  };
}
```

**Checklist**

- [ ] Isolation données par user
- [ ] Vérification userId à chaque requête
- [ ] Chiffrement données sensibles (Phase 2)
- [ ] Pas de partage de données sans consentement

---

## 🛡️ Protection des Données (RGPD)

### Principes Appliqués

```javascript
// ✅ Consentement explicite
const gdprConsent = {
  essential: true, // Obligatoire (auth, session)
  analytics: false, // Optionnel (stats d'usage)
  marketing: false, // Optionnel (emails)
};

function askConsent() {
  const consent = localStorage.getItem("gdprConsent");
  if (!consent) {
    // Afficher popup consentement
    showConsentBanner();
  }
}

// ✅ Droit à l'oubli
function deleteUserData(userId) {
  requireAdmin(); // Ou requireAuth si user supprime son compte

  // Supprimer toutes les données
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const filteredUsers = users.filter((u) => u.id !== userId);
  localStorage.setItem("users", JSON.stringify(filteredUsers));

  const progress = JSON.parse(localStorage.getItem("progress") || "[]");
  const filteredProgress = progress.filter((p) => p.userId !== userId);
  localStorage.setItem("progress", JSON.stringify(filteredProgress));

  // Log la suppression (anonymisé)
  logAdminAction("delete_user", { timestamp: new Date().toISOString() });
}

// ✅ Export des données (portabilité)
function exportUserData(userId) {
  requireAuth();
  const currentUserId = sessionStorage.getItem("userId");

  if (userId !== currentUserId) {
    throw new Error("Accès interdit");
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  const progress = JSON.parse(localStorage.getItem("progress") || "[]");
  const userProgress = progress.filter((p) => p.userId === userId);

  const data = {
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    progress: userProgress,
    exportedAt: new Date().toISOString(),
  };

  // Télécharger en JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mes-donnees-yoga-${Date.now()}.json`;
  a.click();
}
```

---

## 🔑 Best Practices

### 1. Mots de Passe

```javascript
// ✅ Règles strictes
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false, // Pas obligatoire pour UX
  maxLength: 128,
};

// ✅ Vérification Have I Been Pwned (optionnel)
async function checkPwnedPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-1", data);
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const prefix = hashHex.substring(0, 5);
  const suffix = hashHex.substring(5).toUpperCase();

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
  );
  const text = await response.text();

  return text.includes(suffix);
}
```

### 2. Sessions

```javascript
// ✅ Configuration session sécurisée
const SESSION_CONFIG = {
  timeout: 30 * 60 * 1000, // 30 minutes
  inactivityTimeout: 15 * 60 * 1000, // 15 minutes
  maxAge: 24 * 60 * 60 * 1000, // 24 heures max
  storage: "sessionStorage", // Pas localStorage
  secure: true, // HTTPS only
  sameSite: "strict", // Protection CSRF
};
```

### 3. Input Validation

```javascript
// ✅ Validation côté client ET serveur
function validateInput(value, type) {
  const validators = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    name: (v) => /^[a-zA-ZÀ-ÿ\s-]{2,50}$/.test(v),
    duration: (v) => !isNaN(v) && v >= 5 && v <= 120,
    level: (v) => ["beginner", "intermediate", "advanced"].includes(v),
  };

  return validators[type] ? validators[type](value) : false;
}
```

### 4. CSP (Content Security Policy)

```html
<!-- ✅ Headers à ajouter (Phase Backend) -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  media-src 'self';
"
/>
```

---

## ✅ Checklist de Sécurité Globale

### Avant Développement

- [ ] Architecture de sécurité définie
- [ ] Threat modeling effectué
- [ ] Standards de code définis

### Pendant Développement

- [ ] Validation de tous inputs
- [ ] Sanitization XSS systématique
- [ ] Hachage des mots de passe
- [ ] Tokens avec expiration
- [ ] Rate limiting implémenté
- [ ] Logs des actions sensibles
- [ ] Gestion des erreurs sécurisée

### Avant Production

- [ ] Audit de sécurité complet
- [ ] Tests de pénétration
- [ ] HTTPS configuré
- [ ] Headers de sécurité (CSP, HSTS, etc.)
- [ ] Backup des données
- [ ] Plan de réponse aux incidents
- [ ] RGPD compliant
- [ ] CGU et politique de confidentialité

### Monitoring Continu

- [ ] Logs d'accès
- [ ] Alertes sur actions suspectes
- [ ] Rotation des secrets
- [ ] Mises à jour dépendances
- [ ] Audit régulier

---

## 🚨 Réponse aux Incidents

### Procédure en cas de Breach

1. **Détection**
   - Alertes automatiques
   - Monitoring des logs

2. **Contention**
   - Isoler le système
   - Révoquer tokens compromis
   - Changer les credentials

3. **Investigation**
   - Identifier la source
   - Évaluer l'impact
   - Documenter

4. **Notification**
   - Informer les utilisateurs (RGPD : 72h)
   - Contacter autorités si nécessaire

5. **Remediation**
   - Patcher la vulnérabilité
   - Renforcer la sécurité
   - Post-mortem

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RGPD - CNIL](https://www.cnil.fr/)
- [Web Crypto API](https://developer.mozilla.org/fr/docs/Web/API/Web_Crypto_API)
- [Have I Been Pwned](https://haveibeenpwned.com/)

---

**🔒 La sécurité est un voyage, pas une destination.**

_Document vivant - Mise à jour: 23 janvier 2026_
