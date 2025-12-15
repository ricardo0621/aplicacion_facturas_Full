# Guía de Configuración - Base de Datos Nueva

## Paso 1: Ejecutar el Schema SQL

Tienes dos opciones para ejecutar el schema:

### Opción A: Desde la interfaz web de Neon (Recomendado)

1. Ve a https://console.neon.tech/
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto `gestorfactgravity`
4. Ve a la sección "SQL Editor" o "Query"
5. Copia y pega el contenido completo del archivo `database_schema.sql`
6. Ejecuta el script

### Opción B: Usando psql desde la terminal

Si tienes PostgreSQL instalado localmente con psql:

```bash
# Desde la carpeta Backend
psql "postgresql://neondb_owner:npg_1ceCjh5dFQIW@ep-dark-salad-ac9uqdid-pooler.sa-east-1.aws.neon.tech/gestorfacturas?sslmode=require" -f database_schema.sql
```

## Paso 2: Crear el Usuario Administrador

Después de ejecutar el schema, ejecuta:

```bash
node create-admin.js
```

Esto creará el usuario administrador con:
- Email: admin@clinica.com
- Password: admin123
- Rol: SUPER_ADMIN

## Paso 3: Iniciar el Servidor

```bash
npm start
```

## Paso 4: Acceder al Sistema

Abre tu navegador en:
```
http://localhost:3500/login.html
```

Credenciales:
- Email: admin@clinica.com
- Password: admin123

---

## ¿Qué hace el Schema SQL?

El archivo `database_schema.sql` crea:

1. **Tablas**:
   - `roles` - Roles del sistema
   - `estados` - Estados de facturas
   - `proveedores` - Proveedores
   - `tipos_soporte` - Tipos de documentos de soporte
   - `usuarios` - Usuarios del sistema
   - `usuario_roles` - Relación usuarios-roles
   - `facturas` - Facturas
   - `factura_historial` - Historial de acciones
   - `factura_documentos` - Documentos adjuntos

2. **Datos iniciales**:
   - 10 roles predefinidos (SUPER_ADMIN, RUTA_1, RUTA_2_*, RUTA_3, RUTA_4)
   - 11 estados de factura
   - 8 tipos de soporte
   - 1 usuario administrador (con contraseña que necesita actualizarse)

3. **Índices** para mejorar el rendimiento

---

## Verificación

Para verificar que todo está correcto, puedes ejecutar estas consultas en Neon:

```sql
-- Verificar que las tablas se crearon
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar roles
SELECT * FROM roles;

-- Verificar estados
SELECT * FROM estados;

-- Verificar usuarios
SELECT u.nombre, u.email, array_agg(r.codigo) as roles
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.rol_id
GROUP BY u.usuario_id, u.nombre, u.email;
```
