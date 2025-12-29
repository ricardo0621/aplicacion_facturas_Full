# 🔧 FIX COMPLETO: Control Interno - Flujo de Aprobación

## ✅ **PROBLEMA RESUELTO**

**Fecha:** 29/12/2024  
**Estado:** ✅ Solucionado  
**Versión:** 1.0.2

---

## ⚠️ Problema Original

Cuando se seleccionaba **"Control Interno"** como aprobador al crear una factura:
- ❌ **estado_id** = 2 (RUTA_2 - En Revisión General)  
- ❌ **rol_aprobador_ruta2** = `RUTA_3_CONTROL_INTERNO`

**Esperado:**
- ✅ **estado_id** = 7 (RUTA_2_CONTROL_INTERNO)
- ✅ **rol_aprobador_ruta2** = `RUTA_2_CONTROL_INTERNO`

---

## 🔍 Causas Raíz (3 problemas encontrados)

### **1. Frontend enviaba valor incorrecto**
En `create-invoice.view.js` línea 63:
```html
<option value="RUTA_3_CONTROL_INTERNO">Control Interno</option>
```
❌ Debería ser `RUTA_2_CONTROL_INTERNO`

### **2. Backend no usaba el rol para determinar estado**
En `workflow.js`, cuando se enviaba a revisión, no usaba el `rol_aprobador_ruta2` para mapear al estado correcto.

### **3. Caché del navegador**
El navegador guardaba en caché el archivo JavaScript viejo, por lo que seguía usando `RUTA_3_CONTROL_INTERNO`.

---

## ✅ Solución Aplicada

### **1. Frontend: `create-invoice.view.js` (Línea 63)**

**Antes:**
```html
<option value="RUTA_3_CONTROL_INTERNO">Control Interno</option>
```

**Después:**
```html
<option value="RUTA_2_CONTROL_INTERNO">Control Interno</option>
```

### **2. Backend: `factura.service.js` (Línea 328)**

Pasar el `rol_aprobador_ruta2` a la función de workflow:

```javascript
const transicion = calcularTransicion(
    factura.estado_codigo,
    accion,
    estadoRetornoCorreccionCodigo,
    estadoRuta2Aprobador,
    factura.rol_aprobador_ruta2  // ← Pasar el rol
);
```

### **3. Backend: `workflow.js`**

Usar `mapearRolAEstado()` para determinar el estado correcto:

```javascript
// Para ENVIAR_REVISION (líneas 87-98)
if (rolAprobadorRuta2) {
    const estadoMapeado = mapearRolAEstado(rolAprobadorRuta2);
    if (estadoMapeado) {
        return { nuevoEstado: estadoMapeado, esRechazo: false };
    }
}

// Para CORREGIR (líneas 36-43)
if (rolAprobadorRuta2) {
    const estadoMapeado = mapearRolAEstado(rolAprobadorRuta2);
    if (estadoMapeado) {
        return { nuevoEstado: estadoMapeado, esRechazo: false };
    }
}
```

---

## 📦 Archivos Modificados (3 archivos)

| Archivo | Ubicación | Cambio |
|---------|-----------|--------|
| `create-invoice.view.js` | `frontend/js/views/` | `RUTA_3_CONTROL_INTERNO` → `RUTA_2_CONTROL_INTERNO` |
| `factura.service.js` | `Backend/services/` | Pasar `rol_aprobador_ruta2` a `calcularTransicion` |
| `workflow.js` | `Backend/utils/` | Usar `mapearRolAEstado` para estado correcto |

---

## 🚀 Archivos para Subir

### **Backend (2 archivos):**
```
deploy/archivos_corregidos/factura.service.js 
→ /home3/clinica2/facturas-api/services/factura.service.js

deploy/archivos_corregidos/workflow.js 
→ /home3/clinica2/facturas-api/utils/workflow.js
```

### **Frontend (1 archivo):**
```
deploy/archivos_corregidos/create-invoice.view.js 
→ /home3/clinica2/facturas.clinicasanfrancisco.com.co/js/views/create-invoice.view.js
```

---

## ⚠️ Importante: Limpiar Caché del Navegador

Después de subir los archivos, **SIEMPRE** limpia la caché:

**Opción 1: Hard Refresh**
- Presiona **Ctrl + Shift + R** (Windows/Linux)
- Presiona **Cmd + Shift + R** (Mac)

**Opción 2: Borrar Caché Completa**
- Presiona **Ctrl + Shift + Delete**
- Marca "Archivos e imágenes en caché"
- Haz clic en "Borrar datos"

**Opción 3: Modo Incógnito (100% Seguro)**
- Chrome: **Ctrl + Shift + N**
- Firefox: **Ctrl + Shift + P**
- Edge: **Ctrl + Shift + N**

---

## ✅ Verificación

### **En Base de Datos:**

```sql
SELECT 
    factura_id,
    numero_factura,
    rol_aprobador_ruta2,
    estado_id,
    e.codigo as estado_codigo,
    e.nombre as estado_nombre
FROM facturas f
JOIN estados e ON f.estado_id = e.estado_id
ORDER BY factura_id DESC
LIMIT 1;
```

**Resultado esperado:**
```
factura_id | numero_factura | rol_aprobador_ruta2      | estado_id | estado_codigo          | estado_nombre
-----------|----------------|--------------------------|-----------|------------------------|---------------------------
123        | FV-001         | RUTA_2_CONTROL_INTERNO   | 7         | RUTA_2_CONTROL_INTERNO | En Revisión Control Interno
```

---

## 🎯 Mapeo Correcto de Roles a Estados

| Opción en Frontend | Valor Enviado | Estado Asignado | ID Estado |
|-------------------|---------------|-----------------|-----------|
| Control Interno | `RUTA_2_CONTROL_INTERNO` | RUTA_2_CONTROL_INTERNO | 7 |
| Dirección Médica | `RUTA_2_DIRECCION_MEDICA` | RUTA_2_DIRECCION_MEDICA | 4 |
| Dirección Financiera | `RUTA_2_DIRECCION_FINANCIERA` | RUTA_2_DIRECCION_FINANCIERA | 5 |
| Dirección Administrativa | `RUTA_2_DIRECCION_ADMINISTRATIVA` | RUTA_2_DIRECCION_ADMINISTRATIVA | 6 |
| Dirección General | `RUTA_2_DIRECCION_GENERAL` | RUTA_2_DIRECCION_GENERAL | 3 |

---

## 📝 Lecciones Aprendidas

1. **Siempre limpiar caché** después de actualizar archivos JavaScript
2. **Verificar en modo incógnito** para confirmar que los cambios se aplicaron
3. **Revisar el código del frontend** cuando los valores en BD no coinciden con lo esperado
4. **Usar `mapearRolAEstado()`** para mantener consistencia entre roles y estados

---

**Desarrollado por:** Ricardo Andres Castillo Rojas  
**Email:** ricardocastillo19910621@gmail.com  
**Teléfono:** 3178870489
