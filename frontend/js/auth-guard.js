/**
 * auth-guard.js - Protect routes and manage authentication state
 * Include this script at the top of protected HTML pages
 */

(function () {
  const PROTECTED_PAGES = [
    "dashboard.html",
    "patients_data.html",
    "patient-detail.html",
    "face_id.html",
    "settings.html",
    "user_profile.html",
  ];

  const PUBLIC_PAGES = ["retrieve_password.html", "index.html"];

  async function checkAuth() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // If it's a public page, we don't necessarily need to check auth, 
    // but if the user IS logged in, we might want to redirect them to the dashboard.
    
    try {
      const response = await RetrigencyAPI.auth.me();
      
      if (response.status && response.user) {
        // User is authenticated
        window.currentUser = response.user;
        
        // If on login/index page, redirect to dashboard
        if (currentPage === "login_page.html" || currentPage === "index.html" || currentPage === "") {
          const dashboardPath = window.location.pathname.includes('/screens/') 
            ? "dashboard.html" 
            : "screens/dashboard.html";
          window.location.href = dashboardPath;
        }
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      // User is NOT authenticated
      if (PROTECTED_PAGES.includes(currentPage)) {
        console.warn("Access denied. Redirecting to login...");
        
        // Path to index.html from where we are
        const loginPath = window.location.pathname.includes('/screens/') 
          ? "../index.html" 
          : "index.html";
          
        window.location.href = loginPath;
      }
    }
  }

  // Run check on load
  if (typeof RetrigencyAPI !== "undefined") {
    checkAuth();
  } else {
    console.error("RetrigencyAPI not found. Auth guard cannot run.");
  }
})();
