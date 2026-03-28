/**
 * MediTrack Add Patient & Patient Management
 * Handles: Add patient form, modal, validation, confirmation, table updates, row clicks
 */

/**
 * Get patients from API
 */
async function getPatients() {
  try {
    const response = await MediTrackAPI.patients.getAll();
    return response.status ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return [];
  }
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

/**
 * Create and inject the Add Patient modal
 */
function createAddPatientModal() {
  const modal = document.createElement("div");
  modal.className = "add-patient-modal";
  modal.id = "addPatientModal";
  modal.innerHTML = `
    <div class="add-patient-modal-overlay"></div>
    <div class="add-patient-modal-content">
      <div class="add-patient-modal-header">
        <h2>Add New Patient</h2>
        <button type="button" class="add-patient-modal-close" aria-label="Close">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <form id="addPatientForm" class="add-patient-form">
        <div class="form-row">
          <div class="form-group">
            <label for="patientFirstName">First Name <span class="required">*</span></label>
            <input type="text" id="patientFirstName" name="firstName" required placeholder="Enter first name">
          </div>
          <div class="form-group">
            <label for="patientSurname">Surname <span class="required">*</span></label>
            <input type="text" id="patientSurname" name="surname" required placeholder="Enter surname">
          </div>
        </div>
        <div class="form-group">
          <label for="patientOtherNames">Other Names (Optional)</label>
          <input type="text" id="patientOtherNames" name="otherNames" placeholder="Enter other names">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="patientDob">Date of Birth <span class="required">*</span></label>
            <input type="date" id="patientDob" name="dob" required>
          </div>
          <div class="form-group">
            <label for="patientAge">Age (auto-calculated)</label>
            <input type="text" id="patientAge" name="age" readonly placeholder="Calculated from DOB">
          </div>
        </div>
        <div class="form-group">
          <label for="patientAddress">Place of Residence / Address <span class="required">*</span></label>
          <input type="text" id="patientAddress" name="address" required placeholder="Enter address">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="patientGender">Gender <span class="required">*</span></label>
            <select id="patientGender" name="gender" required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="patientBloodType">Blood Type <span class="required">*</span></label>
            <select id="patientBloodType" name="bloodType" required>
              <option value="">Select blood type</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="patientContact">Contact <span class="required">*</span></label>
          <input type="tel" id="patientContact" name="contact" required placeholder="e.g. +233545123456">
        </div>
        <div class="form-group">
          <label for="patientGhanaCard">Ghana Card Number (Optional)</label>
          <input type="text" id="patientGhanaCard" name="ghanaCard" placeholder="GHA-XXXXXXXX-X">
        </div>
        <div class="form-group">
          <label>Patient Photo</label>
          <div class="photo-capture-container">
            <div class="photo-capture-preview" id="photoCapturePreview">
              <video id="patientPhotoVideo" autoplay playsinline style="display:none;"></video>
              <img id="patientPhotoPreview" src="" alt="Captured photo" style="display:none;">
              <div class="photo-capture-placeholder" id="photoPlaceholder">
                <i class="fa-solid fa-camera"></i>
                <span>No photo captured</span>
              </div>
            </div>
            <div class="photo-capture-actions">
              <button type="button" class="btn-photo-capture" id="btnStartCamera">
                <i class="fa-solid fa-video"></i> Take Photo
              </button>
              <button type="button" class="btn-photo-capture btn-photo-remove" id="btnRemovePhoto" style="display:none;">
                <i class="fa-solid fa-trash"></i> Remove Photo
              </button>
            </div>
          </div>
          <input type="hidden" id="patientPhoto" name="photo" value="">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="patientEmergency1">Emergency Contact 1 <span class="required">*</span></label>
            <input type="tel" id="patientEmergency1" name="emergencyContact1" required placeholder="Enter contact">
          </div>
          <div class="form-group">
            <label for="patientEmergency2">Emergency Contact 2 (Optional)</label>
            <input type="tel" id="patientEmergency2" name="emergencyContact2" placeholder="Enter contact">
          </div>
        </div>
        <div class="add-patient-form-actions">
          <button type="button" class="btn-cancel" id="btnCancelAddPatient">Cancel</button>
          <button type="submit" class="btn-submit">Add Patient</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/**
 * Show the Add Patient modal
 */
function openAddPatientModal() {
  const modal = document.getElementById("addPatientModal");
  if (modal) {
    modal.classList.add("add-patient-modal--open");
    modal.style.display = "block"; // Ensure visibility if not using custom CSS
    document.body.style.overflow = "hidden";

    const ageInput =
      document.getElementById("patientAge") || document.getElementById("age");
    if (ageInput) ageInput.value = "";

    const form =
      document.getElementById("addPatientForm") ||
      document.getElementById("quickAddPatientForm");
    form?.reset();

    resetPhotoOnModalOpen();

    const focusInput =
      document.getElementById("patientFirstName") ||
      document.getElementById("firstName");
    focusInput?.focus();
  }
}

/**
 * Hide the Add Patient modal
 */
function closeAddPatientModal() {
  const modal = document.getElementById("addPatientModal");
  if (modal) {
    modal.classList.remove("add-patient-modal--open");
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

/**
 * Add patient via API
 */
async function addPatient(patientData) {
  try {
    // Current user's ID as doctorId (defaulting to 1 if not available for demo fallback)
    const doctorId = window.currentUser ? Number(window.currentUser.id) : 1;
    const admissionDate = new Date().toISOString().split("T")[0];

    const payload = {
      ...patientData,
      doctorId,
      admissionDate,
    };

    const response = await MediTrackAPI.patients.create(payload);

    if (response.status) {
      alert("Patient added successfully!");
      closeAddPatientModal();

      // Redirect or refresh
      if (!window.location.pathname.includes("patients_data")) {
        window.location.href = "patients_data.html";
      } else {
        renderPatientsTable();
      }
    } else {
      alert("Error adding patient: " + (response.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Add patient error:", error);
    alert("Failed to add patient. Please check all fields.");
  }
}

/**
 * Filter patients locally for UI search
 */
function filterPatients(patients, query, searchType) {
  if (!query || !query.trim()) return patients;
  const q = query.trim().toLowerCase();
  return patients.filter((p) => {
    const fullName = [p.firstName, p.surname, p.otherNames]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const id = String(p.id || "").toLowerCase();
    const ghanaCard = (p.ghanaCard || "").toLowerCase();
    switch (searchType) {
      case "name":
        return fullName.includes(q);
      case "id":
        return id.includes(q);
      case "ghanaCard":
        return ghanaCard.includes(q);
      default:
        return fullName.includes(q) || id.includes(q) || ghanaCard.includes(q);
    }
  });
}

/**
 * Delete patient via API
 */
async function deletePatient(patientId) {
  try {
    if (
      !confirm(
        "Are you sure you want to delete this patient? This cannot be undone."
      )
    )
      return;

    const response = await MediTrackAPI.patients.delete(patientId);
    if (response.status) {
      alert("Patient deleted successfully");
      renderPatientsTable();
    } else {
      alert("Error deleting patient: " + (response.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Delete patient error:", error);
    alert("Failed to delete patient.");
  }
}

/**
 * Render patients table
 */
async function renderPatientsTable() {
  const tbody = document.querySelector(".patients-table tbody");
  const footer = document.querySelector(".patients-footer");
  if (!tbody) return;

  tbody.innerHTML =
    '<tr><td colspan="8" style="text-align:center;">Loading patients...</td></tr>';

  const patients = await getPatients();
  const searchInput = document.getElementById("patientSearch");
  const searchTypeSelect = document.getElementById("searchType");
  const query = searchInput ? searchInput.value : "";
  const searchType = searchTypeSelect ? searchTypeSelect.value : "all";
  const filteredPatients = filterPatients(patients, query, searchType);

  if (filteredPatients.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;">No patients found.</td></tr>';
  } else {
    tbody.innerHTML = filteredPatients
      .map((p) => {
        const fullName = [p.firstName, p.surname, p.otherNames]
          .filter(Boolean)
          .join(" ");
        const statusClass =
          p.status === "Active"
            ? "status-badge--active"
            : "status-badge--discharged";
        // Format admission date
        const adDate = p.admissionDate
          ? new Date(p.admissionDate).toLocaleDateString()
          : "-";

        return `
        <tr class="patient-row" data-patient-id="${p.id}">
          <td>P${String(p.id).padStart(3, "0")}</td>
          <td>${fullName}</td>
          <td>${p.age || "-"}</td>
          <td>${p.gender || "-"}</td>
          <td>${
            p.bloodType?.replace("_POSITIVE", "+")?.replace("_NEGATIVE", "-") ||
            "-"
          }</td>
          <td>${adDate}</td>
          <td><span class="status-badge ${statusClass}">${p.status}</span></td>
          <td class="table-actions">
            <i class="fa-regular fa-eye" title="View"></i>
            <i class="fa-regular fa-pen-to-square" title="Edit"></i>
            <i class="fa-regular fa-trash-can table-delete-btn" data-patient-id="${
              p.id
            }" title="Delete"></i>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  if (footer) {
    footer.textContent = `Showing ${filteredPatients.length} of ${patients.length} patients`;
  }

  attachRowClickHandlers();
  attachDeleteHandlers();
}

