// face scanning functionality (only initialize if elements exist on this page)
const video = document.getElementById("webcam");
const startBtn = document.getElementById("start-btn");
const statusText = document.getElementById("status");

if (video && startBtn && statusText) {
  const initialStatusText = statusText.innerText;
  const initialStartButtonMarkup = startBtn.innerHTML;
  const captureButtonMarkup = "Capture Face";

  function resetFaceScan() {
    const stream = video.srcObject;
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    video.srcObject = null;
    statusText.innerText = initialStatusText;
    startBtn.innerHTML = initialStartButtonMarkup;
  }

  async function initCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      video.srcObject = stream;
      statusText.innerText = "Scanning...";
      startBtn.innerHTML = captureButtonMarkup;
    } catch (error) {
      console.error("Camera Error:", error);
      alert(
        "Could not access webcam. Please ensure you are using HTTPS or localhost."
      );
      resetFaceScan();
    }
  }

  startBtn.addEventListener("click", () => {
    if (startBtn.innerText.trim() === "Start Face Scan") {
      initCamera();
    } else {
      alert("Face data captured successfully!");
      resetFaceScan();
    }
  });
}
// Font size adjustment functionality
function changeFontSize() {
  const fontSelector = document.querySelector(".font-selector");
  if (!fontSelector) return;

  const fontSize = fontSelector.value;
  document.body.style.fontSize = fontSize;
  localStorage.setItem("fontSize", fontSize);
}
// Theme toggle and notification preferences
const body = document.querySelector("body");
const toggle = document.querySelector(".toggle");
const emailToggle = document.querySelector(".email-toggle");
const pushToggle = document.querySelector(".push-toggle");
const smsToggle = document.querySelector(".sms-toggle");
const isInsideScreens = window.location.pathname.includes("/screens/");
const DARK_MODE_LOGO = isInsideScreens ? "../images/retrigency-logo-dark.png" : "images/retrigency-logo-dark.png";
const DEFAULT_LIGHT_LOGO = isInsideScreens ? "../images/retrigency-logo.png" : "images/retrigency-logo.png";
let isSidebarNavigating = false;

function updateThemeLogo(isDarkMode) {
  document.querySelectorAll(".logo-img").forEach((logo) => {
    if (!logo.dataset.lightLogo) {
      logo.dataset.lightLogo = logo.getAttribute("src") || DEFAULT_LIGHT_LOGO;
    }
    logo.setAttribute(
      "src",
      isDarkMode ? DARK_MODE_LOGO : logo.dataset.lightLogo
    );
  });
}

function initSidebarPageTransitions() {
  if (!body) return;

  const sidebar = document.querySelector(".sidebar");
  const navLinks = sidebar
    ? sidebar.querySelectorAll(".nav-links a[href]")
    : [];
  if (!sidebar || navLinks.length === 0) return;

  body.classList.add("sidebar-transitions");

  const transitionContent =
    document.querySelector(".main-wrapper") ||
    document.querySelector("main.main-content") ||
    document.querySelector(".main-content");

  if (transitionContent) {
    transitionContent.classList.add("sidebar-transition-content");
  }

  navLinks.forEach((link) => {
    if (link.dataset.transitionBound === "true") return;
    link.dataset.transitionBound = "true";

    link.addEventListener("click", async (event) => {
      if (isSidebarNavigating || event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (/^javascript:/i.test(href)) return;

      const nextUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const samePath = nextUrl.pathname === currentUrl.pathname;
      const sameSearch = nextUrl.search === currentUrl.search;
      const sameHash = nextUrl.hash === currentUrl.hash;
      if (samePath && sameSearch && sameHash) return;

      const isLogoutLink =
        link.closest(".logout") !== null;
      if (isLogoutLink) {
        event.preventDefault();
        const shouldLogout = window.confirm(
          "Are you sure you want to log out?"
        );
        if (!shouldLogout) return;

        try {
          await RetrigencyAPI.auth.logout();
        } catch (e) {
          console.error("Logout error:", e);
        }

        // Keep UI preferences, clear only auth/session data.
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Force redirect to root index.html
        const loginPath = window.location.pathname.includes('/screens/') 
          ? "../index.html" 
          : "index.html";
          
        window.location.href = loginPath;
        return; // Don't proceed to the standard navigation logic
      }

      event.preventDefault();
      isSidebarNavigating = true;

      link.classList.add("nav-link--leaving");
      sidebar.classList.add("nav-transition-out");
      transitionContent?.classList.add("page-transition-out");

      window.setTimeout(() => {
        window.location.href = nextUrl.href;
      }, 220);
    });
  });
}

async function syncSettings(settings) {
  if (!window.currentUser) return;
  try {
    await RetrigencyAPI.profiles.updateSettings(window.currentUser.id, settings);
  } catch (e) {
    console.error("Failed to sync settings with backend:", e);
  }
}

if (toggle && body) {
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    toggle.classList.toggle("active");
    const darkModeEnabled = body.classList.contains("dark");
    localStorage.setItem("darkMode", darkModeEnabled);
    updateThemeLogo(darkModeEnabled);
    syncSettings({ theme: darkModeEnabled ? "dark" : "light" });
  });
}

