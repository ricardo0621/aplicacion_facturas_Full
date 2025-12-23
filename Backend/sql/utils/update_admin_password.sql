-- Script para actualizar la contraseña del usuario administrador
-- Contraseña: admin123
-- Hash generado con bcrypt (10 rounds)

UPDATE usuarios 
SET password_hash = '$2b$10$0mJXwDx36EjV8LtMkKgRjRp40v.Qc5.mhDqzDFpk'
WHERE email = 'admin@clinica.com';

-- Verificar que el usuario existe y está activo
SELECT usuario_id, nombre, email, activo 
FROM usuarios 
WHERE email = 'admin@clinica.com';

-- Verificar roles del usuario
SELECT u.nombre, r.codigo, r.nombre as rol_nombre
FROM usuarios u
JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
JOIN roles r ON ur.rol_id = r.rol_id
WHERE u.email = 'admin@clinica.com';
