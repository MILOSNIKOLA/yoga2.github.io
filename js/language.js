/**
 * LANGUAGE TOGGLE - Gestion du changement de langue
 * 3 langues : Français (par défaut), Serbe, Anglais
 */

// Configurations des langues avec SVG
const languages = {
  en: {
    name: "English",
    svg: `<svg class="flag-icon" data-lang="en" width="32" height="24" viewBox="0 0 32 24">
      <rect width="32" height="24" fill="#012169"/>
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" stroke-width="4"/>
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" stroke-width="2.5"/>
      <path d="M16 0 V24 M0 12 H32" stroke="#FFF" stroke-width="8"/>
      <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" stroke-width="5"/>
    </svg>`,
  },
  fr: {
    name: "Français",
    svg: `<svg class="flag-icon" data-lang="fr" width="32" height="24" viewBox="0 0 32 24">
      <rect width="10.67" height="24" fill="#002395"/>
      <rect x="10.67" width="10.67" height="24" fill="#FFFFFF"/>
      <rect x="21.33" width="10.67" height="24" fill="#ED2939"/>
    </svg>`,
  },
  sr: {
    name: "Српски",
    svg: `<svg class="flag-icon" data-lang="sr" width="32" height="24" viewBox="0 0 32 24">
      <rect width="32" height="8" fill="#C6363C"/>
      <rect y="8" width="32" height="8" fill="#0C4076"/>
      <rect y="16" width="32" height="8" fill="#FFFFFF"/>
    </svg>`,
  },
};

const languageOrder = ["fr", "sr", "en"];

