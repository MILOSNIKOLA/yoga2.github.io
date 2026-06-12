(function () {
  const PROOF_SECTION_HTML = `
    <section class="proof-section" aria-label="Preuves et statistiques">
      <div class="proof-grid">
        <div class="proof-card">
          <span class="proof-number" data-target="50" data-suffix="+">0</span>
          <h3>Séances guidées</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="3">0</span>
          <h3>Niveaux de pratique</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="100" data-suffix="%">0</span>
          <h3>À votre rythme</h3>
        </div>

        <div class="proof-card">
          <span class="proof-number" data-target="24" data-prefix="24h/">0</span>
          <h3>Accessible partout</h3>
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

  function initProofSection() {
    const proofSection = injectProofSection();
    revealProofSection(proofSection);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProofSection, {
      once: true,
    });
  } else {
    initProofSection();
  }
})();
