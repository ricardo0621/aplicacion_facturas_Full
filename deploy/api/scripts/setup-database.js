/**
 * Script para ejecutar el schema SQL en la base de datos
 * Ejecutar con: node setup-database.js
 */

const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔄 Conectando a la base de datos...\n');

        // Leer el archivo SQL
        const schemaPath = path.join(__dirname, 'database_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Ejecutando schema SQL...\n');

        // Ejecutar el schema
        await client.query(schema);

        console.log('✅ Schema ejecutado exitosamente!\n');

        // Verificar tablas creadas
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `;

        const tablesResult = await client.query(tablesQuery);

        console.log('📋 Tablas creadas:');
        tablesResult.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}`);
        });

        // Verificar roles
        const rolesQuery = 'SELECT COUNT(*) as count FROM roles';
        const rolesResult = await client.query(rolesQuery);
        console.log(`\n👥 Roles creados: ${rolesResult.rows[0].count}`);

        // Verificar estados
        const estadosQuery = 'SELECT COUNT(*) as count FROM estados';
        const estadosResult = await client.query(estadosQuery);
        console.log(`📊 Estados creados: ${estadosResult.rows[0].count}`);

        // Verificar tipos de soporte
        const tiposQuery = 'SELECT COUNT(*) as count FROM tipos_soporte';
        const tiposResult = await client.query(tiposQuery);
        console.log(`📎 Tipos de soporte creados: ${tiposResult.rows[0].count}`);

        console.log('\n✅ Base de datos configurada correctamente!');
        console.log('\n📝 Siguiente paso: Ejecuta "node create-admin.js" para crear el usuario administrador\n');

    } catch (error) {
        console.error('❌ Error al configurar la base de datos:');
        console.error(error.message);

        if (error.message.includes('already exists')) {
            console.log('\n⚠️  Algunas tablas ya existen. Si quieres recrear la base de datos,');
            console.log('   elimina las tablas manualmente desde Neon y vuelve a ejecutar este script.\n');
        }
    } finally {
        client.release();
        await pool.end();
    }
}

setupDatabase();
