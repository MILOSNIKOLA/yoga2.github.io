/**
 * ═══════════════════════════════════════════════════════════════════════
 * TRADUCTIONS CENTRALISÉES - TOUTES LES PAGES DU SITE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Ce fichier contient TOUTES les traductions pour TOUTES les pages du site.
 * Il est chargé automatiquement par le système de traduction.
 *
 * Structure: translations[langue][page][section][clé]
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

const SITE_TRANSLATIONS = {
  fr: {
    // ═══════════════════════════════════════════════════════════════════
    // COMMUN (toutes les pages)
    // ═══════════════════════════════════════════════════════════════════
    common: {
      backHome: "Retour à l'accueil",
      aria: {
        language: "Changer de langue",
        theme: "Changer le thème",
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // PAGE: CONFIDENTIALITÉ
    // ═══════════════════════════════════════════════════════════════════
    privacy: {
      title: "Politique de Confidentialité – Yoga App",
      lastUpdate: "Dernière mise à jour : 27 janvier 2026",

      intro:
        "La présente Politique de Confidentialité a pour objet d'informer les utilisateurs de l'application et du site Yoga App des modalités de collecte, de traitement et de protection de leurs données personnelles, conformément au Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (RGPD) et à la législation française en vigueur.",

      section1: {
        title: "1. Responsable du traitement",
        content:
          "Le responsable du traitement des données personnelles est Yoga App, éditeur de l'application et du site web. Toute question relative aux données personnelles peut être adressée via les moyens de contact indiqués sur le site.",
      },

      section2: {
        title: "2. Données personnelles collectées",
        intro:
          "Yoga App est susceptible de collecter les catégories de données suivantes :",
        list: [
          "données d'identification (nom, prénom, adresse e-mail),",
          "données de connexion et d'utilisation (adresse IP, type de navigateur, logs),",
          "préférences utilisateur liées aux séances de yoga et de respiration.",
        ],
        outro:
          "Aucune donnée sensible au sens de l'article 9 du RGPD n'est collectée sans consentement explicite.",
      },

      section3: {
        title: "3. Finalités du traitement",
        intro:
          "Les données personnelles sont collectées pour les finalités suivantes :",
        list: [
          "fourniture et gestion des services proposés par Yoga App,",
          "personnalisation de l'expérience utilisateur,",
          "amélioration continue de l'application,",
          "sécurité, prévention de la fraude et des abus,",
          "communication avec l'utilisateur concernant le service.",
        ],
      },

      section4: {
        title: "4. Base légale du traitement",
        intro: "Les traitements effectués reposent sur :",
        list: [
          "l'exécution du contrat liant l'utilisateur à Yoga App,",
          "le consentement explicite de l'utilisateur,",
          "l'intérêt légitime de Yoga App à assurer la sécurité et l'amélioration du service,",
          "le respect des obligations légales.",
        ],
      },

      section5: {
        title: "5. Destinataires des données",
        content:
          "Les données personnelles sont destinées exclusivement à Yoga App. Elles peuvent être transmises à des prestataires techniques agissant en tant que sous-traitants, conformément à l'article 28 du RGPD, et uniquement pour les besoins du service.",
      },

      section6: {
        title: "6. Transfert des données hors Union européenne",
        content:
          "Aucun transfert de données personnelles hors de l'Union européenne n'est effectué. Dans le cas contraire, Yoga App s'engage à mettre en place des garanties appropriées conformément au RGPD.",
      },

      section7: {
        title: "7. Durée de conservation",
        content:
          "Les données personnelles sont conservées pendant une durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées, sauf obligations légales imposant une durée de conservation plus longue.",
      },

      section8: {
        title: "8. Sécurité des données",
        content:
          "Yoga App met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque, notamment contre l'accès non autorisé, la perte, l'altération ou la divulgation des données.",
      },

      section9: {
        title: "9. Droits des utilisateurs",
        intro:
          "Conformément au RGPD, l'utilisateur dispose des droits suivants :",
        list: [
          "droit d'accès (article 15),",
          "droit de rectification (article 16),",
          "droit à l'effacement (article 17),",
          "droit à la limitation du traitement (article 18),",
          "droit d'opposition (article 21),",
          "droit à la portabilité des données (article 20).",
        ],
        outro:
          "Ces droits peuvent être exercés à tout moment en contactant Yoga App.",
      },

      section10: {
        title: "10. Réclamation",
        content:
          "L'utilisateur dispose du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente, notamment la CNIL (France).",
      },

      section11: {
        title: "11. Cookies",
        content:
          "Yoga App utilise des cookies et technologies similaires afin d'assurer le bon fonctionnement du site et d'analyser l'audience. L'utilisateur peut gérer ou refuser les cookies via les paramètres de son navigateur.",
      },

      section12: {
        title: "12. Modification de la politique",
        content:
          "Yoga App se réserve le droit de modifier la présente Politique de Confidentialité à tout moment. La version en vigueur est celle publiée sur le site à la date de consultation.",
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // PAGE: INDEX (Accueil)
    // ═══════════════════════════════════════════════════════════════════
    home: {
      hero: {
        title:
          "Des séances de yoga personnalisées par l’IA selon votre niveau, votre temps et votre énergie",
        subtitle:
          "Retrouvez calme et bien-être à travers des séances de yoga guidées",
        daily: "Séance du jour",
        breathing: "Respiration rapide",
        gentle: "Étirement doux",
      },
      auth: {
        login: "Se connecter",
        register: "Créer un compte",
        demo: "Essai gratuit",
        dashboard: "Mon espace",
        logout: "Déconnexion",
      },
      features: {
        title: "Un yoga fait pour vous",
        understand: {
          title: "Comprendre",
          desc: "Théorie, intentions et respiration expliquées simplement",
        },
        practice: {
          title: "Pratiquer",
          desc: "Séances guidées adaptées à votre niveau et votre temps",
        },
        progress: {
          title: "Progresser",
          desc: "Suivez votre régularité et célébrez vos moments",
        },
        feel: {
          title: "Ressentir",
          desc: "Calme, confiance et bien-être à portée de main",
        },
      },
      sessions: {
        title: "Séances populaires",
        viewAll: "Voir toutes les séances",
      },
      cta: {
        title: "Commencez votre voyage aujourd'hui",
        description:
          "Des séances de yoga guidées, accessibles à tout moment et à votre rythme.",
        button: "Créer mon compte gratuit",
      },
      aiCoach: {
        kicker: "Votre Coach IA Personnel",
        title: "Votre coach IA vous accompagne chaque jour",
        subtitle:
          "Recevez des recommandations de yoga personnalisées selon votre niveau, vos objectifs, votre temps disponible et votre énergie du moment.",
        cards: {
          analysis: {
            title: "Analyse de votre niveau",
            desc: "L'intelligence artificielle évalue votre expérience, votre condition physique et vos préférences afin de vous proposer des séances adaptées dès le premier jour.",
          },
          recommendations: {
            title: "Recommandations personnalisées",
            desc: "Recevez chaque jour des séances sélectionnées spécialement pour vous afin de progresser plus rapidement et de rester motivé.",
          },
          tracking: {
            title: "Suivi intelligent",
            desc: "Visualisez votre progression, vos habitudes de pratique et vos performances grâce à un tableau de bord clair et intuitif.",
          },
          adaptation: {
            title: "Adaptation automatique",
            desc: "Votre programme évolue automatiquement en fonction de votre progression, de votre disponibilité et de vos objectifs de bien-être.",
          },
        },
        highlights: {
          aria: "Avantages IA",
          title: "Ce que l'IA change pour vous",
          item1: "Plus de personnalisation",
          item2: "Progression plus rapide",
          item3: "Motivation renforcée",
          item4: "Expérience unique grâce à l'IA",
        },
        cta: "Découvrir mon programme personnalisé",
      },
      newsletter: {
        title: "Restez informé",
        description:
          "Recevez nos conseils de yoga et nos nouvelles séances chaque semaine",
        placeholder: "Votre email",
        subscribe: "S'abonner",
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // FOOTER - Traductions complètes
    // ═══════════════════════════════════════════════════════════════════
    footer: {
      brand: {
        title: "Yoga App",
        tagline: "Votre compagnon de pratique au quotidien",
      },
      explore: {
        title: "Explorer",
        sessions: "Séances",
        breathing: "Respiration",
        learning: "Apprendre",
      },
      account: {
        title: "Compte",
        login: "Connexion",
        register: "Inscription",
        dashboard: "Mon espace",
      },
      legal: {
        title: "Légal",
        privacy: "Confidentialité",
        terms: "CGU",
        contact: "Contact",
      },
      copyright: "2026 Yoga App. Tous droits réservés.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRADUCTIONS SERBES
  // ═══════════════════════════════════════════════════════════════════
  sr: {
    common: {
      backHome: "Povratak na početnu",
      aria: {
        language: "Promeni jezik",
        theme: "Promeni temu",
      },
    },

    privacy: {
      title: "Политика Приватности – Yoga App",
      lastUpdate: "Последње ажурирање: 27. јануар 2026.",

      intro:
        "Ова Политика приватности има за циљ да обавести кориснике апликације и сајта Yoga App о начинима прикупљања, обраде и заштите њихових личних података, у складу са Уредбом (ЕУ) 2016/679 Европског парламента и Савета од 27. априла 2016. (GDPR) и важећим француским законодавством.",

      section1: {
        title: "1. Руковалац подацима",
        content:
          "Руковалац личним подацима је Yoga App, издавач апликације и веб сајта. Сва питања у вези са личним подацима могу се поставити путем контакт информација наведених на сајту.",
      },

      section2: {
        title: "2. Прикупљени лични подаци",
        intro: "Yoga App може прикупљати следеће категорије података:",
        list: [
          "идентификациони подаци (име, презиме, имејл адреса),",
          "подаци о повезивању и коришћењу (IP адреса, тип претраживача, логови),",
          "корисничке преференције везане за јога и дисајне сесије.",
        ],
        outro:
          "Осетљиви подаци у смислу члана 9 GDPR-а не прикупљају се без изричитог пристанка.",
      },

      section3: {
        title: "3. Сврхе обраде",
        intro: "Лични подаци се прикупљају за следеће сврхе:",
        list: [
          "пружање и управљање услугама које нуди Yoga App,",
          "персонализација корисничког искуства,",
          "континуирано побољшање апликације,",
          "безбедност, превенција превара и злоупотреба,",
          "комуникација са корисником у вези са услугом.",
        ],
      },

      section4: {
        title: "4. Правни основ обраде",
        intro: "Обраде података се заснивају на:",
        list: [
          "извршавању уговора између корисника и Yoga App,",
          "изричитом пристанку корисника,",
          "легитимном интересу Yoga App за обезбеђивање сигурности и побољшање услуге,",
          "поштовању законских обавеза.",
        ],
      },

      section5: {
        title: "5. Примаоци података",
        content:
          "Лични подаци су намењени искључиво за Yoga App. Они се могу преносити техничким провајдерима који делују као обрађивачи, у складу са чланом 28 GDPR-а, и само за потребе услуге.",
      },

      section6: {
        title: "6. Трансфер података ван Европске уније",
        content:
          "Не врши се трансфер личних података ван Европске уније. У супротном, Yoga App се обавезује да ће успоставити одговарајуће гаранције у складу са GDPR-ом.",
      },

      section7: {
        title: "7. Период чувања",
        content:
          "Лични подаци се чувају у периоду строго неопходном за сврхе за које су прикупљени, осим законских обавеза које налажу дужи период чувања.",
      },

      section8: {
        title: "8. Безбедност података",
        content:
          "Yoga App примењује одговарајуће техничке и организационе мере да гарантује ниво безбедности прилагођен ризику, посебно против неовлашћеног приступа, губитка, промене или откривања података.",
      },

      section9: {
        title: "9. Права корисника",
        intro: "У складу са GDPR-ом, корисник има следећа права:",
        list: [
          "право приступа (члан 15),",
          "право на исправку (члан 16),",
          "право на брисање (члан 17),",
          "право на ограничење обраде (члан 18),",
          "право на приговор (члан 21),",
          "право на преносивост података (члан 20).",
        ],
        outro:
          "Ова права се могу остварити у било ком тренутку контактирањем Yoga App.",
      },

      section10: {
        title: "10. Жалба",
        content:
          "Корисник има право да поднесе жалбу надлежном регулаторном органу, посебно CNIL (Француска).",
      },

      section11: {
        title: "11. Колачићи",
        content:
          "Yoga App користи колачиће и сличне технологије како би обезбедио правилно функционисање сајта и анализирао посећеност. Корисник може управљати или одбити колачиће путем подешавања свог претраживача.",
      },

      section12: {
        title: "12. Измена политике",
        content:
          "Yoga App задржава право да у било ком тренутку измени ову Политику приватности. Важећа верзија је она објављена на сајту на дан консултације.",
      },
    },

    home: {
      hero: {
        title:
          "AI personalizovane yoga sesije prema vašem nivou, vremenu i energiji",
        subtitle: "Pronađite mir i blagostanje kroz vođene joga sesije",
        daily: "Današnja sesija",
        breathing: "Brzo disanje",
        gentle: "Nežno istezanje",
      },
      auth: {
        login: "Prijavite se",
        register: "Napravite nalog",
        demo: "Besplatna proba",
        dashboard: "Moj prostor",
        logout: "Odjavite se",
      },
      features: {
        title: "Joga prilagođena vama",
        understand: {
          title: "Razumeti",
          desc: "Teorija, namere i disanje objašnjeni jednostavno",
        },
        practice: {
          title: "Vežbati",
          desc: "Vođene sesije prilagođene vašem nivou i vremenu",
        },
        progress: {
          title: "Napredovati",
          desc: "Pratite svoju redovnost i proslavite svoje trenutke",
        },
        feel: {
          title: "Osetiti",
          desc: "Mir, samopouzdanje i blagostanje na dohvat ruke",
        },
      },
      sessions: {
        title: "Popularne sesije",
        viewAll: "Pogledajte sve sesije",
      },
      cta: {
        title: "Započnite svoje putovanje danas",
        description:
          "Pridružite se hiljadama ljudi koji su pronašli svoju ravnotežu",
        button: "Napravite besplatan nalog",
      },
      aiCoach: {
        kicker: "Vaš lični AI trener",
        title: "Vaš AI trener vas prati svakog dana",
        subtitle:
          "Dobijajte personalizovane preporuke za jogu prema vašem nivou, ciljevima, raspoloživom vremenu i trenutnoj energiji.",
        cards: {
          analysis: {
            title: "Analiza vašeg nivoa",
            desc: "Veštačka inteligencija procenjuje vaše iskustvo, fizičku spremu i preferencije kako bi vam predložila odgovarajuće sesije već od prvog dana.",
          },
          recommendations: {
            title: "Personalizovane preporuke",
            desc: "Svakog dana dobijajte sesije odabrane posebno za vas kako biste brže napredovali i ostali motivisani.",
          },
          tracking: {
            title: "Pametno praćenje",
            desc: "Pratite svoj napredak, navike vežbanja i rezultate kroz jasan i intuitivan kontrolni panel.",
          },
          adaptation: {
            title: "Automatsko prilagođavanje",
            desc: "Vaš program se automatski prilagođava vašem napretku, raspoloživom vremenu i ciljevima blagostanja.",
          },
        },
        highlights: {
          aria: "Prednosti AI",
          title: "Šta AI menja za vas",
          item1: "Više personalizacije",
          item2: "Brži napredak",
          item3: "Jača motivacija",
          item4: "Jedinstveno iskustvo uz AI",
        },
        cta: "Otkrij moj personalizovani program",
      },
      newsletter: {
        title: "Ostanite informisani",
        description: "Primajte naše savete za jogu i nove sesije svake nedelje",
        placeholder: "Vaš email",
        subscribe: "Prijavite se",
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // FOOTER - Преводи
    // ═══════════════════════════════════════════════════════════════════
    footer: {
      brand: {
        title: "Yoga App",
        tagline: "Vaš dnevni partner za vežbanje",
      },
      explore: {
        title: "Istražite",
        sessions: "Sesije",
        breathing: "Disanje",
        learning: "Učite",
      },
      account: {
        title: "Nalog",
        login: "Prijavite se",
        register: "Registrujte se",
        dashboard: "Moj prostor",
      },
      legal: {
        title: "Pravni",
        privacy: "Politika privatnosti",
        terms: "Uslovi korišćenja",
        contact: "Kontakt",
      },
      copyright: "© 2026 Yoga App. Sva prava zadržana.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRADUCTIONS ANGLAISES
  // ═══════════════════════════════════════════════════════════════════
  en: {
    common: {
      backHome: "Back to home",
      aria: {
        language: "Change language",
        theme: "Toggle theme",
      },
    },

    privacy: {
      title: "Privacy Policy – Yoga App",
      lastUpdate: "Last updated: January 27, 2026",

      intro:
        "This Privacy Policy aims to inform users of the Yoga App application and website about the methods of collection, processing, and protection of their personal data, in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of April 27, 2016 (GDPR) and applicable French legislation.",

      section1: {
        title: "1. Data Controller",
        content:
          "The data controller is Yoga App, publisher of the application and website. Any questions regarding personal data may be addressed through the contact information provided on the site.",
      },

      section2: {
        title: "2. Personal Data Collected",
        intro: "Yoga App may collect the following categories of data:",
        list: [
          "identification data (name, first name, email address),",
          "connection and usage data (IP address, browser type, logs),",
          "user preferences related to yoga and breathing sessions.",
        ],
        outro:
          "No sensitive data within the meaning of Article 9 of the GDPR is collected without explicit consent.",
      },

      section3: {
        title: "3. Purpose of Processing",
        intro: "Personal data is collected for the following purposes:",
        list: [
          "provision and management of services offered by Yoga App,",
          "personalization of the user experience,",
          "continuous improvement of the application,",
          "security, fraud and abuse prevention,",
          "communication with the user regarding the service.",
        ],
      },

      section4: {
        title: "4. Legal Basis for Processing",
        intro: "The processing operations are based on:",
        list: [
          "performance of the contract between the user and Yoga App,",
          "explicit consent of the user,",
          "legitimate interest of Yoga App in ensuring security and service improvement,",
          "compliance with legal obligations.",
        ],
      },

      section5: {
        title: "5. Data Recipients",
        content:
          "Personal data is intended exclusively for Yoga App. It may be transmitted to technical service providers acting as processors, in accordance with Article 28 of the GDPR, and only for service purposes.",
      },

      section6: {
        title: "6. Transfer of Data Outside the European Union",
        content:
          "No transfer of personal data outside the European Union is carried out. Otherwise, Yoga App undertakes to implement appropriate safeguards in accordance with the GDPR.",
      },

      section7: {
        title: "7. Retention Period",
        content:
          "Personal data is retained for a period strictly necessary for the purposes for which it was collected, unless legal obligations require a longer retention period.",
      },

      section8: {
        title: "8. Data Security",
        content:
          "Yoga App implements appropriate technical and organizational measures to ensure a level of security adapted to the risk, particularly against unauthorized access, loss, alteration or disclosure of data.",
      },

      section9: {
        title: "9. User Rights",
        intro: "In accordance with the GDPR, users have the following rights:",
        list: [
          "right of access (Article 15),",
          "right of rectification (Article 16),",
          "right to erasure (Article 17),",
          "right to restriction of processing (Article 18),",
          "right to object (Article 21),",
          "right to data portability (Article 20).",
        ],
        outro:
          "These rights may be exercised at any time by contacting Yoga App.",
      },

      section10: {
        title: "10. Complaint",
        content:
          "Users have the right to lodge a complaint with the competent supervisory authority, in particular CNIL (France).",
      },

      section11: {
        title: "11. Cookies",
        content:
          "Yoga App uses cookies and similar technologies to ensure the proper functioning of the site and to analyze traffic. Users can manage or refuse cookies through their browser settings.",
      },

      section12: {
        title: "12. Policy Amendment",
        content:
          "Yoga App reserves the right to modify this Privacy Policy at any time. The current version is the one published on the site at the date of consultation.",
      },
    },

    home: {
      hero: {
        title:
          "AI-personalized yoga sessions based on your level, time, and energy",
        subtitle: "Find calm and well-being through guided yoga sessions",
        daily: "Daily Session",
        breathing: "Quick Breathing",
        gentle: "Gentle Stretch",
      },
      auth: {
        login: "Log In",
        register: "Create Account",
        demo: "Free Trial",
        dashboard: "My Space",
        logout: "Log Out",
      },
      features: {
        title: "Yoga Made for You",
        understand: {
          title: "Understand",
          desc: "Theory, intentions and breathing explained simply",
        },
        practice: {
          title: "Practice",
          desc: "Guided sessions adapted to your level and time",
        },
        progress: {
          title: "Progress",
          desc: "Track your consistency and celebrate your moments",
        },
        feel: {
          title: "Feel",
          desc: "Calm, confidence and well-being at your fingertips",
        },
      },
      sessions: {
        title: "Popular Sessions",
        viewAll: "View All Sessions",
      },
      cta: {
        title: "Start Your Journey Today",
        description: "Join thousands who have found their balance",
        button: "Create My Free Account",
      },
      aiCoach: {
        kicker: "Your Personal AI Coach",
        title: "Your AI coach supports you every day",
        subtitle:
          "Receive personalized yoga recommendations based on your level, your goals, your available time, and your current energy.",
        cards: {
          analysis: {
            title: "Level analysis",
            desc: "Artificial intelligence evaluates your experience, your physical condition, and your preferences to suggest suitable sessions from day one.",
          },
          recommendations: {
            title: "Personalized recommendations",
            desc: "Receive sessions selected especially for you every day so you can progress faster and stay motivated.",
          },
          tracking: {
            title: "Smart tracking",
            desc: "Visualize your progress, your practice habits, and your performance with a clear and intuitive dashboard.",
          },
          adaptation: {
            title: "Automatic adaptation",
            desc: "Your program evolves automatically according to your progress, your availability, and your wellness goals.",
          },
        },
        highlights: {
          aria: "AI benefits",
          title: "What AI changes for you",
          item1: "More personalization",
          item2: "Faster progress",
          item3: "Stronger motivation",
          item4: "A unique AI-powered experience",
        },
        cta: "Discover my personalized program",
      },
      newsletter: {
        title: "Stay Informed",
        description: "Receive our yoga tips and new sessions every week",
        placeholder: "Your email",
        subscribe: "Subscribe",
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // FOOTER - Translations
    // ═══════════════════════════════════════════════════════════════════
    footer: {
      brand: {
        title: "Yoga App",
        tagline: "Your daily practice companion",
      },
      explore: {
        title: "Explore",
        sessions: "Sessions",
        breathing: "Breathing",
        learning: "Learn",
      },
      account: {
        title: "Account",
        login: "Login",
        register: "Sign Up",
        dashboard: "My Space",
      },
      legal: {
        title: "Legal",
        privacy: "Privacy",
        terms: "Terms of Service",
        contact: "Contact",
      },
      copyright: "© 2026 Yoga App. All rights reserved.",
    },
  },
};

// Rendre disponible globalement
if (typeof window !== "undefined") {
  window.SITE_TRANSLATIONS = SITE_TRANSLATIONS;
}
