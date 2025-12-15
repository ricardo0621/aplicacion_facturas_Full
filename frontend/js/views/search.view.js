/**
 * Advanced Search View
 * Search invoices with multiple filters
 */

import { get } from '../services/api.service.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { CONSTANTS } from '../config/config.js';
import { formatCurrency, formatDate, getEstadoBadgeColor } from '../utils/formatters.js';
import { navigateTo } from '../utils/router.js';

let providers = [];
let searchResults = [];

/**
 * Render advanced search view
 * @param {HTMLElement} container - Container element
 */
export async function renderAdvancedSearchView(container) {
    container.innerHTML = `
        <div class="mb-xl">
            <h1>Búsqueda Avanzada</h1>
            <p class="welcome-subtitle">Encuentra facturas usando filtros avanzados</p>
        </div>

        <!-- Search Filters Card -->
        <div class="card mb-xl">
            <div class="card-body">
                <h3 style="margin-bottom: var(--spacing-lg);">Filtros de Búsqueda</h3>
                
                <form id="searchForm">
                    <div class="grid grid-cols-3">
                        <!-- Invoice Number -->
                        <div class="form-group">
                            <label class="form-label">Número de Factura</label>
                            <input type="text" class="form-input" id="numeroFactura" placeholder="Ej: FAC-2024-001">
                        </div>

                        <!-- Provider -->
                        <div class="form-group">
                            <label class="form-label">Proveedor</label>
                            <select class="form-select" id="proveedor">
                                <option value="">Todos los proveedores</option>
                            </select>
                        </div>

                        <!-- Status -->
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="estado">
                                <option value="">Todos los estados</option>
                                <option value="PENDIENTE">Devuelta (En Gestión)</option>
                                <option value="EN_REVISION_RUTA_2_DIR_ADM">Dirección Administrativa</option>
                                <option value="EN_REVISION_RUTA_2_DIR_FIN">Dirección Financiera</option>
                                <option value="EN_REVISION_RUTA_2_DIR_MED">Dirección Médica</option>
                                <option value="EN_REVISION_RUTA_2_DIR_GEN">Dirección General</option>
                                <option value="EN_REVISION_RUTA_2_CTRL_INT">Control Interno</option>
                                <option value="EN_REVISION_RUTA_3">Contabilidad</option>
                                <option value="EN_TESORERIA">Tesorería</option>
                                <option value="ANULADO">Anulada</option>
                                <option value="PAGADO">Pagada</option>
                            </select>
                        </div>

                        <!-- Approval Direction Filter -->
                        <div class="form-group">
                            <label class="form-label">Dirección que Aprobó</label>
                            <select class="form-select" id="direccionAprobo">
                                <option value="">Todas las direcciones</option>
                                <option value="RUTA_2_DIRECCION_ADMINISTRATIVA">Dirección Administrativa</option>
                                <option value="RUTA_2_DIRECCION_FINANCIERA">Dirección Financiera</option>
                                <option value="RUTA_2_DIRECCION_MEDICA">Dirección Médica</option>
                                <option value="RUTA_2_DIRECCION_GENERAL">Dirección General</option>
                                <option value="RUTA_3_CONTROL_INTERNO">Control Interno</option>
                                <option value="RUTA_3">Contabilidad</option>
                                <option value="RUTA_4">Tesorería</option>
                            </select>
                        </div>

                        <!-- Date From -->
                        <div class="form-group">
                            <label class="form-label">Fecha Desde</label>
                            <input type="date" class="form-input" id="fechaDesde">
                        </div>

                        <!-- Date To -->
                        <div class="form-group">
                            <label class="form-label">Fecha Hasta</label>
                            <input type="date" class="form-input" id="fechaHasta">
                        </div>

                        <!-- Amount From -->
                        <div class="form-group">
                            <label class="form-label">Monto Desde</label>
                            <input type="number" class="form-input" id="montoDesde" placeholder="0" min="0" step="0.01">
                        </div>

                        <!-- Amount To -->
                        <div class="form-group">
                            <label class="form-label">Monto Hasta</label>
                            <input type="number" class="form-input" id="montoHasta" placeholder="0" min="0" step="0.01">
                        </div>

                        <!-- Search Buttons -->
                        <div class="form-group" style="display: flex; align-items: flex-end; gap: 0.5rem;">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">
                                🔍 Buscar
                            </button>
                            <button type="button" class="btn btn-secondary" id="btnClearFilters" style="flex: 1;">
                                🔄 Limpiar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Results Card -->
        <div class="card">
            <div class="card-body">
                <div class="flex justify-between items-center mb-lg">
                    <h3 style="margin: 0;">Resultados de Búsqueda</h3>
                    <span id="resultsCount" class="badge badge-primary">0 resultados</span>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Proveedor</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="resultsTableBody">
                            <tr>
                                <td colspan="6" class="text-center" style="color: var(--gray-400);">
                                    Utiliza los filtros para buscar facturas
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Load providers for dropdown
    await loadProviders();

    // Attach event listeners
    document.getElementById('searchForm')?.addEventListener('submit', handleSearch);
    document.getElementById('btnClearFilters')?.addEventListener('click', clearFilters);
}

/**
 * Load providers for dropdown
 */
async function loadProviders() {
    try {
        const response = await get('/proveedores');
        providers = response.proveedores || response || [];

        const select = document.getElementById('proveedor');
        if (select && providers.length > 0) {
            providers.forEach(provider => {
                const option = document.createElement('option');
                option.value = provider.id;
                option.textContent = `${provider.nombre} (${provider.nit})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading providers:', error);
    }
}

