# 🔧 Solución de Problemas Comunes

## 📋 Índice de Problemas

1. [Error de Login](#error-de-login)
2. [Error de Descarga de Archivos](#error-de-descarga-de-archivos)
3. [Error de Base de Datos](#error-de-base-de-datos)
4. [Error de Rutas](#error-de-rutas)
5. [Aplicación No Inicia](#aplicación-no-inicia)

---

## 1. Error de Login

### Síntoma
- No se puede iniciar sesión
- Error 401 Unauthorized
- Credenciales incorrectas

### Solución

**Paso 1:** Verificar credenciales
```
Usuario: admin@clinica.com
Contraseña: admin123
```

**Paso 2:** Verificar hash de contraseña en base de datos

Ejecutar en phpPgAdmin:
```sql
SELECT email, password_hash 
FROM usuarios 
WHERE email = 'admin@clinica.com';
```

**Paso 3:** Si el hash está incorrecto, ejecutar:
```sql
UPDATE usuarios 
SET password_hash = '$2a$10$rX8F5vGx7YQZhKp3mN2wL.8JhV4xK9pQ2wE6tR7yU3iO5pL1mN2wK'
WHERE email = 'admin@clinica.com';
```

**Paso 4:** Verificar que la aplicación Node.js esté corriendo
- Setup Node.js App → Ver estado
- Si está detenida, hacer clic en RESTART

---

## 2. Error de Descarga de Archivos

### Síntoma
- Error 404 al descargar documentos
- Error MIME type "text/html"
- Archivos no se encuentran

### Solución

**Paso 1:** Verificar que los archivos estén en la carpeta correcta
```bash
ls -la /home3/clinica2/facturas_uploads/
```

**Paso 2:** Verificar variable de entorno
En Setup Node.js App → Environment variables:
```
SOPORTES_PATH=/home3/clinica2/facturas_uploads
```

**Paso 3:** Verificar rutas en base de datos
```sql
SELECT documento_id, nombre_archivo, ruta_archivo 
FROM factura_documentos 
ORDER BY fecha_carga DESC 
LIMIT 10;
```

Las rutas deben ser **solo nombres de archivo**, NO rutas completas:
- ✅ Correcto: `fv1-DOC-12345678.pdf`
- ❌ Incorrecto: `/home3/clinica2/facturas_uploads/fv1-DOC-12345678.pdf`

**Paso 4:** Si las rutas están incorrectas, ejecutar:
```sql
UPDATE factura_documentos
SET ruta_archivo = SUBSTRING(ruta_archivo FROM '[^/]+$')
WHERE ruta_archivo LIKE '%/%';
```

**Paso 5:** Verificar .htaccess
El archivo `.htaccess` debe tener la configuración de Passenger correcta.

**Paso 6:** Reiniciar aplicación
- Setup Node.js App → RESTART
- Esperar 30 segundos

---

## 3. Error de Base de Datos

### Síntoma
- "The server does not support SSL connections"
- Error de conexión a PostgreSQL
- Timeout de conexión

### Solución

**Paso 1:** Verificar configuración SSL en `config/db.js`

Debe estar:
```javascript
ssl: false
```

NO debe estar:
```javascript
ssl: { rejectUnauthorized: false }
```

**Paso 2:** Verificar DATABASE_URL

En Setup Node.js App → Environment variables:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
```

**Sin** `?sslmode=require` al final.

**Paso 3:** Verificar que la base de datos existe
```sql
SELECT datname FROM pg_database WHERE datname = 'clinica2_clinica_facturas';
```

**Paso 4:** Verificar permisos del usuario
```sql
SELECT * FROM pg_user WHERE usename = 'clinica2_facturas_user';
```

---

## 4. Error de Rutas

### Síntoma
- Error "no existe la función array_remove"
- Error de sintaxis SQL
- Funciones no compatibles con PostgreSQL 9.2

### Solución

**Paso 1:** Verificar que estás usando los archivos corregidos

Los archivos en `archivos_corregidos/` están adaptados para PostgreSQL 9.2.

**Paso 2:** Subir `usuario.service.js` corregido
```
archivos_corregidos/usuario.service.js 
→ /home3/clinica2/facturas-api/services/usuario.service.js
```

**Paso 3:** Reiniciar aplicación

---

## 5. Aplicación No Inicia

### Síntoma
- Error al acceder a la URL
- Página en blanco
- Error 500

### Solución

**Paso 1:** Verificar logs de la aplicación

En Setup Node.js App → View Logs

Buscar errores como:
- Module not found
- Syntax error
- Port already in use

**Paso 2:** Verificar que todas las dependencias estén instaladas

En Terminal SSH:
```bash
cd /home3/clinica2/facturas-api
npm install
```

**Paso 3:** Verificar permisos de archivos
```bash
chmod 755 /home3/clinica2/facturas-api
chmod 644 /home3/clinica2/facturas-api/*.js
```

**Paso 4:** Verificar configuración de Passenger

El `.htaccess` debe tener:
```apache
PassengerAppRoot "/home3/clinica2/facturas-api"
PassengerBaseURI "/api"
PassengerNodejs "/home3/clinica2/nodevenv/facturas-api/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
```

**Paso 5:** Reiniciar Apache (si es necesario)

Desde cPanel → Restart Services

---

## 🔍 Comandos Útiles de Diagnóstico

### Verificar archivos subidos
```bash
ls -la /home3/clinica2/facturas_uploads/
```

### Verificar logs de Node.js
```bash
tail -f /home3/clinica2/facturas-api/logs/app.log
```

### Verificar proceso de Node.js
```bash
ps aux | grep node
```

### Verificar conexión a base de datos
```bash
psql -U clinica2_facturas_user -d clinica2_clinica_facturas -c "SELECT version();"
```

---

## 📞 Checklist de Verificación

Cuando algo no funciona, verificar en orden:

- [ ] ¿La aplicación Node.js está corriendo? (Setup Node.js App)
- [ ] ¿Las variables de entorno están configuradas?
- [ ] ¿Los archivos corregidos están subidos?
- [ ] ¿El .htaccess está actualizado?
- [ ] ¿La base de datos está accesible?
- [ ] ¿Los permisos de archivos son correctos?
- [ ] ¿Se reinició la aplicación después de cambios?

---

## 🆘 Problemas No Listados

Si encuentras un problema no listado aquí:

1. **Revisar logs** en Setup Node.js App → View Logs
2. **Revisar consola del navegador** (F12)
3. **Verificar Network tab** para ver qué peticiones fallan
4. **Comparar con archivos en `archivos_corregidos/`**

---

**Última actualización:** 29/12/2024  
**Versión:** 1.0
