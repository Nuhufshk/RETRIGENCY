/**
 * Mobile Menu Toggle Script
 * Handles opening and closing of the sidebar on mobile devices.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if the page has a sidebar
    const sidebar = document.querySelector('.sidebar');
    const mobileToggleBtns = document.querySelectorAll('.mobile-menu-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar) return; // Not a sidebar page

    function openSidebar() {
        sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach click events to all hamburger toggles on the page (usually just 1)
    mobileToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('mobile-open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    });

    // Close when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeSidebar();
        });
    });

    // Close when clicking the overlay
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        }
    });
});
