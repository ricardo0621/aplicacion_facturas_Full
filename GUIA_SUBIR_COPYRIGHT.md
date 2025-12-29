# 📤 GUÍA: Subir Archivos de Copyright a Producción

## 🎯 Archivos a Subir

### **Archivos de Copyright (3 archivos)**

| Archivo Local | Destino en Servidor | Descripción |
|---------------|---------------------|-------------|
| `LICENSE.md` | `/home3/clinica2/facturas-api/LICENSE.md` | Licencia del software |
| `COPYRIGHT_HEADER.js` | `/home3/clinica2/facturas-api/COPYRIGHT_HEADER.js` | Header de copyright |
| `PROTECCION_PROPIEDAD_INTELECTUAL.md` | `/home3/clinica2/facturas-api/PROTECCION_PROPIEDAD_INTELECTUAL.md` | Guía de protección |

---

## 📋 PASO A PASO

### **Paso 1: Acceder a cPanel**

1. Ve a: https://cpanel.dongee.com (o tu URL de cPanel)
2. Ingresa con tus credenciales
3. Busca **"Administrador de archivos"** o **"File Manager"**
4. Haz clic para abrir

---

### **Paso 2: Navegar a la Carpeta del Backend**

1. En el File Manager, navega a:
   ```
   /home3/clinica2/facturas-api/
   ```

2. Deberías ver carpetas como:
   - `config/`
   - `controller/`
   - `middlewares/`
   - `routes/`
   - `services/`
   - `server.js`
   - `package.json`

---

### **Paso 3: Subir Archivos de Copyright**

#### **Opción A: Upload desde cPanel (Recomendado)**

1. Haz clic en el botón **"Upload"** (arriba)
2. Selecciona los 3 archivos desde tu PC:
   - `d:\nuevo_facturas\LICENSE.md`
   - `d:\nuevo_facturas\COPYRIGHT_HEADER.js`
   - `d:\nuevo_facturas\PROTECCION_PROPIEDAD_INTELECTUAL.md`
3. Espera a que se suban (100%)
4. Cierra la ventana de upload

#### **Opción B: Copiar y Pegar Contenido**

Si prefieres copiar el contenido:

1. Haz clic en **"+ File"** (crear archivo nuevo)
2. Nombre: `LICENSE.md`
3. Haz clic en **"Create New File"**
4. Haz clic derecho en el archivo → **"Edit"**
5. Copia y pega el contenido de tu `LICENSE.md` local
6. Haz clic en **"Save Changes"**
7. Repite para los otros 2 archivos

---

### **Paso 4: Agregar Header de Copyright a Archivos Principales**

Ahora necesitas agregar el header de copyright al inicio de los archivos principales:

#### **4.1. Editar server.js**

1. En File Manager, navega a: `/home3/clinica2/facturas-api/`
2. Busca el archivo `server.js`
3. Haz clic derecho → **"Edit"**
4. Al **inicio del archivo** (antes de cualquier código), pega el contenido de `COPYRIGHT_HEADER.js`
5. Haz clic en **"Save Changes"**

**Debería quedar así:**
```javascript
/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE FACTURAS - CLÍNICA SAN FRANCISCO
 * ============================================================================
 * 
 * @author      Ricardo Andres Castillo Rojas
 * @email       ricardocastillo19910621@gmail.com
 * @phone       3178870489
 * @version     1.0.0
 * @date        2024-12-29
 * @copyright   Copyright (c) 2024 Ricardo Andres Castillo Rojas. Todos los derechos reservados.
 * @license     Licencia Propietaria - Ver LICENSE.md
 * 
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
// ... resto del código
```

#### **4.2. Editar otros archivos principales (Opcional pero Recomendado)**

Repite el proceso para:
- `/home3/clinica2/facturas-api/config/db.js`
- `/home3/clinica2/facturas-api/services/factura.service.js`
- `/home3/clinica2/facturas-api/services/usuario.service.js`

---

### **Paso 5: Agregar Crédito en el Footer del Frontend**

#### **5.1. Editar index.html**

