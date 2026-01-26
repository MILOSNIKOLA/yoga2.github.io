# 🚀 Guide de Migration React.js + Optimisations Responsive

Ce document détaille la migration du projet Yoga2 de vanilla JavaScript vers React.js, ainsi que les optimisations pour tablettes et mobiles.

---

## 📱 PARTIE 1 : OPTIMISATIONS RESPONSIVE

### État Actuel

Toutes les pages ont déjà un CSS responsive de base, mais voici les améliorations recommandées :

### Breakpoints Standards

```css
/* Mobile First Approach */
/* xs: 0-575px (mobile) */
/* sm: 576-767px (mobile landscape / petite tablette) */
/* md: 768-991px (tablette) */
/* lg: 992-1199px (desktop) */
/* xl: 1200px+ (large desktop) */
```

### Améliorations par Page

#### 1. Navigation Mobile (Toutes les pages)

**Problème** : Menu horizontal prend trop de place sur mobile

**Solution** :

```css
/* Dans css/dashboard.css (ou un nouveau css/mobile.css) */
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 60px;
    left: -100%;
    width: 80%;
    height: calc(100vh - 60px);
    background: var(--bg-secondary);
    flex-direction: column;
    padding: 2rem;
    transition: left 0.3s;
    z-index: 999;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-link {
    padding: 1rem;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid var(--bg-primary);
  }

  .burger-menu {
    display: block;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
  }
}
```

**JS à ajouter dans chaque page** :

```javascript
// Mobile menu toggle
const burgerBtn = document.querySelector(".burger-menu");
const navMenu = document.querySelector(".nav-menu");

if (burgerBtn) {
  burgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
    navMenu.classList.remove("active");
  }
});
```

#### 2. Mode Tablette (768px - 1024px)

**Ajustements recommandés** :

- Grids : 2 colonnes au lieu de 3
- Padding réduit mais confortable
- Touch targets minimum 44x44px

```css
@media (min-width: 768px) and (max-width: 1024px) {
  /* Sessions grid */
  .sessions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* Stats grid */
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Articles grid */
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

#### 3. Gestes Tactiles

**Pour le lecteur de séance (player.html)** :

```javascript
// Swipe gestures pour navigation
let touchStartX = 0;
let touchEndX = 0;

const playerContainer = document.querySelector(".player-container");

playerContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

playerContainer.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe right : posture précédente
      previousPose();
    } else {
      // Swipe left : posture suivante
      nextPose();
    }
  }
}
```

#### 4. Bouton Burger à Ajouter

**HTML à ajouter dans chaque navbar** :

```html
<button class="burger-menu" aria-label="Menu" style="display: none;">☰</button>
```

---

## ⚛️ PARTIE 2 : MIGRATION REACT.JS

### Pourquoi Migrer vers React ?

**Avantages** :

- ✅ Composants réutilisables
- ✅ State management plus facile (useState, useContext)
- ✅ Performance avec Virtual DOM
- ✅ Écosystème riche (React Router, React Query)
- ✅ TypeScript facile à intégrer
- ✅ Hot reload en développement
- ✅ Préparation pour React Native mobile

**Inconvénients** :

- ❌ Courbe d'apprentissage
- ❌ Build step nécessaire
- ❌ Plus lourd que vanilla JS

### Architecture Proposée

```
yoga-app-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Modal.jsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── ContinuePractice.jsx
│   │   │   └── WeekChart.jsx
│   │   ├── sessions/
│   │   │   ├── SessionCard.jsx
│   │   │   ├── SessionFilters.jsx
│   │   │   └── SessionsList.jsx
│   │   ├── player/
│   │   │   ├── CircularTimer.jsx
│   │   │   ├── PlayerControls.jsx
│   │   │   └── CompletionModal.jsx
│   │   └── breathing/
│   │       ├── BreathingCircle.jsx
│   │       └── ExerciseCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Sessions.jsx
│   │   ├── SessionPlayer.jsx
│   │   ├── Breathing.jsx
│   │   ├── Progress.jsx
│   │   ├── Admin.jsx
│   │   ├── Learning.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSessions.js
│   │   ├── useTheme.js
│   │   └── useLocalStorage.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── sessionService.js
│   │   └── storageService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── themes.css
│   │   └── components/
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

### Étape 1 : Setup Initial

```bash
# Créer un nouveau projet React
npx create-react-app yoga-app-react
cd yoga-app-react

# Installer React Router
npm install react-router-dom

# Installer des utilitaires (optionnel)
npm install clsx date-fns
```

### Étape 2 : Configuration Routes

**src/App.jsx** :

```jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import SessionPlayer from "./pages/SessionPlayer";
import Breathing from "./pages/Breathing";
import Progress from "./pages/Progress";
import Admin from "./pages/Admin";
import Learning from "./pages/Learning";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/session/:id" element={<SessionPlayer />} />
              <Route path="/breathing" element={<Breathing />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/learning" element={<Learning />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
```

### Étape 3 : Contexte Auth

**src/context/AuthContext.jsx** :

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const user = await authService.register(name, email, password);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Étape 4 : Hook localStorage Réutilisable

**src/hooks/useLocalStorage.js** :

