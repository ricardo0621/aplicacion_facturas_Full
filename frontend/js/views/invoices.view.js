/**
 * Invoices List View
 * Displays list of invoices with filters and actions
 */

import { getInvoices, getStatistics } from '../services/invoice.service.js';
import { formatCurrency, formatDate, getEstadoLabel, getEstadoBadgeColor } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { navigateTo } from '../utils/router.js';
import { getCurrentUser, hasRole } from '../utils/auth.js';
import { CONSTANTS } from '../config/config.js';
import { createPagination, attachPaginationListeners, getPaginatedItems } from '../components/pagination.js';

let currentFilters = {};
let allInvoices = [];
let currentPage = 1;
let pageSize = 10;

/**
 * Render invoices list view
 * @param {HTMLElement} container - Container element
 */
export async function renderInvoicesView(container) {
    const user = getCurrentUser();

    // Load statistics
    let stats = null;
    try {
        stats = await getStatistics();
    } catch (error) {
        console.error('Error loading statistics:', error);
    }

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

        ${stats ? `
        <!-- Statistics Section -->
        <div class="mb-lg">
            <h2 style="margin-bottom: 1rem; color: var(--gray-100);">📊 Resumen Histórico</h2>
            <div class="grid grid-cols-3 gap-md">
                <div class="card" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%); backdrop-filter: blur(10px);">
                    <div class="card-body" style="text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📈</div>
                        <div style="font-size: 2.5rem; font-weight: bold; color: white;">${stats.total || 0}</div>
                        <div style="color: rgba(255,255,255,0.9); margin-top: 0.5rem;">Total Facturas Historico</div>
                    </div>
                </div>
                <div class="card" style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.7) 0%, rgba(245, 87, 108, 0.7) 100%); backdrop-filter: blur(10px);">
                    <div class="card-body" style="text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
                        <div style="font-size: 2.5rem; font-weight: bold; color: white;">${stats.mis_pendientes || 0}</div>
                        <div style="color: rgba(255,255,255,0.9); margin-top: 0.5rem;">Mis Facturas Pendientes</div>
                    </div>
                </div>
                <div class="card" style="background: linear-gradient(135deg, rgba(67, 233, 123, 0.7) 0%, rgba(56, 249, 215, 0.7) 100%); backdrop-filter: blur(10px);">
                    <div class="card-body" style="text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
                        <div style="font-size: 2.5rem; font-weight: bold; color: white;">${formatCurrency(stats.mi_monto_total || 0)}</div>
                        <div style="color: rgba(255,255,255,0.9); margin-top: 0.5rem;">Monto de Mis Facturas Pendientes</div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Filters -->
        <div class="card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Filtros</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-cols-4">
                    ${hasRole(CONSTANTS.ROLES.RUTA_1) ? `
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" id="filterEstado">
                            <option value="">Todos</option>
                            <option value="RUTA_1">Devuelta (En Gestión)</option>
                            <option value="RUTA_2_DIRECCION_ADMINISTRATIVA">Dirección Administrativa</option>
                            <option value="RUTA_2_DIRECCION_FINANCIERA">Dirección Financiera</option>
                            <option value="RUTA_2_DIRECCION_MEDICA">Dirección Médica</option>
                            <option value="RUTA_2_DIRECCION_GENERAL">Dirección General</option>
                            <option value="RUTA_2_CONTROL_INTERNO">Control Interno</option>
                            <option value="RUTA_3">Contabilidad</option>
                            <option value="RUTA_4">Tesorería</option>
                            <option value="ANULADA">Anulada</option>
                            <option value="FINALIZADA">Pagada</option>
                        </select>
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label class="form-label">Número de Factura</label>
                        <input type="text" class="form-control" id="filterNumero" placeholder="Buscar...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Proveedor</label>
                        <input type="text" class="form-control" id="filterProveedor" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label class="form-label">NIT Proveedor</label>
                        <input type="text" class="form-control" id="filterNit" placeholder="NIT">
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
                <!-- Pagination Controls -->
                <div id="paginationContainer"></div>
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
    ['filterNumero', 'filterProveedor', 'filterNit'].forEach(id => {
        const element = container.querySelector(`#${id}`);
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
        }
    });

    // Load invoices
    await loadInvoices();
}

/**
 * Apply filters
 */
async function applyFilters() {
    const estadoElement = document.getElementById('filterEstado');
    const estado = estadoElement ? estadoElement.value : '';
    const numero = document.getElementById('filterNumero').value.trim();
    const proveedor = document.getElementById('filterProveedor').value.trim();
    const nit = document.getElementById('filterNit').value.trim();

    currentFilters = {};
    if (estado) currentFilters.estado = estado;
    if (numero) currentFilters.numero_factura = numero;
    if (proveedor) currentFilters.proveedor = proveedor;
    if (nit) currentFilters.nit = nit;

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
            document.getElementById('paginationContainer').innerHTML = '';
            return;
        }

        // Reset to first page when filters change
        if (currentPage > Math.ceil(allInvoices.length / pageSize)) {
            currentPage = 1;
        }

        renderInvoicesPage();

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

/**
 * Render current page of invoices
 */
function renderInvoicesPage() {
    const tbody = document.getElementById('invoicesTableBody');
    const paginationContainer = document.getElementById('paginationContainer');

    // Get paginated items
    const paginatedInvoices = getPaginatedItems(allInvoices, currentPage, pageSize);

    // Render invoices
    tbody.innerHTML = paginatedInvoices.map(invoice => `
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

    // Render pagination controls
    paginationContainer.innerHTML = createPagination({
        currentPage,
        pageSize,
        totalItems: allInvoices.length,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange
    });

    // Attach pagination event listeners
    attachPaginationListeners(handlePageChange, handlePageSizeChange);
}

/**
 * Handle page change
 * @param {number|string} page - Page number or 'prev'/'next'/'last'
 */
function handlePageChange(page) {
    const totalPages = Math.ceil(allInvoices.length / pageSize);

    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1);
    } else if (page === 'last') {
        currentPage = totalPages;
    } else {
        currentPage = page;
    }

    renderInvoicesPage();
}

/**
 * Handle page size change
 * @param {number} newPageSize - New page size
 */
function handlePageSizeChange(newPageSize) {
    pageSize = newPageSize;
    currentPage = 1; // Reset to first page
    renderInvoicesPage();
}

// Make viewInvoiceDetail global
window.viewInvoiceDetail = function (id) {
    navigateTo(`factura/${id}`);
};
