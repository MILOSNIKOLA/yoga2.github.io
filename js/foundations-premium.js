(() => {
  const KEYWORDS = [
    "Équilibre",
    "Respiration",
    "Conscience",
    "Souplesse",
    "Concentration",
    "Confiance",
  ];

  const COACH_TEXT =
    "Le Coach IA vous recommande aujourd'hui un exercice adapté au thème de cette page. Aujourd'hui, prenez quelques minutes pour pratiquer la posture de l'Arbre afin d'améliorer votre équilibre, votre concentration et votre stabilité.";

  const QUOTE_TEXT =
    "« Le véritable équilibre ne consiste pas à rester immobile, mais à avancer avec stabilité. »";

  const state = {
    revealObserver: null,
    main: null,
    hero: null,
    card: null,
    progressRoot: null,
    progressFill: null,
    progressValue: null,
    progressMilestones: [],
    motionRaf: 0,
    parallaxRaf: 0,
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

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildKeywordRegex() {
    const group = KEYWORDS.map(escapeRegExp).join("|");

    try {
      return new RegExp(`(?<![\\p{L}\\p{N}])(${group})(?![\\p{L}\\p{N}])`, "giu");
    } catch {
      return new RegExp(`(^|[^A-Za-zÀ-ÿ])(${group})(?=$|[^A-Za-zÀ-ÿ])`, "gi");
    }
  }

  const KEYWORD_REGEX = buildKeywordRegex();

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

    const source = (heroTitle.textContent || heroTitle.dataset.foundationSource || "").trim();
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
    if (!copy || copy.dataset.foundationLinesReady === "true") return;

    const source = (copy.textContent || "").trim();
    if (!source) return;

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
    if (!state.hero || state.hero.querySelector(".foundation-hero-decor")) return;

    const decor = document.createElement("div");
    decor.className = "foundation-hero-decor";
    decor.setAttribute("aria-hidden", "true");
    decor.innerHTML = `
      <span class="foundation-hero-orb" style="left:6%; top:18%; width:14px; height:14px; animation-duration:28s; animation-delay:-4s;"></span>
      <span class="foundation-hero-orb" style="left:14%; top:62%; width:10px; height:10px; animation-duration:34s; animation-delay:-16s;"></span>
      <span class="foundation-hero-orb" style="left:33%; top:14%; width:8px; height:8px; animation-duration:30s; animation-delay:-8s;"></span>
      <span class="foundation-hero-orb" style="left:62%; top:20%; width:12px; height:12px; animation-duration:36s; animation-delay:-20s;"></span>
      <span class="foundation-hero-orb" style="left:79%; top:54%; width:9px; height:9px; animation-duration:32s; animation-delay:-12s;"></span>
      <span class="foundation-hero-orb" style="left:90%; top:28%; width:7px; height:7px; animation-duration:40s; animation-delay:-24s;"></span>
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

  function createPremiumBlocks() {
    if (!state.main || state.main.querySelector("[data-foundation-premium-block='true']")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "foundation-premium-block";
    wrapper.setAttribute("data-foundation-premium-block", "true");

    wrapper.innerHTML = `
      <blockquote class="foundation-quote" data-foundation-reveal>
        <p>${QUOTE_TEXT}</p>
      </blockquote>

      <section class="foundation-coach" data-foundation-reveal aria-labelledby="foundation-coach-title">
        <div class="foundation-coach__badge">Coach IA</div>
        <h2 id="foundation-coach-title">💡 Conseil du Coach IA</h2>
        <p>${COACH_TEXT}</p>
        <div class="foundation-coach__actions">
          <a class="foundation-coach__btn" href="sessions.html?filter=beginner">Commencer cette séance</a>
        </div>
      </section>

      <section class="foundation-bottom-nav" data-foundation-reveal aria-label="Navigation des fondements">
        <a class="foundation-nav-card" href="respirer.html" aria-label="Fondement précédent : Respiration" data-foundation-reveal>
          <div class="foundation-nav-card__media">
            <img src="img/The major foundations of yoga/2.jpg" alt="Respiration" loading="lazy" decoding="async" />
          </div>
          <div class="foundation-nav-card__body">
            <span class="foundation-nav-card__eyebrow">Fondement précédent</span>
            <span class="foundation-nav-card__title">Respiration</span>
            <span class="foundation-nav-card__desc">Prana, l'énergie vitale respirée</span>
          </div>
          <span class="foundation-nav-card__arrow">←</span>
        </a>

        <a class="foundation-nav-card" href="learning.html" aria-label="Fondement suivant : Conscience" data-foundation-reveal>
          <div class="foundation-nav-card__media">
            <img src="img/The major foundations of yoga/3.jpg" alt="Conscience" loading="lazy" decoding="async" />
          </div>
          <div class="foundation-nav-card__body">
            <span class="foundation-nav-card__eyebrow">Fondement suivant</span>
            <span class="foundation-nav-card__title">Conscience</span>
            <span class="foundation-nav-card__desc">Présence et attention à chaque instant</span>
          </div>
          <span class="foundation-nav-card__arrow">→</span>
        </a>
      </section>
    `;

    state.main.appendChild(wrapper);

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
    rail.setAttribute("aria-label", "Lecture");
    rail.setAttribute("aria-valuemin", "0");
    rail.setAttribute("aria-valuemax", "100");
    rail.setAttribute("aria-valuenow", "0");
    rail.innerHTML = `
      <span class="foundation-reading-progress__label">Lecture</span>
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
    state.progressFill = rail.querySelector(".foundation-reading-progress__fill");
    state.progressValue = rail.querySelector(".foundation-reading-progress__value");
    state.progressMilestones = Array.from(
      rail.querySelectorAll(".foundation-reading-progress__milestone"),
    );
  }

  function updateProgress() {
    if (!state.main || !state.progressFill || !state.progressValue || !state.progressRoot) return;

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
    const centerOffset = (rect.top + rect.height * 0.45 - viewport * 0.5) / viewport;
    const shift = clamp(centerOffset * -26, -18, 18);
    const scale = 1.02 + Math.sin((window.scrollY + viewport) / 850) * 0.012;

    image.style.setProperty("--foundation-image-shift", `${shift.toFixed(2)}px`);
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
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const value = node.nodeValue || "";
        if (!value.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".foundation-keyword")) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript")) return NodeFilter.FILTER_REJECT;
        KEYWORD_REGEX.lastIndex = 0;
        return KEYWORD_REGEX.test(value) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const text = node.nodeValue || "";
      KEYWORD_REGEX.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = KEYWORD_REGEX.exec(text)) !== null) {
        const usesFallback = typeof match[2] !== "undefined";
        const prefix = usesFallback ? match[1] || "" : "";
        const keyword = usesFallback ? match[2] || match[0] : match[1] || match[0];
        const keywordStart = usesFallback ? match.index + prefix.length : match.index;
        const end = match.index + match[0].length;

        if (keywordStart > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, keywordStart)));
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
    state.card = document.getElementById("equilibre");
    state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!state.main || !state.hero || !state.card) return;

    injectHeroDecor();
    prepareRevealTargets();
    prepareCardToggle();
    splitHeroTitle();
    splitCardCopy();
    createPremiumBlocks();
    createReadingProgress();
    highlightKeywords(state.main);
    observeReveals(state.main);
    updateProgress();
    updateParallax();
    startMotionLoop();
  }

  function refreshTranslatedText() {
    if (!state.hero || !state.main) return;

    const heroTitle = state.hero.querySelector("h1");
    if (heroTitle) {
      splitHeroTitle();
    }

    highlightKeywords(state.main);
    observeReveals(state.main);
  }

  onReady(prepareFoundationsPage);
  document.addEventListener("i18nReady", refreshTranslatedText);
  document.addEventListener("languageChanged", refreshTranslatedText);
})();
