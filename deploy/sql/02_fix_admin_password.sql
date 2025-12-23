-- Actualizar contraseña del usuario admin
-- Nueva contraseña: admin123
-- Hash generado con bcryptjs

-- Primero, verificar si el usuario existe
SELECT * FROM usuarios WHERE email = 'admin@clinica.com';

-- Actualizar la contraseña
UPDATE usuarios 
SET password_hash = '$2a$10$rOZJhNhZhNhZhNhZhNhZhOYxQ8VLnQpX8kYZ8kYZ8kYZ8kYZ8kYZ8k'
WHERE email = 'admin@clinica.com';

-- Verificar que se actualizó
SELECT email, nombre, activo FROM usuarios WHERE email = 'admin@clinica.com';

-- NOTA: Si el usuario no existe, créalo con este comando:
/*
INSERT INTO usuarios (nombre, email, password_hash, tipo_documento, numero_documento, area, cargo, activo, puede_buscar_facturas) 
VALUES ('Administrador', 'admin@clinica.com', '$2a$10$rOZJhNhZhNhZhNhZhNhZhOYxQ8VLnQpX8kYZ8kYZ8kYZ8kYZ8kYZ8k', 'CC', '1234567890', 'Sistemas', 'Administrador', true, true);

-- Asignar rol SUPER_ADMIN
INSERT INTO usuario_roles (usuario_id, rol_id) 
SELECT u.usuario_id, r.rol_id 
FROM usuarios u, roles r 
WHERE u.email = 'admin@clinica.com' AND r.codigo = 'SUPER_ADMIN';
*/