/**
 * Attach delete button handlers in table
 */
function attachDeleteHandlers() {
  document.querySelectorAll(".table-delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const patientId = btn.getAttribute("data-patient-id");
      if (patientId) deletePatient(patientId);
    });
  });
}

/**
 * Photo capture logic
 */
let photoStream = null;
function initPhotoCapture(modal) {
  const video = modal.querySelector("#patientPhotoVideo");
  const previewImg = modal.querySelector("#patientPhotoPreview");
  const placeholder = modal.querySelector("#photoPlaceholder");
  const photoInput = modal.querySelector("#patientPhoto");
  const btnStartCamera = modal.querySelector("#btnStartCamera");
  const btnRemovePhoto = modal.querySelector("#btnRemovePhoto");

  function stopCamera() {
    if (photoStream) {
      photoStream.getTracks().forEach((track) => track.stop());
      photoStream = null;
    }
    if (video) {
      video.srcObject = null;
      video.style.display = "none";
    }
  }

  function resetPhotoCapture() {
    stopCamera();
    if (previewImg) {
      previewImg.src = "";
      previewImg.style.display = "none";
    }
    if (placeholder) placeholder.style.display = "flex";
    if (photoInput) photoInput.value = "";
    if (btnRemovePhoto) btnRemovePhoto.style.display = "none";
    if (btnStartCamera) {
      btnStartCamera.innerHTML = '<i class="fa-solid fa-video"></i> Take Photo';
      btnStartCamera.disabled = false;
    }
  }

  btnStartCamera?.addEventListener("click", async function () {
    if (video.style.display === "none" || !video.srcObject) {
      try {
        photoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        video.srcObject = photoStream;
        video.style.display = "block";
        placeholder.style.display = "none";
        previewImg.style.display = "none";
        btnStartCamera.innerHTML = '<i class="fa-solid fa-camera"></i> Capture';
      } catch (err) {
        alert(
          "Could not access camera: " + (err.message || "Permission denied")
        );
      }
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      photoInput.value = dataUrl;
      previewImg.src = dataUrl;
      previewImg.style.display = "block";
      video.style.display = "none";
      stopCamera();
      placeholder.style.display = "none";
      btnRemovePhoto.style.display = "inline-flex";
      btnStartCamera.innerHTML = '<i class="fa-solid fa-video"></i> Take Photo';
    }
  });

  btnRemovePhoto?.addEventListener("click", resetPhotoCapture);

  modal
    .querySelector(".add-patient-modal-close")
    ?.addEventListener("click", stopCamera);
  modal
    .querySelector(".add-patient-modal-overlay")
    ?.addEventListener("click", stopCamera);
}