// Traductions du contenu
const translations = {
  fr: {
    // Hero Section
    "hero.title": "Prenez 15 minutes pour vous",
    "hero.subtitle":
      "Retrouvez calme et bien-être à travers des séances de yoga guidées",
    "hero.daily": "Séance du jour",
    "hero.breathing": "Respiration rapide",
    "hero.gentle": "Étirement doux",

    // Auth Section
    "auth.login": "Se connecter",
    "auth.register": "Créer un compte",
    "auth.demo": "Demo",
    "auth.dashboard": "Mon espace",
    "auth.logout": "Déconnexion",

    // Features Section
    "features.title": "Un yoga fait pour vous",
    "features.understand.title": "Comprendre",
    "features.understand.desc":
      "Théorie, intentions et respiration expliquées simplement",
    "features.practice.title": "Pratiquer",
    "features.practice.desc":
      "Séances guidées adaptées à votre niveau et votre temps",
    "features.progress.title": "Progresser",
    "features.progress.desc": "Suivez votre régularité et célébrez vos moments",
    "features.feel.title": "Ressentir",
    "features.feel.desc": "Calme, confiance et bien-être à portée de main",

    // Sessions Preview
    "sessions.title": "Séances populaires",
    "sessions.viewAll": "Voir toutes les séances",

    // CTA Section (avec préfixe home.)
    "home.cta.title": "Commencez votre voyage aujourd'hui",
    "home.cta.description":
      "Rejoignez des milliers de personnes qui ont trouvé leur équilibre",
    "home.cta.button": "Créer mon compte gratuit",

    // Yoga Section
    "yoga.title": "Qu'est-ce que le yoga ?",
    "yoga.intro":
      "Le yoga est une pratique ancienne qui unit le corps, l'esprit et la respiration",
    "yoga.benefit1.title": "Réduction du stress",
    "yoga.benefit1.desc": "Apaisez votre esprit et trouvez la paix intérieure",
    "yoga.benefit2.title": "Flexibilité accrue",
    "yoga.benefit2.desc": "Améliorez votre souplesse et votre mobilité",
    "yoga.benefit3.title": "Force physique",
    "yoga.benefit3.desc": "Renforcez vos muscles en douceur",

    // Footer Section
    "footer.copyright": "© 2026 Yoga App. Tous droits réservés.",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",

    // Buttons aria-labels
    "aria.language": "Changer de langue",
    "aria.theme": "Changer le thème",
  },
  sr: {
    // Hero Section
    "hero.title": "Odvojite 15 minuta za sebe",
    "hero.subtitle": "Pronađite mir i dobrobit kroz vođene joga sesije",
    "hero.daily": "Današnja sesija",
    "hero.breathing": "Brzo disanje",
    "hero.gentle": "Blago istezanje",

    // Auth Section
    "auth.login": "Prijavite se",
    "auth.register": "Napravite nalog",
    "auth.demo": "Demo",
    "auth.dashboard": "Moj prostor",
    "auth.logout": "Odjavite se",

    // Features Section
    "features.title": "Joga prilagođena vama",
    "features.understand.title": "Razumeti",
    "features.understand.desc":
      "Teorija, namere i disanje jednostavno objašnjeni",
    "features.practice.title": "Vežbati",
    "features.practice.desc": "Vođene sesije prilagođene vašem nivou i vremenu",
    "features.progress.title": "Napredovati",
    "features.progress.desc":
      "Pratite svoju redovnost i proslavite svoje trenutke",
    "features.feel.title": "Osetiti",
    "features.feel.desc": "Mir, samopouzdanje i dobrobit na dohvat ruke",

    // Sessions Preview
    "sessions.title": "Popularne sesije",
    "sessions.viewAll": "Pogledajte sve sesije",

    // CTA Section (avec préfixe home.)
    "home.cta.title": "Započnite svoje putovanje danas",
    "home.cta.description":
      "Pridružite se hiljadama ljudi koji su pronašli svoju ravnotežu",
    "home.cta.button": "Napravite besplatan nalog",

    // Yoga Section
    "yoga.title": "Šta je joga?",
    "yoga.intro": "Joga je drevna praksa koja objedinjuje telo, um i disanje",
    "yoga.benefit1.title": "Smanjenje stresa",
    "yoga.benefit1.desc": "Smirite svoj um i pronađite unutrašnji mir",
    "yoga.benefit2.title": "Povećana fleksibilnost",
    "yoga.benefit2.desc": "Poboljšajte svoju pokretljivost i fleksibilnost",
    "yoga.benefit3.title": "Fizička snaga",
    "yoga.benefit3.desc": "Ojačajte svoje mišiće na nežan način",

    // Footer Section
    "footer.copyright": "© 2026 Yoga App. Sva prava zadržana.",
    "footer.privacy": "Privatnost",
    "footer.terms": "Uslovi",

    // Buttons aria-labels
    "aria.language": "Promenite jezik",
    "aria.theme": "Promenite temu",
  },
  en: {
    // Hero Section
    "hero.title": "Take 15 Minutes for Yourself",
    "hero.subtitle": "Find calm and well-being through guided yoga sessions",
    "hero.daily": "Daily Session",
    "hero.breathing": "Quick Breathing",
    "hero.gentle": "Gentle Stretch",

    // Auth Section
    "auth.login": "Log In",
    "auth.register": "Create Account",
    "auth.demo": "Demo",
    "auth.dashboard": "My Space",
    "auth.logout": "Log Out",

    // Features Section
    "features.title": "Yoga Made for You",
    "features.understand.title": "Understand",
    "features.understand.desc":
      "Theory, intentions and breathing explained simply",
    "features.practice.title": "Practice",
    "features.practice.desc": "Guided sessions adapted to your level and time",
    "features.progress.title": "Progress",
    "features.progress.desc":
      "Track your consistency and celebrate your moments",
    "features.feel.title": "Feel",
    "features.feel.desc": "Calm, confidence and well-being at your fingertips",

    // Sessions Preview
    "sessions.title": "Popular Sessions",
    "sessions.viewAll": "View All Sessions",

    // CTA Section (avec préfixe home.)
    "home.cta.title": "Start Your Journey Today",
    "home.cta.description": "Join thousands who have found their balance",
    "home.cta.button": "Create My Free Account",

    // Yoga Section
    "yoga.title": "What is Yoga?",
    "yoga.intro":
      "Yoga is an ancient practice that unites body, mind and breath",
    "yoga.benefit1.title": "Stress Reduction",
    "yoga.benefit1.desc": "Calm your mind and find inner peace",
    "yoga.benefit2.title": "Increased Flexibility",
    "yoga.benefit2.desc": "Improve your mobility and flexibility",
    "yoga.benefit3.title": "Physical Strength",
    "yoga.benefit3.desc": "Strengthen your muscles gently",

    // Footer Section
    "footer.copyright": "© 2026 Yoga App. All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",

    // Buttons aria-labels
    "aria.language": "Change language",
    "aria.theme": "Toggle theme",
  },
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  setupLanguageToggle();
  setupFooterListener();
});

