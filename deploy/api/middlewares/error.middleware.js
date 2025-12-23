/**
 * Middleware para manejar errores de forma centralizada
 */

/**
 * Wrapper para funciones async que captura errores automáticamente
 * Uso: router.get('/ruta', asyncHandler(async (req, res) => { ... }))
 */
exports.asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Middleware de manejo de errores global
 * Debe ser el último middleware registrado en server.js
 */
exports.errorHandler = (err, req, res, next) => {
    // Log del error en consola
    console.error('❌ Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Determinar código de estado
    const statusCode = err.statusCode || err.status || 500;

    // Respuesta al cliente
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details
        })
    });
};

/**
 * Middleware para rutas no encontradas (404)
 */
exports.notFoundHandler = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
