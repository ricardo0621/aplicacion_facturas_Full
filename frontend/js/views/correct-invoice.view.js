/**
 * Correct Invoice View (RUTA_1)
 * Allows full editing of invoice data and support documents
 */

import { getInvoiceById, correctInvoice, deleteInvoiceDocument } from '../services/invoice.service.js';
import { getProviders } from '../services/provider.service.js';
import { getTiposSoporte } from '../services/tipo-soporte.service.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';
import { navigateTo } from '../utils/router.js';

let currentInvoice = null;
let providers = [];
let tiposSoporte = [];
let filesToDelete = [];
let newSupportFiles = [];

/**
 * Render correct invoice view
 */
export async function renderCorrectInvoiceView(container, invoiceId) {
    try {
        // Load data
        [currentInvoice, providers, tiposSoporte] = await Promise.all([
            getInvoiceById(invoiceId),
            getProviders(),
            getTiposSoporte()
        ]);

        // Separate support documents from main invoice document
        if (currentInvoice.documentos && currentInvoice.documentos.length > 0) {
            // Filter out FACTURA type documents (main invoice document)
            currentInvoice.soportes = currentInvoice.documentos.filter(
                doc => doc.tipo_documento !== 'FACTURA'
            );
        } else {
            currentInvoice.soportes = [];
        }

        filesToDelete = [];
        newSupportFiles = [];

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1>Corregir Factura</h1>
                    <p class="welcome-subtitle">Edite los datos de la factura y gestione los documentos de soporte</p>
                </div>
                <button class="btn btn-secondary" id="btnCancelar">
                    ← Volver
                </button>
            </div>

            <form id="formCorrectInvoice">
                <!-- Invoice Data Card -->
                <div class="card mb-lg">
                    <div class="card-header">
                        <h3 class="card-title">Datos de la Factura</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-2">
                            <!-- Invoice Number -->
                            <div class="form-group">
                                <label class="form-label">Número de Factura *</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    id="numeroFactura" 
                                    value="${currentInvoice.numero_factura}"
                                    required
                                >
                            </div>

                            <!-- Provider -->
                            <div class="form-group">
                                <label class="form-label">Proveedor *</label>
                                <select class="form-select" id="proveedorId" required>
                                    <option value="">Seleccione un proveedor</option>
                                    ${providers.map(p => `
                                        <option value="${p.id}" ${p.id === currentInvoice.proveedor_id ? 'selected' : ''}>
                                            ${p.nombre} - ${p.nit}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <!-- Amount -->
                            <div class="form-group">
                                <label class="form-label">Monto *</label>
                                <input 
                                    type="number" 
                                    class="form-input" 
                                    id="monto" 
                                    value="${currentInvoice.monto}"
                                    step="0.01"
                                    required
                                >
                            </div>

                            <!-- Issue Date -->
                            <div class="form-group">
                                <label class="form-label">Fecha de Emisión *</label>
                                <input 
                                    type="date" 
                                    class="form-input" 
                                    id="fechaEmision" 
                                    value="${currentInvoice.fecha_emision ? currentInvoice.fecha_emision.split('T')[0] : ''}"
                                    required
                                >
                            </div>

                            <!-- Concept -->
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Concepto *</label>
                                <textarea 
                                    class="form-textarea" 
                                    id="concepto" 
                                    rows="3"
                                    required
                                >${currentInvoice.concepto || ''}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Invoice Document Card -->
                <div class="card mb-lg">
                    <div class="card-header">
                        <h3 class="card-title">Documento de Factura</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Documento Actual</label>
                            <div class="file-display">
                                <span>📄 ${currentInvoice.documento_nombre}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Reemplazar Documento (opcional)</label>
                            <input 
                                type="file" 
                                class="form-input" 
                                id="nuevoDocumento"
                                accept=".pdf,.jpg,.jpeg,.png"
                            >
                            <small class="form-help">Formatos permitidos: PDF, JPG, PNG</small>
                        </div>
                    </div>
                </div>

                <!-- Support Documents Card -->
                <div class="card mb-lg">
                    <div class="card-header">
                        <h3 class="card-title">Documentos de Soporte</h3>
                    </div>
                    <div class="card-body">
                        <!-- Existing Support Documents -->
                        <div class="mb-md">
                            <label class="form-label">Documentos Actuales</label>
                            <div id="existingSupportDocs">
                                ${renderExistingSupportDocs()}
                            </div>
                        </div>

                        <!-- Add New Support Documents -->
                        <div class="form-group">
                            <label class="form-label">Agregar Nuevos Documentos</label>
                            <div id="newSupportContainer">
                                ${renderNewSupportForm()}
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm mt-sm" id="btnAddMoreSupport">
                                ➕ Agregar Otro Documento
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-md">
                    <button type="button" class="btn btn-secondary" id="btnCancelarForm">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        💾 Guardar Cambios
                    </button>
                </div>
            </form>
        `;

        // Event listeners
        document.getElementById('btnCancelar').addEventListener('click', () => {
            navigateTo(`factura/${invoiceId}`);
        });

        document.getElementById('btnCancelarForm').addEventListener('click', () => {
            navigateTo(`factura/${invoiceId}`);
        });

        document.getElementById('formCorrectInvoice').addEventListener('submit', handleSubmit);
        document.getElementById('btnAddMoreSupport').addEventListener('click', addNewSupportForm);

        // Attach delete listeners for existing docs
        attachDeleteListeners();

    } catch (error) {
        console.error('Error loading correction view:', error);
        showError('Error', error.message || 'No se pudo cargar la factura');
        navigateTo('facturas');
    }
}

/**
 * Render existing support documents
 */
function renderExistingSupportDocs() {
    if (!currentInvoice.soportes || currentInvoice.soportes.length === 0) {
        return '<p style="color: var(--gray-400);">No hay documentos de soporte</p>';
    }

    return currentInvoice.soportes.map(doc => {
        const isMarkedForDeletion = filesToDelete.includes(doc.documento_id);
        return `
            <div class="file-item" data-doc-id="${doc.documento_id}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; margin-bottom: 0.5rem; border: 1px solid var(--gray-600); border-radius: 4px; ${isMarkedForDeletion ? 'opacity: 0.5; background-color: rgba(255, 0, 0, 0.1);' : ''}">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">📎</span>
                    <div>
                        <div style="font-weight: 500; ${isMarkedForDeletion ? 'text-decoration: line-through;' : ''}">${doc.nombre_archivo}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-400);">${doc.tipo_soporte_nombre || 'Sin tipo'}</div>
                    </div>
                </div>
                <button 
                    type="button" 
                    class="btn btn-sm ${isMarkedForDeletion ? 'btn-secondary' : 'btn-danger'} btn-delete-doc" 
                    data-doc-id="${doc.documento_id}"
                    ${isMarkedForDeletion ? 'disabled' : ''}
                    style="padding: 0.5rem 1rem; border-radius: 4px; cursor: ${isMarkedForDeletion ? 'not-allowed' : 'pointer'};"
                >
                    ${isMarkedForDeletion ? '✓ Marcado para eliminar' : '🗑️ Eliminar'}
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Render new support form
 */
function renderNewSupportForm(index = 0) {
    return `
        <div class="new-support-item" data-index="${index}">
            <div class="grid grid-cols-2 gap-md mb-sm">
                <div class="form-group">
                    <label class="form-label">Tipo de Soporte</label>
                    <select class="form-select support-type" data-index="${index}">
                        <option value="">Seleccione un tipo</option>
                        ${tiposSoporte.map(t => `
                            <option value="${t.tipo_soporte_id}">${t.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Archivo</label>
                    <input 
                        type="file" 
                        class="form-input support-file" 
                        data-index="${index}"
                        accept=".pdf,.jpg,.jpeg,.png"
                    >
                </div>
            </div>
        </div>
    `;
}

/**
 * Add new support form
 */
function addNewSupportForm() {
    const container = document.getElementById('newSupportContainer');
    const index = container.querySelectorAll('.new-support-item').length;
    container.insertAdjacentHTML('beforeend', renderNewSupportForm(index));
}

/**
 * Attach delete listeners
 */
function attachDeleteListeners() {
    document.querySelectorAll('.btn-delete-doc').forEach(btn => {
        btn.addEventListener('click', function () {
            const docId = parseInt(this.dataset.docId);
            if (!filesToDelete.includes(docId)) {
                filesToDelete.push(docId);
                updateExistingDocsDisplay();
            }
        });
    });
}

/**
 * Update existing docs display
 */
function updateExistingDocsDisplay() {
    document.getElementById('existingSupportDocs').innerHTML = renderExistingSupportDocs();
    attachDeleteListeners();
}

/**
 * Handle form submit
 */
async function handleSubmit(e) {
    e.preventDefault();

    try {
        // Collect form data
        const formData = new FormData();

        formData.append('numero_factura', document.getElementById('numeroFactura').value);
        formData.append('proveedor_id', document.getElementById('proveedorId').value);
        formData.append('monto', document.getElementById('monto').value);
        formData.append('fecha_emision', document.getElementById('fechaEmision').value);
        formData.append('concepto', document.getElementById('concepto').value);

        // New invoice document (if any)
        const nuevoDoc = document.getElementById('nuevoDocumento').files[0];
        if (nuevoDoc) {
            formData.append('documento', nuevoDoc);
        }

        // Files to delete
        if (filesToDelete.length > 0) {
            formData.append('documentos_eliminar', JSON.stringify(filesToDelete));
        }

        // New support documents
        const supportTypes = document.querySelectorAll('.support-type');
        const supportFiles = document.querySelectorAll('.support-file');

        supportTypes.forEach((typeSelect, index) => {
            const file = supportFiles[index].files[0];
            if (file && typeSelect.value) {
                formData.append('soportes', file);
                // Send the selected option's text (name) instead of value (ID)
                const selectedOption = typeSelect.options[typeSelect.selectedIndex];
                formData.append(`soporte_tipo_${index}`, selectedOption.text);
            }
        });

        // Submit
        await correctInvoice(currentInvoice.factura_id, formData);

        showSuccess('Éxito', 'Factura corregida correctamente');
        navigateTo(`factura/${currentInvoice.factura_id}`);

    } catch (error) {
        console.error('Error correcting invoice:', error);
        showError('Error', error.message || 'No se pudo corregir la factura');
    }
}
