/* ========================================
   SCROLL ANIMATIONS SYSTEM
   ======================================== */

class ScrollAnimations {
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || "0px 0px -100px 0px",
      animationClass: options.animationClass || "in-view",
      triggerOnce: options.triggerOnce !== false,
    };

    this.animatedElements = new WeakSet();
    this.init();
  }

  init() {
    this.observeElements();
    this.observeParallaxElements();
    this.setupCounters();
    this.setupProgressBars();
  }

  /* ========================================
     OBSERVE ELEMENTS FOR ANIMATION
     ======================================== */

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);

          if (this.options.triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!this.options.triggerOnce) {
          entry.target.classList.remove(this.options.animationClass);
        }
      });
    }, this.options);

    // Get all elements with animation attributes
    const selectors = [
      "[data-animate]",
      ".scroll-reveal",
      ".fade-up",
      ".fade-left",
      ".fade-right",
      ".fade-down",
      ".scale-up",
      ".scale-down",
      ".card-premium",
      ".scroll-section",
      "[data-scroll]",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        observer.observe(el);
      });
    });
  }

  animateElement(element) {
    if (this.animatedElements.has(element)) return;

    this.animatedElements.add(element);

    // Get animation type from data attribute or class
    const animationType =
      element.getAttribute("data-animate") ||
      Array.from(element.classList).find((cls) =>
        [
          "fade-up",
          "fade-left",
          "fade-right",
          "fade-down",
          "scale-up",
          "scale-down",
        ].includes(cls),
      );

    // Add delay if specified
    const delay = element.getAttribute("data-delay");
    if (delay) {
      element.style.animationDelay = `${delay}ms`;
    }

    // Add animation
    element.classList.add(this.options.animationClass);

    if (animationType) {
      element.style.animation = this.getAnimationName(animationType);
    }
  }

  getAnimationName(type) {
    const animations = {
      "fade-up": "fadeInUp 0.8s ease-out forwards",
      "fade-left": "fadeInLeft 0.8s ease-out forwards",
      "fade-right": "fadeInRight 0.8s ease-out forwards",
      "fade-down": "fadeInDown 0.8s ease-out forwards",
      "scale-up": "scaleUp 0.8s ease-out forwards",
      "scale-down": "scaleDown 0.8s ease-out forwards",
    };

    return animations[type] || "fadeInUp 0.8s ease-out forwards";
  }

  /* ========================================
     PARALLAX SCROLL
     ======================================== */

  observeParallaxElements() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    if (parallaxElements.length === 0) return;

    window.addEventListener("scroll", () => {
      parallaxElements.forEach((el) => {
        const scrollPosition = window.scrollY;
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.5;
        const offset = scrollPosition * speed;

        el.style.transform = `translateY(${offset}px)`;
      });
    });
  }

  /* ========================================
     COUNTER ANIMATIONS
     ======================================== */

  setupCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          this.animateCounter(entry.target);
          entry.target.dataset.counted = "true";
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-counter"));
    const duration = parseInt(element.getAttribute("data-duration")) || 2000;
    const suffix = element.getAttribute("data-suffix") || "";
    const start = 0;
    const frames = 60;
    const increment = target / frames;
    const stepDuration = duration / frames;

    let current = start;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current += increment;

      if (frame >= frames) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, stepDuration);
  }

  /* ========================================
     PROGRESS BARS
     ======================================== */

  setupProgressBars() {
    const progressBars = document.querySelectorAll("[data-progress]");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    progressBars.forEach((bar) => observer.observe(bar));
  }

  animateProgressBar(element) {
    const targetWidth = element.getAttribute("data-progress");
    const duration = parseInt(element.getAttribute("data-duration")) || 1500;
    const startWidth = 0;
    const frames = 60;
    const increment = targetWidth / frames;
    const stepDuration = duration / frames;

    let currentWidth = startWidth;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      currentWidth += increment;

      if (frame >= frames) {
        element.style.width = targetWidth + "%";
        clearInterval(timer);
      } else {
        element.style.width = currentWidth + "%";
      }
    }, stepDuration);
  }

  /* ========================================
     STAGGER ANIMATIONS
     ======================================== */

  setupStaggerAnimations() {
    const staggerContainers = document.querySelectorAll("[data-stagger]");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateStaggerGroup(entry.target);

          if (this.options.triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, this.options);

    staggerContainers.forEach((container) => observer.observe(container));
  }

  animateStaggerGroup(container) {
    const children = container.querySelectorAll(":scope > *");
    const staggerDelay =
      parseInt(container.getAttribute("data-stagger")) || 100;

    children.forEach((child, index) => {
      const delay = index * staggerDelay;
      child.style.animation = `fadeInUp 0.8s ease-out ${delay}ms forwards`;
      child.style.opacity = "0";
    });
  }

  /* ========================================
     TEXT ANIMATION (REVEAL)
     ======================================== */

  setupTextReveal() {
    const textElements = document.querySelectorAll("[data-text-reveal]");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.revealText(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    textElements.forEach((el) => observer.observe(el));
  }

  revealText(element) {
    const text = element.textContent;
    const chars = text.split("");
    const duration = parseInt(element.getAttribute("data-duration")) || 1500;
    const stepDuration = duration / chars.length;

    element.textContent = "";
    element.style.overflow = "hidden";

    chars.forEach((char, index) => {
      setTimeout(() => {
        element.textContent += char;
      }, stepDuration * index);
    });
  }

  /* ========================================
     SCROLL PROGRESS
     ======================================== */

  setupScrollProgress() {
    const progressBar = document.querySelector("[data-scroll-progress]");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = scrollPercent + "%";
    });
  }

  /* ========================================
     BLUR SCROLL
     ======================================== */

  setupBlurScroll() {
    const blurElements = document.querySelectorAll("[data-blur-scroll]");

    window.addEventListener("scroll", () => {
      blurElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight / 2);
        const blur = Math.max(0, Math.min(10, distance / 100));

        el.style.filter = `blur(${blur}px)`;
      });
    });
  }
}

