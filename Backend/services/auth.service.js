const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Función para iniciar sesión de un usuario.
 */
const loginUsuario = async (email, password) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                u.usuario_id, u.email, u.nombre, u.password_hash, u.activo, u.area, u.cargo,
                u.puede_buscar_facturas, u.requiere_soporte_pago
            FROM usuarios u
            WHERE u.email = $1;
        `;
        const result = await client.query(query, [email]);

        if (result.rows.length === 0) {
            return { error: 'Credenciales inválidas.' };
        }

        const usuario = result.rows[0];

        if (!usuario.activo) {
            return { error: 'Usuario inactivo. Contacte al administrador.' };
        }

        // Verificar contraseña con bcrypt
        const passwordMatch = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordMatch) {
            return { error: 'Credenciales inválidas.' };
        }

        // Obtener roles del usuario (Nombre y Código)
        const rolesQuery = `
            SELECT r.nombre, r.codigo, r.rol_id
            FROM usuario_roles ur
            JOIN roles r ON ur.rol_id = r.rol_id
            WHERE ur.usuario_id = $1;
        `;
        const rolesResult = await client.query(rolesQuery, [usuario.usuario_id]);

        // Crear array de objetos de roles
        const roles = rolesResult.rows.map(r => ({
            rol_id: r.rol_id,
            codigo: r.codigo,
            nombre: r.nombre
        }));

        // Determinar si es admin basado en el rol
        const isAdmin = roles.some(r => r.codigo === 'SUPER_ADMIN');

        // Datos a incluir en el token JWT
        const tokenPayload = {
            usuario_id: usuario.usuario_id,
            email: usuario.email,
            nombre: usuario.nombre,
            is_admin: isAdmin,
            roles: roles.map(r => r.codigo), // Solo códigos en el token
            puede_buscar_facturas: usuario.puede_buscar_facturas || false,
            requiere_soporte_pago: usuario.requiere_soporte_pago || false
        };

        // Generar el token
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'mi_clave_secreta_por_defecto',
            { expiresIn: '8h' }
        );

        return {
            token: token,
            message: "Inicio de sesión exitoso.",
            usuario: {
                usuario_id: usuario.usuario_id,
                email: usuario.email,
                nombre: usuario.nombre,
                area: usuario.area,
                cargo: usuario.cargo,
                roles: roles, // Array de objetos con codigo y nombre
                is_admin: isAdmin,
                puede_buscar_facturas: usuario.puede_buscar_facturas || false,
                requiere_soporte_pago: usuario.requiere_soporte_pago || false
            }
        };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw new Error('Error en la capa de servicio al autenticar.');
    } finally {
        client.release();
    }
};

module.exports = {
    loginUsuario
};