/**
 * Providers Management View
 * CRUD operations for providers (proveedores)
 */

import { get, post, put, del } from '../services/api.service.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { showModal, showConfirm, hideModal } from '../components/modal.js';
import { formatDate } from '../utils/formatters.js';

let currentProviders = [];

/**
 * Render providers view
 * @param {HTMLElement} container - Container element
 */
export async function renderProvidersView(container) {
    container.innerHTML = `
        <div class="flex justify-between items-center mb-xl">
            <div>
                <h1>Gestión de Proveedores</h1>
                <p class="welcome-subtitle">Administra los proveedores del sistema</p>
            </div>
            <button class="btn btn-primary" id="btnNuevoProveedor">
                ➕ Nuevo Proveedor
            </button>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-container">
                    <table class="table" id="providersTable">
                        <thead>
                            <tr>
                                <th>NIT</th>
                                <th>Nombre</th>
                                <th>Contacto</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="providersTableBody">
                            <tr>
                                <td colspan="7" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Load providers
    await loadProviders();

    // Attach event listeners
    document.getElementById('btnNuevoProveedor')?.addEventListener('click', showCreateProviderModal);
}

/**
 * Load providers from API
 */
async function loadProviders() {
    try {
        const response = await get('/proveedores');

        // API might return {success, proveedores} or just array
        const providersArray = response.proveedores || response;

        // Validate response is an array
        if (!Array.isArray(providersArray)) {
            console.error('Invalid response from API:', response);
            throw new Error('La respuesta del servidor no es válida');
        }

        currentProviders = providersArray;
        renderProvidersTable();
    } catch (error) {
        console.error('Error loading providers:', error);
        showError('Error', error.message || 'No se pudieron cargar los proveedores');
        const tbody = document.getElementById('providersTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger-400);">Error: ${error.message}</td></tr>`;
        }
    }
}

/**
 * Render providers table
 */
function renderProvidersTable() {
    const tbody = document.getElementById('providersTableBody');
    if (!tbody) return;

    if (currentProviders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay proveedores registrados</td></tr>';
        return;
    }

    tbody.innerHTML = currentProviders.map(provider => `
        <tr>
            <td><strong>${provider.nit}</strong></td>
            <td>${provider.nombre}</td>
            <td>${provider.contacto || '-'}</td>
            <td>${provider.telefono || '-'}</td>
            <td>${provider.email || '-'}</td>
            <td>${provider.direccion || '-'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="window.editProvider(${provider.id})" style="margin-right: 0.25rem;">
                    ✏️ Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteProvider(${provider.id})">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Show create provider modal
 */
function showCreateProviderModal() {
    const content = document.createElement('div');
    content.innerHTML = `
        <form id="providerForm">
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">NIT *</label>
                    <input type="text" class="form-input" id="nit" required placeholder="123456789-0">
                </div>
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-input" id="nombre" required placeholder="Nombre del proveedor">
                </div>
                <div class="form-group">
                    <label class="form-label">Contacto</label>
                    <input type="text" class="form-input" id="contacto" placeholder="Nombre del contacto">
                </div>
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-input" id="telefono" placeholder="300 123 4567">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="email" placeholder="contacto@proveedor.com">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Dirección</label>
                    <textarea class="form-input" id="direccion" rows="2" placeholder="Dirección completa"></textarea>
                </div>
            </div>
        </form>
    `;

    showModal({
        title: 'Crear Nuevo Proveedor',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Crear Proveedor',
                class: 'btn-primary',
                onClick: async () => {
                    const form = document.getElementById('providerForm');
                    if (!form.checkValidity()) {
                        form.reportValidity();
                        return;
                    }

                    const providerData = {
                        nit: document.getElementById('nit').value,
                        nombre: document.getElementById('nombre').value,
                        contacto: document.getElementById('contacto').value,
                        telefono: document.getElementById('telefono').value,
                        email: document.getElementById('email').value,
                        direccion: document.getElementById('direccion').value
                    };

                    try {
                        await post('/proveedores', providerData);
                        showSuccess('Éxito', 'Proveedor creado correctamente');
                        hideModal();
                        await loadProviders();
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo crear el proveedor');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

/**
 * Show edit provider modal
 */
async function showEditProviderModal(id) {
    try {
        const provider = currentProviders.find(p => p.id === id);
        if (!provider) {
            showError('Error', 'Proveedor no encontrado');
            return;
        }

        const content = document.createElement('div');
        content.innerHTML = `
            <form id="providerForm">
                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label">NIT *</label>
                        <input type="text" class="form-input" id="nit" required value="${provider.nit}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-input" id="nombre" required value="${provider.nombre}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Contacto</label>
                        <input type="text" class="form-input" id="contacto" value="${provider.contacto || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input type="tel" class="form-input" id="telefono" value="${provider.telefono || ''}">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="email" value="${provider.email || ''}">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label class="form-label">Dirección</label>
                        <textarea class="form-input" id="direccion" rows="2">${provider.direccion || ''}</textarea>
                    </div>
                </div>
            </form>
        `;

        showModal({
            title: 'Editar Proveedor',
            content,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'btn-secondary'
                },
                {
                    text: 'Guardar Cambios',
                    class: 'btn-primary',
                    onClick: async () => {
                        const form = document.getElementById('providerForm');
                        if (!form.checkValidity()) {
                            form.reportValidity();
                            return;
                        }

                        const providerData = {
                            nit: document.getElementById('nit').value,
                            nombre: document.getElementById('nombre').value,
                            contacto: document.getElementById('contacto').value,
                            telefono: document.getElementById('telefono').value,
                            email: document.getElementById('email').value,
                            direccion: document.getElementById('direccion').value
                        };

                        try {
                            await put(`/proveedores/${id}`, providerData);
                            showSuccess('Éxito', 'Proveedor actualizado correctamente');
                            hideModal();
                            await loadProviders();
                        } catch (error) {
                            showError('Error', error.message || 'No se pudo actualizar el proveedor');
                        }
                    },
                    closeOnClick: false
                }
            ]
        });
    } catch (error) {
        showError('Error', error.message || 'No se pudo cargar el proveedor');
    }
}

// Make functions global for inline onclick
window.editProvider = function (id) {
    showEditProviderModal(id);
};

window.deleteProvider = function (id) {
    const provider = currentProviders.find(p => p.id === id);
    const providerName = provider ? provider.nombre : 'este proveedor';

    showConfirm(
        'Eliminar Proveedor',
        `¿Está seguro que desea eliminar a ${providerName}?`,
        async () => {
            try {
                await del(`/proveedores/${id}`);
                showSuccess('Éxito', 'Proveedor eliminado correctamente');
                await loadProviders();
            } catch (error) {
                showError('Error', error.message || 'No se pudo eliminar el proveedor');
            }
        }
    );
};
