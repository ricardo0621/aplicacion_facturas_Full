# Instrucciones de Despliegue - PASO A PASO

## ✅ PASO 1: Base de Datos (COMPLETADO)
Ya ejecutaste el schema SQL en PostgreSQL. ¡Perfecto!

---

## 📦 PASO 2: Preparar Archivos para Subir

### 2.1 Backend - Archivos a Subir por FTP

Debes subir **TODA la carpeta Backend** a tu servidor Dongee, **EXCEPTO**:
- ❌ `node_modules/` (se instalará en el servidor)
- ❌ `.env` (se creará en el servidor)
- ❌ `logs/` (se creará automáticamente)
- ❌ Archivos `.backup*`

**Carpetas y archivos que SÍ debes subir:**
- ✅ `controller/`
- ✅ `middlewares/`
- ✅ `routes/`
- ✅ `services/`
- ✅ `sql/`
- ✅ `server.js`
- ✅ `package.json`
- ✅ `db.js`

### 2.2 Frontend - Archivos a Subir

Debes subir **TODA la carpeta frontend** a `public_html/`:
- ✅ `index.html`
- ✅ `login.html`
- ✅ `css/`
- ✅ `js/`
- ✅ `assets/`

---

## ⚙️ PASO 3: Configurar en Dongee (cPanel)

### 3.1 Subir Backend

1. **Conecta por FTP** (FileZilla o cPanel File Manager)
2. Crea la carpeta: `/home/tu_usuario/facturas-api/`
3. Sube todos los archivos del Backend a esa carpeta

### 3.2 Crear archivo .env en el servidor

En la carpeta `/home/tu_usuario/facturas-api/` crea un archivo `.env` con este contenido:

```env
# Base de Datos
DATABASE_URL=postgresql://TU_USUARIO_BD:TU_PASSWORD_BD@localhost:5432/TU_NOMBRE_BD

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_2024

# Servidor
PORT=3500
NODE_ENV=production

# Archivos
SOPORTES_PATH=/home/tu_usuario/facturas_uploads
```

**IMPORTANTE:** Reemplaza:
- `TU_USUARIO_BD` - Usuario de PostgreSQL que creaste
- `TU_PASSWORD_BD` - Contraseña de PostgreSQL
- `TU_NOMBRE_BD` - Nombre de la base de datos
- `tu_usuario` - Tu usuario de hosting

### 3.3 Configurar Aplicación Node.js

1. En cPanel, busca **"Setup Node.js App"**
2. Haz clic en **"Create Application"**
3. Configura:
   - **Node.js version:** 18.x o superior
   - **Application mode:** Production
   - **Application root:** `/home/tu_usuario/facturas-api`
   - **Application URL:** Tu dominio (ej: `facturas.tudominio.com`)
   - **Application startup file:** `server.js`

4. En **Environment variables**, agrega las mismas del archivo .env

5. Haz clic en **"Run NPM Install"** (espera a que termine)

6. Haz clic en **"Start"** o **"Restart"**

### 3.4 Crear Carpeta de Uploads

1. Crea la carpeta: `/home/tu_usuario/facturas_uploads/`
2. Asigna permisos **755**

---

## 🌐 PASO 4: Configurar Frontend

### 4.1 Subir Frontend

Sube todos los archivos de la carpeta `frontend/` a:
- `/public_html/` (si es el dominio principal)
- O `/public_html/facturas/` (si usas subdirectorio)

### 4.2 Actualizar URL de API

Edita el archivo: `/public_html/js/config/config.js`

Cambia la línea:
```javascript
API_BASE_URL: 'http://localhost:3200/api',
```

Por:
```javascript
API_BASE_URL: 'https://tudominio.com/api',
```

**IMPORTANTE:** Usa la URL que configuraste en el paso 3.3

---

## ✅ PASO 5: Verificar

1. **Probar API:** Abre `https://tudominio.com/api/` en el navegador
   - Deberías ver un mensaje de la API

2. **Probar Login:** Abre `https://tudominio.com/login.html`
   - Usuario: `admin@clinica.com`
   - Contraseña: La que configuraste en el script SQL

3. **Probar funcionalidades:**
   - Ver facturas
   - Crear factura
   - Subir documentos

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica las credenciales en `.env`
- Verifica que PostgreSQL esté corriendo
- Verifica que el usuario tenga permisos en la BD

### Error: "Module not found"
- Ejecuta `npm install` en cPanel > Node.js App
- Verifica que `node_modules/` se haya creado

### Frontend no carga
- Verifica que `config.js` tenga la URL correcta
- Verifica que los archivos estén en `public_html/`

### No se pueden subir archivos
- Verifica permisos de `/facturas_uploads/` (755 o 777)
- Verifica que la ruta en `.env` sea correcta

---

## 📝 Checklist de Despliegue

- [x] Base de datos creada y schema ejecutado
- [ ] Backend subido a `/home/tu_usuario/facturas-api/`
- [ ] Archivo `.env` creado en el servidor
- [ ] Aplicación Node.js configurada en cPanel
- [ ] `npm install` ejecutado
- [ ] Aplicación Node.js iniciada
- [ ] Carpeta de uploads creada con permisos
- [ ] Frontend subido a `public_html/`
- [ ] URL de API actualizada en `config.js`
- [ ] Login probado exitosamente
- [ ] Funcionalidades principales probadas

---

## 🎯 Siguiente Paso

**Ahora debes:**

1. Subir la carpeta `Backend/` a tu servidor (excepto node_modules y .env)
2. Crear el archivo `.env` en el servidor con tus credenciales
3. Configurar la aplicación Node.js en cPanel

¿Necesitas ayuda con alguno de estos pasos?
