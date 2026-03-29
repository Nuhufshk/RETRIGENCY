/**
 * Reports Screen Logic
 * Handles data fetching, Chart.js visualization, and exports.
 */

let allPatients = [];
let dashboardStats = null;

async function fetchReportData() {
    try {
        const [patientsRes, statsRes] = await Promise.all([
            RetrigencyAPI.patients.getAll(),
            RetrigencyAPI.dashboard.getData()
        ]);

        if (patientsRes.status) {
            allPatients = patientsRes.data;
        }

        if (statsRes.status) {
            dashboardStats = statsRes.data;
        }

        renderCharts();
    } catch (error) {
        console.error("Failed to load report data:", error);
    }
}

function renderCharts() {
    // 1. Gender Distribution Chart
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    const genderCounts = { Male: 0, Female: 0, Other: 0 };
    
    allPatients.forEach(p => {
        if (genderCounts[p.gender] !== undefined) genderCounts[p.gender]++;
        else genderCounts['Other']++;
    });

    new Chart(genderCtx, {
        type: 'doughnut',
        data: {
            labels: ['Male', 'Female', 'Other'],
            datasets: [{
                data: [genderCounts.Male, genderCounts.Female, genderCounts.Other],
                backgroundColor: ['#3b82f6', '#ec4899', '#94a3b8'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. 7-Day Admission Trend
    const admissionCtx = document.getElementById('admissionChart').getContext('2d');
    
    // Group patients by admission date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const admissionHistory = last7Days.map(date => {
        return allPatients.filter(p => p.admissionDate.startsWith(date)).length;
    });

    new Chart(admissionCtx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' })),
            datasets: [{
                label: 'New Admissions',
                data: admissionHistory,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

/**
 * Handle individual report export (CSV)
 */
function exportData(type, format) {
    if (!allPatients.length) {
        alert("No data available to export.");
        return;
    }

    let dataToExport = [];
    let fileName = `Retrigency_${type}_Report_${new Date().toISOString().split('T')[0]}`;

    if (type === 'gender') {
        const genderCounts = { Male: 0, Female: 0, Other: 0 };
        allPatients.forEach(p => {
            if (genderCounts[p.gender] !== undefined) genderCounts[p.gender]++;
            else genderCounts['Other']++;
        });
        dataToExport = [
            { Category: 'Male', Count: genderCounts.Male },
            { Category: 'Female', Count: genderCounts.Female },
            { Category: 'Other', Count: genderCounts.Other }
        ];
    } else if (type === 'admissions') {
        // Last 7 days admissions logic
        const counts = {};
        allPatients.forEach(p => {
            const date = p.admissionDate.split('T')[0];
            counts[date] = (counts[date] || 0) + 1;
        });
        dataToExport = Object.entries(counts).map(([date, count]) => ({ Date: date, Admissions: count }));
    }

    if (format === 'csv') {
        const csv = ExportUtils.convertToCSV(dataToExport);
        ExportUtils.downloadFile(csv, `${fileName}.csv`, 'text/csv');
    }
}

/**
 * Full patient database export
 */
function exportAllPatients(format) {
    if (!allPatients.length) {
        alert("No patient data found.");
        return;
    }

    const fileName = `Retrigency_Patient_List_${new Date().toISOString().split('T')[0]}`;
    
    // Flatten metadata/nested objects for CSV readability
    const flattenedData = allPatients.map(p => ({
        ID: p.id,
        Name: `${p.firstName} ${p.surname}`,
        Gender: p.gender,
        DOB: p.dob.split('T')[0],
        BloodType: p.bloodType,
        AdmissionDate: p.admissionDate.split('T')[0],
        Contact: p.contact || 'N/A',
        GhanaCard: p.ghanaCard || 'N/A'
    }));

    if (format === 'csv') {
        const csv = ExportUtils.convertToCSV(flattenedData);
        ExportUtils.downloadFile(csv, `${fileName}.csv`, 'text/csv');
    }
}

// Global exposure for onClick handlers
window.exportData = exportData;
window.exportAllPatients = exportAllPatients;

// Initialize
document.addEventListener('DOMContentLoaded', fetchReportData);
