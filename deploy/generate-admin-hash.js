const bcrypt = require('bcryptjs');

// Generar hash para la contraseña 'admin123'
const password = 'admin123';

bcrypt.hash(password, 10)
    .then(hash => {
        console.log('===========================================');
        console.log('Hash generado para contraseña: admin123');
        console.log('===========================================');
        console.log(hash);
        console.log('===========================================');
        console.log('\nEjecuta este SQL en tu base de datos:');
        console.log('\nUPDATE usuarios SET password_hash = \'' + hash + '\' WHERE email = \'admin@clinica.com\';');
        console.log('\n===========================================');
    })
    .catch(err => {
        console.error('Error:', err);
    });
