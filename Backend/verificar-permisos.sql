-- Script para verificar y actualizar permisos de búsqueda
-- Ejecutar este script en la base de datos

-- 1. Verificar si las columnas existen
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name IN ('puede_buscar_facturas', 'requiere_soporte_pago');

-- 2. Ver usuarios y sus permisos actuales
SELECT 
    u.usuario_id,
    u.nombre,
    u.email,
    u.puede_buscar_facturas,
    u.requiere_soporte_pago,
    STRING_AGG(r.codigo, ', ') as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.rol_id
GROUP BY u.usuario_id, u.nombre, u.email, u.puede_buscar_facturas, u.requiere_soporte_pago
ORDER BY u.usuario_id;

-- 3. Dar permiso de búsqueda a TODOS los SUPER_ADMIN
UPDATE usuarios 
SET puede_buscar_facturas = true
WHERE usuario_id IN (
    SELECT ur.usuario_id 
    FROM usuario_roles ur
    JOIN roles r ON ur.rol_id = r.rol_id
    WHERE r.codigo = 'SUPER_ADMIN'
);

-- 4. Verificar actualización
SELECT 
    u.usuario_id,
    u.nombre,
    u.email,
    u.puede_buscar_facturas,
    STRING_AGG(r.codigo, ', ') as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.rol_id
WHERE r.codigo = 'SUPER_ADMIN'
GROUP BY u.usuario_id, u.nombre, u.email, u.puede_buscar_facturas;
