# 🧪 GUIDE DE VALIDATION - i18n 100%

## ✅ Étapes de validation complètes

### Étape 1️⃣ : Vérifier l'initialisation

**En ouvrant la page en F12 (Console):**

```
[1] Chercher les messages d'initialisation:
✅ "🚀 Initialisation du système i18n"
✅ "🌍 Langue détectée: fr" (ou votre langue)
✅ "✅ i18n initialisé - Langue: Français"

[2] Si vous avez ces messages → ✅ OK
    Si vous n'avez rien → ❌ Problème de chargement
```

---

### Étape 2️⃣ : Vérifier les traductions appliquées

**En console, taper:**

```javascript
// Vérifier le contenu traduit
document.querySelectorAll("[data-i18n]").length;

// Résultat attendu: 40+ éléments
// ✅ Si > 0 → Traductions appliquées
// ❌ Si 0 → Rien n'a été traduit
```

**Exemple:**

```
> document.querySelectorAll('[data-i18n]').length
< 47
✅ OK - 47 éléments sont traduits
```

---

### Étape 3️⃣ : Tester le changement de langue

**Cliquer sur le bouton 🌐 drapeau en haut à gauche:**

```
✅ AVANT: Page en français
  "Prenez 15 minutes pour vous"
  "Yogа fait pour vous"
  "Restez informé"

CLIC sur bouton drapeau

✅ APRÈS: Page en serbe
  "Одvojite 15 minuta za sebe"
  "Joga prilagođena vama"
  "Ostanite informisani"

CLIC à nouveau

✅ APRÈS: Page en anglais
  "Take 15 Minutes for Yourself"
  "Yoga Made for You"
  "Stay Informed"
```

**Si tout se traduit instantanément → ✅ PARFAIT**
**Si certains éléments ne se traduisent pas → ❌ Voir dépannage**

---

### Étape 4️⃣ : Vérifier placeholder traduit

**Regarder le champ d'email de la newsletter:**

```
🔍 Regarder le placeholder (texte gris dans l'input)

✅ FRANÇAIS:  "Votre email"
✅ SERBE:     "Ваш имејл"
✅ ANGLAIS:   "Your email"

Si placeholder change → ✅ OK
Si placeholder ne change pas → ❌ data-i18n-placeholder manquant
```

---

### Étape 5️⃣ : Vérifier aria-labels traduits

**En F12 Console:**

```javascript
// Vérifier aria-label du bouton langue
document.getElementById("language-toggle").getAttribute("aria-label") <
  // Résultat attendu en français:
  "Changer de langue" <
  // Après translatePage('en'):
  "Change language";

// ✅ Si change → OK
// ❌ Si reste pareil → Problème
```

---

### Étape 6️⃣ : Vérifier localStorage

**En F12 Console:**

```javascript
// Vérifier que la langue est sauvegardée
localStorage.getItem('site_language')

// 1ère visite (vide):
< null

// Après clic sur bouton langue:
< "sr"  (ou "en" ou "fr" selon ce que vous avez cliqué)

// ✅ Si changement détecté → OK
// ❌ Si localStorage reste null → Problème de persistance
```

---

### Étape 7️⃣ : Tester après rechargement

**Recharger la page (Ctrl+R ou F5):**

```
AVANT rechargement: Page en ANGLAIS

RECHARGEMENT

APRÈS rechargement: Page en ANGLAIS (persistance!)
✅ La langue sauvegardée est restituée

Si page repasse au français → ❌ localStorage ne sauvegarde pas
```

---

### Étape 8️⃣ : Vérifier console sans erreurs

**Ouvrir la console (F12 → Console):**

```
✅ BON:     Que des messages ℹ️ et ✅
❌ MAUVAIS: Erreurs rouges ❌ ou avertissements ⚠️

Acceptable ⚠️:
- "Traduction manquante" — Normal si clé oubliée
- "Aucune langue navigateur détectée" — OK, fallback

Non acceptable ❌:
- "Cannot read property" — Bug sérieux
- "SITE_TRANSLATIONS is not defined" — Chargement mal
```

---

### Étape 9️⃣ : Tester contenu dynamique

**En F12 Console, exécuter:**

```javascript
// Créer un nouvel élément avec traduction
const el = document.createElement("h2");
el.setAttribute("data-i18n", "hero.title");
el.textContent = "Texte par défaut";
document.body.appendChild(el);

// Attendre 100ms et vérifier
setTimeout(() => {
  console.log(el.textContent);
  // ✅ Devrait afficher: "Prenez 15 minutes pour vous" (en FR)
  //                    ou "Одvojite 15 minuta za sebe" (en SR)
  //                    ou "Take 15 Minutes..." (en EN)
}, 100);
```

