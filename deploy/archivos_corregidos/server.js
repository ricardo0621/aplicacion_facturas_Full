const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno requeridas
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Error: Variables de entorno requeridas no configuradas:');
    console.error('   -', missingEnvVars.join('\n   - '));
    console.error('\nPor favor, configura estas variables en el archivo .env');
    process.exit(1);
}

// =============================================================
// 1. IMPORTACIÓN DE RUTAS
// =============================================================

const authRoutes = require('./routes/auth.route');
const facturaRoutes = require('./routes/factura.route');
const usuarioRoutes = require('./routes/usuario.route');
const proveedorRoutes = require('./routes/proveedor.route');
const tipoSoporteRoutes = require('./routes/tipoSoporte.route');
const exportRoutes = require('./routes/export.route');
const { errorHandler } = require('./middlewares/error.middleware');

// =============================================================
// 2. CONFIGURACIÓN INICIAL DE EXPRESS
// =============================================================
const app = express();
const PORT = process.env.PORT || 3500;

// =============================================================
// 3. MIDDLEWARES GLOBALES
// =============================================================

// Habilitar CORS para permitir solicitudes desde otros dominios
app.use(cors());

// Middleware para parsear JSON body
app.use(express.json());

// Middleware para parsear URL-encoded body
app.use(express.urlencoded({ extended: true }));

// =============================================================
// 4. SERVIR ARCHIVOS ESTÁTICOS
// =============================================================

// Ruta para servir los soportes de facturas cargados
const SOPORTES_PATH = process.env.SOPORTES_PATH || path.join(__dirname, 'uploads');
app.use('/api/soportes_facturas', express.static(SOPORTES_PATH));

// Servir archivos estáticos del frontend
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_PATH));

// =============================================================
// 5. REGISTRO DE RUTAS ESPECÍFICAS
// =============================================================

// Rutas de Autenticación
app.use('/api/auth', authRoutes);

// Ruta de Facturas
app.use('/api/facturas', facturaRoutes);

// Rutas de Usuarios
app.use('/api/usuarios', usuarioRoutes);

// Rutas de Proveedores
app.use('/api/proveedores', proveedorRoutes);

// Rutas de Tipos de Soporte
app.use('/api/tipos-soporte', tipoSoporteRoutes);

// Rutas de Exportación
app.use('/api/export', exportRoutes);

// =============================================================
// 6. MANEJO DE RUTA NO ENCONTRADA (404)
// =============================================================

app.use((req, res, next) => {
    // Si la ruta no es de API, servir index.html (para SPA)
    if (!req.path.startsWith('/api')) {
        return res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
    }
    res.status(404).json({
        error: 'Ruta no encontrada',
        details: `La URL solicitada: ${req.method} ${req.originalUrl} no existe en el servidor.`
    });
});

// Middleware de error global (debe ser el último)
app.use(errorHandler);

// =============================================================
// 7. INICIO DEL SERVIDOR
// =============================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Gestor de Facturas disponible en la red en: http://172.16.2.230:${PORT}`);
});