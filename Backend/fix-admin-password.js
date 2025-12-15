/**
 * Script para actualizar la contraseña del administrador
 * Ejecutar con: node fix-admin-password.js
 */

const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
    const client = await pool.connect();

    try {
        console.log('Conectando a la base de datos...');

        // Generar hash de la contraseña
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);

        console.log('Hash generado:', hash);

        // Actualizar contraseña
        const updateQuery = `
            UPDATE usuarios 
            SET password_hash = $1
            WHERE email = 'admin@clinica.com'
            RETURNING usuario_id, nombre, email;
        `;

        const result = await client.query(updateQuery, [hash]);

        if (result.rows.length > 0) {
            console.log('\n✅ Contraseña actualizada exitosamente:');
            console.log(result.rows[0]);

            // Verificar roles
            const rolesQuery = `
                SELECT r.codigo, r.nombre
                FROM usuario_roles ur
                JOIN roles r ON ur.rol_id = r.rol_id
                WHERE ur.usuario_id = $1;
            `;

            const rolesResult = await client.query(rolesQuery, [result.rows[0].usuario_id]);
            console.log('\n📋 Roles asignados:');
            rolesResult.rows.forEach(role => {
                console.log(`  - ${role.nombre} (${role.codigo})`);
            });

            console.log('\n✅ Puedes iniciar sesión con:');
            console.log('   Email: admin@clinica.com');
            console.log('   Password: admin123');
        } else {
            console.log('❌ No se encontró el usuario admin@clinica.com');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

updateAdminPassword();
