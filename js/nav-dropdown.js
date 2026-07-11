(function () {
  function initNavDropdown() {
    const dropdown = document.querySelector(".nav-dropdown");
    if (!dropdown) {
      return;
    }

    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    const menu = dropdown.querySelector(".nav-dropdown-menu");

    if (!toggle || !menu) {
      return;
    }

    const setOpen = (isOpen) => {
      dropdown.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!dropdown.classList.contains("is-open"));
    });

    dropdown.addEventListener("mouseenter", () => {
      setOpen(true);
    });

    dropdown.addEventListener("mouseleave", () => {
      setOpen(false);
    });

    dropdown.addEventListener("focusin", () => {
      setOpen(true);
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) {
        setOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavDropdown, { once: true });
  } else {
    initNavDropdown();
  }
})();
