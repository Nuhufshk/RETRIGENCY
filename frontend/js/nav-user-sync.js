/**
 * nav-user-sync.js
 * Syncs the user's first name from localStorage into the top-right "Staff" 
 * text on every page. Also listens for updates from auth-guard.js.
 */
(function () {
  function applyName() {
    const name = localStorage.getItem("retrigency_user_name") || "Staff";
    
    // Pattern 1: .user p (Standard dashboard/notifications)
    document.querySelectorAll(".user p, #nav-username").forEach((el) => {
      // Avoid recursive loops by checking if text matches existing name
      if (el.textContent.trim() !== name) {
        el.textContent = name;
      }
    });

    // Pattern 2: top-nav-icons links (Settings, Face ID, etc.)
    document.querySelectorAll(".top-nav-icons a, .right-side a").forEach((a) => {
      const linkHtml = a.innerHTML;
      // If it contains "Staff" and is likely the profile link
      if (linkHtml.includes("Staff") || a.href.includes("user_profile")) {
        // Keep the icon if it exists, replace only the text "Staff" or current name
        const icon = a.querySelector("i");
        if (icon) {
          const iconHtml = icon.outerHTML;
          a.innerHTML = iconHtml + " " + name;
        } else if (a.textContent.includes("Staff")) {
           a.textContent = name;
        }
      }
    });
  }

  // Initial apply
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyName);
  } else {
    applyName();
  }

  // Listen for real-time updates from auth-guard.js
  window.addEventListener("userProfileUpdated", applyName);
})();
