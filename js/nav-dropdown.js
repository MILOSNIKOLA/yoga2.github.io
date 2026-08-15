(function () {
  function initNavDropdown() {
    const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
    if (dropdowns.length === 0) {
      return;
    }

    const closeAll = (except = null) => {
      dropdowns.forEach((dropdown) => {
        if (dropdown === except) return;

        dropdown.classList.remove("is-open");
        dropdown
          .querySelector(".nav-dropdown-toggle")
          ?.setAttribute("aria-expanded", "false");
      });
    };

    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".nav-dropdown-toggle");
      const menu = dropdown.querySelector(".nav-dropdown-menu");

      if (!toggle || !menu) return;

      const setOpen = (isOpen) => {
        if (isOpen) closeAll(dropdown);

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
    });

    document.addEventListener("click", (event) => {
      if (!dropdowns.some((dropdown) => dropdown.contains(event.target)))
        closeAll();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAll();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavDropdown, {
      once: true,
    });
  } else {
    initNavDropdown();
  }
})();
