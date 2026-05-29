// premium-ui.js - behaviors for premium components
// Initializes carousels, accordions, scroll reveal, breathing circle control
(function () {
  function initScrollReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
  }

  function initCarousels() {
    // make horizontal areas draggable for better mobile feel
    const draggables = document.querySelectorAll(
      ".program-row, .carousel, .audio-row",
    );
    draggables.forEach((track) => {
      let pos = { down: false, startX: 0, scrollLeft: 0 };
      track.addEventListener("pointerdown", (e) => {
        pos.down = true;
        track.setPointerCapture(e.pointerId);
        pos.startX = e.pageX;
        pos.scrollLeft = track.scrollLeft;
        track.classList.add("dragging");
      });
      track.addEventListener("pointermove", (e) => {
        if (!pos.down) return;
        const dx = e.pageX - pos.startX;
        track.scrollLeft = pos.scrollLeft - dx;
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
        track.addEventListener(evt, () => {
          pos.down = false;
          track.classList.remove("dragging");
        }),
      );
    });
  }

  function initFAQ() {
    document.querySelectorAll(".faq .qa .question").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qa = btn.closest(".qa");
        qa.classList.toggle("open");
      });
    });
  }

  function initProgression() {
    document.querySelectorAll(".progression .progress-fill").forEach((el) => {
      const val = el.dataset.value || el.getAttribute("data-value") || "0";
      setTimeout(() => {
        el.style.width = parseInt(val, 10) + "%";
      }, 200);
    });
  }

  function initBreathingControls() {
    // Make breathing circles pulse slower/faster based on data-duration
    document.querySelectorAll(".breathing-circle").forEach((el) => {
      const dur = parseInt(el.dataset.duration || 4200, 10);
      el.style.animationDuration = dur + "ms";
    });
  }

  function initAudioVisualizer() {
    // Simple staggered animation seed for visualizer bars
    document
      .querySelectorAll(".audio-card .visualizer span")
      .forEach((bar, i) => {
        bar.style.animationDelay = i * 80 + "ms";
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initCarousels();
    initFAQ();
    initProgression();
    initBreathingControls();
    initAudioVisualizer();
    // gentle console log for debug
    try {
      console.log("Premium UI initialized");
    } catch (e) {}
  });
})();
