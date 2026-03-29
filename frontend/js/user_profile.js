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
    fullNameInput: document.getElementById("profileFullName"),
    emailInput: document.getElementById("profileEmail"),
    staffIdInput: document.getElementById("profileStaffId") || document.getElementById("staffId"),
    departmentInput: document.getElementById("departmentId"),
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
  let currentProfile = null;

  async function init() {
    try {
      const meResponse = await RetrigencyAPI.auth.me();
      if (!meResponse.status) throw new Error("Failed to fetch user info");
      const user = meResponse.user;
      currentUserId = user.id;

      if (profileDisplay.email) profileDisplay.email.textContent = user.email;
      if (profileForm.emailInput) profileForm.emailInput.value = user.email;

      try {
        const profileResponse = await RetrigencyAPI.profiles.getByUserId(currentUserId);
        if (profileResponse.status && profileResponse.data) {
          currentProfile = profileResponse.data;
          updateProfileUI(currentProfile);
          populateForms(currentProfile);
        }
      } catch (profileError) {
        console.warn("Profile not found:", profileError.message);
        if (profileDisplay.fullName) profileDisplay.fullName.textContent = "Not Set";
        if (profileDisplay.staffId) profileDisplay.staffId.textContent = "Not Set";
        if (profileDisplay.department) profileDisplay.department.textContent = "Not Set";
      }
    } catch (error) {
      console.error("Initialization error:", error);
    }
  }

  function updateProfileUI(profile) {
    const firstName = profile.firstName || "Staff";
    const lastName = profile.lastName || "";
    const fullName = [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ");

    if (profileDisplay.fullName) profileDisplay.fullName.textContent = fullName || "Not Set";
    if (profileDisplay.staffId) profileDisplay.staffId.textContent = profile.staffId || "Not Set";
    if (profileDisplay.department) {
      profileDisplay.department.textContent = profile.department ? profile.department.name : "Not Set";
    }

    // Persist name to localStorage for all pages
    localStorage.setItem("retrigency_user_name", firstName);

    // Update top nav on current page immediately
    document.querySelectorAll(".user p").forEach((el) => {
      if (el.dataset.navUser || el.textContent.trim() === "Staff") {
        el.textContent = firstName;
        el.dataset.navUser = "true";
      }
    });
    document.querySelectorAll(".top-nav-icons a").forEach((a) => {
      if (a.href && a.href.includes("user_profile")) {
        const icon = a.querySelector("i");
        if (icon) {
          a.textContent = "";
          a.appendChild(icon);
          a.append(firstName);
        }
      }
    });

    // Update profile image with name-based avatar
    const profileImg = document.getElementById("profile-image-display");
    if (profileImg) {
      profileImg.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(firstName + " " + lastName) + "&background=0D8ABC&color=fff&size=128";
    }
  }

  function populateForms(profile) {
    if (profileForm.firstName) profileForm.firstName.value = profile.firstName || "";
    if (profileForm.middleName) profileForm.middleName.value = profile.middleName || "";
    if (profileForm.lastName) profileForm.lastName.value = profile.lastName || "";

    if (profileForm.fullNameInput) {
      profileForm.fullNameInput.value = [profile.firstName, profile.middleName, profile.lastName]
        .filter(Boolean)
        .join(" ");
    }

    if (profileForm.staffIdInput) profileForm.staffIdInput.value = profile.staffId || "";

    // Set Department NAME in the disabled input
    if (profileForm.departmentInput) {
      profileForm.departmentInput.value = profile.department ? profile.department.name : "Not Assigned";
    }

    if (settingsForm.theme) settingsForm.theme.value = profile.theme || "light";
    if (settingsForm.language) settingsForm.language.value = profile.language || "english";
    if (settingsForm.emailNotification) settingsForm.emailNotification.checked = profile.emailNotification ?? true;
    if (settingsForm.pushNotification) settingsForm.pushNotification.checked = profile.pushNotification ?? true;
    if (settingsForm.smsNotification) settingsForm.smsNotification.checked = profile.smsNotification ?? true;
  }

  saveProfileBtn?.addEventListener("click", async () => {
    if (!currentUserId || !currentProfile) return;

    let profileData = {};
    const newEmail = profileForm.emailInput ? profileForm.emailInput.value.trim() : null;

    if (profileForm.fullNameInput) {
      const fullName = profileForm.fullNameInput.value.trim();
      const nameParts = fullName.split(" ");
      profileData = {
        firstName: nameParts[0] || "",
        lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
        middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : null,
      };
    } else {
      profileData = {
        firstName: profileForm.firstName.value.trim(),
        middleName: profileForm.middleName.value.trim() || null,
        lastName: profileForm.lastName.value.trim(),
      };
    }

    // Include existing immutable details
    profileData.staffId = currentProfile.staffId;
    profileData.departmentId = currentProfile.departmentId;

    if (!profileData.firstName || !profileData.lastName) {
      alert("First Name and Last Name are required.");
      return;
    }

    try {
      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = "Saving...";

      // Run profile update and email update in parallel
      const tasks = [RetrigencyAPI.profiles.upsert(currentUserId, profileData)];
      if (newEmail && newEmail !== profileForm.emailInput.defaultValue) {
        tasks.push(RetrigencyAPI.users.update(currentUserId, { email: newEmail }));
      }
      await Promise.all(tasks);

      alert("Profile updated successfully!");

      // Immediately reflect email change
      if (profileDisplay.email && newEmail) {
        profileDisplay.email.textContent = newEmail;
      }

      // Refresh profile data and reflect in UI
      const refreshed = await RetrigencyAPI.profiles.getByUserId(currentUserId);
      currentProfile = refreshed.data;
      updateProfileUI(currentProfile);
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = "Save Changes";
    }
  });

  saveSettingsBtn?.addEventListener("click", async () => {
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
      const response = await RetrigencyAPI.profiles.updateSettings(currentUserId, settingsData);
      if (response.status) {
        alert("Settings updated successfully!");
        document.body.classList.toggle("dark", settingsData.theme === "dark");
      }
    } catch (error) {
      alert("Error updating settings: " + error.message);
    } finally {
      saveSettingsBtn.disabled = false;
      saveSettingsBtn.textContent = "Save Settings";
    }
  });

  init();
});
