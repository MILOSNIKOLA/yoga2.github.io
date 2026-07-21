(() => {
  const KEYWORDS_BY_LANGUAGE = {
    fr: [
      "Équilibre",
      "Respiration",
      "Conscience",
      "Souplesse",
      "Concentration",
      "Confiance",
    ],
    en: [
      "Balance",
      "Breathing",
      "Breath",
      "Consciousness",
      "Mindfulness",
      "Awareness",
      "Flexibility",
      "Concentration",
      "Trust",
      "Confidence",
    ],
    sr: [
      "Ravnoteža",
      "Disanje",
      "Dah",
      "Svesnost",
      "Svest",
      "Fleksibilnost",
      "Koncentracija",
      "Poverenje",
    ],
  };

  const FALLBACK_COPY = {
    quote:
      "« Le véritable équilibre ne consiste pas à rester immobile, mais à avancer avec stabilité. »",
    coachBadge: "Coach IA",
    coachTitle: "💡 Conseil du Coach IA",
    coachDescription:
      "Le Coach IA vous recommande aujourd'hui un exercice adapté au thème de cette page. Aujourd'hui, prenez quelques minutes pour pratiquer la posture de l'Arbre afin d'améliorer votre équilibre, votre concentration et votre stabilité.",
    coachButton: "Commencer cette séance",
    navLabel: "Navigation des fondements",
    previousEyebrow: "Fondement précédent",
    nextEyebrow: "Fondement suivant",
    previousAria: "Fondement précédent : Respiration",
    nextAria: "Fondement suivant : Conscience",
    progressLabel: "Lecture",
    progressAria: "Progression de lecture",
  };

  const state = {
    revealObserver: null,
    main: null,
    hero: null,
    card: null,
    premiumBlock: null,
    progressRoot: null,
    progressFill: null,
    progressValue: null,
    progressMilestones: [],
    motionRaf: 0,
    parallaxRaf: 0,
    hashSyncRaf: 0,
    hashSynced: false,
    reducedMotion: false,
  };

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getCurrentLanguage() {
    return (
      window.i18n?.getCurrentLanguage?.() ||
      document.documentElement.lang ||
      "fr"
    );
  }

  function translate(key, fallback = "") {
    const value = window.i18n?.getTranslation?.(key);
    return typeof value === "string" && value.length > 0 ? value : fallback;
  }

  function getKeywords(lang = getCurrentLanguage()) {
    return KEYWORDS_BY_LANGUAGE[lang] || KEYWORDS_BY_LANGUAGE.fr;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildKeywordRegex(keywords) {
    const uniqueKeywords = Array.from(new Set(keywords.filter(Boolean))).sort(
      (left, right) => right.length - left.length,
    );
    const group = uniqueKeywords.map(escapeRegExp).join("|");

    try {
      return new RegExp(
        `(?<![\\p{L}\\p{N}])(${group})(?![\\p{L}\\p{N}])`,
        "giu",
      );
    } catch {
      return new RegExp(
        `(^|[^A-Za-zÀ-ÖØ-öø-ÿĐđČčĆćŠšŽž])(${group})(?=$|[^A-Za-zÀ-ÖØ-öø-ÿĐđČčĆćŠšŽž])`,
        "gi",
      );
    }
  }

  function clearKeywordHighlights(scope) {
    scope.querySelectorAll(".foundation-keyword").forEach((node) => {
      node.replaceWith(document.createTextNode(node.textContent || ""));
    });

    scope.normalize();
  }

  function ensureRevealObserver() {
    if (state.revealObserver || !("IntersectionObserver" in window)) return;

    state.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          state.revealObserver?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      },
    );
  }

  function observeReveals(scope) {
    const targets = scope.querySelectorAll("[data-foundation-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    ensureRevealObserver();
    targets.forEach((target) => {
      if (target.dataset.foundationObserved === "true") return;
      target.dataset.foundationObserved = "true";
      state.revealObserver.observe(target);
    });
  }

  function buildHeroLines(text) {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 1) return [text];

    const lineCount = words.length <= 6 ? 2 : 3;
    const chunk = Math.ceil(words.length / lineCount);
    const lines = [];

    for (let index = 0; index < words.length; index += chunk) {
      lines.push(words.slice(index, index + chunk).join(" "));
    }

    return lines.filter(Boolean);
  }

  function splitHeroTitle() {
    const heroTitle = state.hero?.querySelector("h1");
    if (!heroTitle) return;

    const source = (
      heroTitle.textContent ||
      heroTitle.dataset.foundationSource ||
      ""
    ).trim();
    if (!source) return;

    heroTitle.dataset.foundationSource = source;
    heroTitle.textContent = "";

    const fragment = document.createDocumentFragment();
    buildHeroLines(source).forEach((line, index) => {
      const span = document.createElement("span");
      span.className = "foundation-hero-line";
      span.setAttribute("data-foundation-reveal", "");
      span.style.transitionDelay = `${index * 120}ms`;
      span.textContent = line;
      fragment.appendChild(span);
    });

    heroTitle.appendChild(fragment);
    observeReveals(heroTitle);
  }

  function splitCardCopy() {
    const copy = state.card?.querySelector(".foundation-card-copy");
    if (!copy) return;

    const source = (copy.textContent || "").trim();
    if (!source) return;

    if (
      copy.dataset.foundationSource === source &&
      copy.dataset.foundationLinesReady === "true"
    ) {
      return;
    }

    copy.dataset.foundationSource = source;
    copy.dataset.foundationLinesReady = "true";
    copy.textContent = "";

    const lines = source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
      const span = document.createElement("span");
      span.className = "foundation-copy-line";
      span.setAttribute("data-foundation-reveal", "");
      span.style.transitionDelay = `${index * 42}ms`;
      span.textContent = line;
      fragment.appendChild(span);
    });

    copy.appendChild(fragment);
    observeReveals(copy);
  }

  function injectHeroDecor() {
    if (!state.hero || state.hero.querySelector(".foundation-hero-decor"))
      return;

    const decor = document.createElement("div");
    decor.className = "foundation-hero-decor";
    decor.setAttribute("aria-hidden", "true");
    decor.innerHTML = `
      <span class="foundation-hero-orb" style="left:6%; top:18%; width:14px; height:14px; animation-duration:30s; animation-delay:-4s;"></span>
      <span class="foundation-hero-orb" style="left:14%; top:62%; width:10px; height:10px; animation-duration:36s; animation-delay:-16s;"></span>
      <span class="foundation-hero-orb" style="left:33%; top:14%; width:8px; height:8px; animation-duration:34s; animation-delay:-8s;"></span>
      <span class="foundation-hero-orb" style="left:48%; top:40%; width:16px; height:16px; animation-duration:46s; animation-delay:-26s;"></span>
      <span class="foundation-hero-orb" style="left:62%; top:20%; width:12px; height:12px; animation-duration:40s; animation-delay:-20s;"></span>
      <span class="foundation-hero-orb" style="left:79%; top:54%; width:9px; height:9px; animation-duration:38s; animation-delay:-12s;"></span>
      <span class="foundation-hero-orb" style="left:90%; top:28%; width:7px; height:7px; animation-duration:44s; animation-delay:-24s;"></span>
      <span class="foundation-hero-orb" style="left:84%; top:78%; width:6px; height:6px; animation-duration:52s; animation-delay:-18s;"></span>
    `;

    state.hero.appendChild(decor);
  }

  function prepareRevealTargets() {
    if (!state.hero) return;

    const kicker = state.hero.querySelector(".foundations-kicker");
    const intro = state.hero.querySelector(".foundations-hero > p");

    if (kicker && kicker.dataset.foundationReveal !== "true") {
      kicker.dataset.foundationReveal = "true";
      kicker.setAttribute("data-foundation-reveal", "");
      kicker.style.transitionDelay = "80ms";
    }

    if (intro && intro.dataset.foundationReveal !== "true") {
      intro.dataset.foundationReveal = "true";
      intro.setAttribute("data-foundation-reveal", "");
      intro.style.transitionDelay = "160ms";
    }

    if (state.card && state.card.dataset.foundationReveal !== "true") {
      state.card.dataset.foundationReveal = "true";
      state.card.setAttribute("data-foundation-reveal", "");
      state.card.style.transitionDelay = "120ms";
    }

    const note = state.card?.querySelector(".foundation-note");
    if (note && note.dataset.foundationReveal !== "true") {
      note.dataset.foundationReveal = "true";
      note.setAttribute("data-foundation-reveal", "");
      note.style.transitionDelay = "140ms";
    }
  }

  function prepareCardToggle() {
    const toggle = state.card?.querySelector(".foundation-card-copy-toggle");
    if (!toggle || toggle.dataset.foundationToggleReady === "true") return;

    toggle.dataset.foundationToggleReady = "true";

    const setExpanded = (expanded) => {
      state.card?.classList.toggle("is-expanded", expanded);
      toggle.setAttribute("aria-expanded", String(expanded));
    };

    toggle.addEventListener("click", () => {
      setExpanded(!state.card?.classList.contains("is-expanded"));
    });

    toggle.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setExpanded(!state.card?.classList.contains("is-expanded"));
    });
  }

  function localizePremiumBlocks() {
    const wrapper =
      state.premiumBlock ||
      state.main?.querySelector("[data-foundation-premium-block='true']");

    if (!wrapper) return;

    state.premiumBlock = wrapper;

    const quote = wrapper.querySelector(".foundation-quote p");
    if (quote) {
      quote.textContent = translate("foundations.quote", FALLBACK_COPY.quote);
    }

    const coachBadge = wrapper.querySelector(".foundation-coach__badge");
    if (coachBadge) {
      coachBadge.textContent = translate(
        "foundations.coach.badge",
        FALLBACK_COPY.coachBadge,
      );
    }

    const coachTitle = wrapper.querySelector("#foundation-coach-title");
    if (coachTitle) {
      coachTitle.textContent = translate(
        "foundations.coach.title",
        FALLBACK_COPY.coachTitle,
      );
    }

    const coachText = wrapper.querySelector(".foundation-coach p");
    if (coachText) {
      coachText.textContent = translate(
        "foundations.coach.description",
        FALLBACK_COPY.coachDescription,
      );
    }

    const coachButton = wrapper.querySelector(".foundation-coach__btn");
    if (coachButton) {
      coachButton.textContent = translate(
        "foundations.coach.button",
        FALLBACK_COPY.coachButton,
      );
    }

    const nav = wrapper.querySelector(".foundation-bottom-nav");
    if (nav) {
      nav.setAttribute(
        "aria-label",
        translate("foundations.navigation.label", FALLBACK_COPY.navLabel),
      );
    }

    const previousCard = wrapper.querySelector(
      '.foundation-nav-card[href="respirer.html"]',
    );
    if (previousCard) {
      previousCard.setAttribute(
        "aria-label",
        translate(
          "foundations.navigation.previousAria",
          FALLBACK_COPY.previousAria,
        ),
      );

      const eyebrow = previousCard.querySelector(
        ".foundation-nav-card__eyebrow",
      );
      if (eyebrow) {
        eyebrow.textContent = translate(
          "foundations.navigation.previousEyebrow",
          FALLBACK_COPY.previousEyebrow,
        );
      }

      const title = previousCard.querySelector(".foundation-nav-card__title");
      if (title) {
        title.textContent = translate(
          "foundations.pillar2.title",
          "Respiration",
        );
      }

      const desc = previousCard.querySelector(".foundation-nav-card__desc");
      if (desc) {
        desc.textContent = translate(
          "foundations.pillar2.desc",
          "Prana, l'énergie vitale respirée",
        );
      }

      const image = previousCard.querySelector("img");
      if (image) {
        image.alt = translate("foundations.pillar2.title", "Respiration");
      }
    }

    const nextCard = wrapper.querySelector(
      '.foundation-nav-card[href="learning.html"]',
    );
    if (nextCard) {
      nextCard.setAttribute(
        "aria-label",
        translate("foundations.navigation.nextAria", FALLBACK_COPY.nextAria),
      );

      const eyebrow = nextCard.querySelector(".foundation-nav-card__eyebrow");
      if (eyebrow) {
        eyebrow.textContent = translate(
          "foundations.navigation.nextEyebrow",
          FALLBACK_COPY.nextEyebrow,
        );
      }

      const title = nextCard.querySelector(".foundation-nav-card__title");
      if (title) {
        title.textContent = translate(
          "foundations.pillar3.title",
          "Conscience",
        );
      }

      const desc = nextCard.querySelector(".foundation-nav-card__desc");
      if (desc) {
        desc.textContent = translate(
          "foundations.pillar3.desc",
          "Présence et attention à chaque instant",
        );
      }

      const image = nextCard.querySelector("img");
      if (image) {
        image.alt = translate("foundations.pillar3.title", "Conscience");
      }
    }

    if (state.progressRoot) {
      state.progressRoot.setAttribute(
        "aria-label",
        translate(
          "foundations.readingProgress.ariaLabel",
          FALLBACK_COPY.progressAria,
        ),
      );

      const label = state.progressRoot.querySelector(
        ".foundation-reading-progress__label",
      );
      if (label) {
        label.textContent = translate(
          "foundations.readingProgress.label",
          FALLBACK_COPY.progressLabel,
        );
      }
    }
  }

  function createPremiumBlocks() {
    if (
      !state.main ||
      state.main.querySelector("[data-foundation-premium-block='true']")
    )
      return;

    const wrapper = document.createElement("div");
    wrapper.className = "foundation-premium-block";
    wrapper.setAttribute("data-foundation-premium-block", "true");

    wrapper.innerHTML = `
      <blockquote class="foundation-quote" data-foundation-reveal>
        <p data-i18n="foundations.quote"></p>
      </blockquote>

      <section class="foundation-coach" data-foundation-reveal aria-labelledby="foundation-coach-title">
        <div class="foundation-coach__badge" data-i18n="foundations.coach.badge"></div>
        <h2 id="foundation-coach-title" data-i18n="foundations.coach.title"></h2>
        <p data-i18n="foundations.coach.description"></p>
        <div class="foundation-coach__actions">
          <a class="foundation-coach__btn" href="sessions.html?filter=beginner" data-i18n="foundations.coach.button"></a>
        </div>
      </section>

      <section class="foundation-bottom-nav" data-foundation-reveal data-i18n-attr-aria-label="foundations.navigation.label" aria-label="">
        <a class="foundation-nav-card" href="respirer.html" aria-label="" data-foundation-reveal data-i18n-aria-label="foundations.navigation.previousAria">
          <div class="foundation-nav-card__media">
            <img src="img/The major foundations of yoga/2.jpg" alt="" loading="lazy" decoding="async" data-i18n-attr-alt="foundations.pillar2.title" />
          </div>
          <div class="foundation-nav-card__body">
            <span class="foundation-nav-card__eyebrow" data-i18n="foundations.navigation.previousEyebrow"></span>
            <span class="foundation-nav-card__title" data-i18n="foundations.pillar2.title"></span>
            <span class="foundation-nav-card__desc" data-i18n="foundations.pillar2.desc"></span>
          </div>
          <span class="foundation-nav-card__arrow">←</span>
        </a>

        <a class="foundation-nav-card" href="learning.html" aria-label="" data-foundation-reveal data-i18n-aria-label="foundations.navigation.nextAria">
          <div class="foundation-nav-card__media">
            <img src="img/The major foundations of yoga/3.jpg" alt="" loading="lazy" decoding="async" data-i18n-attr-alt="foundations.pillar3.title" />
          </div>
          <div class="foundation-nav-card__body">
            <span class="foundation-nav-card__eyebrow" data-i18n="foundations.navigation.nextEyebrow"></span>
            <span class="foundation-nav-card__title" data-i18n="foundations.pillar3.title"></span>
            <span class="foundation-nav-card__desc" data-i18n="foundations.pillar3.desc"></span>
          </div>
          <span class="foundation-nav-card__arrow">→</span>
        </a>
      </section>
    `;

    state.main.appendChild(wrapper);
    state.premiumBlock = wrapper;
    window.i18n?.applyTranslations?.();

    const quote = wrapper.querySelector(".foundation-quote");
    const coach = wrapper.querySelector(".foundation-coach");
    const nav = wrapper.querySelector(".foundation-bottom-nav");
    const navCards = wrapper.querySelectorAll(".foundation-nav-card");

    if (quote) quote.style.transitionDelay = "180ms";
    if (coach) coach.style.transitionDelay = "240ms";
    if (nav) nav.style.transitionDelay = "300ms";
    navCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 120 + 330}ms`;
    });

    observeReveals(wrapper);
  }

  function createReadingProgress() {
    if (document.querySelector(".foundation-reading-progress")) return;

    const rail = document.createElement("aside");
    rail.className = "foundation-reading-progress";
    rail.setAttribute("role", "progressbar");
    rail.setAttribute("aria-label", "");
    rail.setAttribute(
      "data-i18n-aria-label",
      "foundations.readingProgress.ariaLabel",
    );
    rail.setAttribute("aria-valuemin", "0");
    rail.setAttribute("aria-valuemax", "100");
    rail.setAttribute("aria-valuenow", "0");
    rail.innerHTML = `
      <span class="foundation-reading-progress__label" data-i18n="foundations.readingProgress.label"></span>
      <div class="foundation-reading-progress__rail" aria-hidden="true">
        <div class="foundation-reading-progress__fill"></div>
      </div>
      <div class="foundation-reading-progress__meta">
        <span class="foundation-reading-progress__value">0 %</span>
        <span class="foundation-reading-progress__milestone">23 %</span>
        <span class="foundation-reading-progress__milestone">58 %</span>
        <span class="foundation-reading-progress__milestone">100 %</span>
      </div>
    `;

    document.body.appendChild(rail);
    state.progressRoot = rail;
    state.progressFill = rail.querySelector(
      ".foundation-reading-progress__fill",
    );
    state.progressValue = rail.querySelector(
      ".foundation-reading-progress__value",
    );
    state.progressMilestones = Array.from(
      rail.querySelectorAll(".foundation-reading-progress__milestone"),
    );
    window.i18n?.applyTranslations?.();
  }

  function syncHashTarget() {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    state.hashSynced = true;
    target.scrollIntoView({
      behavior: state.reducedMotion ? "auto" : "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  function scheduleHashTarget() {
    if (state.hashSynced) return;

    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    if (state.hashSyncRaf) {
      window.cancelAnimationFrame(state.hashSyncRaf);
    }

    state.hashSyncRaf = window.requestAnimationFrame(() => {
      state.hashSyncRaf = 0;
      syncHashTarget();
    });
  }

  function updateProgress() {
    if (
      !state.main ||
      !state.progressFill ||
      !state.progressValue ||
      !state.progressRoot
    )
      return;

    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const viewport = window.innerHeight || 1;
    const mainRect = state.main.getBoundingClientRect();
    const mainTop = scrollTop + mainRect.top;
    const mainBottom = scrollTop + mainRect.bottom;
    const start = Math.max(0, mainTop - 140);
    const end = Math.max(start + 1, mainBottom - viewport * 0.42);
    const progress = clamp((scrollTop - start) / (end - start), 0, 1);
    const percentage = Math.round(progress * 100);

    state.progressFill.style.transform = `scaleY(${progress})`;
    state.progressValue.textContent = `${percentage} %`;
    state.progressRoot.setAttribute("aria-valuenow", String(percentage));
    state.progressRoot.setAttribute(
      "aria-valuetext",
      `${translate("foundations.readingProgress.label", FALLBACK_COPY.progressLabel)} ${percentage} %`,
    );

    const thresholds = [23, 58, 100];
    state.progressMilestones.forEach((milestone, index) => {
      milestone.classList.toggle("is-active", percentage >= thresholds[index]);
    });
  }

  function updateParallax() {
    if (!state.card) return;

    const image = state.card.querySelector(".foundation-card-img");
    if (!image) return;

    const rect = state.card.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const centerOffset =
      (rect.top + rect.height * 0.45 - viewport * 0.5) / viewport;
    const shift = clamp(centerOffset * -26, -18, 18);
    const scale = 1.02 + Math.sin((window.scrollY + viewport) / 850) * 0.012;

    image.style.setProperty(
      "--foundation-image-shift",
      `${shift.toFixed(2)}px`,
    );
    image.style.setProperty("--foundation-image-scale", scale.toFixed(4));
  }

  function scheduleMotionUpdate() {
    if (state.reducedMotion) {
      updateProgress();
      updateParallax();
      return;
    }

    if (state.motionRaf) return;

    state.motionRaf = window.requestAnimationFrame(() => {
      state.motionRaf = 0;
      updateProgress();
      updateParallax();
    });
  }

  function startMotionLoop() {
    const update = () => {
      scheduleMotionUpdate();
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    if (state.reducedMotion) {
      update();
      return;
    }

    const loop = () => {
      if (!document.hidden) {
        updateProgress();
        updateParallax();
      }
      state.parallaxRaf = window.requestAnimationFrame(loop);
    };

    state.parallaxRaf = window.requestAnimationFrame(loop);
  }

  function highlightKeywords(scope) {
    if (!scope) return;

    clearKeywordHighlights(scope);

    const keywords = getKeywords();
    if (!keywords.length) return;

    const keywordRegex = buildKeywordRegex(keywords);

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const value = node.nodeValue || "";
        if (!value.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".foundation-keyword"))
          return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript"))
          return NodeFilter.FILTER_REJECT;
        keywordRegex.lastIndex = 0;
        return keywordRegex.test(value)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const text = node.nodeValue || "";
      keywordRegex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = keywordRegex.exec(text)) !== null) {
        const usesFallback = typeof match[2] !== "undefined";
        const prefix = usesFallback ? match[1] || "" : "";
        const keyword = usesFallback
          ? match[2] || match[0]
          : match[1] || match[0];
        const keywordStart = usesFallback
          ? match.index + prefix.length
          : match.index;
        const end = match.index + match[0].length;

        if (keywordStart > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex, keywordStart)),
          );
        }

        const span = document.createElement("span");
        span.className = "foundation-keyword";
        span.textContent = keyword;
        fragment.appendChild(span);

        lastIndex = end;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode?.replaceChild(fragment, node);
    });
  }

  function prepareFoundationsPage() {
    state.main = document.querySelector(".foundations-page");
    state.hero = document.querySelector(".foundations-hero");
    state.card =
      document.getElementById("equilibre") ||
      document.querySelector(".foundations-page .foundation-card");
    state.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!state.main || !state.hero || !state.card) return;

    injectHeroDecor();
    prepareRevealTargets();
    prepareCardToggle();
    createPremiumBlocks();
    createReadingProgress();
    splitHeroTitle();
    splitCardCopy();
    highlightKeywords(state.main);
    observeReveals(state.main);
    updateProgress();
    updateParallax();
    startMotionLoop();
    scheduleHashTarget();
  }

  function refreshTranslatedText() {
    if (!state.hero || !state.main) return;

    const heroTitle = state.hero.querySelector("h1");
    if (heroTitle) {
      splitHeroTitle();
    }

    splitCardCopy();
    highlightKeywords(state.main);
    observeReveals(state.main);
    scheduleHashTarget();
  }

  onReady(prepareFoundationsPage);
  document.addEventListener("i18nReady", refreshTranslatedText);
  document.addEventListener("languageChanged", refreshTranslatedText);
})();
