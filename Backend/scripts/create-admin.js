/**
 * Script para crear el usuario administrador
 * Ejecutar con: node create-admin.js
 */

const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const client = await pool.connect();

    try {
        console.log('🔄 Conectando a la base de datos...\n');

        // Verificar si el usuario ya existe
        const checkQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const checkResult = await client.query(checkQuery, ['admin@clinica.com']);

        if (checkResult.rows.length > 0) {
            console.log('⚠️  El usuario admin@clinica.com ya existe.');
            console.log('   Actualizando contraseña...\n');

            const hash = await bcrypt.hash('admin123', 10);
            await client.query(
                'UPDATE usuarios SET password_hash = $1 WHERE email = $2',
                [hash, 'admin@clinica.com']
            );

            console.log('✅ Contraseña actualizada exitosamente\n');
        } else {
            console.log('📝 Creando usuario administrador...\n');

            // Generar hash de la contraseña
            const hash = await bcrypt.hash('admin123', 10);

            // Crear usuario
            const insertQuery = `
                INSERT INTO usuarios (nombre, email, password_hash, tipo_documento, numero_documento, area, cargo, activo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING usuario_id, nombre, email;
            `;

            const result = await client.query(insertQuery, [
                'Administrador',
                'admin@clinica.com',
                hash,
                'CC',
                '1234567890',
                'Sistemas',
                'Administrador del Sistema',
                true
            ]);

            const usuario = result.rows[0];
            console.log('✅ Usuario creado:', usuario);

            // Obtener el rol SUPER_ADMIN
            const rolQuery = 'SELECT rol_id FROM roles WHERE codigo = $1';
            const rolResult = await client.query(rolQuery, ['SUPER_ADMIN']);

            if (rolResult.rows.length === 0) {
                console.log('❌ No se encontró el rol SUPER_ADMIN');
                return;
            }

            const rolId = rolResult.rows[0].rol_id;

            // Asignar rol al usuario
            await client.query(
                'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)',
                [usuario.usuario_id, rolId]
            );

            console.log('✅ Rol SUPER_ADMIN asignado\n');
        }

        // Verificar el usuario final
        const verifyQuery = `
            SELECT u.usuario_id, u.nombre, u.email, u.area, u.cargo, u.activo,
                   array_agg(r.codigo) as roles
            FROM usuarios u
            LEFT JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
            LEFT JOIN roles r ON ur.rol_id = r.rol_id
            WHERE u.email = 'admin@clinica.com'
            GROUP BY u.usuario_id, u.nombre, u.email, u.area, u.cargo, u.activo;
        `;

        const verifyResult = await client.query(verifyQuery);

        if (verifyResult.rows.length > 0) {
            console.log('📋 Usuario verificado:');
            console.log('   ID:', verifyResult.rows[0].usuario_id);
            console.log('   Nombre:', verifyResult.rows[0].nombre);
            console.log('   Email:', verifyResult.rows[0].email);
            console.log('   Área:', verifyResult.rows[0].area);
            console.log('   Cargo:', verifyResult.rows[0].cargo);
            console.log('   Activo:', verifyResult.rows[0].activo);
            console.log('   Roles:', verifyResult.rows[0].roles.join(', '));
            console.log('\n✅ Credenciales de acceso:');
            console.log('   Email: admin@clinica.com');
            console.log('   Password: admin123\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        client.release();
        await pool.end();
    }
}

createAdmin();
