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
    staffId: document.getElementById("staffId"),
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

  async function init() {
    try {
      const meResponse = await MediTrackAPI.auth.me();
      if (!meResponse.status) throw new Error("Failed to fetch user info");
      const user = meResponse.user;
      currentUserId = user.id;
      profileDisplay.email.textContent = user.email;

      await fetchDepartments();

      try {
        const profileResponse = await MediTrackAPI.profiles.getByUserId(currentUserId);
        if (profileResponse.status && profileResponse.data) {
          const profile = profileResponse.data;
          updateProfileUI(profile);
          populateForms(profile);
        }
      } catch (profileError) {
        console.warn("Profile not found:", profileError.message);
        profileDisplay.fullName.textContent = "Not Set";
        profileDisplay.staffId.textContent = "Not Set";
        profileDisplay.department.textContent = "Not Set";
      }
    } catch (error) {
      console.error("Initialization error:", error);
    }
  }

  async function fetchDepartments() {
    try {
      const response = await MediTrackAPI.departments.getAll();
      if (response.status && response.data) {
        const select = profileForm.departmentId;
        // Keep only the first "Select" option
        select.innerHTML = '<option value="">Select Department</option>';
        response.data.forEach((dept) => {
          const opt = document.createElement("option");
          opt.value = dept.id;
          opt.textContent = dept.name;
          select.appendChild(opt);
        });
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  }

  function updateProfileUI(profile) {
    const fullName = [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    profileDisplay.fullName.textContent = fullName || "Not Set";
    profileDisplay.staffId.textContent = profile.staffId || "Not Set";
    profileDisplay.department.textContent = profile.department ? profile.department.name : "Not Set";
  }

  function populateForms(profile) {
    profileForm.firstName.value = profile.firstName || "";
    profileForm.middleName.value = profile.middleName || "";
    profileForm.lastName.value = profile.lastName || "";
    profileForm.staffId.value = profile.staffId || "";
    profileForm.departmentId.value = profile.departmentId || "";
    settingsForm.theme.value = profile.theme || "light";
    settingsForm.language.value = profile.language || "english";
    settingsForm.emailNotification.checked = profile.emailNotification ?? true;
    settingsForm.pushNotification.checked = profile.pushNotification ?? true;
    settingsForm.smsNotification.checked = profile.smsNotification ?? true;
  }

  saveProfileBtn.addEventListener("click", async () => {
    if (!currentUserId) return;
    const profileData = {
      firstName: profileForm.firstName.value.trim(),
      middleName: profileForm.middleName.value.trim() || null,
      lastName: profileForm.lastName.value.trim(),
      staffId: profileForm.staffId.value.trim(),
      departmentId: profileForm.departmentId.value ? profileForm.departmentId.value : null
    };
    if (!profileData.firstName || !profileData.lastName || !profileData.staffId) {
      alert("First Name, Last Name, and Staff ID are required.");
      return;
    }
    try {
      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = "Saving...";
      const response = await MediTrackAPI.profiles.upsert(currentUserId, profileData);
      if (response.status) {
        alert("Profile updated successfully!");
        const refreshed = await MediTrackAPI.profiles.getByUserId(currentUserId);
        updateProfileUI(refreshed.data);
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
        document.body.classList.toggle("dark", settingsData.theme === "dark");
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

  init();
});
