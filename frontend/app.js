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
    registerRoute('facturas', () => {
        updateActiveNav('facturas');
        renderInvoicesView(viewContainer);
    });

    registerRoute('factura/:id', (params) => {
        updateActiveNav('facturas');
        renderInvoiceDetailView(viewContainer, params);
    });

    registerRoute('usuarios', () => {
        updateActiveNav('usuarios');
        renderUsersView(viewContainer);
    });

    registerRoute('proveedores', () => {
        updateActiveNav('proveedores');
        renderProvidersView(viewContainer);
    });

    registerRoute('nueva-factura', () => {
        updateActiveNav('facturas');
        renderCreateInvoiceView(viewContainer);
    });

    registerRoute('corregir-factura/:id', (params) => {
        updateActiveNav('facturas');
        renderCorrectInvoiceView(viewContainer, params.id);
    });

    registerRoute('tipos-soporte', () => {
        updateActiveNav('tipos-soporte');
        renderDocumentTypesView(viewContainer);
    });

    registerRoute('busqueda', () => {
        updateActiveNav('busqueda');
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
