/**
 * Dashboard - Dynamic stats and recent activity from API
 */

async function updateDashboard(data) {
  if (!data || !data.stats) return;

  const stats = data.stats;
  const statsCards = document.querySelectorAll(".stats-card");

  if (statsCards.length >= 4) {
    const statValues = [
      {
        value: stats.totalPatients.total.toLocaleString(),
        sub: `${stats.totalPatients.addedToday} added today`,
      },
      {
        value: stats.todayAdmissions.total,
        sub: `${stats.todayAdmissions.pendingVerification} pending verification`,
      },
      {
        value: stats.faceIdScans.total,
        sub: "Today",
      },
      {
        value: stats.activeCases.total,
        sub: stats.activeCases.description,
      },
    ];

    statsCards.forEach((card, i) => {
      const h3 = card.querySelector("h3");
      const p = card.querySelector(":scope > p");
      if (h3) h3.textContent = statValues[i].value;
      if (p) p.textContent = statValues[i].sub;
    });
  }

  // Update Recent Activity (using recent patients for now as "activity")
  const container = document.querySelector(".recent-activity-list");
  if (!container) return;

  if (!data.recentPatients || data.recentPatients.length === 0) {
    container.innerHTML =
      '<div class="recent-activity-item"><span class="activity-tag grey">No recent activity</span></div>';
    return;
  }

  container.innerHTML = data.recentPatients
    .map((p) => {
      const fullName = [p.firstName, p.surname, p.otherNames]
        .filter(Boolean)
        .join(" ");
      return `
                <div class="recent-activity-item">
                    <span class="activity-tag green">New patient</span>
                    <span class="activity-text">${fullName} registered</span>
                    <span class="activity-time">${formatRelativeTime(
                      p.createdAt
                    )}</span>
                </div>
            `;
    })
    .join("");
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

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

async function initDashboard() {
  try {
    const response = await MediTrackAPI.dashboard.getData();
    if (response.status) {
      updateDashboard(response.data);
    }
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
