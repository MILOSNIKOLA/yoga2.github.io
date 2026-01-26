# 🎨 GUIDE VISUEL - ARCHITECTURE YOGA APP

## 📱 Flow Utilisateur Complet

```
┌─────────────────────────────────────────────────────────────┐
│                    PARCOURS UTILISATEUR                      │
└─────────────────────────────────────────────────────────────┘

1️⃣ DÉCOUVERTE (Public)

   index.html
   ┌─────────────────────────┐
   │  🏠 Page d'Accueil      │
   │                         │
   │  • Hero inspirant       │
   │  • 3 Quick Actions      │
   │  • 4 Piliers yoga       │
   │  • Séances populaires   │
   │                         │
   │  [Créer un compte]      │
   │  [Se connecter]         │
   └─────────────────────────┘
            │
            ├── Nouveau ? ──────────┐
            │                       │
            ↓                       ↓
   ┌─────────────────┐    ┌─────────────────┐
   │ register.html   │    │  login.html     │
   │                 │    │                 │
   │ • Email         │    │ • Email         │
   │ • Mot de passe  │    │ • Mot de passe  │
   │ • Nom           │    │ • Se souvenir   │
   │ • Niveau        │    │                 │
   │                 │    │ [Connexion]     │
   │ [Créer]         │    └─────────────────┘
   └─────────────────┘              │
            │                       │
            └───────────┬───────────┘
                        │
                        ↓

2️⃣ ESPACE PERSONNEL (Authentifié)

   dashboard.html
   ┌──────────────────────────────────────┐
   │  👤 Dashboard - Bonjour Marie !      │
   │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
   │  │ 15      │ │ 320 min │ │ 5 jours ││
   │  │ séances │ │ pratique│ │ streak  ││
   │  └─────────┘ └─────────┘ └─────────┘│
   │                                      │
   │  Continuer ma pratique :             │
   │  ▶ Flow doux du matin (8 min restant)│
   │                                      │
   │  Séances récentes :                  │
   │  • Yin relaxant - hier 20h          │
   │  • Quick stretch - hier 14h         │
   │                                      │
   │  [🔍 Nouvelle séance]                │
   └──────────────────────────────────────┘
                    │
                    ↓

3️⃣ CHOISIR UNE SÉANCE

   sessions.html
   ┌──────────────────────────────────────┐
   │  🔍 Trouvez votre séance             │
   │                                      │
   │  Filtres:  [Niveau ▼] [Durée ▼]    │
   │           [Type ▼] [Objectif ▼]     │
   │                                      │
   │  ┌──────────┐ ┌──────────┐         │
   │  │ 🧘‍♀️ Vinyasa│ │ 🧘 Yin    │         │
   │  │ 30 min   │ │ 20 min   │         │
   │  │ [▶ Play] │ │ [▶ Play] │         │
   │  └──────────┘ └──────────┘         │
   │                                      │
   │  ┌──────────┐ ┌──────────┐         │
   │  │ 🧘 Hatha │ │ 🧘‍♀️ Flow  │         │
   │  │ 15 min   │ │ 10 min   │         │
   │  │ [▶ Play] │ │ [▶ Play] │         │
   │  └──────────┘ └──────────┘         │
   └──────────────────────────────────────┘
                    │
                    │ Click sur une séance
                    ↓

4️⃣ PRATIQUER

   session-player.html
   ┌──────────────────────────────────────┐
   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━ 40%    │
   │                                      │
   │         Chien tête en bas            │
   │                                      │
   │              🧘‍♀️                     │
   │                                      │
   │    Poussez les talons vers le sol   │
   │    Colonne vertébrale étirée        │
   │                                      │
   │            ⏱️  00:45                 │
   │                                      │
   │      [◀] [⏸️ PAUSE] [▶]             │
   │                                      │
   │  Posture 2/5 • 12 min restantes     │
   └──────────────────────────────────────┘
```

Pour voir tous les diagrammes complets, consultez [ARCHITECTURE.md](ARCHITECTURE.md) et [SECURITY.md](SECURITY.md).

_Document créé le 23 janvier 2026_
