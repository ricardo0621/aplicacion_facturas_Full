const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function addSupportTypes() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Agregar tipos de soporte específicos
        await client.query(`
            INSERT INTO tipos_soporte (codigo, nombre, descripcion, orden, activo) VALUES
            ('SOPORTE_CONTABILIDAD', 'Doc soporte Contabilidad', 'Documento de soporte subido por Contabilidad', 9, true),
            ('SOPORTE_TESORERIA', 'Doc soporte Tesoreria', 'Documento de soporte subido por Tesorería', 10, true)
            ON CONFLICT (codigo) DO NOTHING
        `);

        await client.query('COMMIT');
        console.log('✓ Tipos de soporte agregados exitosamente');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al agregar tipos de soporte:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

addSupportTypes();
