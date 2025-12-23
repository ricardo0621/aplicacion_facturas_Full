/**
 * Create Invoice View
 * Form to create new invoices with multiple document uploads
 */

import { get, post, upload } from '../services/api.service.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { navigateTo } from '../utils/router.js';

let selectedFiles = [];
let providers = [];

/**
 * Render create invoice view
 * @param {HTMLElement} container - Container element
 */
export async function renderCreateInvoiceView(container) {
    container.innerHTML = `
        <div class="mb-xl">
            <h1>Nueva Factura</h1>
            <p class="welcome-subtitle">Carga una nueva factura al sistema</p>
        </div>

        <div class="card">
            <div class="card-body">
                <form id="createInvoiceForm" enctype="multipart/form-data">
                    <div class="grid grid-cols-2">
                        <!-- Invoice Number -->
                        <div class="form-group">
                            <label class="form-label">Número de Factura *</label>
                            <input type="text" class="form-input" id="numeroFactura" required placeholder="Ej: FAC-2024-001">
                        </div>

                        <!-- Provider -->
                        <div class="form-group">
                            <label class="form-label">Proveedor (NIT) *</label>
                            <select class="form-select" id="nitProveedor" required>
                                <option value="">Seleccione un proveedor</option>
                            </select>
                        </div>

                        <!-- Invoice Date -->
                        <div class="form-group">
                            <label class="form-label">Fecha de Emisión *</label>
                            <input type="date" class="form-input" id="fechaEmision" required>
                        </div>

                        <!-- Amount -->
                        <div class="form-group">
                            <label class="form-label">Monto Total *</label>
                            <input type="number" class="form-input" id="monto" required min="0" step="0.01" placeholder="0.00">
                        </div>

                        <!-- Approval Direction (Ruta 2) -->
                        <div class="form-group" style="grid-column: span 2;">
                            <label class="form-label">Dirección Aprobadora (Ruta 2) *</label>
                            <select class="form-select" id="rolAprobadorRuta2" required>
                                <option value="">Seleccione la dirección</option>
                                <option value="RUTA_2_DIRECCION_ADMINISTRATIVA">Dirección Administrativa</option>
                                <option value="RUTA_2_DIRECCION_FINANCIERA">Dirección Financiera</option>
                                <option value="RUTA_2_DIRECCION_MEDICA">Dirección Médica</option>
                                <option value="RUTA_2_DIRECCION_GENERAL">Dirección General</option>
                                <option value="RUTA_3_CONTROL_INTERNO">Control Interno</option>
                            </select>
                            <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                                Selecciona la dirección que debe aprobar esta factura
                            </small>
                        </div>

                        <!-- Concept -->
                        <div class="form-group" style="grid-column: span 2;">
                            <label class="form-label">Concepto</label>
                            <textarea class="form-input" id="concepto" rows="3" placeholder="Descripción del concepto de la factura"></textarea>
                        </div>

                        <!-- File Upload Section -->
                        <div class="form-group" style="grid-column: span 2;">
                            <label class="form-label">Documentos *</label>
                            <div style="border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: var(--spacing-lg); background: rgba(255, 255, 255, 0.02);">
                                <div class="flex items-center gap-md mb-md">
                                    <select class="form-select" id="tipoDocumento" style="flex: 1;">
                                        <option value="">Cargando tipos...</option>
                                    </select>
                                    <input type="file" id="fileInput" style="display: none;" accept=".pdf,.jpg,.jpeg,.png">
                                    <button type="button" class="btn btn-secondary" id="btnSelectFile">
                                        📎 Seleccionar Archivo
                                    </button>
                                </div>
                                
                                <div id="filesList" style="margin-top: var(--spacing-md);">
                                    <p style="color: var(--gray-400); text-align: center;">
                                        No hay archivos seleccionados. Debe incluir al menos una FACTURA.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Buttons -->
                        <div class="form-group" style="grid-column: span 2; display: flex; gap: var(--spacing-md); justify-content: flex-end;">
                            <button type="button" class="btn btn-secondary" id="btnCancel">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary" id="btnSubmit">
                                💾 Crear Factura
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Load providers and document types
    await Promise.all([loadProviders(), loadDocumentTypes()]);

    // Set default date to today
    document.getElementById('fechaEmision').valueAsDate = new Date();

    // Attach event listeners
    document.getElementById('btnSelectFile')?.addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput')?.addEventListener('change', handleFileSelect);
    document.getElementById('createInvoiceForm')?.addEventListener('submit', handleSubmit);
    document.getElementById('btnCancel')?.addEventListener('click', () => {
        navigateTo('facturas');
    });
}

/**
 * Load providers for dropdown
 */
async function loadProviders() {
    try {
        const response = await get('/proveedores');
        providers = response.proveedores || response || [];

        const select = document.getElementById('nitProveedor');
        if (select && providers.length > 0) {
            providers.forEach(provider => {
                const option = document.createElement('option');
                option.value = provider.nit;
                option.textContent = `${provider.nombre} (${provider.nit})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading providers:', error);
        showError('Error', 'No se pudieron cargar los proveedores');
    }
}

