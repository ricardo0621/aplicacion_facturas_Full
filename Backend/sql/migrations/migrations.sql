-- ============================================
-- MIGRACIONES PARA SISTEMA DE GESTIÓN DE FACTURAS
-- Archivo unificado para deployment en Dongee
-- ============================================

-- ============================================
-- 1. TIPOS DE SOPORTE ADICIONALES
-- ============================================
-- Agregar tipos de soporte específicos para RUTA_3 y RUTA_4

INSERT INTO tipos_soporte (codigo, nombre, descripcion, orden, activo) VALUES
('SOPORTE_CONTABILIDAD', 'Doc soporte Contabilidad', 'Documento de soporte subido por Contabilidad', 9, true),
('SOPORTE_TESORERIA', 'Doc soporte Tesoreria', 'Documento de soporte subido por Tesorería', 10, true)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- 2. PERMISOS DE USUARIO
-- ============================================
-- Agregar columnas de permisos a la tabla usuarios

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS requiere_soporte_pago BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS puede_buscar_facturas BOOLEAN DEFAULT false;

COMMENT ON COLUMN usuarios.requiere_soporte_pago IS 'Si es true, usuario RUTA_4 debe subir soporte antes de marcar como pagada';
COMMENT ON COLUMN usuarios.puede_buscar_facturas IS 'Si es true, usuario puede acceder a búsqueda avanzada de facturas';

-- Por defecto, dar permiso de búsqueda a SUPER_ADMIN
UPDATE usuarios 
SET puede_buscar_facturas = true
WHERE usuario_id IN (
    SELECT ur.usuario_id 
    FROM usuario_roles ur
    JOIN roles r ON ur.rol_id = r.rol_id
    WHERE r.codigo = 'SUPER_ADMIN'
);

-- ============================================
-- FIN DE MIGRACIONES
-- ============================================
