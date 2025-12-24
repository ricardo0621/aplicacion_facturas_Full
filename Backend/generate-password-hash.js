const bcrypt = require('bcryptjs');

// Generar hash para la contraseña "admin123"
const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error al generar hash:', err);
        return;
    }

    console.log('\n===========================================');
    console.log('Hash generado para la contraseña: admin123');
    console.log('===========================================');
    console.log(hash);
    console.log('===========================================\n');
    console.log('Ejecuta este SQL en phpPgAdmin:');
    console.log('\nUPDATE usuarios');
    console.log(`SET password_hash = '${hash}'`);
    console.log("WHERE email = 'admin@clinica.com';");
    console.log('\n===========================================\n');
});
