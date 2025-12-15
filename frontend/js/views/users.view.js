/**
 * Users Management View
 * CRUD operations for users
 */

import { get, post, put, del } from '../services/api.service.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { showModal, showConfirm, hideModal } from '../components/modal.js';
import { CONSTANTS } from '../config/config.js';
import { getRoleLabel } from '../utils/formatters.js';

let currentUsers = [];

/**
 * Render users view
 * @param {HTMLElement} container - Container element
 */
export async function renderUsersView(container) {
    container.innerHTML = `
        <div class="flex justify-between items-center mb-xl">
            <div>
                <h1>Gestión de Usuarios</h1>
                <p class="welcome-subtitle">Administra los usuarios del sistema</p>
            </div>
            <button class="btn btn-primary" id="btnNuevoUsuario">
                ➕ Nuevo Usuario
            </button>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-container">
                    <table class="table" id="usersTable">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Área</th>
                                <th>Cargo</th>
                                <th>Roles</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr>
                                <td colspan="7" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Load users
    await loadUsers();

    // Attach event listeners
    document.getElementById('btnNuevoUsuario')?.addEventListener('click', showCreateUserModal);
}

/**
 * Load users from API
 */
async function loadUsers() {
    try {
        const response = await get('/usuarios');

        // API returns {success, count, usuarios}, extract the array
        const usersArray = response.usuarios || response;

        // Validate response is an array
        if (!Array.isArray(usersArray)) {
            console.error('Invalid response from API:', response);
            throw new Error('La respuesta del servidor no es válida');
        }

        currentUsers = usersArray;
        renderUsersTable();
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Error', error.message || 'No se pudieron cargar los usuarios');
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger-400);">Error: ${error.message}</td></tr>`;
        }
    }
}

/**
 * Render users table
 */
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (currentUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios registrados</td></tr>';
        return;
    }

    tbody.innerHTML = currentUsers.map(user => `
        <tr>
            <td><strong>${user.nombre}</strong></td>
            <td>${user.email}</td>
            <td>${user.area || '-'}</td>
            <td>${user.cargo || '-'}</td>
            <td>
                ${user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? user.roles.map(role => {
        // Handle both object format {nombre, codigo} and string format
        const roleName = typeof role === 'string' ? role : (role.nombre || role.codigo || role);
        return `
                        <span class="badge badge-primary" style="margin-right: 0.25rem;">
                            ${roleName}
                        </span>
                    `;
    }).join('') : '-'}
            </td>
            <td>
                <span class="badge badge-${user.activo ? 'success' : 'danger'}">
                    ${user.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="window.editUser(${user.usuario_id})" style="margin-right: 0.25rem;">
                    ✏️ Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteUser(${user.usuario_id})">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Show create user modal
 */
async function showCreateUserModal() {
    const response = await get('/usuarios/roles');
    const roles = response.roles || response;

    const content = document.createElement('div');
    content.innerHTML = `
        <form id="userForm">
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-input" id="nombre" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-input" id="email" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contraseña *</label>
                    <input type="password" class="form-input" id="password" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Tipo Documento</label>
                    <select class="form-select" id="tipo_documento">
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Número Documento</label>
                    <input type="text" class="form-input" id="numero_documento">
                </div>
                <div class="form-group">
                    <label class="form-label">Área</label>
                    <input type="text" class="form-input" id="area">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Cargo</label>
                    <input type="text" class="form-input" id="cargo">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Roles *</label>
                    <div id="rolesContainer" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                        ${roles.map(role => `
                            <label style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" name="roles" value="${role.rol_id}">
                                <span>${role.nombre}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        </form>
    `;

    showModal({
        title: 'Crear Nuevo Usuario',
        content,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary'
            },
            {
                text: 'Crear Usuario',
                class: 'btn-primary',
                onClick: async () => {
                    const form = document.getElementById('userForm');
                    if (!form.checkValidity()) {
                        form.reportValidity();
                        return;
                    }

                    const selectedRoles = Array.from(document.querySelectorAll('input[name="roles"]:checked'))
                        .map(cb => parseInt(cb.value));

                    if (selectedRoles.length === 0) {
                        showError('Error', 'Debe seleccionar al menos un rol');
                        return;
                    }

                    const userData = {
                        nombre: document.getElementById('nombre').value,
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                        tipo_documento: document.getElementById('tipo_documento').value,
                        numero_documento: document.getElementById('numero_documento').value,
                        area: document.getElementById('area').value,
                        cargo: document.getElementById('cargo').value,
                        roles: selectedRoles
                    };

                    try {
                        await post('/usuarios', userData);
                        showSuccess('Éxito', 'Usuario creado correctamente');
                        hideModal();
                        await loadUsers();
                    } catch (error) {
                        showError('Error', error.message || 'No se pudo crear el usuario');
                    }
                },
                closeOnClick: false
            }
        ]
    });
}

