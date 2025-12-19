/**
 * Main Application Entry Point
 * Handles routing and view management
 */

import { requireAuth } from './js/utils/auth.js';
import { initRouter, registerRoute, updateActiveNav } from './js/utils/router.js';
import { renderInvoicesView } from './js/views/invoices.view.js';
import { renderInvoiceDetailView } from './js/views/invoice-detail.view.js';
import { renderUsersView } from './js/views/users.view.js';
import { renderProvidersView } from './js/views/providers.view.js';
import { renderAdvancedSearchView } from './js/views/search.view.js';
import { renderCreateInvoiceView } from './js/views/create-invoice.view.js';
import { renderCorrectInvoiceView } from './js/views/correct-invoice.view.js';
import { renderDocumentTypesView } from './js/views/document-types.view.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!requireAuth()) {
        window.location.href = '/login.html';
        return;
    }

    // Get view container
    const viewContainer = document.getElementById('viewContainer');
    if (!viewContainer) {
        console.error('View container not found');
        return;
    }

    // Register routes
    registerRoute('dashboard', () => {
        updateActiveNav('dashboard');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.remove('hidden');
        }
        // Clear view container
        if (viewContainer) {
            viewContainer.innerHTML = '';
        }
    });

    registerRoute('facturas', () => {
        updateActiveNav('facturas');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderInvoicesView(viewContainer);
    });

    registerRoute('factura/:id', (params) => {
        updateActiveNav('facturas');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderInvoiceDetailView(viewContainer, params);
    });

    registerRoute('usuarios', () => {
        updateActiveNav('usuarios');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderUsersView(viewContainer);
    });

    registerRoute('proveedores', () => {
        updateActiveNav('proveedores');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderProvidersView(viewContainer);
    });

    registerRoute('nueva-factura', () => {
        updateActiveNav('facturas');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderCreateInvoiceView(viewContainer);
    });

    registerRoute('corregir-factura/:id', (params) => {
        updateActiveNav('facturas');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderCorrectInvoiceView(viewContainer, params.id);
    });

    registerRoute('tipos-soporte', () => {
        updateActiveNav('tipos-soporte');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderDocumentTypesView(viewContainer);
    });

    registerRoute('busqueda', () => {
        updateActiveNav('busqueda');
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        renderAdvancedSearchView(viewContainer);
    });

    // Initialize router
    initRouter();

    // Navigation link handlers
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view) {
                window.location.hash = view;
            }
        });
    });
});