/* ========================================
   ADVANCED SCROLL EFFECTS
   ======================================== */

class AdvancedScrollEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupTextScroll();
    this.setupImageZoom();
    this.setupColorShift();
  }

  /* ========================================
     TEXT SCALE ON SCROLL
     ======================================== */

  setupTextScroll() {
    const textElements = document.querySelectorAll("[data-text-scroll]");

    window.addEventListener("scroll", () => {
      textElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(rect.top - viewportCenter);
        const scale = Math.max(0.8, 1 - distance / window.innerHeight);

        el.style.transform = `scale(${scale})`;
        el.style.opacity = scale;
      });
    });
  }

  /* ========================================
     IMAGE ZOOM ON SCROLL
     ======================================== */

  setupImageZoom() {
    const imageElements = document.querySelectorAll("[data-image-zoom]");

    window.addEventListener("scroll", () => {
      imageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollPercent = 1 - rect.top / viewportHeight;
        const scale = Math.max(1, 1 + scrollPercent * 0.2);

        el.style.transform = `scale(${scale})`;
      });
    });
  }

  /* ========================================
     COLOR SHIFT ON SCROLL
     ======================================== */

  setupColorShift() {
    const colorElements = document.querySelectorAll("[data-color-shift]");

    window.addEventListener("scroll", () => {
      colorElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const scrollPercent = 1 - rect.top / window.innerHeight;
        const hue = scrollPercent * 360;

        el.style.filter = `hue-rotate(${hue}deg)`;
      });
    });
  }
}

/* ========================================
   REVEAL TEXT ON SCROLL
   ======================================== */

class RevealTextOnScroll {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.revealText(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    this.elements.forEach((el) => observer.observe(el));
  }

  revealText(element) {
    const text = element.textContent;
    const words = text.split(" ");

    element.innerHTML = words
      .map(
        (word, index) =>
          `<span style="display: inline-block; opacity: 0; animation: fadeIn 0.6s ease-out ${index * 50}ms forwards;">${word}&nbsp;</span>`,
      )
      .join("");
  }
}

/* ========================================
   LAZY LOAD IMAGES
   ======================================== */

class LazyLoadImages {
  constructor() {
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      document
        .querySelectorAll("img[data-src]")
        .forEach((img) => observer.observe(img));
    }
  }

  loadImage(img) {
    img.src = img.getAttribute("data-src");
    img.removeAttribute("data-src");
    img.style.animation = "fadeIn 0.6s ease-out";
  }
}

/* ========================================
   COACH AI PREMIUM EXPERIENCE
   ======================================== */

class CoachAiPremium {
  constructor() {
    this.section = document.querySelector(".coach-ai-section");
    this.shell = document.querySelector(".coach-ai-shell");
    this.dashboard = null;
    this.rafScheduled = false;
    this.lastScrollY = window.scrollY;
    this.hasPlayedStats = false;

    if (!this.section || !this.shell) return;

    this.injectDashboard();
    this.setupVisibility();
    this.setupPointerEffects();
    this.setupParallax();
  }

