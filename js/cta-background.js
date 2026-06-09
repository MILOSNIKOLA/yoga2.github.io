(function () {
  "use strict";
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const items = Array.from(document.querySelectorAll(".cta-item"));

  if (!items.length) return;

  // assign CSS variable for slight stagger
  items.forEach((item, i) => item.style.setProperty("--i", i));

  function reveal(entries, obs) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // once revealed, unobserve to save work
        obs.unobserve(entry.target);
      }
    });
  }

  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(reveal, {
      root: null,
      threshold: 0.18,
      rootMargin: "-6% 0px",
    });
    items.forEach((item) => io.observe(item));
  } else {
    // fallback: reveal all
    items.forEach((item) => item.classList.add("in-view"));
  }

  // keyboard accessibility: press Enter to follow CTA (if any link inside)
  items.forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
})();
