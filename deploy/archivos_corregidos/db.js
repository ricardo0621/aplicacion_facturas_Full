const { Pool } = require('pg');
require('dotenv').config();

// Configuración del Pool de Conexiones a PostgreSQL
// Usa la variable DATABASE_URL del archivo .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // =============================================================
    // SSL DESHABILITADO PARA DONGEE
    // Dongee no soporta conexiones SSL a PostgreSQL
    // =============================================================
    ssl: false,

    // Configurar zona horaria de Colombia
    options: '-c timezone=America/Bogota'
});

module.exports = pool;