/**
 * Dashboard Initialization
 * Main entry point for the dashboard page
 */

import { getCurrentUser, logout, hasRole, requireAuth } from './js/utils/auth.js';
import { CONSTANTS } from './js/config/config.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!requireAuth()) {
        window.location.href = '/login.html';
        return;
    }

    const user = getCurrentUser();

    // Initialize UI
    function initUI() {
        // Set user info
        const userNameEl = document.getElementById('userName');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = user.nombre;

        // Set avatar initial
        if (userAvatarEl) {
            const initial = user.nombre.charAt(0).toUpperCase();
            userAvatarEl.textContent = initial;
        }

        // Show/hide elements based on role
        if (hasRole(CONSTANTS.ROLES.SUPER_ADMIN)) {
            document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
        }

        if (hasRole(CONSTANTS.ROLES.RUTA_1)) {
            document.querySelectorAll('.ruta1-only').forEach(el => el.classList.remove('hidden'));
        }

        // Show search link only if user has permission
        if (user.puede_buscar_facturas) {
            document.querySelectorAll('.search-only').forEach(el => el.classList.remove('hidden'));
        }
    }

    // User dropdown toggle
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userButton && userDropdown) {
        userButton.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Initialize
    initUI();
});
