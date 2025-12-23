# 🔧 SOLUCIÓN RÁPIDA - Usar Puerto Directo

## ✅ Solución Aplicada

He actualizado el frontend para usar el puerto 3500 directamente:

**Nueva URL de API:**
```
https://facturas.clinicasanfrancisco.com.co:3500/api
```

## 📦 Nuevo ZIP Creado

**Archivo:** `deploy/frontend-dongee-port.zip`

## 🚀 PASOS PARA ACTUALIZAR:

### 1. Eliminar Frontend Anterior
1. Ve a **File Manager**
2. Navega a `facturas.clinicasanfrancisco.com.co/`
3. Elimina los archivos del frontend anterior (index.html, login.html, css/, js/, assets/)
4. **NO elimines** `.htaccess` ni `.well-known`

### 2. Subir Nuevo Frontend
1. Sube `frontend-dongee-port.zip`
2. Extrae el ZIP
3. Elimina el ZIP

### 3. Probar
Abre: `https://facturas.clinicasanfrancisco.com.co/login.html`

Debería funcionar ahora.

---

## ⚠️ IMPORTANTE

**Firewall:** Algunos servidores bloquean puertos personalizados. Si no funciona:

1. Contacta a soporte de Dongee
2. Pide que abran el puerto 3500
3. O usa la **Opción del Subdominio** (más profesional)

---

## 🎯 Opción Alternativa: Subdominio (Recomendado)

Si el puerto no funciona, crea un subdominio:

1. **cPanel** → **Subdomains**
2. Crea: `api.facturas.clinicasanfrancisco.com.co`
3. En **Node.js App**, cambia Application URL a: `api.facturas.clinicasanfrancisco.com.co`
4. Actualiza frontend a: `https://api.facturas.clinicasanfrancisco.com.co/api`

Esta es la solución más profesional y no requiere puertos especiales.