/**
 * Handle search form submission
 */
async function handleSearch(e) {
    e.preventDefault();

    const filters = {
        numero_factura: document.getElementById('numeroFactura').value.trim(),
        proveedor_id: document.getElementById('proveedor').value,
        estado: document.getElementById('estado').value,
        direccion_aprobo: document.getElementById('direccionAprobo').value,
        fecha_desde: document.getElementById('fechaDesde').value,
        fecha_hasta: document.getElementById('fechaHasta').value,
        monto_desde: document.getElementById('montoDesde').value,
        monto_hasta: document.getElementById('montoHasta').value
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });

    // Check if at least one filter is provided
    if (Object.keys(filters).length === 0) {
        showError('Error', 'Debe especificar al menos un filtro de búsqueda');
        return;
    }

    try {
        // Build query string
        const queryString = new URLSearchParams(filters).toString();
        const response = await get(`/facturas?${queryString}`);

        searchResults = response.facturas || response || [];
        renderResults();

        if (searchResults.length === 0) {
            showToast('Info', 'No se encontraron facturas con los filtros especificados', 'info');
        } else {
            showSuccess('Éxito', `Se encontraron ${searchResults.length} factura(s)`);
        }
    } catch (error) {
        console.error('Error searching invoices:', error);
        showError('Error', error.message || 'No se pudo realizar la búsqueda');
        searchResults = [];
        renderResults();
    }
}

/**
 * Render search results
 */
function renderResults() {
    const tbody = document.getElementById('resultsTableBody');
    const countBadge = document.getElementById('resultsCount');

    if (!tbody) return;

    // Update count
    if (countBadge) {
        countBadge.textContent = `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''}`;
    }

    if (searchResults.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="color: var(--gray-400);">
                    No se encontraron resultados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = searchResults.map(factura => {
        const badgeColor = getEstadoBadgeColor(factura.estado);
        const estadoLabel = CONSTANTS.ESTADO_LABELS[factura.estado] || factura.estado;

        return `
            <tr>
                <td><strong>${factura.numero_factura}</strong></td>
                <td>${factura.proveedor_nombre || '-'}</td>
                <td>${formatDate(factura.fecha_factura)}</td>
                <td><strong>${formatCurrency(factura.monto_total)}</strong></td>
                <td>
                    <span class="badge badge-${badgeColor}">
                        ${estadoLabel}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.viewInvoiceDetail(${factura.factura_id})">
                        👁️ Ver Detalle
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Clear all filters
 */
function clearFilters() {
    document.getElementById('searchForm').reset();
    searchResults = [];
    renderResults();

    const countBadge = document.getElementById('resultsCount');
    if (countBadge) {
        countBadge.textContent = '0 resultados';
    }

    const tbody = document.getElementById('resultsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="color: var(--gray-400);">
                    Utiliza los filtros para buscar facturas
                </td>
            </tr>
        `;
    }
}

// Make function global for inline onclick
window.viewInvoiceDetail = function (id) {
    navigateTo(`factura/${id}`);
};
