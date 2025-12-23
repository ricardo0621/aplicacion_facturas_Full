# Guía de Despliegue - Dongee Hosting

## 📋 Información del Proyecto

- **Aplicación:** Gestor de Facturas Clínica San Francisco
- **Backend:** Node.js + Express
- **Frontend:** HTML/CSS/JavaScript (SPA)
- **Base de Datos:** PostgreSQL 9.2.24

---

## 🚀 PASO 1: Preparar Base de Datos en Dongee

### 1.1 Crear Base de Datos PostgreSQL

1. Accede a **cPanel** de Dongee
2. Ve a **PostgreSQL Databases**
3. Crea una nueva base de datos:
   - Nombre: `clinica_facturas` (o el que prefieras)
   - Anota el nombre completo (ej: `usuario_clinica_facturas`)

### 1.2 Crear Usuario de Base de Datos

1. En la misma sección, crea un usuario:
   - Usuario: `facturas_user`
   - Contraseña: (genera una segura)
   - **ANOTA ESTOS DATOS**

2. Asigna el usuario a la base de datos con **TODOS LOS PRIVILEGIOS**

### 1.3 Ejecutar Scripts SQL

1. Ve a **phpPgAdmin** en cPanel
2. Selecciona tu base de datos
3. Ejecuta los scripts en este orden:
   - `deploy/sql/01_schema.sql` - Crea tablas
   - `deploy/sql/02_initial_data.sql` - Datos iniciales
   - `deploy/sql/03_admin_user.sql` - Usuario administrador

**IMPORTANTE:** Anota las credenciales del usuario admin que se crean.

---

## 🔧 PASO 2: Configurar Variables de Entorno

### 2.1 Datos que Necesitas

Anota esta información:

```
DATABASE_URL=postgresql://[USUARIO]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
JWT_SECRET=[GENERA_UNA_CLAVE_SEGURA]
PORT=3500
NODE_ENV=production
SOPORTES_PATH=/home/[tu_usuario]/facturas_uploads
```

**Ejemplo:**
```
DATABASE_URL=postgresql://usuario_facturas:MiPass123@localhost:5432/usuario_clinica_facturas
JWT_SECRET=mi_clave_super_secreta_2024
PORT=3500
NODE_ENV=production
SOPORTES_PATH=/home/miusuario/facturas_uploads
```

### 2.2 Crear Archivo .env en Dongee

Este archivo se creará directamente en el servidor después de subir los archivos.

---

## 📁 PASO 3: Subir Archivos al Servidor

### 3.1 Conectar por FTP

1. Usa **FileZilla** o el **Administrador de Archivos** de cPanel
2. Credenciales FTP (las proporciona Dongee)

### 3.2 Subir Frontend

**Origen:** `deploy/public_html/*`
**Destino:** `/public_html/` (o `/public_html/facturas/` si usas subdirectorio)

Archivos a subir:
- `index.html`
- `login.html`
- `css/`
- `js/`
- `assets/`

### 3.3 Subir Backend

**Origen:** `deploy/api/*`
**Destino:** `/nodejs/facturas-api/` (o la ruta que uses para apps Node.js)

Archivos a subir:
- Todos los archivos de `deploy/api/`
- **NO subir:** `node_modules/`, `.env` (se crea después)

### 3.4 Crear Carpeta de Uploads

1. Crea la carpeta: `/home/[tu_usuario]/facturas_uploads/`
2. Asigna permisos **755** o **777**

---

## ⚙️ PASO 4: Configurar Node.js en Dongee

### 4.1 Acceder a Node.js App Manager

1. En cPanel, busca **Setup Node.js App**
2. Haz clic en **Create Application**

### 4.2 Configurar Aplicación

- **Node.js version:** Selecciona la más reciente disponible (mínimo 14.x)
- **Application mode:** Production
- **Application root:** `/nodejs/facturas-api` (ruta donde subiste el backend)
- **Application URL:** Tu dominio o subdominio (ej: `facturas.tudominio.com`)
- **Application startup file:** `server.js`

### 4.3 Variables de Entorno

En la sección **Environment variables**, agrega:

```
DATABASE_URL=postgresql://[tus_datos_aqui]
JWT_SECRET=[tu_clave_secreta]
PORT=3500
NODE_ENV=production
SOPORTES_PATH=/home/[tu_usuario]/facturas_uploads
```

### 4.4 Instalar Dependencias

1. Haz clic en **Run NPM Install**
2. Espera a que termine (puede tardar varios minutos)

### 4.5 Iniciar Aplicación

1. Haz clic en **Start** o **Restart**
2. Verifica que el estado sea **Running**

---

## 🌐 PASO 5: Configurar Frontend

### 5.1 Actualizar URL de API

Edita el archivo `/public_html/js/config/config.js`:

```javascript
export const CONFIG = {
    API_BASE_URL: 'https://tudominio.com/api',  // ← Cambia esto
    // ... resto del archivo
};
```

**IMPORTANTE:** La URL debe apuntar a tu aplicación Node.js configurada en el paso anterior.

---

## ✅ PASO 6: Verificar Instalación

### 6.1 Probar Conexión a Base de Datos

1. Accede a: `https://tudominio.com/api/health` (o la ruta que hayas configurado)
2. Deberías ver un mensaje de estado

### 6.2 Probar Login

1. Accede a: `https://tudominio.com/login.html`
2. Usa las credenciales del admin creadas en el script SQL:
   - Usuario: `admin@clinica.com`
   - Contraseña: (la que configuraste en el script)

### 6.3 Probar Funcionalidades

- ✅ Login
- ✅ Ver facturas
- ✅ Crear factura
- ✅ Subir documentos
- ✅ Búsqueda avanzada
- ✅ Exportar a Excel

---

## 🔍 Solución de Problemas

### Error: "Cannot connect to database"

- Verifica las credenciales en `.env`
- Verifica que el usuario tenga permisos en la BD
- Verifica que PostgreSQL esté corriendo

### Error: "Module not found"

- Ejecuta `npm install` en el directorio de la aplicación
- Verifica que `node_modules/` se haya creado

### Error: "Cannot upload files"

- Verifica permisos de la carpeta `facturas_uploads/`
- Debe tener permisos 755 o 777

### Frontend no carga

- Verifica que `config.js` tenga la URL correcta de la API
- Verifica que los archivos estén en `public_html/`

### API no responde

- Verifica que la aplicación Node.js esté **Running** en cPanel
- Revisa los logs en cPanel > Node.js App > View Logs

---

## 📞 Contacto y Soporte

Si tienes problemas, revisa:
1. Logs de la aplicación Node.js en cPanel
2. Logs de PostgreSQL
3. Consola del navegador (F12) para errores del frontend

---

## 📝 Notas Importantes

⚠️ **Seguridad:**
- Cambia las contraseñas por defecto
- Usa HTTPS (SSL) en producción
- No compartas el archivo `.env`

⚠️ **Backups:**
- Configura backups automáticos de la base de datos
- Respalda la carpeta de uploads regularmente

⚠️ **Mantenimiento:**
- Revisa logs periódicamente
- Actualiza dependencias de Node.js cuando sea necesario
