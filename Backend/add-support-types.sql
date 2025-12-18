-- Agregar tipos de soporte específicos para RUTA_3 y RUTA_4

INSERT INTO tipos_soporte (codigo, nombre, descripcion, orden, activo) VALUES
('SOPORTE_CONTABILIDAD', 'Doc soporte Contabilidad', 'Documento de soporte subido por Contabilidad', 9, true),
('SOPORTE_TESORERIA', 'Doc soporte Tesoreria', 'Documento de soporte subido por Tesorería', 10, true)
ON CONFLICT (codigo) DO NOTHING;