/**
 * Initialise la langue depuis localStorage ou défaut (français)
 */
function initLanguage() {
  const savedLang = localStorage.getItem("preferred-language") || "fr";
  setLanguage(savedLang);
}

/**
 * Configure le bouton de changement de langue
 */
function setupLanguageToggle() {
  const toggleBtn = document.getElementById("language-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("preferred-language") || "en";
    const currentIndex = languageOrder.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    const nextLang = languageOrder[nextIndex];

    setLanguage(nextLang);
  });
}

/**
 * Écoute l'événement de chargement du footer
 * Relance la traduction quand le footer est ajouté au DOM
 */
function setupFooterListener() {
  window.addEventListener("footerLoaded", () => {
    console.log("📍 Événement footerLoaded reçu - re-traduction du contenu");
    const currentLang = localStorage.getItem("preferred-language") || "fr";
    applyTranslations(currentLang);
  });
}

/**
 * Change la langue active
 * @param {string} lang - Code de la langue (en, fr, sr)
 */
function setLanguage(lang) {
  if (!languages[lang]) {
    console.warn(
      `⚠️ Langue "${lang}" invalide, utilisation du français par défaut`,
    );
    lang = "fr";
  }

  console.log(
    `🌐 Changement de langue vers: ${languages[lang].name} (${lang})`,
  );

  // Sauvegarde la langue
  localStorage.setItem("preferred-language", lang);

  // Met à jour l'attribut lang du HTML
  document.documentElement.lang = lang;

  // Met à jour l'icône du bouton avec le SVG
  const toggleBtn = document.getElementById("language-toggle");
  if (toggleBtn) {
    toggleBtn.innerHTML = languages[lang].svg;
    toggleBtn.setAttribute("aria-label", translations[lang]["aria.language"]);
  }

  // Applique les traductions au contenu de la page
  applyTranslations(lang);
}

/**
 * Applique les traductions à tous les éléments avec data-i18n
 * @param {string} lang - Code de la langue
 */
function applyTranslations(lang) {
  const langData = translations[lang];
  if (!langData) {
    console.error(`❌ Langue "${lang}" non trouvée dans translations`);
    return;
  }

  let translatedCount = 0;
  let missingCount = 0;
  const missingKeys = [];

  // Traduit tous les éléments avec l'attribut data-i18n
  // GARANTIE : Trouve TOUS les [data-i18n] y compris dans .container ET .footer
  const elements = document.querySelectorAll("[data-i18n]");
  console.log(
    `🔍 Recherche traductions pour ${lang} - ${elements.length} éléments trouvés`,
  );

  let footerCount = 0;

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (langData[key]) {
      // Traduction trouvée
      element.textContent = langData[key];
      translatedCount++;

      // Compte les éléments du footer
      if (element.closest("footer")) {
        footerCount++;
      }
    } else {
      // Clé manquante - log pour debug
      missingCount++;
      missingKeys.push(key);
      console.warn(
        `⚠️ Traduction manquante pour clé: "${key}" (langue: ${lang})`,
      );
    }
  });

  // Traduit les attributs aria-label
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle && langData["aria.theme"]) {
    themeToggle.setAttribute("aria-label", langData["aria.theme"]);
  }

  // Rapport de traduction
  console.log(
    `✅ ${translatedCount} éléments traduits en ${lang.toUpperCase()}`,
  );
  if (footerCount > 0) {
    console.log(`   📍 Footer: ${footerCount} éléments traduits`);
  }
  if (missingCount > 0) {
    console.warn(`⚠️ ${missingCount} traductions manquantes:`, missingKeys);
  }
}

/**
 * Récupère la langue actuelle
 * @returns {string} Code de la langue actuelle
 */
function getCurrentLanguage() {
  return localStorage.getItem("preferred-language") || "fr";
}

/**
 * Récupère le nom de la langue actuelle
 * @returns {string} Nom de la langue
 */
function getCurrentLanguageName() {
  const lang = getCurrentLanguage();
  return languages[lang].name;
}