/**
 * Show edit user modal
 */
async function showEditUserModal(id) {
    try {
        const user = currentUsers.find(u => u.usuario_id === id);
        if (!user) {
            showError('Error', 'Usuario no encontrado');
            return;
        }

        const response = await get('/usuarios/roles');
        const roles = response.roles || response;

        const content = document.createElement('div');
        content.innerHTML = `
            <form id="userForm">
                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-input" id="nombre" required value="${user.nombre}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-input" id="email" required value="${user.email}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nueva Contraseña</label>
                        <input type="password" class="form-input" id="password" placeholder="Dejar vacío para no cambiar">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo Documento</label>
                        <select class="form-select" id="tipo_documento">
                            <option value="CC" ${user.tipo_documento === 'CC' ? 'selected' : ''}>Cédula de Ciudadanía</option>
                            <option value="CE" ${user.tipo_documento === 'CE' ? 'selected' : ''}>Cédula de Extranjería</option>
                            <option value="PA" ${user.tipo_documento === 'PA' ? 'selected' : ''}>Pasaporte</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Número Documento</label>
                        <input type="text" class="form-input" id="numero_documento" value="${user.numero_documento || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Área</label>
                        <input type="text" class="form-input" id="area" value="${user.area || ''}">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-input" id="cargo" value="${user.cargo || ''}">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label class="form-label">Roles *</label>
                        <div id="rolesContainer" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                            ${roles.map(role => {
            const isChecked = user.roles && user.roles.some(r => r.rol_id === role.rol_id || r.codigo === role.codigo);
            return `
                                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                                        <input type="checkbox" name="roles" value="${role.rol_id}" ${isChecked ? 'checked' : ''}>
                                        <span>${role.nombre}</span>
                                    </label>
                                `;
        }).join('')}
                        </div>
                    </div>
                </div>
            </form>
        `;

        showModal({
            title: 'Editar Usuario',
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
                        const form = document.getElementById('userForm');
                        if (!form.checkValidity()) {
                            form.reportValidity();
                            return;
                        }

                        const selectedRoles = Array.from(document.querySelectorAll('input[name="roles"]:checked'))
                            .map(cb => parseInt(cb.value));

                        if (selectedRoles.length === 0) {
                            showError('Error', 'Debe seleccionar al menos un rol');
                            return;
                        }

                        const userData = {
                            nombre: document.getElementById('nombre').value,
                            email: document.getElementById('email').value,
                            tipo_documento: document.getElementById('tipo_documento').value,
                            numero_documento: document.getElementById('numero_documento').value,
                            area: document.getElementById('area').value,
                            cargo: document.getElementById('cargo').value
                        };

                        // Only include password if it was changed
                        const password = document.getElementById('password').value;
                        if (password) {
                            userData.password = password;
                        }

                        try {
                            // Update user data
                            await put(`/usuarios/${id}`, userData);

                            // Update roles
                            await put(`/usuarios/${id}/roles`, { roles_ids: selectedRoles });

                            showSuccess('Éxito', 'Usuario actualizado correctamente');
                            hideModal();
                            await loadUsers();
                        } catch (error) {
                            showError('Error', error.message || 'No se pudo actualizar el usuario');
                        }
                    },
                    closeOnClick: false
                }
            ]
        });
    } catch (error) {
        showError('Error', error.message || 'No se pudo cargar el usuario');
    }
}

// Make functions global for inline onclick
window.editUser = function (id) {
    showEditUserModal(id);
};

window.deleteUser = function (id) {
    showConfirm(
        'Eliminar Usuario',
        '¿Está seguro que desea eliminar este usuario?',
        async () => {
            try {
                await del(`/usuarios/${id}`);
                showSuccess('Éxito', 'Usuario eliminado correctamente');
                await loadUsers();
            } catch (error) {
                showError('Error', error.message || 'No se pudo eliminar el usuario');
            }
        }
    );
};