/**
 * Load document types for dropdown
 */
async function loadDocumentTypes() {
    try {
        const response = await get('/tipos-soporte?solo_activos=true');
        const types = response.tipos || response || [];

        const select = document.getElementById('tipoDocumento');
        if (select) {
            // Clear loading option
            select.innerHTML = '';

            if (types.length === 0) {
                select.innerHTML = '<option value="">No hay tipos disponibles</option>';
                return;
            }

            // Sort by orden field
            types.sort((a, b) => a.orden - b.orden);

            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.codigo;
                option.textContent = type.nombre;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading document types:', error);
        const select = document.getElementById('tipoDocumento');
        if (select) {
            select.innerHTML = '<option value="">Error al cargar tipos</option>';
        }
    }
}


/**
 * Handle file selection
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const tipoDocumento = document.getElementById('tipoDocumento').value;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showError('Error', 'El archivo no puede superar 10MB');
        e.target.value = '';
        return;
    }

    // Add file to list
    selectedFiles.push({
        file: file,
        tipo: tipoDocumento
    });

    // Reset file input
    e.target.value = '';

    // Render files list
    renderFilesList();
}

/**
 * Render files list
 */
function renderFilesList() {
    const container = document.getElementById('filesList');
    if (!container) return;

    if (selectedFiles.length === 0) {
        container.innerHTML = `
            <p style="color: var(--gray-400); text-align: center;">
                No hay archivos seleccionados. Debe incluir al menos una FACTURA.
            </p>
        `;
        return;
    }

    const hasFactura = selectedFiles.some(f => f.tipo === 'FACTURA');

    container.innerHTML = `
        ${!hasFactura ? `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger-500); border-radius: var(--radius-md); padding: var(--spacing-sm); margin-bottom: var(--spacing-md);">
                <p style="color: var(--danger-300); margin: 0; font-size: 0.875rem;">
                    ⚠️ Debe incluir al menos un archivo de tipo FACTURA
                </p>
            </div>
        ` : ''}
        
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            ${selectedFiles.map((item, index) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-sm); background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-md);">
                    <div style="flex: 1;">
                        <strong style="color: var(--gray-200);">${item.file.name}</strong>
                        <span class="badge badge-primary" style="margin-left: var(--spacing-sm);">${item.tipo}</span>
                        <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                            ${(item.file.size / 1024).toFixed(2)} KB
                        </small>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger" onclick="window.removeFile(${index})">
                        🗑️
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Remove file from list
 */
window.removeFile = function (index) {
    selectedFiles.splice(index, 1);
    renderFilesList();
};

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();

    // Validate files
    if (selectedFiles.length === 0) {
        showError('Error', 'Debe seleccionar al menos un archivo');
        return;
    }

    const hasFactura = selectedFiles.some(f => f.tipo === 'FACTURA');
    if (!hasFactura) {
        showError('Error', 'Debe incluir al menos un archivo de tipo FACTURA');
        return;
    }

    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Creando...';

    try {
        // Prepare FormData
        const formData = new FormData();
        formData.append('numero_factura', document.getElementById('numeroFactura').value);
        formData.append('nit_proveedor', document.getElementById('nitProveedor').value);
        formData.append('fecha_emision', document.getElementById('fechaEmision').value);
        formData.append('monto', document.getElementById('monto').value);
        formData.append('concepto', document.getElementById('concepto').value);
        formData.append('rol_aprobador_ruta2', document.getElementById('rolAprobadorRuta2').value);

        // Add files and their types
        selectedFiles.forEach(item => {
            formData.append('documentos', item.file);
            formData.append('tipos_documento', item.tipo);
        });

        // Send request using upload service
        const data = await upload('/facturas/cargar', formData);

        showSuccess('Éxito', 'Factura creada correctamente');

        // Navigate to invoice detail
        setTimeout(() => {
            navigateTo(`factura/${data.factura.factura_id}`);
        }, 1500);

    } catch (error) {
        console.error('Error creating invoice:', error);

        // The backend now sends user-friendly messages
        const errorMessage = error.message || 'No se pudo crear la factura';

        showError('Error', errorMessage);

        submitBtn.disabled = false;
        submitBtn.innerHTML = '💾 Crear Factura';
    }
}
