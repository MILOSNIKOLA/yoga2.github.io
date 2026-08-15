(function () {
  const PAYLOAD_STORAGE_KEY = "selectedYogaBenefitsPayload";

  const titleElement = document.getElementById("details-title");
  const subtitleElement = document.getElementById("details-subtitle");
  const benefitsContainer = document.getElementById("details-benefits");
  if (!titleElement || !subtitleElement || !benefitsContainer) return;

  const topics = {
    "what-is-yoga": {
      title: "Qu'est-ce que le yoga ?",
      subtitle:
        "Une vue d'ensemble claire pour comprendre la pratique et son rôle dans le site.",
      sections: [
        {
          title: "Une pratique globale",
          paragraphs: [
            "Le yoga relie respiration, mouvement et attention pour créer une pratique simple à comprendre et utile au quotidien.",
            "Sur ce site, cette logique se traduit par des contenus lisibles et des pages conçues pour guider l'utilisateur sans le perdre.",
          ],
        },
        {
          title: "Le rôle du menu",
          paragraphs: [
            "Chaque lien du menu doit ouvrir une page qui raconte un thème précis, avec un contenu réellement utile.",
            "Cette page sert de support éditorial pour transformer le clic en lecture claire et cohérente.",
          ],
        },
        {
          title: "Une lecture fluide",
          paragraphs: [
            "Les blocs restent courts, les titres sont nets et le texte conserve une bonne lisibilité sur desktop comme sur mobile.",
            "Le résultat ressemble davantage à une vraie page de contenu qu'à un simple écran vide.",
          ],
        },
      ],
    },
    "begin-yoga": {
      title: "Débuter le yoga",
      subtitle:
        "Un guide pratique pour commencer sans pression et construire une routine simple.",
      sections: [
        {
          title: "Commencer simplement",
          paragraphs: [
            "Quand on débute, l'essentiel est de commencer sans pression et de laisser la pratique s'installer progressivement.",
            "Une séance courte, une respiration calme et des postures simples suffisent pour entrer dans le rythme.",
          ],
        },
        {
          title: "Construire un rythme",
          paragraphs: [
            "Le plus efficace est de choisir un créneau simple à tenir et de le répéter régulièrement.",
            "La constance compte plus que l'intensité, surtout au début.",
          ],
        },
        {
          title: "Suivre les ressources",
          paragraphs: [
            "Le menu aide à trouver le bon point d'entrée: découverte, séances, progression ou relaxation.",
            "Chaque clic devient une étape claire dans le chemin d'apprentissage.",
          ],
        },
      ],
    },
    "history-origins": {
      title: "Histoire et origines",
      subtitle:
        "Une présentation simple pour replacer le yoga dans une histoire longue et vivante.",
      sections: [
        {
          title: "Des racines anciennes",
          paragraphs: [
            "Le yoga vient d'une tradition ancienne où la respiration, le corps et l'attention occupaient déjà une place centrale.",
            "Cette histoire donne du sens à la pratique contemporaine et enrichit la lecture du site.",
          ],
        },
        {
          title: "Une évolution continue",
          paragraphs: [
            "Au fil des siècles, le yoga s'est adapté aux contextes culturels successifs sans perdre son intention profonde.",
            "Cette évolution montre une pratique vivante, capable de se renouveler.",
          ],
        },
        {
          title: "Du patrimoine au quotidien",
          paragraphs: [
            "Aujourd'hui, beaucoup de personnes découvrent le yoga via des séances accessibles, des cours en ligne ou des supports modernes.",
            "Le site relie cette histoire à un usage concret et actuel.",
          ],
        },
      ],
    },
    "main-principles": {
      title: "Les grands principes",
      subtitle:
        "Les repères essentiels qui structurent la pratique et la navigation du site.",
      sections: [
        {
          title: "Respiration et présence",
          paragraphs: [
            "Le yoga repose sur quelques principes simples: respirer avec conscience, rester stable et conserver une attention présente.",
            "Ces repères donnent un fil conducteur à la pratique et au site.",
          ],
        },
        {
          title: "Un cadre cohérent",
          paragraphs: [
            "Une pratique cohérente suit un ordre logique: préparer, explorer, observer puis récupérer.",
            "La page traduit cette logique avec une structure claire et lisible.",
          ],
        },
        {
          title: "L'écoute du ressenti",
          paragraphs: [
            "Le ressenti permet de savoir si une posture convient, si la respiration reste fluide et si le rythme est adapté.",
            "Cette écoute rend la pratique plus durable et plus juste.",
          ],
        },
      ],
    },
    "beginner-faq": {
      title: "FAQ débutants",
      subtitle:
        "Les réponses les plus utiles pour lever les doutes avant de commencer.",
      faq: [
        {
          q: "Une question: Faut-il être souple pour commencer ?",
          a: "Non. Le yoga aide justement à développer la souplesse progressivement, sans niveau minimum requis.",
        },
        {
          q: "Une question: Combien de temps faut-il pratiquer ?",
          a: "Quelques minutes régulières suffisent pour démarrer. La constance compte plus que la durée.",
        },
        {
          q: "Une question: Quel matériel est nécessaire ?",
          a: "Un tapis suffit pour commencer. Le reste dépend surtout de ton confort et de ta pratique.",
        },
        {
          q: "Une question: Peut-on pratiquer à la maison ?",
          a: "Oui. Le site peut t'aider à suivre une routine simple à la maison avec des repères clairs.",
        },
        {
          q: "Une question: Le yoga sert-il à se détendre ?",
          a: "Oui. La respiration et les postures douces sont pensées pour réduire la tension et recentrer l'attention.",
        },
        {
          q: "Une question: Doit-on faire du sport avant ?",
          a: "Non. Le yoga peut être débuté sans préparation sportive particulière et s'adapte à chacun.",
        },
        {
          q: "Une question: Pourquoi les séances sont-elles courtes ?",
          a: "Des séances courtes permettent d'installer une habitude plus facilement et de rester régulier.",
        },
        {
          q: "Une question: Comment choisir une séance ?",
          a: "Choisis selon ton niveau, ton énergie du jour et l'objectif recherché: apprentissage, détente ou progression.",
        },
        {
          q: "Une question: Le site propose-t-il des parcours ?",
          a: "Oui. Le menu oriente vers la découverte, les séances, la progression et la relaxation.",
        },
        {
          q: "Une question: Peut-on progresser vite ?",
          a: "On progresse surtout par répétition. Le rythme régulier est plus efficace qu'une pratique intense mais rare.",
        },
        {
          q: "Une question: Faut-il suivre les instructions à la lettre ?",
          a: "Non. Les repères sont là pour guider, mais il faut toujours adapter la pratique à ses sensations.",
        },
        {
          q: "Une question: Le yoga aide-t-il la posture ?",
          a: "Oui. Il favorise la conscience corporelle, la stabilité et l'alignement dans les gestes du quotidien.",
        },
        {
          q: "Une question: Peut-on pratiquer si on est fatigué ?",
          a: "Oui, mais avec douceur. Une séance calme ou une respiration simple peut suffire ce jour-là.",
        },
        {
          q: "Une question: Quel est le bon rythme hebdomadaire ?",
          a: "Le bon rythme est celui que tu peux garder. Deux à quatre séances courtes constituent déjà une base solide.",
        },
        {
          q: "Une question: Les débutants doivent-ils éviter certaines postures ?",
          a: "Oui, si une posture semble trop intense. Le site doit encourager une progression prudente et adaptée.",
        },
        {
          q: "Une question: Peut-on pratiquer sans professeur ?",
          a: "Oui, pour des bases simples. Mais des cours ou des guides fiables aident à sécuriser la progression.",
        },
        {
          q: "Une question: Pourquoi le site insiste sur la régularité ?",
          a: "Parce que la régularité construit les automatismes, la confiance et les bénéfices sur le long terme.",
        },
        {
          q: "Une question: Le yoga remplace-t-il le sport ?",
          a: "Non. Il complète souvent une hygiène de vie, mais il ne remplace pas tous les besoins physiques.",
        },
        {
          q: "Une question: Faut-il respirer d'une manière précise ?",
          a: "Au début, il suffit de respirer calmement et naturellement, en suivant le rythme indiqué par la séance.",
        },
        {
          q: "Une question: Le menu du site sert-il vraiment à progresser ?",
          a: "Oui. Il organise les thèmes pour passer de la découverte à la pratique de façon cohérente.",
        },
        {
          q: "Une question: Les contenus sont-ils adaptés aux mobiles ?",
          a: "Oui, les blocs sont pensés pour rester lisibles et confortables sur écran mobile.",
        },
        {
          q: "Une question: Peut-on revenir en arrière pendant la pratique ?",
          a: "Bien sûr. La progression n'est jamais linéaire, et il faut pouvoir ralentir quand c'est nécessaire.",
        },
        {
          q: "Une question: Le site donne-t-il des repères simples ?",
          a: "Oui. Chaque page essaie de garder un ton clair, direct et utile pour éviter de noyer le visiteur.",
        },
        {
          q: "Une question: Le yoga est-il accessible à tous ?",
          a: "Oui, avec adaptations. C'est justement pour cela que les pages expliquent les bases sans jargon.",
        },
        {
          q: "Une question: Que faire si une posture gêne ?",
          a: "Arrêter, ajuster ou remplacer la posture. Le confort et la sécurité passent avant tout.",
        },
        {
          q: "Une question: L'objectif est-il la performance ?",
          a: "Non. L'objectif est la compréhension, la stabilité et le bien-être dans la pratique.",
        },
        {
          q: "Une question: Pourquoi y a-t-il plusieurs pages de menu ?",
          a: "Pour guider le visiteur vers des thèmes précis et éviter une navigation confuse ou trop large.",
        },
        {
          q: "Une question: Peut-on pratiquer le soir ?",
          a: "Oui, surtout si tu veux finir la journée avec une séance douce et apaisante.",
        },
        {
          q: "Une question: Comment savoir si on progresse ?",
          a: "Quand les postures deviennent plus confortables, que la respiration est plus stable et que la pratique devient plus régulière.",
        },
        {
          q: "Une question: Que dois-je lire en premier sur le site ?",
          a: "Commence par la découverte, puis passe à débuter le yoga avant d'explorer les autres rubriques.",
        },
      ],
    },
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function render(payload) {
    titleElement.textContent = payload.title;
    subtitleElement.textContent = payload.subtitle;
    benefitsContainer.innerHTML = payload.sections
      .map((section, index) => {
        const paragraphs = section.paragraphs
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("\n");
        return `<article class="benefit-item" style="animation-delay:${index * 0.12}s"><h3>${escapeHtml(section.title)}</h3>${paragraphs}</article>`;
      })
      .join("\n");
  }

  function renderFaq(payload) {
    titleElement.textContent = payload.title;
    subtitleElement.textContent = payload.subtitle;
    benefitsContainer.innerHTML = payload.faq
      .map(
        (item, index) => `
          <article class="faq-item" style="animation-delay:${index * 0.08}s">
            <button class="faq-question" type="button" data-faq-question="${index}">
              <span class="faq-question-label">${escapeHtml(item.q)}</span>
              <span class="faq-question-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${index}" hidden>
              <p>${escapeHtml(item.a)}</p>
            </div>
          </article>
        `,
      )
      .join("\n");

    const cards = Array.from(benefitsContainer.querySelectorAll(".faq-item"));
    cards.forEach((card, index) => {
      const button = card.querySelector(".faq-question");
      const answer = card.querySelector(".faq-answer");
      const icon = card.querySelector(".faq-question-icon");
      let timer = null;

      button?.addEventListener("click", () => {
        const isOpen = card.classList.contains("is-open");
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("is-open");
            otherCard.querySelector(".faq-answer")?.setAttribute("hidden", "");
            otherCard.querySelector(".faq-question-icon").textContent = "+";
          }
        });

        if (!isOpen) {
          card.classList.add("is-open");
          answer?.removeAttribute("hidden");
          if (icon) icon.textContent = "−";
          clearTimeout(timer);
          timer = window.setTimeout(() => {
            answer?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 3000);
        } else {
          card.classList.remove("is-open");
          answer?.setAttribute("hidden", "");
          if (icon) icon.textContent = "+";
          clearTimeout(timer);
        }
      });
    });
  }

  function readSessionPayload() {
    try {
      const raw = sessionStorage.getItem(PAYLOAD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  const sessionPayload = readSessionPayload();
  const topic = new URLSearchParams(window.location.search).get("topic");

  function getTopicPayload() {
    return window.i18n?.getTranslationData(`topicDetails.${topic}`) || null;
  }

  function renderCurrentTopic() {
    const payload = getTopicPayload();
    if (!payload) return false;

    if (topic === "beginner-faq") {
      renderFaq(payload);
    } else {
      render(payload);
    }
    return true;
  }

  if (sessionPayload?.articlesHtml?.length) {
    titleElement.textContent =
      typeof sessionPayload.titleText === "string" &&
      sessionPayload.titleText.trim()
        ? sessionPayload.titleText.trim()
        : "Articles de yoga";
    subtitleElement.textContent =
      "Contenu détaillé généré depuis la section sélectionnée.";
    benefitsContainer.innerHTML = sessionPayload.articlesHtml.join("\n");
    return;
  }

  if (topic && topics[topic]) {
    const renderWhenI18nIsReady = () => {
      if (!renderCurrentTopic()) {
        render(topic === "beginner-faq" ? topics[topic] : topics[topic]);
      }
    };

    if (window.i18n?.initialized) {
      renderWhenI18nIsReady();
    } else {
      document.addEventListener("i18nReady", renderWhenI18nIsReady, {
        once: true,
      });
    }

    document.addEventListener("languageChanged", renderCurrentTopic);
    return;
  }

  titleElement.textContent = "Articles de yoga";
  subtitleElement.textContent =
    "Cliquez sur un lien du menu principal pour afficher une page détaillée.";
  benefitsContainer.innerHTML =
    '<article class="benefit-item"><h3>Aucun article à afficher</h3><p>Utilisez les liens du menu pour charger un contenu lié au thème cliqué.</p></article>';
})();
