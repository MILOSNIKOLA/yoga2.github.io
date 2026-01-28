/**
 * Footer Component Loader
 * Loads and injects the reusable footer into all pages
 */

(function loadFooter() {
  // Check if footer already exists
  if (document.querySelector("footer.footer")) {
    return; // Footer already present, skip loading
  }

  // Fetch the footer HTML
  fetch("includes/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load footer: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      // Create a container for the footer
      const footerContainer = document.createElement("div");
      footerContainer.innerHTML = html;

      // Insert footer before closing body tag
      const footer = footerContainer.querySelector("footer");
      if (footer) {
        // Try to insert before last script tag, or at end of body
        const lastScript = document.body.querySelector("script:last-of-type");
        if (lastScript) {
          lastScript.parentNode.insertBefore(footer, lastScript);
        } else {
          document.body.appendChild(footer);
        }

        // 🎯 Dispatch event when footer is loaded
        // This allows language.js to re-translate the footer
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("footerLoaded", { detail: { footer: footer } }),
          );
          console.log("✅ Footer loaded and event dispatched");
        }, 0);
      }
    })
    .catch((error) => {
      console.warn("Footer loader: Could not load footer component.", error);
      // Silently fail - footer is not critical
    });
})();
