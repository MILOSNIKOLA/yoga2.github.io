# 🔍 Test de la traduction dans la Console

## Ouvrir sessions.html dans le navigateur

1. Ouvrez **http://localhost:8000/sessions.html**
2. Appuyez sur **F12** pour ouvrir la Console

## Collez ces commandes dans la console :

### Test 1 : Vérifier window.i18n

```javascript
console.log("1. window.i18n existe ?", !!window.i18n);
console.log("2. Langue actuelle :", window.i18n?.currentLanguage);
console.log("3. Traductions chargées :", !!window.i18n?.translations);
```

### Test 2 : Vérifier les traductions de sessions

```javascript
console.log(
  "4. Traductions FR sessions :",
  window.i18n?.translations?.fr?.sessions,
);
console.log(
  "5. Session 41 FR :",
  window.i18n?.translations?.fr?.sessions?.cards?.session_41,
);
```

### Test 3 : Vérifier les éléments DOM

```javascript
const title = document.querySelector(".session-card-title");
console.log("6. Titre trouvé :", !!title);
console.log("7. data-i18n du titre :", title?.getAttribute("data-i18n"));
console.log("8. Contenu actuel du titre :", title?.textContent);
```

### Test 4 : Tester getTranslation

```javascript
const key = "sessions.cards.session_41.title";
console.log("9. Test getTranslation :", window.i18n?.getTranslation(key));
```

### Test 5 : Forcer l'application des traductions

```javascript
console.log("10. Appliquer les traductions...");
window.i18n?.applyTranslations();
console.log(
  "11. Nouveau contenu du titre :",
  document.querySelector(".session-card-title")?.textContent,
);
```

### Test 6 : Changer de langue

```javascript
console.log("12. Changement de langue...");
window.i18n?.switchLanguage();
console.log("13. Nouvelle langue :", window.i18n?.currentLanguage);
console.log(
  "14. Contenu après changement :",
  document.querySelector(".session-card-title")?.textContent,
);
```

---

## Résultats attendus :

- ✅ **Test 1-2** : window.i18n existe, langue = "fr"
- ✅ **Test 4-5** : Session 41 existe avec title et description
- ✅ **Test 7** : data-i18n = "sessions.cards.session_41.title"
- ✅ **Test 9** : Retourne "Étirements matinaux doux"
- ✅ **Test 11** : Le titre change après applyTranslations()
- ✅ **Test 14** : Le titre change en anglais

---

## Si ça ne marche pas :

**Copiez TOUS les résultats de la console ici !**