**Si texte change → ✅ MutationObserver fonctionne**
**Si texte ne change pas → ❌ Observer pas configuré**

---

## 🚀 Lancer l'audit automatique complet

**Copier-coller en console (F12):**

```javascript
// Charger le script de validation
fetch("docs/i18n-VALIDATION.js")
  .then((r) => r.text())
  .then(eval);

// OU: Copier directement le contenu de docs/i18n-VALIDATION.js
// et le coller en console
```

**Résultat attendu:**

```
✅ AUDIT COMPLET DU SYSTÈME i18n

✓ TEST 1: Traductions chargées
  ✅ SITE_TRANSLATIONS disponible
  ✅ Langues: fr, sr, en

✓ TEST 2: Système de traduction chargé
  ✅ translatePage() disponible
  ✅ getCurrentLanguage() disponible
  ✅ getCurrentLanguageName() disponible
  ✅ setLanguage() disponible

...

🎯 Score: 100%

✨ EXCELLENT! Système i18n OK pour production ✨
```

---

## 📱 Tester responsive (Mobile)

**Avec DevTools responsive (F12 → Ctrl+Shift+M):**

```
✅ Changer langue sur MOBILE
✅ Vérifier tous les textes se traduisent
✅ Vérifier placeholder du form
✅ Vérifier bouton drapeau visible
✅ Vérifier pas de débordement

Si tout fonctionne → ✅ Mobile OK
```

---

## 🔴 Dépannage rapide

### ❌ "Rien n'est traduit"

```
1. Ouvrir F12 Console
2. Chercher les erreurs rouges
3. Vérifier que SITE_TRANSLATIONS existe:
   > window.SITE_TRANSLATIONS
4. Vérifier que language.js est chargé:
   > window.getCurrentLanguage
```

### ❌ "Placeholder ne se traduit pas"

```
1. Vérifier l'input a data-i18n-placeholder (pas data-i18n)
2. Vérifier la clé existe en translations.js:
   > SITE_TRANSLATIONS.fr.newsletter.placeholder
3. Vérifier qu'il n'y a pas de typo
```

### ❌ "Console pleine d'erreurs"

```
1. Quelle erreur exactement?
2. À quel moment? (Au chargement? Au changement?)
3. Vérifier l'ordre des scripts:
   - translations.js AVANT language.js ✅
```

### ❌ "Langue ne se sauvegarde pas"

```
1. Vérifier localStorage activé:
   > localStorage.setItem('test', '1')
   > localStorage.getItem('test')
2. Vérifier pas de session privée
3. Vérifier pas de restriction domaine
```

---

## ✅ Checklist finale

- [ ] Page charge en bonne langue (détection navigator)
- [ ] Au moins 40 éléments avec [data-i18n]
- [ ] Placeholder newsletter traduit
- [ ] Aria-labels traduits
- [ ] Changement de langue instantané
- [ ] localStorage sauvegarde langue
- [ ] Rechargement = même langue
- [ ] Console sans erreurs bloquantes
- [ ] Contenu dynamique traduit (test dans console)
- [ ] Mobile responsive OK
- [ ] Aucun texte français visible après changeLanguage('en')
- [ ] Aucun texte serbe visible après changeLanguage('fr')
- [ ] Aucun texte anglais visible après changeLanguage('sr')
- [ ] Footer traduit correctement
- [ ] Newsletter traduite
- [ ] Tous les boutons traduits

---

## 📊 Résultat attendu après validation

```
✨ SYSTÈME i18n VALIDÉ ✨

✅ 100% du contenu traduit
✅ 3 langues fonctionnelles
✅ Détection automatique langue
✅ Persistance localStorage
✅ Traduction instantanée
✅ Contenu dynamique traduit
✅ Console clean
✅ Mobile OK
✅ Accessible (aria-labels)
✅ Performant

🎯 PRÊT POUR LA PRODUCTION
```

---

## 📞 Besoin d'aide?

1. **Lire:** [docs/i18n-GUIDE.md](i18n-GUIDE.md)
2. **Valider:** Lancer le script [docs/i18n-VALIDATION.js](i18n-VALIDATION.js)
3. **Audit:** [docs/i18n-AUDIT-COMPLET.md](i18n-AUDIT-COMPLET.md)

---

**Dernière mise à jour:** 29 janvier 2026
**Statut:** ✅ Validation complète