```javascript
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}
```

### Étape 5 : Exemple Composant Navbar

**src/components/common/Navbar.jsx** :

```jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/sessions", label: "Séances" },
    { path: "/breathing", label: "Respiration" },
    { path: "/progress", label: "Progression" },
    { path: "/learning", label: "Apprentissage" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">
          🧘‍♀️ Yoga App
        </Link>

        <button
          className="burger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Changer de thème"
          >
            <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
          <button
            className="btn-logout"
            onClick={handleLogout}
            aria-label="Se déconnecter"
          >
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
```

### Étape 6 : Exemple Page Dashboard

**src/pages/Dashboard.jsx** :

```jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../services/sessionService";
import Navbar from "../components/common/Navbar";
import StatCard from "../components/dashboard/StatCard";
import ContinuePractice from "../components/dashboard/ContinuePractice";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    level: "Débutant",
  });

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = () => {
    const history = sessionService.getUserHistory(user.id);

    const totalSessions = history.length;
    const totalMinutes = history.reduce((sum, s) => sum + (s.duration || 0), 0);
    const currentStreak = calculateStreak(history);
    const level = calculateLevel(totalSessions);

    setStats({ totalSessions, totalMinutes, currentStreak, level });
  };

  const calculateStreak = (history) => {
    // Logique identique à la version vanilla
    // ... (code existant)
    return 0;
  };

  const calculateLevel = (sessions) => {
    if (sessions < 10) return "Débutant";
    if (sessions < 30) return "Intermédiaire";
    return "Avancé";
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Bonjour {user?.name} !</h1>
          <p>Prenez un moment pour vous aujourd'hui</p>
        </header>

        <section className="stats-section">
          <StatCard
            icon="📊"
            label="Séances complétées"
            value={stats.totalSessions}
          />
          <StatCard
            icon="⏱️"
            label="Temps total"
            value={`${Math.floor(stats.totalMinutes / 60)}h`}
          />
          <StatCard
            icon="🔥"
            label="Série actuelle"
            value={stats.currentStreak}
          />
          <StatCard icon="🎯" label="Niveau" value={stats.level} />
        </section>

        <ContinuePractice userId={user?.id} />

        {/* ... autres sections */}
      </main>
    </div>
  );
}

export default Dashboard;
```

### Étape 7 : Migration Progressive

**Stratégie recommandée** :

1. **Phase 1** : Créer la structure React + Router + Context
2. **Phase 2** : Migrer Login & Register
3. **Phase 3** : Migrer Dashboard
4. **Phase 4** : Migrer Sessions + Player
5. **Phase 5** : Migrer Breathing + Progress
6. **Phase 6** : Migrer Admin + Learning
7. **Phase 7** : Tests complets + optimisations

### Étape 8 : TypeScript (Optionnel mais Recommandé)

```bash
# Convertir en TypeScript
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

**Renommer fichiers** : `.jsx` → `.tsx` et `.js` → `.ts`

**Exemple interface** :

```typescript
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isPremium: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  type: "hatha" | "vinyasa" | "yin" | "flow";
  isPremium: boolean;
  goals: string[];
  poses: Pose[];
}

export interface Pose {
  id: string;
  name: string;
  duration: number;
  instructions: string;
}
```

---

## 📦 PARTIE 3 : OPTIMISATIONS PERFORMANCE

### 1. Lazy Loading des Images

```jsx
import React, { useState, useEffect, useRef } from "react";

function LazyImage({ src, alt, placeholder }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.unobserve(imgRef.current);
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return <img ref={imgRef} src={imageSrc} alt={alt} />;
}
```

### 2. Debounce Search

```javascript
// src/utils/debounce.js
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage dans composant
const debouncedSearch = useCallback(
  debounce((query) => setSearchQuery(query), 300),
  [],
);
```

### 3. Service Worker (PWA)

```javascript
// public/service-worker.js
const CACHE_NAME = "yoga-app-v1";
const urlsToCache = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
```

---

## 🎯 CHECKLIST FINALE

### Responsive ✅

- [ ] Navigation burger mobile sur toutes les pages
- [ ] Grids adaptées (3 → 2 → 1 colonnes)
- [ ] Touch targets minimum 44x44px
- [ ] Swipe gestures sur player
- [ ] Modal fullscreen sur mobile
- [ ] Padding/margins adaptés par breakpoint
- [ ] Test sur iPhone SE, iPad, Desktop

### React Migration ✅

- [ ] Structure créée avec Create React App
- [ ] Router configuré
- [ ] AuthContext + ThemeContext
- [ ] Services migrés (auth, sessions, storage)
- [ ] Hooks personnalisés (useAuth, useLocalStorage)
- [ ] Composants réutilisables (Navbar, Button, Card)
- [ ] Toutes les pages migrées
- [ ] Tests unitaires écrits

### Performance ✅

- [ ] Lazy loading images
- [ ] Debounce sur search
- [ ] Service Worker pour PWA
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90

---

## 📚 Ressources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Create React App](https://create-react-app.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Responsive Design Guide](https://web.dev/responsive-web-design-basics/)

---

**Bon développement ! 🚀**

_Document mis à jour : 24 janvier 2026_