function resetPhotoOnModalOpen() {
  const photoInput = document.getElementById("patientPhoto");
  const previewImg = document.getElementById("patientPhotoPreview");
  const placeholder = document.getElementById("photoPlaceholder");
  const btnRemovePhoto = document.getElementById("btnRemovePhoto");

  if (photoInput) photoInput.value = "";
  if (previewImg) {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
  if (placeholder) placeholder.style.display = "flex";
  if (btnRemovePhoto) btnRemovePhoto.style.display = "none";
}

/**
 * Handle row navigation
 */
function attachRowClickHandlers() {
  document.querySelectorAll(".patient-row").forEach((row) => {
    const patientId = row.getAttribute("data-patient-id");
    row.addEventListener("click", (e) => {
      if (e.target.closest(".table-actions")) return;
      window.location.href = `patient-detail.html?id=${patientId}`;
    });
  });
}

/**
 * Init
 */
function init() {
  let modal = document.getElementById("addPatientModal");
  if (!modal) modal = createAddPatientModal();

  document.querySelectorAll(".add-patient-btn").forEach((btn) => {
    btn.addEventListener("click", openAddPatientModal);
  });

  modal
    .querySelector(".add-patient-modal-close")
    ?.addEventListener("click", closeAddPatientModal);
  modal
    .querySelector(".close-modal")
    ?.addEventListener("click", closeAddPatientModal);
  modal
    .querySelector(".add-patient-modal-overlay")
    ?.addEventListener("click", closeAddPatientModal);
  document
    .getElementById("btnCancelAddPatient")
    ?.addEventListener("click", closeAddPatientModal);

  initPhotoCapture(modal);

  document
    .getElementById("patientDob")
    ?.addEventListener("change", function () {
      document.getElementById("patientAge").value = calculateAge(this.value);
    });

  const patientForm =
    document.getElementById("addPatientForm") ||
    document.getElementById("quickAddPatientForm");
  patientForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      firstName: (
        document.getElementById("patientFirstName") ||
        document.getElementById("firstName")
      )?.value,
      surname: (
        document.getElementById("patientSurname") ||
        document.getElementById("surname")
      )?.value,
      otherNames: document.getElementById("patientOtherNames")?.value || "",
      dob: (
        document.getElementById("patientDob") || document.getElementById("dob")
      )?.value,
      address: document.getElementById("patientAddress")?.value || "",
      gender: (
        document.getElementById("patientGender") ||
        document.getElementById("gender")
      )?.value,
      bloodType:
        document.getElementById("patientBloodType")?.value || "O_POSITIVE",
      contact: (
        document.getElementById("patientContact") ||
        document.getElementById("contact")
      )?.value,
      ghanaCard: document.getElementById("patientGhanaCard")?.value || "",
      emergencyContact1:
        document.getElementById("patientEmergency1")?.value || "",
      emergencyContact2:
        document.getElementById("patientEmergency2")?.value || "",
      photo: document.getElementById("patientPhoto")?.value || "",
    };
    addPatient(formData);
  });

  renderPatientsTable();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
