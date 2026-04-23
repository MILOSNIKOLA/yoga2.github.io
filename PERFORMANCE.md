# Performance - Yoga2 SaaS

## ⚡ Optimisation Performance

Plateforme optimisée pour des temps de chargement rapides et une expérience utilisateur fluide.

## 📊 Métriques Performance

### Objectifs

- **First Contentful Paint (FCP)** : < 1.5s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **First Input Delay (FID)** : < 100ms
- **Cumulative Layout Shift (CLS)** : < 0.1
- **Time to Interactive (TTI)** : < 3s

### Outils de mesure

```bash
# Lighthouse
npx lighthouse http://localhost:3000 --output=json

# WebPageTest
# https://www.webpagetest.org/

# Chrome DevTools
# Performance tab
```

## 🖥️ Optimisation Frontend

### Code Splitting

```javascript
// React.lazy pour chargement différé
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));

// Routes avec Suspense
<Suspense fallback={<div>Chargement...</div>}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>;
```

### Bundle Analysis

```bash
# Analyser la taille du bundle
npm install --save-dev webpack-bundle-analyzer

# Script dans package.json
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
```

### Images optimisées

```javascript
// Lazy loading images
import { useState, useRef, useEffect } from "react";

const LazyImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img ref={imgRef} src={isLoaded ? src : ""} alt={alt} loading="lazy" />
  );
};
```

### CSS optimisé

```css
/* CSS critique en ligne */
<style>
  .hero { background: #22c55e; color: white; }
  .btn { background: #3b82f6; color: white; }
</style>

/* Chargement différé du CSS non critique */
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## 🚀 Optimisation Backend

### Mise en cache

```javascript
// Cache Redis
const redis = require("redis");
const client = redis.createClient();

app.get("/api/content", async (req, res) => {
  const cacheKey = "content:" + JSON.stringify(req.query);

  // Vérifier cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Requête DB
  const content = await Content.find(req.query);

  // Mettre en cache (5 min)
  await client.setex(cacheKey, 300, JSON.stringify(content));

  res.json(content);
});
```

### Database optimisation

```javascript
// Index MongoDB
db.content.createIndex({ type: 1, category: 1 });
db.content.createIndex({ premium: 1 });
db.users.createIndex({ firebaseUid: 1 }, { unique: true });

// Pagination efficace
app.get("/api/content", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const content = await Content.find()
    .skip(skip)
    .limit(limit)
    .select("title type category duration premium") // Projection
    .lean(); // Plain objects

  res.json(content);
});
```

### Compression

```javascript
// Compression Gzip
const compression = require("compression");

app.use(
  compression({
    level: 6, // Niveau de compression
    threshold: 1024, // Seulement > 1KB
    filter: (req, res) => {
      // Ne pas compresser si déjà compressé
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);
```

## 🌐 Optimisation Réseau

### CDN

```javascript
// Configuration CDN (Vercel/Netlify)
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.yoga2.com/:path*" }
  ]
}
```

### HTTP/2

- **Multiplexing** : Requêtes parallèles
- **Header compression** : HPACK
- **Server push** : Ressources critiques

### Préchargement

```html
<!-- Précharger les routes critiques -->
<link rel="prefetch" href="/dashboard" />
<link rel="prefetch" href="/api/content" />

<!-- Précharger les polices -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

## 📱 Optimisation Mobile

### Responsive Design

```css
/* Mobile-first approach */
.hero {
  padding: 1rem;
}

@media (min-width: 768px) {
  .hero {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: 3rem;
  }
}
```

### Performance mobile

```javascript
// Service Worker pour cache offline
// public/sw.js
const CACHE_NAME = "yoga2-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/static/js/bundle.js",
        "/static/css/main.css",
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

### Touch Optimisations

```css
/* Optimisations tactiles */
.btn {
  min-height: 44px; /* Taille minimale pour les doigts */
  min-width: 44px;
}

.card {
  touch-action: manipulation; /* Évite le zoom */
}
```

## 🔍 Monitoring Performance

### Real User Monitoring (RUM)

```javascript
// Intégration Google Analytics
import { getAnalytics } from "firebase/analytics";

// Mesures Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Server Monitoring

```javascript
// Middleware de monitoring
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});
```

### Alertes

```javascript
// Alertes sur métriques critiques
const thresholds = {
  responseTime: 1000, // 1s
  errorRate: 0.05, // 5%
  cpuUsage: 0.8, // 80%
};

// Vérification périodique
setInterval(() => {
  // Vérifier métriques et alerter si dépassement
}, 60000); // Toutes les minutes
```

## 🧪 Tests Performance

### Load Testing

```javascript
// Artillery pour tests de charge
// tests/load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 10
      rampTo: 50
scenarios:
  - name: 'Test API performance'
    requests:
      - get:
          url: '/api/content'
```

### Stress Testing

```bash
# Tests de stress avec k6
k6 run --vus 100 --duration 30s tests/stress-test.js
```

## 📈 Optimisations Avancées

### Virtual Scrolling

```javascript
// Pour listes longues
import { FixedSizeList as List } from "react-window";

const ContentList = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={50}>
    {({ index, style }) => <div style={style}>{items[index].title}</div>}
  </List>
);
```

### Memoization

```javascript
// React.memo pour éviter re-renders inutiles
const ContentCard = memo(({ content, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect(content.id)}>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
    </div>
  );
});

// useMemo pour calculs coûteux
const filteredContent = useMemo(() => {
  return content.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
}, [content, searchTerm]);
```

### Tree Shaking

```javascript
// Imports spécifiques pour réduire le bundle
import { useState, useEffect } from "react"; // Au lieu de import React
import { motion } from "framer-motion"; // Au lieu de toute la lib
```

## 🎯 Checklist Performance

### Frontend

- [ ] Code splitting implémenté
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Bundle analysé et optimisé
- [ ] CSS critique en ligne
- [ ] Service Worker pour cache

### Backend

- [ ] Mise en cache Redis
- [ ] Index DB optimisés
- [ ] Compression activée
- [ ] Pagination implémentée
- [ ] Monitoring en place

### Réseau

- [ ] CDN configuré
- [ ] HTTP/2 activé
- [ ] Préchargement ressources
- [ ] Headers optimisés

### Mobile

- [ ] Design responsive
- [ ] Touch targets adaptés
- [ ] Performance mobile testée
- [ ] PWA features

---

**Performance optimale = Utilisateurs satisfaits ⚡**
