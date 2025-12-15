/**
 * Invoices List View
 * Displays list of invoices with filters and actions
 */

import { getInvoices } from '../services/invoice.service.js';
import { formatCurrency, formatDate, getEstadoLabel, getEstadoBadgeColor } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { navigateTo } from '../utils/router.js';
import { getCurrentUser, hasRole } from '../utils/auth.js';
import { CONSTANTS } from '../config/config.js';

let currentFilters = {};
let allInvoices = [];

/**
 * Render invoices list view
 * @param {HTMLElement} container - Container element
 */
export async function renderInvoicesView(container) {
    const user = getCurrentUser();

    container.innerHTML = `
        <div class="flex justify-between items-center mb-xl">
            <div>
                <h1>Gestión de Facturas</h1>
                <p class="welcome-subtitle">Administra y revisa todas las facturas</p>
            </div>
            ${hasRole(CONSTANTS.ROLES.RUTA_1) ? `
                <button class="btn btn-primary" id="btnNewInvoice">
                    ➕ Nueva Factura
                </button>
            ` : ''}
        </div>

        <!-- Filters -->
        <div class="card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Filtros</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-cols-4">
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" id="filterEstado">
                            <option value="">Todos</option>
                            <option value="RUTA_1">En Gestión</option>
                            <option value="RUTA_2">En Revisión</option>
                            <option value="RUTA_3">En Contabilidad</option>
                            <option value="RUTA_4">En Tesorería</option>
                            <option value="FINALIZADA">Finalizadas</option>
                            <option value="ANULADA">Anuladas</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Número de Factura</label>
                        <input type="text" class="form-control" id="filterNumero" placeholder="Buscar...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Proveedor</label>
                        <input type="text" class="form-control" id="filterProveedor" placeholder="Nombre o NIT">
                    </div>
                    <div class="form-group">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary" id="btnApplyFilters" style="width: 100%;">
                            🔍 Buscar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoices Table -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Facturas <span id="invoiceCount" class="badge badge-primary">0</span></h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>N° Factura</th>
                                <th>Proveedor</th>
                                <th>NIT</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Fecha Emisión</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="invoicesTableBody">
                            <tr>
                                <td colspan="8" class="text-center">
                                    <div class="spinner" style="margin: 2rem auto;"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    const btnNewInvoice = container.querySelector('#btnNewInvoice');
    if (btnNewInvoice) {
        btnNewInvoice.addEventListener('click', () => {
            navigateTo('nueva-factura');
        });
    }

    const btnApplyFilters = container.querySelector('#btnApplyFilters');
    btnApplyFilters.addEventListener('click', applyFilters);

    // Enter key on filter inputs
    ['filterNumero', 'filterProveedor'].forEach(id => {
        container.querySelector(`#${id}`).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    });

    // Load invoices
    await loadInvoices();
}

/**
 * Apply filters
 */
async function applyFilters() {
    const estado = document.getElementById('filterEstado').value;
    const numero = document.getElementById('filterNumero').value.trim();
    const proveedor = document.getElementById('filterProveedor').value.trim();

    currentFilters = {};
    if (estado) currentFilters.estado = estado;
    if (numero) currentFilters.numero_factura = numero;
    if (proveedor) currentFilters.proveedor = proveedor;

    await loadInvoices();
}

/**
 * Load invoices from API
 */
async function loadInvoices() {
    const tbody = document.getElementById('invoicesTableBody');

    try {
        allInvoices = await getInvoices(currentFilters);

        document.getElementById('invoiceCount').textContent = allInvoices.length;

        if (allInvoices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="padding: 3rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                        <p style="color: var(--gray-400);">No se encontraron facturas</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = allInvoices.map(invoice => `
            <tr>
                <td><strong>${invoice.numero_factura}</strong></td>
                <td>${invoice.proveedor_nombre || '-'}</td>
                <td>${invoice.nit_proveedor || '-'}</td>
                <td>${formatCurrency(invoice.monto)}</td>
                <td>
                    <span class="badge badge-${getEstadoBadgeColor(invoice.estado_codigo)}">
                        ${getEstadoLabel(invoice.estado_codigo)}
                    </span>
                </td>
                <td>${formatDate(invoice.fecha_emision)}</td>
                <td>${formatDate(invoice.fecha_creacion, true)}</td>
                <td>
                    <button 
                        class="btn btn-sm btn-primary" 
                        onclick="window.viewInvoiceDetail(${invoice.factura_id})"
                    >
                        Ver Detalle
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading invoices:', error);
        showToast('Error', 'No se pudieron cargar las facturas', 'error');
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 3rem; color: var(--danger-400);">
                    Error al cargar las facturas. Por favor intente nuevamente.
                </td>
            </tr>
        `;
    }
}

// Make viewInvoiceDetail global
window.viewInvoiceDetail = function (id) {
    navigateTo(`factura/${id}`);
};