1. Navega a: `/home3/clinica2/facturas.clinicasanfrancisco.com.co/`
2. Busca `index.html`
3. Haz clic derecho → **"Edit"**
4. Busca la sección del footer (cerca del final del archivo)
5. Agrega o modifica el footer para incluir tu crédito:

```html
<footer class="app-footer" style="text-align: center; padding: 1rem; margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
    <p style="margin: 0.5rem 0;">&copy; 2024 Clínica San Francisco. Todos los derechos reservados.</p>
    <p class="developer-credit" style="font-size: 0.75rem; color: #9ca3af; margin: 0.5rem 0;">
        Desarrollado por <strong>Ricardo Andres Castillo Rojas</strong> | 
        <a href="mailto:ricardocastillo19910621@gmail.com" style="color: #60a5fa; text-decoration: none;">ricardocastillo19910621@gmail.com</a>
    </p>
</footer>
```

6. Haz clic en **"Save Changes"**

#### **5.2. Editar login.html**

Repite el mismo proceso para `login.html`

---

### **Paso 6: Verificar Permisos de Archivos**

1. Selecciona los 3 archivos nuevos (LICENSE.md, COPYRIGHT_HEADER.js, PROTECCION_PROPIEDAD_INTELECTUAL.md)
2. Haz clic derecho → **"Change Permissions"** o **"Permissions"**
3. Configura permisos: **644** (lectura para todos, escritura solo para ti)
   - Owner: Read + Write
   - Group: Read
   - Public: Read

---

### **Paso 7: Reiniciar Aplicación Node.js**

1. En cPanel, busca **"Setup Node.js App"**
2. Encuentra tu aplicación (facturas-api)
3. Haz clic en **"RESTART"**
4. Espera 20-30 segundos

---

### **Paso 8: Verificar en el Navegador**

1. Abre: https://facturas.clinicasanfrancisco.com.co
2. Baja hasta el footer
3. Deberías ver tu crédito:
   ```
   © 2024 Clínica San Francisco. Todos los derechos reservados.
   Desarrollado por Ricardo Andres Castillo Rojas | ricardocastillo19910621@gmail.com
   ```

---

## ✅ Checklist de Verificación

- [ ] `LICENSE.md` subido a `/home3/clinica2/facturas-api/`
- [ ] `COPYRIGHT_HEADER.js` subido a `/home3/clinica2/facturas-api/`
- [ ] `PROTECCION_PROPIEDAD_INTELECTUAL.md` subido a `/home3/clinica2/facturas-api/`
- [ ] Header de copyright agregado a `server.js`
- [ ] Header de copyright agregado a archivos principales (opcional)
- [ ] Footer con crédito agregado a `index.html`
- [ ] Footer con crédito agregado a `login.html`
- [ ] Permisos configurados (644)
- [ ] Aplicación reiniciada
- [ ] Verificado en navegador

---

## 📸 Capturas de Pantalla Esperadas

### **En File Manager:**
```
facturas-api/
├── LICENSE.md                              ← NUEVO
├── COPYRIGHT_HEADER.js                     ← NUEVO
├── PROTECCION_PROPIEDAD_INTELECTUAL.md    ← NUEVO
├── server.js                               ← MODIFICADO (con header)
├── config/
├── controller/
└── ...
```

### **En el Navegador (Footer):**
```
──────────────────────────────────────────
© 2024 Clínica San Francisco. Todos los derechos reservados.
Desarrollado por Ricardo Andres Castillo Rojas | ricardocastillo19910621@gmail.com
──────────────────────────────────────────
```

---

## 🔧 Solución de Problemas

### **Problema: No puedo subir archivos**
**Solución:** Verifica que tienes permisos de escritura en la carpeta. Si no, contacta a soporte de Dongee.

### **Problema: El footer no se ve**
**Solución:** Limpia la caché del navegador (Ctrl + Shift + R) o abre en modo incógnito.

### **Problema: Error al reiniciar la aplicación**
**Solución:** Verifica que no haya errores de sintaxis en `server.js`. El header debe estar como comentario (/* */).

---

## 📞 Contacto

Si tienes problemas durante el proceso:
- **Email:** ricardocastillo19910621@gmail.com
- **Teléfono:** 3178870489

---

**¡Listo! Tu autoría estará protegida y visible en producción.** 🎉
