# 🔧 SOLUCIÓN AL ERROR "Unexpected token '<'"

## ❌ Problema
El error "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" significa que cuando el frontend intenta llamar a la API, está recibiendo HTML en lugar de JSON.

## 🔍 Causa
El servidor web no está redirigiendo correctamente las peticiones `/api/*` a la aplicación Node.js que corre en el puerto 3500.

## ✅ Soluciones Posibles

### Solución 1: Verificar Configuración de Node.js App

1. Ve a **cPanel** → **Setup Node.js App**
2. Haz clic en **Edit** (lápiz) en tu aplicación
3. Busca la sección **"Passenger"** o **"Application URL"**
4. Verifica que esté configurado para servir en `/api`

### Solución 2: Subir archivo .htaccess

He creado un archivo `.htaccess` que redirige las peticiones de API correctamente.

**Pasos:**
1. Sube el archivo `deploy/.htaccess` a la carpeta `facturas.clinicasanfrancisco.com.co/`
2. Asegúrate de que el archivo se llame exactamente `.htaccess` (con el punto al inicio)

### Solución 3: Cambiar la URL de la API en el Frontend

Si las soluciones anteriores no funcionan, podemos hacer que la API esté en un subdominio separado.

**Opción A: Usar puerto directo**
Edita `frontend/js/config/config.js`:
```javascript
API_BASE_URL: 'https://facturas.clinicasanfrancisco.com.co:3500/api',
```

**Opción B: Crear subdominio para API**
1. Crea un subdominio: `api.facturas.clinicasanfrancisco.com.co`
2. Apúntalo a la aplicación Node.js
3. Edita `config.js`:
```javascript
API_BASE_URL: 'https://api.facturas.clinicasanfrancisco.com.co/api',
```

---

## 🎯 Siguiente Paso

**Por favor comparte una captura de pantalla de:**
1. La configuración completa de tu aplicación Node.js en cPanel (haz clic en Edit)
2. Específicamente la sección de "Application URL" y cualquier configuración de proxy

Con esa información podré darte la solución exacta para tu configuración.

---

## 📝 Verificación Rápida

Mientras tanto, prueba abrir directamente la API en el navegador:

```
https://facturas.clinicasanfrancisco.com.co:3500/api/
```

Si esto funciona, significa que la API está corriendo pero el proxy no está configurado.
Si no funciona, significa que hay un problema con la aplicación Node.js.
