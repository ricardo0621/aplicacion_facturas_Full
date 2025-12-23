# 📦 INSTRUCCIONES PARA SUBIR EL BACKEND

## ✅ Archivo Listo: `backend-dongee.zip`

Este archivo contiene TODO lo necesario para el Backend:
- ✅ server.js
- ✅ package.json
- ✅ controller/
- ✅ middlewares/
- ✅ routes/
- ✅ services/
- ✅ sql/

**NO incluye** (se instalarán/crearán en el servidor):
- ❌ node_modules/
- ❌ .env
- ❌ logs/

---

## 🚀 PASOS PARA SUBIR A DONGEE

### PASO 1: Crear Carpeta en cPanel

1. Abre **File Manager** en cPanel
2. Haz clic en **"Inicio"** para ir a `/home3/clinica2/`
3. Haz clic en **"+ Folder"** (arriba)
4. Nombre: `facturas-api`
5. Haz clic en **"Create New Folder"**

### PASO 2: Subir el ZIP

1. **Entra** a la carpeta `facturas-api` que acabas de crear
2. Haz clic en **"Cargar"** (Upload) - arriba
3. Selecciona el archivo: `deploy/backend-dongee.zip`
4. Espera a que se suba (puede tardar unos minutos)

### PASO 3: Extraer el ZIP

1. En File Manager, haz **clic derecho** en `backend-dongee.zip`
2. Selecciona **"Extract"**
3. Verifica que la ruta sea: `/home3/clinica2/facturas-api/`
4. Haz clic en **"Extract Files"**
5. Espera a que termine
6. **Elimina el ZIP** (ya no lo necesitas)

### PASO 4: Verificar Archivos

Deberías ver esta estructura en `/home3/clinica2/facturas-api/`:
```
facturas-api/
├── server.js
├── package.json
├── controller/
├── middlewares/
├── routes/
├── services/
└── sql/
```

### PASO 5: Crear Carpeta de Uploads

1. Regresa a **"Inicio"** (`/home3/clinica2/`)
2. Crea otra carpeta: `facturas_uploads`
3. Haz clic derecho en `facturas_uploads` → **"Change Permissions"**
4. Marca: **755** (rwxr-xr-x)
5. Haz clic en **"Change Permissions"**

---

## ⚙️ SIGUIENTE PASO: Configurar Node.js

Ahora que los archivos están en el servidor, puedes configurar la aplicación Node.js:

1. Ve a **cPanel** → **Setup Node.js App**
2. Llena los campos:
   - **Application root:** `facturas-api`
   - **Application startup file:** `server.js`
   - **Variables de entorno:** (las 5 que te mencioné antes)

3. Haz clic en **CREATE**

---

## 📝 Variables de Entorno a Agregar

Cuando configures Node.js, agrega estas variables (haz clic en "+ ADD VARIABLE"):

1. **DATABASE_URL**
   ```
   postgresql://TU_USUARIO_BD:TU_PASSWORD_BD@localhost:5432/TU_NOMBRE_BD
   ```

2. **JWT_SECRET**
   ```
   tu_clave_secreta_muy_larga_y_segura_2024_clinica_sf
   ```

3. **PORT**
   ```
   3500
   ```

4. **NODE_ENV**
   ```
   production
   ```

5. **SOPORTES_PATH**
   ```
   /home3/clinica2/facturas_uploads
   ```

---

## ✅ Checklist

- [ ] Carpeta `facturas-api` creada
- [ ] ZIP subido a `facturas-api`
- [ ] ZIP extraído
- [ ] ZIP eliminado
- [ ] Archivos verificados (server.js, package.json, etc.)
- [ ] Carpeta `facturas_uploads` creada
- [ ] Permisos 755 en `facturas_uploads`
- [ ] Listo para configurar Node.js

---

**¿Listo para continuar?** Una vez que hayas subido y extraído los archivos, avísame para ayudarte con la configuración de Node.js.
