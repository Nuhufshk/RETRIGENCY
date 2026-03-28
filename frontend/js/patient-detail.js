/**
 * Patient Detail Page - Load, display, discharge, delete via API
 */

async function getPatientById(id) {
  try {
    const response = await MediTrackAPI.patients.getById(id);
    return response.status ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    return null;
  }
}

async function dischargePatient(patientId) {
  try {
    if (!confirm("Are you sure you want to discharge this patient?")) return;

    const response = await MediTrackAPI.patients.update(patientId, { status: 'Inactive' }); // Backend schema uses 'Inactive' instead of 'Discharged'
    if (response.status) {
      alert('Patient discharged successfully');
      renderPatientDetail(patientId);
    } else {
      alert('Error: ' + (response.message || 'Could not discharge patient'));
    }
  } catch (error) {
    console.error("Discharge error:", error);
    alert('Failed to discharge patient.');
  }
}

async function deletePatient(patientId) {
  try {
    if (!confirm("Are you sure you want to delete this patient record? This cannot be undone.")) return;

    const response = await MediTrackAPI.patients.delete(patientId);
    if (response.status) {
      alert('Patient deleted successfully');
      window.location.href = 'patients_data.html';
    } else {
      alert('Error: ' + (response.message || 'Could not delete patient'));
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert('Failed to delete patient.');
  }
}

async function renderPatientDetail(patientId) {
  const patient = await getPatientById(patientId);
  const container = document.getElementById('patientDetailContent');

  if (!container) return;

  if (!patient) {
    container.innerHTML = `<p class="error">Patient ${patientId} not found or you don't have permission to view it. <a href="patients_data.html" style="color:var(--primary-color)">Back to patients</a></p>`;
    return;
  }

  const fullName = [patient.firstName, patient.surname, patient.otherNames].filter(Boolean).join(' ');
  const statusClass = patient.status === 'Active' ? 'status-badge--active' : 'status-badge--discharged';
  const photoHtml = patient.photo
    ? `<div class="patient-photo-container"><img src="${patient.photo}" alt="Patient photo" class="patient-photo"></div>`
    : '<div class="patient-photo-container patient-photo-placeholder"><i class="fa-solid fa-user"></i><span>No photo</span></div>';

  const dischargeDisabled = patient.status !== 'Active';

  container.innerHTML = `
    <div class="patient-detail-card">
      <div class="patient-detail-header">
        <div class="patient-detail-title">
          ${photoHtml}
          <div class="patient-detail-name-row">
            <h2>${fullName}</h2>
            <span class="status-badge ${statusClass}">${patient.status}</span>
          </div>
        </div>
      </div>
      <div class="patient-detail-grid">
        <div class="patient-detail-item">
          <label>Patient ID</label>
          <span>P${String(patient.id).padStart(3, '0')}</span>
        </div>
        <div class="patient-detail-item">
          <label>Full Name</label>
          <span>${fullName}</span>
        </div>
        <div class="patient-detail-item">
            <label>Date of Birth</label>
            <span>${patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Gender</label>
          <span>${patient.gender || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Blood Type</label>
          <span>${patient.bloodType?.replace('_POSITIVE', '+')?.replace('_NEGATIVE', '-') || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Admission Date</label>
          <span>${patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : '-'}</span>
        </div>
        <div class="patient-detail-item full-width">
          <label>Place of Residence / Address</label>
          <span>${patient.address || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Contact</label>
          <span>${patient.contact || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Ghana Card Number</label>
          <span>${patient.ghanaCard || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Emergency Contact 1</label>
          <span>${patient.emergencyContact1 || '-'}</span>
        </div>
        <div class="patient-detail-item">
          <label>Emergency Contact 2</label>
          <span>${patient.emergencyContact2 || '-'}</span>
        </div>
      </div>
      <div class="patient-detail-actions">
        <button type="button" class="btn-discharge" id="btnDischarge" ${dischargeDisabled ? 'disabled' : ''}>
          <i class="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
          ${dischargeDisabled ? 'Discharged' : 'Discharge Patient'}
        </button>
        <button type="button" class="btn-delete" id="btnDelete">
          <i class="fa-solid fa-trash-can"></i> Delete Patient
        </button>
      </div>
    </div>
  `;

  document.getElementById('btnDischarge')?.addEventListener('click', () => dischargePatient(patientId));
  document.getElementById('btnDelete')?.addEventListener('click', () => deletePatient(patientId));
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get('id');
  const container = document.getElementById('patientDetailContent');

  if (!patientId) {
    if (container) {
      container.innerHTML = '<p class="error">No patient ID provided. <a href="patients_data.html">Back to patients</a></p>';
    }
    return;
  }

  renderPatientDetail(patientId);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
