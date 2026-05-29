/* ========================================
   PREMIUM ANIMATIONS JAVASCRIPT
   ======================================== */

class PremiumAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupHoverAnimations();
    this.setupStaggerAnimations();
    this.setupBreathingAnimations();
  }

  /* ========================================
     SCROLL REVEAL
     ======================================== */

  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all scroll-reveal elements
    document
      .querySelectorAll(".scroll-reveal, .fade-up, .scroll-section")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  /* ========================================
     HOVER ANIMATIONS
     ======================================== */

  setupHoverAnimations() {
    const hoverElements = document.querySelectorAll(
      ".card-premium, .btn-premium, .hover-scale",
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.05)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });
    });
  }

  /* ========================================
     STAGGER ANIMATIONS
     ======================================== */

  setupStaggerAnimations() {
    const staggerContainers = document.querySelectorAll(".stagger");

    staggerContainers.forEach((container) => {
      const children = container.querySelectorAll(":scope > *");
      children.forEach((child, index) => {
        child.style.animationDelay = `${index * 100}ms`;
      });
    });
  }

  /* ========================================
     BREATHING ANIMATIONS
     ======================================== */

  setupBreathingAnimations() {
    const breathingElements = document.querySelectorAll(
      "[data-breathing='true']",
    );

    breathingElements.forEach((el) => {
      el.style.animation = "breathe-in 4s ease-in-out infinite";
    });
  }

  /* ========================================
     MANUAL TRIGGER FUNCTIONS
     ======================================== */

  // Trigger fade-up animation
  triggerFadeUp(element) {
    element.classList.add("fade-up");
  }

  // Trigger scale animation
  triggerScale(element) {
    element.classList.add("scale-up");
  }

  // Trigger glow pulse
  triggerGlowPulse(element, color = "primary") {
    element.classList.add(`glow-pulse-${color}`);
  }

  // Remove animation class
  removeAnimation(element, animationClass) {
    element.classList.remove(animationClass);
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new PremiumAnimations();
});

/* ========================================
   BREATHING CIRCLE ANIMATION
   ======================================== */

class BreathingCircle {
  constructor(svgSelector) {
    this.svg = document.querySelector(svgSelector);
    this.circle = this.svg?.querySelector("circle[data-breathing]");
    this.isAnimating = false;
  }

  start() {
    if (this.circle) {
      this.circle.style.animation = "breathing-circle 4s ease-in-out infinite";
      this.isAnimating = true;
    }
  }

  stop() {
    if (this.circle) {
      this.circle.style.animation = "none";
      this.isAnimating = false;
    }
  }

  setDuration(seconds) {
    if (this.circle && this.isAnimating) {
      this.circle.style.animation = `breathing-circle ${seconds}s ease-in-out infinite`;
    }
  }
}

/* ========================================
   SCROLL PROGRESS BAR
   ======================================== */

class ScrollProgressBar {
  constructor(selector = ".scroll-progress") {
    this.progressBar = document.querySelector(selector);
    if (!this.progressBar) {
      this.createProgressBar();
    }
    this.init();
  }

  createProgressBar() {
    this.progressBar = document.createElement("div");
    this.progressBar.className = "scroll-progress";
    this.progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      z-index: 9999;
      transition: width 0.1s linear;
    `;
    document.body.insertBefore(this.progressBar, document.body.firstChild);
  }

  init() {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (this.progressBar) {
        this.progressBar.style.width = scrollPercent + "%";
      }
    });
  }
}

/* ========================================
   SMOOTH SCROLL BEHAVIOR
   ======================================== */

class SmoothScroll {
  constructor() {
    this.setupLinks();
  }

  setupLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

/* ========================================
   PARALLAX SCROLL
   ======================================== */

class ParallaxScroll {
  constructor() {
    this.parallaxElements = document.querySelectorAll("[data-parallax]");
    this.init();
  }

  init() {
    if (this.parallaxElements.length === 0) return;

    window.addEventListener("scroll", () => {
      this.parallaxElements.forEach((el) => {
        const scrollPosition = window.scrollY;
        const speed = el.getAttribute("data-parallax") || "0.5";
        el.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }
}

/* ========================================
   FLOATING ELEMENTS
   ======================================== */

class FloatingElements {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach((el) => {
      const delay = Math.random() * 2;
      el.style.animation = `float 6s ease-in-out infinite`;
      el.style.animationDelay = `${delay}s`;
    });
  }
}

/* ========================================
   RIPPLE EFFECT
   ======================================== */

class RippleEffect {
  constructor(selector) {
    this.buttons = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.createRipple(e);
      });
    });
  }

  createRipple(event) {
    const btn = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple-expand 0.6s ease-out;
    `;

    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

/* ========================================
   GRADIENT ANIMATOR
   ======================================== */

class GradientAnimator {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach((el) => {
      el.style.backgroundSize = "200% 200%";
      el.style.animation = "gradient-shift 15s ease infinite";
    });
  }

  setDuration(element, duration) {
    element.style.animation = `gradient-shift ${duration}s ease infinite`;
  }
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */

class CounterAnimation {
  constructor(selector, duration = 2000) {
    this.counters = document.querySelectorAll(selector);
    this.duration = duration;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    this.counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target")) || 0;
    const start = 0;
    const increment = target / (this.duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
}

/* ========================================
   TOOLTIP HOVER
   ======================================== */

class TooltipHover {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach((el) => {
      const tooltip = el.getAttribute("data-tooltip");
      if (!tooltip) return;

      const tooltipEl = document.createElement("div");
      tooltipEl.className = "tooltip";
      tooltipEl.textContent = tooltip;
      tooltipEl.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
      `;

      el.addEventListener("mouseenter", () => {
        el.appendChild(tooltipEl);
        setTimeout(() => (tooltipEl.style.opacity = "1"), 0);
      });

      el.addEventListener("mouseleave", () => {
        tooltipEl.style.opacity = "0";
        setTimeout(() => tooltipEl.remove(), 300);
      });
    });
  }
}

/* ========================================
   MAGNETIC BUTTON
   ======================================== */

class MagneticButton {
  constructor(selector) {
    this.buttons = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }
}

/* ========================================
   EXPORT FOR USAGE
   ======================================== */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PremiumAnimations,
    BreathingCircle,
    ScrollProgressBar,
    SmoothScroll,
    ParallaxScroll,
    FloatingElements,
    RippleEffect,
    GradientAnimator,
    CounterAnimation,
    TooltipHover,
    MagneticButton,
  };
}
