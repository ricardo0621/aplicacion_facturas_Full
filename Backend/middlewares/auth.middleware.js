const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez del token JWT en las peticiones.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado. Se requiere un token JWT en el formato "Bearer [token]".'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar la información decodificada del usuario a req.user
        req.user = decoded;

        next();

    } catch (error) {
        console.error("Error de verificación de token:", error.message);
        return res.status(401).json({
            error: 'Token inválido o expirado.',
            details: error.message
        });
    }
};

/**
 * Middleware para verificar si el usuario es SUPER_ADMIN
 */
const isSuperAdmin = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) {
        return res.status(403).json({
            error: 'Acceso denegado. Se requieren permisos de Super Administrador.'
        });
    }
    next();
};

/**
 * Middleware para verificar si el usuario tiene permiso de búsqueda
 */
const verificarPermisoBusqueda = async (req, res, next) => {
    try {
        // SUPER_ADMIN siempre tiene acceso
        if (req.user.is_admin || (req.user.roles && req.user.roles.includes('SUPER_ADMIN'))) {
            return next();
        }

        // Verificar si el permiso está en el token (más eficiente)
        if (req.user.puede_buscar_facturas === true) {
            return next();
        }

        // Si no está en el token, consultar la base de datos (por si el token es antiguo)
        const db = require('../config/db');
        const client = await db.connect();

        try {
            const query = 'SELECT puede_buscar_facturas FROM usuarios WHERE usuario_id = $1';
            const result = await client.query(query, [req.user.usuario_id]);

            if (result.rows.length === 0 || !result.rows[0].puede_buscar_facturas) {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    details: 'No tiene permisos para acceder a la búsqueda de facturas. Cierre sesión y vuelva a iniciar sesión si recientemente se le asignó este permiso.'
                });
            }

            next();
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al verificar permiso de búsqueda:', error);
        return res.status(500).json({
            error: 'Error al verificar permisos',
            details: error.message
        });
    }
};

module.exports = {
    verifyToken,
    isSuperAdmin,
    verificarPermisoBusqueda
};