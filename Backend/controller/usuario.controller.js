const usuarioService = require('../services/usuario.service');

/**
 * Crear un nuevo usuario (solo SUPER_ADMIN)
 */
const crearUsuario = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden crear usuarios.'
            });
        }

        const { nombre, email, password, tipo_documento, numero_documento, area, cargo, requiere_evidencia_pago } = req.body;

        // Validaciones
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'Nombre, email y contraseña son obligatorios.'
            });
        }

        const nuevoUsuario = await usuarioService.crearUsuario({
            nombre,
            email,
            password,
            tipo_documento,
            numero_documento,
            area,
            cargo,
            requiere_evidencia_pago
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            usuario: nuevoUsuario
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);

        if (error.message.includes('email ya está registrado')) {
            return res.status(409).json({ error: 'Email duplicado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al crear usuario',
            details: error.message
        });
    }
};

/**
 * Listar todos los usuarios
 */
const listarUsuarios = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden ver la lista de usuarios.'
            });
        }

        const usuarios = await usuarioService.listarUsuarios();

        res.status(200).json({
            success: true,
            count: usuarios.length,
            usuarios
        });

    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({
            error: 'Error al listar usuarios',
            details: error.message
        });
    }
};

/**
 * Obtener un usuario por ID
 */
const obtenerUsuario = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden ver detalles de usuarios.'
            });
        }

        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);

        res.status(200).json({
            success: true,
            usuario
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al obtener usuario',
            details: error.message
        });
    }
};

/**
 * Actualizar un usuario
 */
const actualizarUsuario = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden actualizar usuarios.'
            });
        }

        const { id } = req.params;
        const { nombre, email, password, tipo_documento, numero_documento, area, cargo, requiere_evidencia_pago } = req.body;

        const usuarioActualizado = await usuarioService.actualizarUsuario(id, {
            nombre,
            email,
            password,
            tipo_documento,
            numero_documento,
            area,
            cargo,
            requiere_evidencia_pago
        });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error.message });
        }
        if (error.message.includes('email ya está en uso')) {
            return res.status(409).json({ error: 'Email duplicado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al actualizar usuario',
            details: error.message
        });
    }
};

/**
 * Desactivar un usuario
 */
const desactivarUsuario = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden desactivar usuarios.'
            });
        }

        const { id } = req.params;
        const usuario = await usuarioService.desactivarUsuario(id);

        res.status(200).json({
            success: true,
            message: 'Usuario desactivado exitosamente',
            usuario
        });

    } catch (error) {
        console.error('Error al desactivar usuario:', error);

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al desactivar usuario',
            details: error.message
        });
    }
};

/**
 * Activar un usuario
 */
const activarUsuario = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden activar usuarios.'
            });
        }

        const { id } = req.params;
        const usuario = await usuarioService.activarUsuario(id);

        res.status(200).json({
            success: true,
            message: 'Usuario activado exitosamente',
            usuario
        });

    } catch (error) {
        console.error('Error al activar usuario:', error);

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al activar usuario',
            details: error.message
        });
    }
};

/**
 * Asignar roles a un usuario
 */
const asignarRoles = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden asignar roles.'
            });
        }

        const { id } = req.params;
        const { roles_ids } = req.body;

        if (!roles_ids || !Array.isArray(roles_ids)) {
            return res.status(400).json({
                error: 'Datos inválidos',
                details: 'Se requiere un array de IDs de roles.'
            });
        }

        const roles = await usuarioService.asignarRoles(id, roles_ids);

        res.status(200).json({
            success: true,
            message: 'Roles asignados exitosamente',
            roles
        });

    } catch (error) {
        console.error('Error al asignar roles:', error);

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error.message });
        }

        res.status(500).json({
            error: 'Error al asignar roles',
            details: error.message
        });
    }
};

/**
 * Listar roles disponibles
 */
const listarRoles = async (req, res) => {
    try {
        const roles = await usuarioService.listarRoles();

        res.status(200).json({
            success: true,
            roles
        });

    } catch (error) {
        console.error('Error al listar roles:', error);
        res.status(500).json({
            error: 'Error al listar roles',
            details: error.message
        });
    }
};

/**
 * Listar usuarios con roles de Ruta 2 (para selector en carga de facturas)
 */
const listarUsuariosRuta2 = async (req, res) => {
    try {
        const db = require('../config/db');
        const client = await db.connect();

        try {
            const query = `
                SELECT DISTINCT
                    u.usuario_id,
                    u.nombre,
                    u.email,
                    u.area,
                    u.cargo,
                    r.codigo as rol_codigo,
                    r.nombre as rol_nombre
                FROM usuarios u
                JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
                JOIN roles r ON ur.rol_id = r.rol_id
                WHERE r.codigo LIKE 'RUTA_2_%'
                  AND u.activo = true
                ORDER BY r.nombre, u.nombre
            `;

            const result = await client.query(query);

            res.status(200).json({
                success: true,
                count: result.rows.length,
                usuarios: result.rows
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error al listar usuarios de Ruta 2:', error);
        res.status(500).json({
            error: 'Error al listar usuarios de Ruta 2',
            details: error.message
        });
    }
};

/**
 * Asignar roles y permisos a un usuario (solo SUPER_ADMIN)
 */
const asignarRolesYPermisos = async (req, res) => {
    try {
        // Verificar que el usuario actual es SUPER_ADMIN
        if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los Super Administradores pueden asignar roles y permisos.'
            });
        }

        const { id } = req.params;
        const { roles, permisos } = req.body;

        await usuarioService.asignarRolesYPermisos(id, roles, permisos);

        res.json({
            success: true,
            message: 'Roles y permisos asignados exitosamente'
        });

    } catch (error) {
        console.error('Error al asignar roles y permisos:', error);
        res.status(500).json({
            error: 'Error al asignar roles y permisos',
            details: error.message
        });
    }
};

/**
 * Obtener roles y permisos de un usuario
 */
const obtenerRolesYPermisos = async (req, res) => {
    try {
        const { id } = req.params;
        const permisos = await usuarioService.obtenerPermisosUsuario(id);

        res.json({
            success: true,
            permisos
        });

    } catch (error) {
        console.error('Error al obtener roles y permisos:', error);
        res.status(404).json({
            error: 'Error al obtener roles y permisos',
            details: error.message
        });
    }
};

module.exports = {
    crearUsuario,
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    desactivarUsuario,
    activarUsuario,
    asignarRoles,
    listarRoles,
    listarUsuariosRuta2,
    asignarRolesYPermisos,
    obtenerRolesYPermisos
};