if (emailToggle) {
  emailToggle.addEventListener("click", () => {
    emailToggle.classList.toggle("active");
    const enabled = emailToggle.classList.contains("active");
    localStorage.setItem("emailNotifications", enabled);
    syncSettings({ emailNotification: enabled });
  });
}

if (pushToggle) {
  pushToggle.addEventListener("click", () => {
    pushToggle.classList.toggle("active");
    const enabled = pushToggle.classList.contains("active");
    localStorage.setItem("pushNotifications", enabled);
    syncSettings({ pushNotification: enabled });
  });
}

if (smsToggle) {
  smsToggle.addEventListener("click", () => {
    smsToggle.classList.toggle("active");
    const enabled = smsToggle.classList.contains("active");
    localStorage.setItem("smsNotifications", enabled);
    syncSettings({ smsNotification: enabled });
  });
}

// Load saved UI preferences once DOM is ready
function applySavedUiPreferences() {
  const darkModeEnabled = localStorage.getItem("darkMode") === "true";
  initSidebarPageTransitions();

  if (body) {
    body.classList.toggle("dark", darkModeEnabled);
  }
  if (toggle) {
    toggle.classList.toggle("active", darkModeEnabled);
  }
  updateThemeLogo(darkModeEnabled);

  // Apply saved font size globally
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    document.body.style.fontSize = savedFontSize;
    const fontSelector = document.querySelector(".font-selector");
    if (fontSelector) {
      fontSelector.value = savedFontSize;
    }
  }
  if (emailToggle && localStorage.getItem("emailNotifications") === "true") {
    emailToggle.classList.add("active");
  }
  if (pushToggle && localStorage.getItem("pushNotifications") === "true") {
    pushToggle.classList.add("active");
  }
  if (smsToggle && localStorage.getItem("smsNotifications") === "true") {
    smsToggle.classList.add("active");
  }

  loadUserProfile();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applySavedUiPreferences);
} else {
  applySavedUiPreferences();
}

