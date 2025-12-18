/**
 * Invoice Detail View
 * Displays invoice details with workflow actions
 */

import { getInvoiceById, approveInvoice, rejectInvoice, markAsPaid, annulInvoice, addInvoiceDocument } from '../services/invoice.service.js';
import { getDocumentTypes } from '../services/document-type.service.js';
import { formatCurrency, formatDate, formatDateTime, getEstadoLabel, getEstadoBadgeColor, getRoleLabel, getAccionLabel } from '../utils/formatters.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { showModal, showConfirm, hideModal } from '../components/modal.js';
import { navigateTo } from '../utils/router.js';
import { getCurrentUser, hasRole, hasAnyRole } from '../utils/auth.js';
import { CONSTANTS, API_BASE_URL } from '../config/config.js';

let currentInvoice = null;

/**
 * Render invoice detail view
 * @param {HTMLElement} container - Container element
 * @param {Object} params - Route parameters
 */
export async function renderInvoiceDetailView(container, params) {
    const invoiceId = params.id;

    if (!invoiceId || invoiceId === 'nueva') {
        // TODO: Render create invoice form
        container.innerHTML = '<h1>Crear Nueva Factura</h1><p>Formulario en desarrollo...</p>';
        return;
    }

    // Show loading
    container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
            <div class="spinner"></div>
        </div>
    `;

    try {
        currentInvoice = await getInvoiceById(invoiceId);
        renderInvoiceDetail(container);
    } catch (error) {
        console.error('Error loading invoice:', error);
        showError('Error', 'No se pudo cargar la factura');
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center" style="padding: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h2>Error al cargar la factura</h2>
                    <p style="color: var(--gray-400); margin-bottom: 2rem;">${error.message}</p>
                    <button class="btn btn-primary" onclick="history.back()">Volver</button>
                </div>
            </div>
        `;
    }
}

/**
 * Render invoice detail
 * @param {HTMLElement} container - Container element
 */