  injectDashboard() {
    if (this.shell.querySelector(".coach-ai-dashboard")) {
      this.dashboard = this.shell.querySelector(".coach-ai-dashboard");
      return;
    }

    const dashboard = document.createElement("aside");
    dashboard.className = "coach-ai-dashboard coach-ai-dashboard-floating";
    dashboard.innerHTML = `
      <p class="coach-ai-dashboard-greeting" data-i18n="home.aiCoach.dashboard.greeting">Bonjour Jean 👋</p>

      <p class="coach-ai-dashboard-energy-label" data-i18n="home.aiCoach.dashboard.energyLabel">Votre énergie aujourd'hui</p>
      <div class="coach-ai-dashboard-energy-row">
        <span class="coach-ai-dashboard-energy-count" data-counter-value="82">0</span>
        <span>%</span>
      </div>
      <div class="coach-ai-dashboard-energy-bar" aria-hidden="true">
        <div class="coach-ai-dashboard-energy-fill"></div>
      </div>

      <div class="coach-ai-dashboard-grid">
        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.recommendedLabel">Séance recommandée</p>
          <strong data-i18n="home.aiCoach.dashboard.recommendedTitle">Yoga du matin</strong>
          <strong data-i18n="home.aiCoach.dashboard.recommendedDuration">12 minutes</strong>
        </div>

        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.objectiveLabel">Objectif</p>
          <strong data-i18n="home.aiCoach.dashboard.objectiveValue">Relaxation</strong>
        </div>

        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.progressLabel">Progression</p>
          <strong><span>+</span><span data-counter-value="14">0</span><span>%</span></strong>
        </div>

        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.streakLabel">Streak</p>
          <strong><span data-counter-value="16">0</span> <span data-i18n="home.aiCoach.dashboard.days">jours</span></strong>
        </div>

        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.caloriesLabel">Calories</p>
          <strong><span data-counter-value="96">0</span> kcal</strong>
        </div>

        <div class="coach-ai-dashboard-tile">
          <p class="coach-ai-dashboard-meta-label" data-i18n="home.aiCoach.dashboard.breathingLabel">Respiration</p>
          <strong data-i18n="home.aiCoach.dashboard.breathingValue">Excellente</strong>
        </div>
      </div>

      <div class="coach-ai-dashboard-progress-ring">
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <circle class="coach-ai-dashboard-progress-ring-bg" cx="30" cy="30" r="25"></circle>
          <circle class="coach-ai-dashboard-progress-ring-bar" cx="30" cy="30" r="25"></circle>
        </svg>
        <div class="coach-ai-dashboard-progress-text">
          <span data-i18n="home.aiCoach.dashboard.globalScore">Score global</span>
          <strong>82%</strong>
        </div>
      </div>
    `;

    this.shell.appendChild(dashboard);
    this.dashboard = dashboard;

    if (window.i18n && typeof window.i18n.applyTranslations === "function") {
      window.i18n.applyTranslations();
    }
  }

  setupVisibility() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          this.shell.classList.add("is-visible");
          if (!this.hasPlayedStats) {
            this.hasPlayedStats = true;
            this.animateDashboardStats();
          }
          observer.unobserve(this.shell);
        });
      },
      { threshold: 0.24 },
    );

    observer.observe(this.shell);
  }

  animateDashboardStats() {
    if (!this.dashboard) return;

    const counters = this.dashboard.querySelectorAll("[data-counter-value]");
    counters.forEach((el) => {
      const target = Number(el.getAttribute("data-counter-value"));
      this.animateNumber(el, target, 1200);
    });

    const energyFill = this.dashboard.querySelector(
      ".coach-ai-dashboard-energy-fill",
    );
    if (energyFill) {
      requestAnimationFrame(() => {
        energyFill.style.transition =
          "width 1250ms cubic-bezier(0.16, 1, 0.3, 1)";
        energyFill.style.width = "82%";
      });
    }

    const progressRing = this.dashboard.querySelector(
      ".coach-ai-dashboard-progress-ring-bar",
    );
    if (progressRing) {
      const circumference = 2 * Math.PI * 25;
      const targetOffset = circumference * (1 - 0.82);
      progressRing.style.strokeDasharray = `${circumference}`;
      progressRing.style.strokeDashoffset = `${circumference}`;
      requestAnimationFrame(() => {
        progressRing.style.transition =
          "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
        progressRing.style.strokeDashoffset = `${targetOffset}`;
      });
    }
  }

  animateNumber(element, target, duration) {
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (target - from) * eased);
      element.textContent = `${value}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  setupPointerEffects() {
    this.shell.addEventListener("mousemove", (event) => {
      const rect = this.shell.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      this.shell.style.setProperty("--coach-mx", `${x}%`);
      this.shell.style.setProperty("--coach-my", `${y}%`);
    });
  }

  setupParallax() {
    const onScroll = () => {
      this.lastScrollY = window.scrollY;
      if (this.rafScheduled) return;

      this.rafScheduled = true;
      requestAnimationFrame(() => {
        this.rafScheduled = false;
        this.updateParallax();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    this.updateParallax();
  }

  updateParallax() {
    const rect = this.section.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = Math.max(
      -1,
      Math.min(1, (rect.top + rect.height / 2 - viewport / 2) / viewport),
    );
    const shift = progress * -14;
    this.section.style.setProperty("--coach-parallax", `${shift.toFixed(2)}px`);
  }
}

/* ========================================
   INITIALIZE ON DOM READY
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize scroll animations
  new ScrollAnimations({
    threshold: 0.15,
    triggerOnce: true,
  });

  // Initialize advanced effects
  new AdvancedScrollEffects();

  // Initialize lazy loading
  new LazyLoadImages();

  // Coach AI premium experience (injected dashboard + advanced micro interactions)
  new CoachAiPremium();
});

/* ========================================
   EXPORT FOR USAGE
   ======================================== */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ScrollAnimations,
    AdvancedScrollEffects,
    CoachAiPremium,
    RevealTextOnScroll,
    LazyLoadImages,
  };
}
