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

  const PUBLIC_PAGES = ["login_page.html", "retrieve_password.html", "index.html"];

  async function checkAuth() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // If it's a public page, we don't necessarily need to check auth, 
    // but if the user IS logged in, we might want to redirect them to the dashboard.
    
    try {
      const response = await MediTrackAPI.auth.me();
      
      if (response.status && response.user) {
        // User is authenticated
        window.currentUser = response.user;
        
        // If on login page, redirect to dashboard
        if (currentPage === "login_page.html" || currentPage === "index.html") {
          window.location.href = "screens/dashboard.html";
        } else if (currentPage === "") {
             // Handle root
             window.location.href = "frontend/screens/dashboard.html";
        }
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      // User is NOT authenticated
      if (PROTECTED_PAGES.includes(currentPage)) {
        console.warn("Access denied. Redirecting to login...");
        
        // Adjust path based on current location
        const redirectPath = currentPage.includes('.html') && !PUBLIC_PAGES.includes(currentPage) 
          ? "../index.html" 
          : "index.html";
          
        window.location.href = redirectPath;
      }
    }
  }

  // Run check on load
  if (typeof MediTrackAPI !== "undefined") {
    checkAuth();
  } else {
    console.error("MediTrackAPI not found. Auth guard cannot run.");
  }
})();
