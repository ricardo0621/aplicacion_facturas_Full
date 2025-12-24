# 🚀 Guía Completa de Despliegue - Sistema de Gestión de Facturas

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
4. [Despliegue del Backend](#despliegue-del-backend)
5. [Despliegue del Frontend](#despliegue-del-frontend)
6. [Configuración Final](#configuración-final)
7. [Verificación](#verificación)
8. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos Previos

### Servidor (Dongee/cPanel)
- **Node.js**: 20.x
- **PostgreSQL**: 9.2+ (compatible con 9.2)
- **Apache/LiteSpeed** con Passenger
- **Acceso a cPanel**

### Archivos Necesarios
- Código fuente del Backend (`/Backend`)
- Código fuente del Frontend (`/frontend`)
- Archivos SQL (`/deploy/sql`)
- Archivos corregidos (`/deploy/archivos_corregidos`)

---

## 🗂️ Estructura del Proyecto

```
nuevo_facturas/
├── Backend/
│   ├── config/
│   │   └── db.js                    # ✅ Configuración BD (SSL disabled)
│   ├── services/
│   │   ├── usuario.service.js       # ✅ Compatible PG 9.2
│   │   ├── factura.service.js
│   │   ├── auth.service.js
│   │   └── tipoSoporte.service.js
│   ├── controller/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── constants/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── css/
│   ├── js/
│   └── assets/
└── deploy/
    ├── archivos_corregidos/         # ✅ Archivos corregidos
    ├── sql/                         # Scripts SQL
    ├── .htaccess                    # Configuración Passenger
    ├── .env.example                 # Plantilla variables
    └── *.md                         # Guías
```

---

## 🗄️ Configuración de la Base de Datos

### Paso 1: Crear Base de Datos en cPanel

1. Accede a **cPanel** → **PostgreSQL Databases**
2. Crea una nueva base de datos:
   - **Nombre:** `clinica2_clinica_facturas` (ajusta según tu prefijo)
3. Crea un usuario:
   - **Usuario:** `clinica2_facturas_user`
   - **Contraseña:** (guarda esta contraseña de forma segura)
4. Asigna **ALL PRIVILEGES** al usuario sobre la base de datos

### Paso 2: Ejecutar Scripts SQL

1. Accede a **phpPgAdmin**
2. Selecciona la base de datos `clinica2_clinica_facturas`
3. Ejecuta los scripts en orden:

```sql
-- 1. Crear estructura de tablas
-- Ejecuta: deploy/sql/01_schema.sql

-- 2. Insertar datos iniciales (roles, estados, etc.)
-- Ejecuta: deploy/sql/02_data.sql
```

### Paso 3: Crear Usuario Administrador

Ejecuta este SQL para crear el usuario admin:

```sql
-- Insertar usuario admin
INSERT INTO usuarios (nombre, email, password_hash, activo)
VALUES (
    'Administrador',
    'admin@clinica.com',
    '$2a$10$rX8F5vGx7YQZhKp3mN2wL.8JhV4xK9pQ2wE6tR7yU3iO5pL1mN2wK',
    TRUE
);

-- Asignar rol SUPER_ADMIN
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.usuario_id, r.rol_id
FROM usuarios u, roles r
WHERE u.email = 'admin@clinica.com'
AND r.codigo = 'SUPER_ADMIN';
```

**Credenciales iniciales:**
- **Usuario:** `admin@clinica.com`
- **Contraseña:** `admin123`

> ⚠️ **IMPORTANTE:** Cambia esta contraseña después del primer login.

---

## 🔧 Despliegue del Backend

### Paso 1: Configurar Node.js App en cPanel

1. Ve a **cPanel** → **Setup Node.js App**
2. Haz clic en **"CREATE APPLICATION"**
3. Configura:
   - **Node.js version:** 20.x
   - **Application mode:** Production
   - **Application root:** `facturas-api` (o el nombre que prefieras)
   - **Application URL:** Deja vacío o selecciona tu dominio
   - **Application startup file:** `server.js`

4. Haz clic en **"CREATE"**

### Paso 2: Subir Archivos del Backend

**Opción A: File Manager**

1. Ve a **File Manager**
2. Navega a `/home3/tuusuario/facturas-api/`
3. Sube todos los archivos de la carpeta `Backend/`:
   - `server.js`
   - `package.json`
   - Carpetas: `config/`, `controller/`, `routes/`, `services/`, `middleware/`, `utils/`, `constants/`

**Opción B: ZIP**

1. Comprime la carpeta `Backend/` localmente
2. Sube el ZIP a `/home3/tuusuario/facturas-api/`
3. Extrae el contenido

### Paso 3: Aplicar Archivos Corregidos

**IMPORTANTE:** Reemplaza estos archivos con las versiones corregidas:

1. **`config/db.js`**
   - Copia desde: `deploy/archivos_corregidos/db.js`
   - Destino: `/home3/tuusuario/facturas-api/config/db.js`
   - **Razón:** SSL deshabilitado para compatibilidad con Dongee

2. **`services/usuario.service.js`**
   - Copia desde: `deploy/archivos_corregidos/usuario.service.js`
   - Destino: `/home3/tuusuario/facturas-api/services/usuario.service.js`
   - **Razón:** Compatible con PostgreSQL 9.2 (sin FILTER, sin array_remove)

### Paso 4: Configurar Variables de Entorno

1. En **Setup Node.js App**, haz clic en tu aplicación
2. En la sección **"Environment variables"**, agrega:

```
DATABASE_URL=postgresql://clinica2_facturas_user:TU_CONTRASEÑA@localhost:5432/clinica2_clinica_facturas
JWT_SECRET=clinica_sf_jwt_secret_2024_muy_segura_y_larga_12345
NODE_ENV=production
PORT=3500
SOPORTES_PATH=/home3/tuusuario/facturas_uploads
```

> 🔑 **Reemplaza:**
> - `clinica2_facturas_user` con tu usuario de BD
> - `TU_CONTRASEÑA` con la contraseña de BD
> - `clinica2_clinica_facturas` con el nombre de tu BD
> - `tuusuario` con tu usuario de cPanel
> - `JWT_SECRET` con una clave secreta única

### Paso 5: Instalar Dependencias

1. En **Setup Node.js App**, haz clic en **"Run NPM Install"**
2. Espera a que termine (puede tardar 2-3 minutos)

### Paso 6: Iniciar la Aplicación

1. Haz clic en **"RESTART"** o **"START"**
2. Verifica que el estado sea **"Running"**

---

## 🌐 Despliegue del Frontend

### Paso 1: Configurar API URL

1. Abre `frontend/js/config/api.config.js`
2. Configura la URL de la API:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://facturas.clinicasanfrancisco.com.co/api',
    TIMEOUT: 30000
};
```

> 📝 **Nota:** Usa la URL completa de tu dominio/subdominio + `/api`

### Paso 2: Subir Archivos del Frontend

1. Ve a **File Manager**
2. Navega a `/home3/tuusuario/public_html/` (o el directorio de tu subdominio)
3. Sube todos los archivos de la carpeta `frontend/`:
   - `index.html`
   - `login.html`
   - Carpetas: `css/`, `js/`, `assets/`

### Paso 3: Configurar .htaccess

Copia el archivo `deploy/.htaccess` a `/home3/tuusuario/public_html/.htaccess`

**Contenido del .htaccess:**

```apache
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home3/tuusuario/facturas-api"
PassengerBaseURI "/"
PassengerNodejs "/home3/tuusuario/nodevenv/facturas-api/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

# Configuración para aplicación Node.js
RewriteEngine On

# Permitir acceso a archivos estáticos del frontend
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Las peticiones a /api las maneja Passenger (configurado arriba)
# Las demás rutas sirven index.html para el SPA
RewriteCond %{REQUEST_URI} !^/api
RewriteRule ^(.*)$ /index.html [L]
```

> ⚠️ **Ajusta las rutas:**
> - Reemplaza `tuusuario` con tu usuario de cPanel
> - Verifica que `PassengerAppRoot` apunte a tu carpeta del backend

### Paso 4: Crear Directorio de Uploads

```bash
mkdir -p /home3/tuusuario/facturas_uploads
chmod 755 /home3/tuusuario/facturas_uploads
```

---

## ✅ Configuración Final

### 1. Reiniciar Aplicación Node.js

- Ve a **Setup Node.js App**
- Haz clic en **"RESTART"**
- Espera 15 segundos

### 2. Verificar Permisos

```bash
chmod 755 /home3/tuusuario/facturas-api
chmod 755 /home3/tuusuario/facturas_uploads
chmod 644 /home3/tuusuario/public_html/.htaccess
```

---

## 🧪 Verificación

### 1. Probar API

Accede a: `https://tudominio.com/api/health` (si tienes un endpoint de health)

O prueba el login:
```bash
curl -X POST https://tudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica.com","password":"admin123"}'
```

### 2. Probar Frontend

1. Accede a: `https://tudominio.com/login.html`
2. Ingresa:
   - **Usuario:** `admin@clinica.com`
   - **Contraseña:** `admin123`
3. Deberías poder iniciar sesión y ver el dashboard

### 3. Verificar Funcionalidades

- ✅ Login
- ✅ Listado de usuarios
- ✅ Listado de facturas
- ✅ Crear factura
- ✅ Subir documentos

---

## 🔧 Solución de Problemas

### Error: "Cannot find module '../config/db'"

**Causa:** Archivos no subidos correctamente

**Solución:**
1. Verifica que todos los archivos estén en `/home3/tuusuario/facturas-api/`
2. Verifica que la estructura de carpetas sea correcta
3. Reinicia la aplicación Node.js

### Error: "The server does not support SSL connections"

**Causa:** Archivo `db.js` no actualizado

**Solución:**
1. Reemplaza `config/db.js` con `deploy/archivos_corregidos/db.js`
2. Reinicia la aplicación

### Error: "error de sintaxis en o cerca de «(»"

**Causa:** Archivo `usuario.service.js` no actualizado (incompatible con PostgreSQL 9.2)

**Solución:**
1. Reemplaza `services/usuario.service.js` con `deploy/archivos_corregidos/usuario.service.js`
2. Reinicia la aplicación

### Error 401: Unauthorized

**Causa:** Contraseña incorrecta o usuario no existe

**Solución:**
1. Genera un nuevo hash de contraseña:
   ```bash
   node deploy/archivos_corregidos/generate-password-hash.js
   ```
2. Ejecuta el SQL UPDATE que te muestra el script
3. Intenta el login nuevamente

### Error 503: Service Unavailable

**Causa:** Aplicación Node.js no está corriendo

**Solución:**
1. Ve a **Setup Node.js App**
2. Verifica el estado de la aplicación
3. Revisa los logs en cPanel
4. Haz clic en **"RESTART"**

### Frontend no se conecta al Backend

**Causa:** API_CONFIG incorrecta

**Solución:**
1. Verifica `frontend/js/config/api.config.js`
2. Asegúrate de que `BASE_URL` sea correcta
3. Verifica que `.htaccess` esté configurado correctamente

---

## 📞 Soporte

Si encuentras problemas no listados aquí:

1. Revisa los logs de Node.js en cPanel
2. Revisa los logs de Apache/LiteSpeed
3. Verifica la consola del navegador (F12) para errores de JavaScript
4. Consulta la guía de funcionamiento: `GUIA_FUNCIONAMIENTO.md`

---

## 🔐 Seguridad Post-Despliegue

1. ✅ Cambia la contraseña del administrador
2. ✅ Cambia el `JWT_SECRET` a un valor único
3. ✅ Verifica que HTTPS esté habilitado
4. ✅ Configura backups automáticos de la base de datos
5. ✅ No compartas las credenciales de la base de datos

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2024  
**Compatible con:** PostgreSQL 9.2+, Node.js 20.x