// Login functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const staffId = document.getElementById("ID").value.trim();
    const password = document.getElementById("Password").value;

    if (!staffId || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector(".submit-button");
    const originalText = submitBtn ? submitBtn.textContent : "Login";
    if (submitBtn) {
      submitBtn.textContent = "Logging in...";
      submitBtn.disabled = true;
    }

    try {
      const data = await RetrigencyAPI.auth.login(staffId, password);

      // Successful login
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      window.location.href = "screens/dashboard.html";
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// Retrieve password functionality
const retrieveForm = document.getElementById("retrieveForm");
if (retrieveForm) {
  retrieveForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const staffIdInput = document.getElementById("staffId");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    if (!staffIdInput || !emailInput || !phoneInput) return;

    const staffId = staffIdInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Get selected retrieval modes
    const retrievalModes = [];
    const smsRet = document.getElementById("sms-retrieval");
    const emailRet = document.getElementById("email-retrieval");

    if (smsRet && smsRet.checked) retrievalModes.push("sms");
    if (emailRet && emailRet.checked) retrievalModes.push("email");

    if (!staffId || !email || !phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (retrievalModes.length === 0) {
      alert("Please select at least one retrieval mode");
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector(".button");
    const originalText = submitBtn ? submitBtn.textContent : "Send";
    if (submitBtn) {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
    }

    try {
      const data = await RetrigencyAPI.auth.forgotPassword({
        staffId,
        email,
        phone,
        retrievalModes,
      });

      alert(data.message || "Password reset instructions sent successfully!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Retrieve password error:", error);
      alert(error.message || "An error occurred. Please try again later.");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// Clear cache functionality
function clearBrowserCache() {
  // Clear local storage data
  localStorage.clear();

  // Force a hard reload to bypass browser cache
  window.location.reload(true);
}

// Add event listener for clear cache button (assuming button with id 'clear-cache-btn')
const clearCacheBtn = document.getElementById("clear-cache-btn");
if (clearCacheBtn) {
  clearCacheBtn.addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to clear the cache? This will reload the page and clear stored preferences."
      )
    ) {
      clearBrowserCache();
    }
  });
}

/**
 * Notification management logic
 */

const notificationsList = document.getElementById("notificationsList");
const notificationModal = document.getElementById("notificationModal");
const btnOpenAddModal = document.getElementById("btnOpenAddModal");
const notificationForm = document.getElementById("notificationForm");
const modalTitle = document.getElementById("modalTitle");

if (notificationsList) {
  async function loadNotifications() {
    try {
      const response = await RetrigencyAPI.notifications.getAll();
      if (response.status) {
        renderNotifications(response.data);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      notificationsList.innerHTML = `<div class="empty-state"><p>Error loading notifications: ${error.message}</p></div>`;
    }
  }

  function renderNotifications(notifications) {
    if (!notifications || notifications.length === 0) {
      notificationsList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><p>No notifications found.</p></div>`;
      return;
    }

    notificationsList.innerHTML = notifications
      .map(
        (n) => `
      <div class="notification-card" data-id="${n.id}">
        <div class="notification-info">
          <h3>${n.title}</h3>
          <p>${n.message}</p>
          <small style="color:#adb5bd; margin-top:8px; display:block">
            ${new Date(n.createdAt).toLocaleString()}
          </small>
        </div>
        <div class="notification-actions">
          <button class="btn-icon edit" onclick="editNotification('${n.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon delete" onclick="deleteNotification('${
            n.id
          }')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Global functions for inline actions
  window.editNotification = async (id) => {
    try {
      const response = await RetrigencyAPI.notifications.getById(id);
      if (response.status) {
        const n = response.data;
        document.getElementById("notificationId").value = n.id;
        document.getElementById("title").value = n.title;
        document.getElementById("message").value = n.message;
        modalTitle.textContent = "Edit Notification";
        notificationModal.classList.add("active");
      }
    } catch (error) {
      alert("Error fetching notification: " + error.message);
    }
  };

  window.deleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      const response = await RetrigencyAPI.notifications.delete(id);
      if (response.status) {
        loadNotifications();
      }
    } catch (error) {
      alert("Error deleting notification: " + error.message);
    }
  };

  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener("click", () => {
      notificationForm.reset();
      document.getElementById("notificationId").value = "";
      modalTitle.textContent = "Add Notification";
      notificationModal.classList.add("active");
    });
  }

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      notificationModal.classList.remove("active");
    });
  });

  if (notificationForm) {
    notificationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("notificationId").value;
      const data = {
        title: document.getElementById("title").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      const submitBtn = document.getElementById("btnSubmit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";

      try {
        let response;
        if (id) {
          response = await RetrigencyAPI.notifications.update(id, data);
        } else {
          response = await RetrigencyAPI.notifications.create(data);
        }

        if (response.status) {
          notificationModal.classList.remove("active");
          loadNotifications();
        }
      } catch (error) {
        alert("Error saving notification: " + error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Notification";
      }
    });
  }

  loadNotifications();
}
