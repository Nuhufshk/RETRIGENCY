/**
 * nav-user-sync.js
 * Syncs the user's first name from localStorage into the top-right "Staff" 
 * text on every page. Also loads it from the API on first visit.
 */
(function () {
  function applyName() {
    const name = localStorage.getItem("retrigency_user_name") || "Staff";
    // Pattern 1: <p>Staff</p> inside .user div (dashboard, patients)
    document.querySelectorAll(".user p").forEach((el) => {
      if (el.textContent.trim() === "Staff" || el.dataset.navUser) {
        el.textContent = name;
        el.dataset.navUser = "true";
      }
    });
    // Pattern 2: <a>...Staff</a> in top-nav-icons (settings, profile, face_id)
    document.querySelectorAll(".top-nav-icons a, .top-nav-icons a").forEach((a) => {
      if (a.href && a.href.includes("user_profile")) {
        // Keep the icon, replace only text
        const icon = a.querySelector("i");
        if (icon) {
          a.textContent = "";
          a.appendChild(icon);
          a.append(name);
        }
      }
    });
    // Pattern 3: notifications page <p>Staff</p>
    document.querySelectorAll(".right-side .user p, .notification-link + .user p").forEach((el) => {
      el.textContent = name;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyName);
  } else {
    applyName();
  }
})();
