(function () {
  const PROOF_SECTION_HTML = `
    <section class="proof-section" aria-label="Preuves et statistiques">
      <div class="proof-grid">
        <div class="proof-card">
          <span class="proof-number" data-target="50" data-suffix="+">0</span>
          <h3 data-i18n="proofCards.guided">Séances guidées</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="3">0</span>
          <h3 data-i18n="proofCards.levels">Niveaux de pratique</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="100" data-suffix="%">0</span>
          <h3 data-i18n="proofCards.pace">À votre rythme</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="24" data-prefix="24h/">0</span>
          <h3 data-i18n="proofCards.anywhere">Accessible partout</h3>
        </div>
      </div>
    </section>
  `;

  const JOURNEY_SECTION_HTML = `
    <section class="journey-section" aria-label="Parcours utilisateur">
      <div class="journey-shell">
        <div class="journey-heading">
          <span class="journey-kicker" data-i18n="journey.kicker">Parcours utilisateur</span>
          <h2 data-i18n="journey.heading">Comment Yoga App AI fonctionne</h2>
          <p data-i18n="journey.description">Un parcours simple et guidé pour comprendre immédiatement comment découvrir, suivre et faire évoluer votre pratique.</p>
        </div>

        <div class="journey-steps" role="list">
          <article class="journey-step" role="listitem" data-step="1">
            <span class="journey-step-index">1</span>
            <div class="journey-step-content">
              <h3 data-i18n="journey.step1.title">Choisissez un programme</h3>
              <p data-i18n="journey.step1.desc">Débutant, intermédiaire ou avancé selon votre niveau du moment.</p>
            </div>
          </article>

          <div class="journey-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v12"></path>
              <path d="M7 13l5 5 5-5"></path>
            </svg>
          </div>

          <article class="journey-step" role="listitem" data-step="2">
            <span class="journey-step-index">2</span>
            <div class="journey-step-content">
              <h3 data-i18n="journey.step2.title">Suivez vos séances</h3>
              <p data-i18n="journey.step2.desc">Chaque séance est guidée pour vous aider à rester concentré.</p>
            </div>
          </article>

          <div class="journey-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v12"></path>
              <path d="M7 13l5 5 5-5"></path>
            </svg>
          </div>

          <article class="journey-step" role="listitem" data-step="3">
            <span class="journey-step-index">3</span>
            <div class="journey-step-content">
              <h3 data-i18n="journey.step3.title">Progressez à votre rythme</h3>
              <p data-i18n="journey.step3.desc">La plateforme s'adapte à votre énergie et à votre régularité.</p>
            </div>
          </article>

          <div class="journey-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v12"></path>
              <path d="M7 13l5 5 5-5"></path>
            </svg>
          </div>

          <article class="journey-step" role="listitem" data-step="4">
            <span class="journey-step-index">4</span>
            <div class="journey-step-content">
              <h3 data-i18n="journey.step4.title">Retrouvez votre équilibre</h3>
              <p data-i18n="journey.step4.desc">Installez une routine claire, durable et rassurante au quotidien.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;

  function formatCounterValue(prefix, value, suffix) {
    return `${prefix || ""}${value}${suffix || ""}`;
  }

  function animateCounter(element, options) {
    const target = Number(options.target) || 0;
    const prefix = options.prefix || "";
    const suffix = options.suffix || "";
    const duration = Number(options.duration) || 1400;
    const startTime = performance.now();

    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(target * easedProgress);

      element.textContent = formatCounterValue(prefix, currentValue, suffix);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = formatCounterValue(prefix, target, suffix);
      }
    };

    requestAnimationFrame(tick);
  }

  function injectProofSection() {
    if (document.querySelector(".proof-section")) {
      return document.querySelector(".proof-section");
    }

    const featuresSection = document.querySelector(".features");
    const heroSection = document.querySelector(".hero");

    if (!featuresSection && !heroSection) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = PROOF_SECTION_HTML.trim();

    const proofSection = wrapper.firstElementChild;
    const proofCards = proofSection.querySelectorAll(".proof-card");

    proofCards.forEach((card, index) => {
      card.style.setProperty("--proof-index", index);
      card.style.transitionDelay = `${index * 120}ms`;
    });

    if (featuresSection?.parentNode) {
      featuresSection.parentNode.insertBefore(proofSection, featuresSection);
    } else if (heroSection?.parentNode) {
      heroSection.insertAdjacentElement("afterend", proofSection);
    } else {
      document.body.appendChild(proofSection);
    }

    return proofSection;
  }

  function injectJourneySection(proofSection) {
    if (document.querySelector(".journey-section")) {
      return document.querySelector(".journey-section");
    }

    if (!proofSection) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = JOURNEY_SECTION_HTML.trim();

    const journeySection = wrapper.firstElementChild;

    proofSection.insertAdjacentElement("afterend", journeySection);

    const steps = journeySection.querySelectorAll(".journey-step");
    const arrows = journeySection.querySelectorAll(".journey-arrow");

    steps.forEach((step, index) => {
      step.style.transitionDelay = `${index * 140}ms`;
    });

    arrows.forEach((arrow, index) => {
      arrow.style.transitionDelay = `${index * 140 + 80}ms`;
    });

    return journeySection;
  }

  function revealProofSection(section) {
    if (!section) {
      return;
    }

    const proofCards = Array.from(section.querySelectorAll(".proof-card"));
    const proofNumbers = Array.from(section.querySelectorAll(".proof-number"));
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finalizeCards = () => {
      proofCards.forEach((card) => {
        card.style.transitionDelay = "0ms";
      });
    };

    const renderFinalValues = () => {
      proofNumbers.forEach((number) => {
        const target = Number(number.dataset.target) || 0;
        const prefix = number.dataset.prefix || "";
        const suffix = number.dataset.suffix || "";
        number.textContent = formatCounterValue(prefix, target, suffix);
      });
    };

    const triggerReveal = () => {
      section.classList.add("is-visible");

      proofNumbers.forEach((number, index) => {
        window.setTimeout(() => {
          animateCounter(number, {
            target: number.dataset.target,
            prefix: number.dataset.prefix,
            suffix: number.dataset.suffix,
          });
        }, index * 120);
      });

      window.setTimeout(finalizeCards, 900);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      renderFinalValues();
      finalizeCards();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          triggerReveal();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(section);
  }

  function revealJourneySection(section) {
    if (!section) {
      return;
    }

    const journeySteps = Array.from(section.querySelectorAll(".journey-step"));
    const journeyArrows = Array.from(
      section.querySelectorAll(".journey-arrow"),
    );
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finalizeState = () => {
      journeySteps.forEach((step) => {
        step.style.transitionDelay = "0ms";
      });
      journeyArrows.forEach((arrow) => {
        arrow.style.transitionDelay = "0ms";
      });
    };

    const triggerReveal = () => {
      section.classList.add("is-visible");
      window.setTimeout(finalizeState, 900);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      finalizeState();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          triggerReveal();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);
  }

  function initProofSection() {
    const proofSection = injectProofSection();
    const journeySection = injectJourneySection(proofSection);
    revealProofSection(proofSection);
    revealJourneySection(journeySection);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProofSection, {
      once: true,
    });
  } else {
    initProofSection();
  }
})();
