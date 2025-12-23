# 📦 INSTRUCCIONES PARA SUBIR EL FRONTEND

## ✅ Archivo Listo: `frontend-dongee.zip`

Este archivo contiene TODO el frontend con la configuración de producción:
- ✅ `index.html`
- ✅ `login.html`
- ✅ `css/` (estilos)
- ✅ `js/` (JavaScript con API URL configurada)
- ✅ `assets/` (imágenes, logo)

**Configuración aplicada:**
- ✅ API URL: `https://facturas.clinicasanfrancisco.com.co/api`

---

## 🚀 PASOS PARA SUBIR A DONGEE

### PASO 1: Ir a la Carpeta del Dominio

1. Abre **File Manager** en cPanel
2. Navega a: `facturas.clinicasanfrancisco.com.co/`
3. Verás carpetas como `.well-known`, `cgi-bin`, etc.

### PASO 2: Subir el ZIP

1. Dentro de `facturas.clinicasanfrancisco.com.co/`
2. Haz clic en **"Cargar"** (Upload)
3. Selecciona: `deploy/frontend-dongee.zip`
4. Espera a que se suba

### PASO 3: Extraer el ZIP

1. Haz **clic derecho** en `frontend-dongee.zip`
2. Selecciona **"Extract"**
3. Verifica que la ruta sea: `/home3/clinica2/facturas.clinicasanfrancisco.com.co/`
4. Haz clic en **"Extract Files"**
5. Espera a que termine
6. **Elimina el ZIP**

### PASO 4: Verificar Archivos

Deberías ver en `facturas.clinicasanfrancisco.com.co/`:
```
facturas.clinicasanfrancisco.com.co/
├── index.html
├── login.html
├── css/
│   └── styles.css
├── js/
│   ├── config/
│   ├── services/
│   ├── views/
│   ├── components/
│   └── utils/
└── assets/
    └── logo.png
```

---

## 🧪 PROBAR LA APLICACIÓN

### 1. Abrir Login
Abre en tu navegador:
```
https://facturas.clinicasanfrancisco.com.co/login.html
```

### 2. Credenciales de Prueba
- **Usuario:** `admin@clinica.com`
- **Contraseña:** La que configuraste en el script SQL

### 3. Verificar Funcionalidades
Una vez dentro:
- ✅ Ver facturas
- ✅ Crear nueva factura
- ✅ Subir documentos
- ✅ Búsqueda avanzada
- ✅ Exportar a Excel

---

## 🔧 Solución de Problemas

### Error: "Failed to fetch" o "Network Error"
- Verifica que la aplicación Node.js esté **Running** en cPanel
- Verifica que la URL de la API sea correcta en `config.js`

### Error: "Cannot read properties of undefined"
- Limpia el caché del navegador (Ctrl + Shift + Delete)
- Recarga la página (Ctrl + F5)

### No carga el CSS
- Verifica que la carpeta `css/` se haya extraído correctamente
- Verifica permisos de archivos (644 para archivos, 755 para carpetas)

---

## ✅ Checklist Final

- [ ] ZIP subido a `facturas.clinicasanfrancisco.com.co/`
- [ ] ZIP extraído
- [ ] ZIP eliminado
- [ ] Archivos verificados (index.html, login.html, css/, js/, assets/)
- [ ] Login probado exitosamente
- [ ] Funcionalidades principales probadas

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará **100% funcional** en producción.

**URL de acceso:**
- Login: `https://facturas.clinicasanfrancisco.com.co/login.html`
- Dashboard: `https://facturas.clinicasanfrancisco.com.co/`
