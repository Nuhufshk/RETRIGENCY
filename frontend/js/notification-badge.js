/**
 * notification-badge.js
 * Fetches notifications and updates the unread badge (red dot + count) on all screens.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Basic styles for the badge count if we need to add a number inside the dot
    const style = document.createElement('style');
    style.innerHTML = `
        .notification-link {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .notification-dot {
            position: absolute;
            background: #dc3545;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .notification-dot.has-count {
            width: auto;
            height: 16px;
            min-width: 16px;
            border-radius: 8px;
            padding: 0 5px;
            font-size: 10px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            top: -6px;
            right: -8px;
            font-weight: 600;
            line-height: 1;
        }

    `;
    document.head.appendChild(style);

    async function updateNotificationBadge() {
        try {
            // Get all notifications from API
            const response = await RetrigencyAPI.notifications.getAll();
            if (response && response.status && Array.isArray(response.data)) {
                const count = response.data.length;
                
                // Find all notification bell container elements
                const bellLinks = document.querySelectorAll('.notification-link, .top-nav-icons a[href="notifications.html"]');
                
                bellLinks.forEach(link => {
                    // Ensure it has notification-link class
                    if (!link.classList.contains('notification-link')) {
                        link.classList.add('notification-link');
                    }
                    
                    // Make sure it's positioned relatively to hold the absolute badge
                    link.style.position = 'relative';
                    link.style.display = 'inline-block';

                    let dot = link.querySelector('.notification-dot');
                    
                    if (count > 0) {
                        if (!dot) {
                            dot = document.createElement('span');
                            dot.className = 'notification-dot';
                            link.appendChild(dot);
                        }
                        dot.className = 'notification-dot has-count';
                        dot.textContent = count > 99 ? '99+' : count;
                        dot.style.display = 'flex';
                    } else if (dot) {
                        dot.style.display = 'none';
                    }
                });
            }
        } catch (error) {
            console.error("Failed to load notifications for badge:", error);
        }
    }

    // Run on load
    updateNotificationBadge();
    
    // Optionally poll every 60 seconds to keep updated
    setInterval(updateNotificationBadge, 60000);
});
