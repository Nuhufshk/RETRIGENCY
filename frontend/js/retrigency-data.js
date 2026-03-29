/**
 * Retrigency Shared Data
 * Activities log, stats, Face ID count - used by dashboard, add-patient, patient-detail
 */
const STORAGE_ACTIVITIES = 'retrigency_activities';
const STORAGE_FACE_ID = 'retrigency_face_id_scans';

/**
 * Add activity to log
 */
function addActivity(type, patientId, patientName) {
  const activities = getActivities();
  activities.unshift({
    type,
    patientId: patientId || '',
    patientName: patientName || '',
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
}

/**
 * Get activities from storage
 */
function getActivities() {
  try {
    const data = localStorage.getItem(STORAGE_ACTIVITIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Format relative time (e.g. "5 minutes ago")
 */
function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
}

/**
 * Get activity display text
 */
function getActivityLabel(activity) {
  switch (activity.type) {
    case 'new_patient': return 'New patient registered';
    case 'discharged': return 'Patient discharged';
    case 'patient_deleted': return 'Patient removed';
    case 'face_id': return 'Face ID verification completed';
    default: return activity.type || 'Activity';
  }
}

/**
 * Get activity tag class
 */
function getActivityTagClass(activity) {
  switch (activity.type) {
    case 'new_patient': return 'green';
    case 'discharged': return 'purple';
    case 'patient_deleted': return 'grey';
    case 'face_id': return 'blue';
    default: return 'grey';
  }
}

/**
 * Get Face ID scan count
 */
function getFaceIdCount() {
  const val = localStorage.getItem(STORAGE_FACE_ID);
  return val ? parseInt(val, 10) : 0;
}

/**
 * Increment Face ID scans (call when Face ID is used)
 */
function incrementFaceIdCount() {
  const count = getFaceIdCount() + 1;
  localStorage.setItem(STORAGE_FACE_ID, String(count));
  return count;
}
