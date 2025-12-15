/**
 * Document Types Management View
 * CRUD for tipos_soporte (only SUPER_ADMIN)
 */

import { get, post, put, del } from '../services/api.service.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';

let documentTypes = [];

/**
 * Render document types management view
 * @param {HTMLElement} container - Container element
 */
export async function renderDocumentTypesView(container) {
    container.innerHTML = `
        <div class="mb-xl">
            <div class="flex justify-between items-center">
                <div>
                    <h1>Tipos de Documentos</h1>
                    <p class="welcome-subtitle">Gestiona los tipos de documentos de soporte</p>
                </div>
                <button class="btn btn-primary" id="btnNewType">
                    ➕ Nuevo Tipo
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Orden</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="typesTableBody">
                            <tr>
                                <td colspan="6" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Load document types
    await loadDocumentTypes();

    // Attach event listeners
    document.getElementById('btnNewType')?.addEventListener('click', showCreateModal);
}

/**
 * Load document types from API
 */
async function loadDocumentTypes() {
    try {
        const response = await get('/tipos-soporte');
        documentTypes = response.tipos || response || [];
        renderTypesTable();
    } catch (error) {
        console.error('Error loading document types:', error);
        showError('Error', 'No se pudieron cargar los tipos de documentos');
        documentTypes = [];
        renderTypesTable();
    }
}

/**
 * Render types table
 */
function renderTypesTable() {
    const tbody = document.getElementById('typesTableBody');
    if (!tbody) return;

    if (documentTypes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="color: var(--gray-400);">
                    No hay tipos de documentos registrados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = documentTypes.map(type => `
        <tr>
            <td><strong>${type.codigo}</strong></td>
            <td>${type.nombre}</td>
            <td>${type.descripcion || '-'}</td>
            <td>${type.orden}</td>
            <td>
                <span class="badge badge-${type.activo ? 'success' : 'secondary'}">
                    ${type.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="window.editDocumentType(${type.tipo_soporte_id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteDocumentType(${type.tipo_soporte_id})">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Show create modal
 */
function showCreateModal() {
    const modalContent = `
        <form id="typeForm">
            <div class="form-group">
                <label class="form-label">Código *</label>
                <input type="text" class="form-input" id="codigo" required placeholder="Ej: RUT">
                <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                    Código único en mayúsculas sin espacios
                </small>
            </div>

            <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-input" id="nombre" required placeholder="Ej: RUT">
            </div>

            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-input" id="descripcion" rows="3" placeholder="Descripción del tipo de documento"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Orden</label>
                <input type="number" class="form-input" id="orden" value="0" min="0">
                <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                    Orden de visualización en listas
                </small>
            </div>

            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="activo" checked>
                    <span>Activo</span>
                </label>
            </div>

            <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg);">
                <button type="button" class="btn btn-secondary" onclick="window.closeModal()">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                    💾 Crear
                </button>
            </div>
        </form>
    `;

    showModal({
        title: 'Nuevo Tipo de Documento',
        content: modalContent
    });

    document.getElementById('typeForm')?.addEventListener('submit', handleCreate);
}

/**
 * Show edit modal
 */
window.editDocumentType = async function (id) {
    const type = documentTypes.find(t => t.tipo_soporte_id === id);
    if (!type) return;

    const modalContent = `
        <form id="typeForm">
            <div class="form-group">
                <label class="form-label">Código *</label>
                <input type="text" class="form-input" id="codigo" required value="${type.codigo}" placeholder="Ej: RUT">
                <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                    Código único en mayúsculas sin espacios
                </small>
            </div>

            <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-input" id="nombre" required value="${type.nombre}" placeholder="Ej: RUT">
            </div>

            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-input" id="descripcion" rows="3" placeholder="Descripción del tipo de documento">${type.descripcion || ''}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Orden</label>
                <input type="number" class="form-input" id="orden" value="${type.orden}" min="0">
                <small style="color: var(--gray-400); display: block; margin-top: 0.25rem;">
                    Orden de visualización en listas
                </small>
            </div>

            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="activo" ${type.activo ? 'checked' : ''}>
                    <span>Activo</span>
                </label>
            </div>

            <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg);">
                <button type="button" class="btn btn-secondary" onclick="window.closeModal()">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                    💾 Actualizar
                </button>
            </div>
        </form>
    `;

    showModal({
        title: 'Editar Tipo de Documento',
        content: modalContent
    });

    document.getElementById('typeForm')?.addEventListener('submit', (e) => handleUpdate(e, id));
};

/**
 * Handle create
 */
async function handleCreate(e) {
    e.preventDefault();

    const data = {
        codigo: document.getElementById('codigo').value.trim().toUpperCase(),
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        orden: parseInt(document.getElementById('orden').value),
        activo: document.getElementById('activo').checked
    };

    try {
        await post('/tipos-soporte', data);
        showSuccess('Éxito', 'Tipo de documento creado correctamente');
        closeModal();
        await loadDocumentTypes();
    } catch (error) {
        console.error('Error creating document type:', error);
        showError('Error', error.message || 'No se pudo crear el tipo de documento');
    }
}

/**
 * Handle update
 */
async function handleUpdate(e, id) {
    e.preventDefault();

    const data = {
        codigo: document.getElementById('codigo').value.trim().toUpperCase(),
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        orden: parseInt(document.getElementById('orden').value),
        activo: document.getElementById('activo').checked
    };

    try {
        await put(`/tipos-soporte/${id}`, data);
        showSuccess('Éxito', 'Tipo de documento actualizado correctamente');
        closeModal();
        await loadDocumentTypes();
    } catch (error) {
        console.error('Error updating document type:', error);
        showError('Error', error.message || 'No se pudo actualizar el tipo de documento');
    }
}

/**
 * Delete document type
 */
window.deleteDocumentType = async function (id) {
    const type = documentTypes.find(t => t.tipo_soporte_id === id);
    if (!type) return;

    if (!confirm(`¿Está seguro de eliminar el tipo "${type.nombre}"?`)) {
        return;
    }

    try {
        await del(`/tipos-soporte/${id}`);
        showSuccess('Éxito', 'Tipo de documento eliminado correctamente');
        await loadDocumentTypes();
    } catch (error) {
        console.error('Error deleting document type:', error);
        showError('Error', error.message || 'No se pudo eliminar el tipo de documento');
    }
};

// Make closeModal available globally
window.closeModal = closeModal;
