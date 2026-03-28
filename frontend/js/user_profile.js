document.addEventListener("DOMContentLoaded", () => {
  const profileDisplay = {
    fullName: document.getElementById("full-name-display"),
    email: document.getElementById("email-display"),
    staffId: document.getElementById("staff-id-display"),
    department: document.getElementById("dept-display"),
  };

  const profileForm = {
    firstName: document.getElementById("firstName"),
    middleName: document.getElementById("middleName"),
    lastName: document.getElementById("lastName"),
    departmentId: document.getElementById("departmentId"),
  };

  const settingsForm = {
    theme: document.getElementById("theme"),
    language: document.getElementById("language"),
    emailNotification: document.getElementById("emailNotification"),
    pushNotification: document.getElementById("pushNotification"),
    smsNotification: document.getElementById("smsNotification"),
  };

  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");

  let currentUserId = null;
  let currentStaffId = null;

  /**
   * Initialize page by fetching user and profile data
   */
  async function init() {
    try {
      // 1. Get current user info (email and ID)
      const meResponse = await MediTrackAPI.auth.me();
      if (!meResponse.status) throw new Error("Failed to fetch user info");

      const user = meResponse.user;
      currentUserId = user.id;
      profileDisplay.email.textContent = user.email;

      // 2. Get profile details
      try {
        const profileResponse = await MediTrackAPI.profiles.getByUserId(currentUserId);
        if (profileResponse.status && profileResponse.data) {
          const profile = profileResponse.data;
          updateProfileUI(profile);
          populateForms(profile);
        }
      } catch (profileError) {
        console.warn("Profile not found, user may need to create one:", profileError.message);
        // If profile doesn't exist yet, we only have the email from the user object
        profileDisplay.fullName.textContent = "Not Set";
        profileDisplay.staffId.textContent = "Not Set";
        profileDisplay.department.textContent = "Not Set";
      }
    } catch (error) {
      console.error("Initialization error:", error);
      alert("Error loading profile: " + error.message);
    }
  }

  /**
   * Update the display elements with profile data
   */
  function updateProfileUI(profile) {
    const fullName = [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    
    profileDisplay.fullName.textContent = fullName || "Not Set";
    profileDisplay.staffId.textContent = profile.staffId || "Not Set";
    profileDisplay.department.textContent = profile.department ? profile.department.name : (profile.departmentId || "Not Set");
    
    currentStaffId = profile.staffId;
  }

  /**
   * Populate the forms with existing profile and settings data
   */
  function populateForms(profile) {
    // Profile Form
    profileForm.firstName.value = profile.firstName || "";
    profileForm.middleName.value = profile.middleName || "";
    profileForm.lastName.value = profile.lastName || "";
    profileForm.departmentId.value = profile.departmentId || "";

    // Settings Form
    settingsForm.theme.value = profile.theme || "light";
    settingsForm.language.value = profile.language || "english";
    settingsForm.emailNotification.checked = profile.emailNotification ?? true;
    settingsForm.pushNotification.checked = profile.pushNotification ?? true;
    settingsForm.smsNotification.checked = profile.smsNotification ?? true;
  }

  /**
   * Handle Profile Update (Upsert)
   */
  saveProfileBtn.addEventListener("click", async () => {
    if (!currentUserId) return;

    const profileData = {
      firstName: profileForm.firstName.value.trim(),
      middleName: profileForm.middleName.value.trim() || null,
      lastName: profileForm.lastName.value.trim(),
      staffId: parseInt(currentStaffId || prompt("Enter your Staff ID:")), // If new profile, ask for staff ID
      departmentId: profileForm.departmentId.value ? parseInt(profileForm.departmentId.value) : null
    };

    if (!profileData.firstName || !profileData.lastName || !profileData.staffId) {
      alert("Please fill in all required fields (First Name, Last Name, and Staff ID if new).");
      return;
    }

    try {
      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = "Saving...";
      
      const response = await MediTrackAPI.profiles.upsert(currentUserId, profileData);
      
      if (response.status) {
        alert("Profile updated successfully!");
        // Refresh UI
        const refreshedProfileResponse = await MediTrackAPI.profiles.getByUserId(currentUserId);
        updateProfileUI(refreshedProfileResponse.data);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = "Save Changes";
    }
  });

  /**
   * Handle Settings Update
   */
  saveSettingsBtn.addEventListener("click", async () => {
    if (!currentUserId) return;

    const settingsData = {
      theme: settingsForm.theme.value,
      language: settingsForm.language.value,
      emailNotification: settingsForm.emailNotification.checked,
      pushNotification: settingsForm.pushNotification.checked,
      smsNotification: settingsForm.smsNotification.checked
    };

    try {
      saveSettingsBtn.disabled = true;
      saveSettingsBtn.textContent = "Saving...";
      
      const response = await MediTrackAPI.profiles.updateSettings(currentUserId, settingsData);
      
      if (response.status) {
        alert("Settings updated successfully!");
        
        // Apply theme if changed
        if (settingsData.theme === "dark") {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
      }
    } catch (error) {
      alert("Error updating settings: " + error.message);
    } finally {
      saveSettingsBtn.disabled = false;
      saveSettingsBtn.textContent = "Save Settings";
    }
  });

  // Run initialization
  init();
});