function renderInvoiceDetail(container) {
    const user = getCurrentUser();
    const invoice = currentInvoice;

    container.innerHTML = `
        <!-- Header -->
        <div class="flex justify-between items-center mb-xl">
            <div>
                <button class="btn btn-secondary btn-sm mb-md" onclick="history.back()">
                    ← Volver
                </button>
                <h1>Factura ${invoice.numero_factura}</h1>
                <p class="welcome-subtitle">Detalle completo de la factura</p>
            </div>
            <div>
                <span class="badge badge-${getEstadoBadgeColor(invoice.estado_codigo)}" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
                    ${getEstadoLabel(invoice.estado_codigo)}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-3">
            <!-- Main Info -->
            <div style="grid-column: span 2;">
                <!-- Invoice Information -->
                <div class="card mb-lg">
                    <div class="card-header">
                        <h3 class="card-title">Información de la Factura</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label class="form-label">Número de Factura</label>
                                <p style="font-size: 1.25rem; font-weight: 700; color: var(--gray-50);">
                                    ${invoice.numero_factura}
                                </p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Monto</label>
                                <p style="font-size: 1.25rem; font-weight: 700; color: var(--success-400);">
                                    ${formatCurrency(invoice.monto)}
                                </p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">NIT Proveedor</label>
                                <p style="color: var(--gray-200);">${invoice.nit_proveedor}</p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Proveedor</label>
                                <p style="color: var(--gray-200);">${invoice.proveedor_nombre || '-'}</p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fecha de Emisión</label>
                                <p style="color: var(--gray-200);">${formatDate(invoice.fecha_emision)}</p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fecha de Creación</label>
                                <p style="color: var(--gray-200);">${formatDateTime(invoice.fecha_creacion)}</p>
                            </div>
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Concepto</label>
                                <p style="color: var(--gray-200);">${invoice.concepto || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Documents -->
                <div class="card mb-lg">
                    <div class="card-header">
                        <h3 class="card-title">Documentos Adjuntos</h3>
                    </div>
                    <div class="card-body">
                        <div id="documentsContainer">
                            ${renderDocuments(invoice.documentos || [])}
                        </div>
                    </div>
                </div>

                <!-- History -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Historial de Acciones</h3>
                    </div>
                    <div class="card-body">
                        <div id="historyContainer">
                            ${renderHistory(invoice.historial || [])}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Sidebar -->
            <div>
                <div class="card" style="position: sticky; top: 100px;">
                    <div class="card-header">
                        <h3 class="card-title">Acciones</h3>
                    </div>
                    <div class="card-body">
                        ${renderActions(invoice, user)}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach event listeners
    attachActionListeners();
}

/**
 * Render documents list
 */
function renderDocuments(documentos) {
    if (!documentos || documentos.length === 0) {
        return '<p style="color: var(--gray-400); text-align: center; padding: 2rem;">No hay documentos adjuntos</p>';
    }

    const user = getCurrentUser();
    const estadoActual = currentInvoice.estado_codigo;

    return `
        <div class="grid grid-cols-2 gap-md">
            ${documentos.map(doc => {
        // Determinar si se puede eliminar el documento
        let canDelete = false;

        // SUPER_ADMIN puede eliminar cualquier documento excepto SOPORTE_INICIAL
        if (hasRole(CONSTANTS.ROLES.SUPER_ADMIN) && doc.tipo_documento !== 'SOPORTE_INICIAL') {
            canDelete = true;
        }

        // RUTA_3 puede eliminar SOPORTE_CONTABILIDAD solo cuando está en RUTA_3
        if (hasRole(CONSTANTS.ROLES.RUTA_3) &&
            doc.tipo_documento === 'SOPORTE_CONTABILIDAD' &&
            estadoActual === CONSTANTS.ESTADOS.RUTA_3) {
            canDelete = true;
        }

        // RUTA_4 puede eliminar SOPORTE_TESORERIA solo cuando está en RUTA_4
        if (hasRole(CONSTANTS.ROLES.RUTA_4) &&
            doc.tipo_documento === 'SOPORTE_TESORERIA' &&
            estadoActual === CONSTANTS.ESTADOS.RUTA_4) {
            canDelete = true;
        }

        return `
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.5rem;">📄</span>
                            <strong style="color: var(--gray-200);">${doc.tipo_documento}</strong>
                        </div>
                        <p style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">
                            ${doc.nombre_personalizado || doc.nombre_archivo}
                        </p>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-secondary" onclick="window.downloadDocument('${doc.ruta_archivo}', '${doc.nombre_archivo}')">
                                ⬇ Descargar
                            </button>
                            ${canDelete ? `
                                <button class="btn btn-sm btn-danger" onclick="window.deleteDocument(${doc.documento_id})">
                                    🗑️ Eliminar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

/**
 * Render history timeline
 */
function renderHistory(historial) {
    if (!historial || historial.length === 0) {
        return '<p style="color: var(--gray-400); text-align: center; padding: 2rem;">No hay historial disponible</p>';
    }

    return `
        <div style="position: relative; padding-left: 2rem;">
            <div style="position: absolute; left: 0.5rem; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.1);"></div>
            ${historial.map((item, index) => `
                <div style="position: relative; margin-bottom: 1.5rem;">
                    <div style="position: absolute; left: -1.5rem; top: 0.25rem; width: 12px; height: 12px; border-radius: 50%; background: var(--primary-500); border: 2px solid var(--bg-dark-secondary);"></div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div>
                                <strong style="color: var(--primary-400);">${getAccionLabel(item.accion)}</strong>
                                ${item.estado_nuevo ? `
                                    <div style="margin-top: 0.25rem;">
                                        <span style="font-size: 0.75rem; color: var(--gray-400);">→ </span>
                                        <span style="font-size: 0.75rem; color: var(--success-400);">${item.estado_nuevo}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <span style="font-size: 0.75rem; color: var(--gray-500);">${formatDateTime(item.fecha_accion)}</span>
                        </div>
                        <p style="font-size: 0.875rem; color: var(--gray-300); margin-bottom: 0.25rem;">
                            ${item.usuario_nombre} (${item.usuario_cargo || 'Sin cargo'})
                        </p>
                        ${item.observacion ? `
                            <p style="font-size: 0.875rem; color: var(--gray-400); font-style: italic; margin-top: 0.5rem;">
                                "${item.observacion}"
                            </p>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render action buttons based on user role and invoice state
 */
function renderActions(invoice, user) {
    const estado = invoice.estado_codigo;
    const buttons = [];

    // RUTA_1 actions
    if (hasRole(CONSTANTS.ROLES.RUTA_1) && estado === CONSTANTS.ESTADOS.RUTA_1) {
        buttons.push(`
            <button class="btn btn-primary" id="btnEnviarRevision" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Enviar a Revisión
            </button>
            <button class="btn btn-warning" id="btnCorregir" style="width: 100%; margin-bottom: 0.5rem;">
                ✏️ Corregir Datos
            </button>
        `);
    }

    // RUTA_2 actions - Each direccion can only approve invoices in their specific state
    // Dirección Administrativa
    if (hasRole(CONSTANTS.ROLES.RUTA_2_DIRECCION_ADMINISTRATIVA) && estado === CONSTANTS.ESTADOS.RUTA_2_DIRECCION_ADMINISTRATIVA) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
        `);
    }

    // Dirección Financiera
    if (hasRole(CONSTANTS.ROLES.RUTA_2_DIRECCION_FINANCIERA) && estado === CONSTANTS.ESTADOS.RUTA_2_DIRECCION_FINANCIERA) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
        `);
    }

    // Dirección Médica
    if (hasRole(CONSTANTS.ROLES.RUTA_2_DIRECCION_MEDICA) && estado === CONSTANTS.ESTADOS.RUTA_2_DIRECCION_MEDICA) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
        `);
    }

    // Dirección General
    if (hasRole(CONSTANTS.ROLES.RUTA_2_DIRECCION_GENERAL) && estado === CONSTANTS.ESTADOS.RUTA_2_DIRECCION_GENERAL) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
        `);
    }

    // Control Interno
    if (hasRole(CONSTANTS.ROLES.RUTA_2_CONTROL_INTERNO) && estado === CONSTANTS.ESTADOS.RUTA_2_CONTROL_INTERNO) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
        `);
    }

    // RUTA_3 actions
    if (hasRole(CONSTANTS.ROLES.RUTA_3) && estado === CONSTANTS.ESTADOS.RUTA_3) {
        buttons.push(`
            <button class="btn btn-success" id="btnAprobar" style="width: 100%; margin-bottom: 0.5rem;">
                ✓ Aprobar
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
            <button class="btn btn-warning" id="btnCorregirSimple" style="width: 100%; margin-bottom: 0.5rem;">
                📎 Agregar Soporte
            </button>
        `);
    }

    // RUTA_4 actions
    if (hasRole(CONSTANTS.ROLES.RUTA_4) && estado === CONSTANTS.ESTADOS.RUTA_4) {
        buttons.push(`
            <button class="btn btn-success" id="btnPagar" style="width: 100%; margin-bottom: 0.5rem;">
                💰 Marcar como Pagada
            </button>
            <button class="btn btn-danger" id="btnRechazar" style="width: 100%; margin-bottom: 0.5rem;">
                ✕ Rechazar
            </button>
            <button class="btn btn-warning" id="btnAgregarSoporteTesoreria" style="width: 100%; margin-bottom: 0.5rem;">
                📎 Agregar Soporte
            </button>
        `);
    }

    // Admin actions
    if (hasRole(CONSTANTS.ROLES.SUPER_ADMIN)) {
        buttons.push(`
            <button class="btn btn-danger" id="btnAnular" style="width: 100%; margin-bottom: 0.5rem;">
                🚫 Anular Factura
            </button>
        `);
    }

    if (buttons.length === 0) {
        return '<p style="color: var(--gray-400); text-align: center;">No hay acciones disponibles</p>';
    }

    return buttons.join('');
}

/**
 * Attach event listeners to action buttons
 */
function attachActionListeners() {
    // Approve
    document.getElementById('btnAprobar')?.addEventListener('click', handleApprove);

    // Reject
    document.getElementById('btnRechazar')?.addEventListener('click', handleReject);

    // Pay
    document.getElementById('btnPagar')?.addEventListener('click', handlePay);

    // Annul
    document.getElementById('btnAnular')?.addEventListener('click', handleAnnul);

    // Add Support (RUTA_3)
    document.getElementById('btnCorregirSimple')?.addEventListener('click', handleAddSupport);

    // Add Support (RUTA_4)
    document.getElementById('btnAgregarSoporteTesoreria')?.addEventListener('click', handleAddSupport);
}

/**
 * Handle approve action
 */
async function handleApprove() {
    const user = getCurrentUser();

    // RUTA_3 validation: Check if SOPORTE_CONTABILIDAD exists
    if (hasRole(CONSTANTS.ROLES.RUTA_3)) {
        const hasSupportDoc = currentInvoice.documentos?.some(doc =>
            doc.tipo_documento === 'SOPORTE_CONTABILIDAD'
        );

        if (!hasSupportDoc) {
            showError(
                'Documento Requerido',
                'Debe agregar el documento de soporte de Contabilidad antes de aprobar. Use el botón "📎 Agregar Soporte".'
            );
            return;
        }
    }

    // RUTA_4 validation: Check if SOPORTE_TESORERIA exists
    if (hasRole(CONSTANTS.ROLES.RUTA_4)) {
        const hasSupportDoc = currentInvoice.documentos?.some(doc =>
            doc.tipo_documento === 'SOPORTE_TESORERIA'
        );

        if (!hasSupportDoc) {
            showError(
                'Documento Requerido',
                'Debe agregar el documento de soporte de Tesorería antes de aprobar. Use el botón "📎 Agregar Soporte".'
            );
            return;
        }
    }

    const content = document.createElement('div');
    content.innerHTML = `
        <p style="margin-bottom: 1rem; color: var(--gray-300);">
            ¿Está seguro que desea aprobar esta factura?
        </p>
        <div class="form-group">
            <label class="form-label">Observación *</label>
            <textarea 
                class="form-textarea" 
                id="approveObservation" 
                placeholder="Ingrese una observación (obligatorio)..."
                rows="3"
                required
            ></textarea>
        </div>
    `;

    showModal({
        title: 'Aprobar Factura',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Aprobar',
                class: 'btn-success',
                onClick: async () => {
                    const observacion = document.getElementById('approveObservation').value.trim();

                    if (!observacion) {
                        showError('Error', 'Debe ingresar una observación');
                        return;
                    }

                    try {
                        await approveInvoice(currentInvoice.factura_id, observacion);
                        showSuccess('Éxito', 'Factura aprobada correctamente');
                        hideModal();
                        // Reload invoice
                        const updated = await getInvoiceById(currentInvoice.factura_id);
                        currentInvoice = updated;
                        renderInvoiceDetail(document.getElementById('viewContainer'));
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo aprobar la factura');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

/**
 * Handle reject action
 */
function handleReject() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="form-group">
            <label class="form-label">Motivo del Rechazo *</label>
            <textarea 
                class="form-textarea" 
                id="rejectReason" 
                placeholder="Ingrese el motivo del rechazo..."
                required
            ></textarea>
        </div>
    `;

    showModal({
        title: 'Rechazar Factura',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Rechazar',
                class: 'btn-danger',
                onClick: async () => {
                    const reason = document.getElementById('rejectReason').value.trim();
                    if (!reason) {
                        showError('Error', 'Debe ingresar un motivo de rechazo');
                        return;
                    }

                    try {
                        await rejectInvoice(currentInvoice.factura_id, reason);
                        showSuccess('Éxito', 'Factura rechazada correctamente');
                        hideModal();
                        // Reload invoice
                        const updated = await getInvoiceById(currentInvoice.factura_id);
                        currentInvoice = updated;
                        renderInvoiceDetail(document.getElementById('viewContainer'));
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo rechazar la factura');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

/**
 * Handle pay action
 */
async function handlePay() {
    const content = document.createElement('div');
    content.innerHTML = `
        <p style="margin-bottom: 1rem; color: var(--gray-300);">
            ¿Está seguro que desea marcar esta factura como pagada?
        </p>
        <div class="form-group">
            <label class="form-label">Observación *</label>
            <textarea 
                class="form-textarea" 
                id="payObservation" 
                placeholder="Ingrese una observación (obligatorio)..."
                rows="3"
                required
            ></textarea>
        </div>
    `;

    showModal({
        title: 'Marcar como Pagada',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Marcar como Pagada',
                class: 'btn-success',
                onClick: async () => {
                    const observacion = document.getElementById('payObservation').value.trim();

                    if (!observacion) {
                        showError('Error', 'Debe ingresar una observación');
                        return;
                    }

                    try {
                        await markAsPaid(currentInvoice.factura_id, observacion);
                        showSuccess('Éxito', 'Factura marcada como pagada');
                        hideModal();
                        // Reload invoice
                        const updated = await getInvoiceById(currentInvoice.factura_id);
                        currentInvoice = updated;
                        renderInvoiceDetail(document.getElementById('viewContainer'));
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo marcar la factura como pagada');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

/**
 * Handle annul action
 */
function handleAnnul() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="form-group">
            <label class="form-label">Motivo de Anulación *</label>
            <textarea 
                class="form-textarea" 
                id="annulReason" 
                placeholder="Ingrese el motivo de anulación..."
                required
            ></textarea>
        </div>
    `;

    showModal({
        title: 'Anular Factura',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Anular',
                class: 'btn-danger',
                onClick: async () => {
                    const reason = document.getElementById('annulReason').value.trim();
                    if (!reason) {
                        showError('Error', 'Debe ingresar un motivo de anulación');
                        return;
                    }

                    try {
                        await annulInvoice(currentInvoice.factura_id, reason);
                        showSuccess('Éxito', 'Factura anulada correctamente');
                        hideModal();
                        // Reload invoice
                        const updated = await getInvoiceById(currentInvoice.factura_id);
                        currentInvoice = updated;
                        renderInvoiceDetail(document.getElementById('viewContainer'));
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo anular la factura');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}
/**
 * Handle add support document (RUTA_3 and RUTA_4)
 */
async function handleAddSupport() {
    const user = getCurrentUser();

    // Determinar tipo de documento según el rol
    let tipoDocumento = '';
    let tituloModal = '';

    if (hasRole(CONSTANTS.ROLES.RUTA_3)) {
        tipoDocumento = 'SOPORTE_CONTABILIDAD';
        tituloModal = 'Agregar Documento de Soporte - Contabilidad';
    } else if (hasRole(CONSTANTS.ROLES.RUTA_4)) {
        tipoDocumento = 'SOPORTE_TESORERIA';
        tituloModal = 'Agregar Documento de Soporte - Tesorería';
    } else {
        showError('Error', 'No tiene permisos para agregar documentos de soporte');
        return;
    }

    const content = document.createElement('div');
    content.innerHTML = `
        <div class="form-group">
            <label class="form-label">Tipo de Documento</label>
            <input 
                type="text" 
                class="form-input" 
                value="${tipoDocumento === 'SOPORTE_CONTABILIDAD' ? 'Doc soporte Contabilidad' : 'Doc soporte Tesoreria'}"
                disabled
                style="background-color: rgba(255,255,255,0.05); cursor: not-allowed;"
            />
        </div>
        <div class="form-group">
            <label class="form-label">Documento de Soporte *</label>
            <input 
                type="file" 
                class="form-input" 
                id="supportFile" 
                accept=".pdf,.jpg,.jpeg,.png"
                required
            />
            <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                Formatos permitidos: PDF, JPG, PNG (Máx. 10MB)
            </small>
        </div>
    `;

    showModal({
        title: tituloModal,
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Subir Documento',
                class: 'btn-primary',
                onClick: async () => {
                    const fileInput = document.getElementById('supportFile');

                    if (!fileInput.files || fileInput.files.length === 0) {
                        showError('Error', 'Debe seleccionar un archivo');
                        return;
                    }

                    const file = fileInput.files[0];

                    // Validate file size (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                        showError('Error', 'El archivo no debe superar 10MB');
                        return;
                    }

                    try {
                        const formData = new FormData();
                        formData.append('documento', file);
                        formData.append('tipo_documento', tipoDocumento);

                        await addInvoiceDocument(currentInvoice.factura_id, formData);
                        showSuccess('Éxito', 'Documento de soporte agregado correctamente');
                        hideModal();

                        // Reload invoice
                        const updated = await getInvoiceById(currentInvoice.factura_id);
                        currentInvoice = updated;
                        renderInvoiceDetail(document.getElementById('viewContainer'));
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo agregar el documento');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

// Global function for downloading documents
window.downloadDocument = function (path, filename) {
    // TODO: Implement document download
    showToast('Info', 'Descarga de documentos en desarrollo', 'info');
};

// Global function for deleting documents
window.deleteDocument = async function (documentoId) {
    showConfirm(
        'Eliminar Documento',
        '¿Está seguro que desea eliminar este documento?',
        async () => {
            try {
                const { deleteInvoiceDocument } = await import('../services/invoice.service.js');
                await deleteInvoiceDocument(currentInvoice.factura_id, documentoId);
                showSuccess('Éxito', 'Documento eliminado correctamente');

                // Reload invoice
                const updated = await getInvoiceById(currentInvoice.factura_id);
                currentInvoice = updated;
                renderInvoiceDetail(document.getElementById('viewContainer'));
            } catch (error) {
                showError('Error', error.message || 'No se pudo eliminar el documento');
            }
        }
    );
};
