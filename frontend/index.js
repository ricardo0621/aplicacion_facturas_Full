/**
 * Dashboard Initialization
 * Main entry point for the dashboard page
 */

import { getCurrentUser, logout, hasRole, requireAuth } from './js/utils/auth.js';
import { get } from './js/services/api.service.js';
import { formatCurrency, formatDate, getEstadoLabel, getEstadoBadgeColor } from './js/utils/formatters.js';
import { showToast } from './js/components/toast.js';
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
        const welcomeNameEl = document.getElementById('welcomeName');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = user.nombre;
        if (welcomeNameEl) welcomeNameEl.textContent = user.nombre;

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

    // Load dashboard statistics
    async function loadDashboardStats() {
        try {
            const response = await get('/facturas');
            const facturas = response.facturas || response || [];

            // Calculate stats
            const pendientes = facturas.filter(f => f.estado_codigo !== CONSTANTS.ESTADOS.FINALIZADA && f.estado_codigo !== CONSTANTS.ESTADOS.ANULADA).length;
            const finalizadas = facturas.filter(f => f.estado_codigo === CONSTANTS.ESTADOS.FINALIZADA).length;

            // Update UI
            const statPendientesEl = document.getElementById('statPendientes');
            const statFinalizadasEl = document.getElementById('statFinalizadas');
            const statTotalEl = document.getElementById('statTotal');

            if (statPendientesEl) statPendientesEl.textContent = pendientes;
            if (statFinalizadasEl) statFinalizadasEl.textContent = finalizadas;
            if (statTotalEl) statTotalEl.textContent = facturas.length;

            // Load recent invoices
            loadRecentInvoices(facturas.slice(0, 10));
        } catch (error) {
            console.error('Error loading stats:', error);
            showToast('Error', 'No se pudieron cargar las estadísticas', 'error');
        }
    }

    // Load recent invoices
    function loadRecentInvoices(facturas) {
        const tbody = document.getElementById('recentInvoicesBody');
        if (!tbody) return;

        if (facturas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay facturas recientes</td></tr>';
            return;
        }

        tbody.innerHTML = facturas.map(factura => `
            <tr>
                <td><strong>${factura.numero_factura}</strong></td>
                <td>${factura.proveedor_nombre || '-'}</td>
                <td>${formatCurrency(factura.monto)}</td>
                <td>
                    <span class="badge badge-${getEstadoBadgeColor(factura.estado_codigo)}">
                        ${getEstadoLabel(factura.estado_codigo)}
                    </span>
                </td>
                <td>${formatDate(factura.fecha_creacion)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.viewInvoice(${factura.factura_id})">
                        Ver
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Quick action buttons
    const btnVerFacturas = document.getElementById('btnVerFacturas');
    const btnBusqueda = document.getElementById('btnBusqueda');
    const btnNuevaFactura = document.getElementById('btnNuevaFactura');

    if (btnVerFacturas) {
        btnVerFacturas.addEventListener('click', () => {
            window.location.hash = '#facturas';
        });
    }

    if (btnBusqueda) {
        btnBusqueda.addEventListener('click', () => {
            window.location.hash = '#busqueda';
        });
    }

    if (btnNuevaFactura) {
        btnNuevaFactura.addEventListener('click', () => {
            window.location.hash = '#nueva-factura';
        });
    }

    // Initialize
    initUI();
    loadDashboardStats();

    // Refresh stats every 30 seconds
    setInterval(loadDashboardStats, 30000);

    // Make viewInvoice global for inline onclick
    window.viewInvoice = function (id) {
        window.location.hash = `#factura/${id}`;
    };
});
