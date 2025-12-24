# 📦 Paquete de Despliegue - Sistema de Gestión de Facturas

## 📋 Contenido de esta Carpeta

Esta carpeta contiene todos los archivos necesarios para desplegar el Sistema de Gestión de Facturas en un servidor Dongee/cPanel.

---

## 📂 Estructura de Archivos

```
deploy/
├── README.md                          # Este archivo
├── GUIA_DESPLIEGUE_COMPLETA.md       # 🚀 Guía paso a paso de despliegue
├── GUIA_FUNCIONAMIENTO.md            # 📖 Cómo funciona la aplicación
├── .htaccess                          # Configuración Apache/Passenger
├── .env.example                       # Plantilla de variables de entorno
│
├── archivos_corregidos/               # ✅ Archivos corregidos para PostgreSQL 9.2
│   ├── db.js                          # Config BD (SSL disabled)
│   ├── usuario.service.js             # Compatible PG 9.2
│   └── generate-password-hash.js      # Generador de hash de contraseñas
│
├── sql/                               # Scripts SQL
│   ├── 01_schema.sql                  # Estructura de tablas
│   └── 02_data.sql                    # Datos iniciales
│
└── [Guías adicionales]                # Documentación complementaria
```

---

## 🚀 Inicio Rápido

### 1. Lee la Guía de Despliegue

📖 **[GUIA_DESPLIEGUE_COMPLETA.md](./GUIA_DESPLIEGUE_COMPLETA.md)**

Esta guía contiene:
- Requisitos previos
- Configuración de base de datos
- Despliegue del backend
- Despliegue del frontend
- Configuración final
- Solución de problemas

### 2. Entiende Cómo Funciona la Aplicación

📚 **[GUIA_FUNCIONAMIENTO.md](./GUIA_FUNCIONAMIENTO.md)**

Esta guía explica:
- Arquitectura del sistema
- Roles y permisos
- Flujo de trabajo de facturas
- Módulos del sistema
- Casos de uso
- Reglas de negocio

---

## ✅ Archivos Corregidos (IMPORTANTE)

La carpeta **`archivos_corregidos/`** contiene versiones corregidas de archivos del backend que **DEBEN** reemplazar los originales durante el despliegue:

### 1. `db.js`
**Ubicación en servidor:** `/home3/tuusuario/facturas-api/config/db.js`

**Corrección aplicada:**
- SSL deshabilitado (`ssl: false`)
- Compatible con PostgreSQL en Dongee

**Razón:**
El servidor PostgreSQL de Dongee no soporta conexiones SSL.

---

### 2. `usuario.service.js`
**Ubicación en servidor:** `/home3/tuusuario/facturas-api/services/usuario.service.js`

**Correcciones aplicadas:**
- Reemplazado `ARRAY_AGG() FILTER (WHERE ...)` con `ARRAY_AGG()` simple
- Filtrado de valores NULL en JavaScript en lugar de SQL
- Compatible con PostgreSQL 9.2

**Razón:**
PostgreSQL 9.2 no soporta la sintaxis `FILTER` (introducida en PG 9.4) ni `array_remove()` (introducida en PG 9.3).

---

### 3. `generate-password-hash.js`
**Uso:** Script auxiliar para generar hashes de contraseñas

**Cómo usar:**
```bash
node generate-password-hash.js
```

Genera un hash bcrypt compatible para actualizar contraseñas de usuarios.

---

## 🗄️ Scripts SQL

### `sql/01_schema.sql`
Crea la estructura completa de la base de datos:
- Tablas de usuarios, roles, proveedores
- Tablas de facturas, documentos, historial
- Tablas de estados, tipos de soporte
- Relaciones y constraints

### `sql/02_data.sql`
Inserta datos iniciales:
- Roles del sistema (SUPER_ADMIN, RUTA_1, RUTA_2, RUTA_3, RUTA_4)
- Estados de facturas
- Tipos de soporte
- Usuario administrador inicial

---

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.example` y ajusta los valores:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
NODE_ENV=production
PORT=3500
SOPORTES_PATH=/ruta/a/uploads
```

### .htaccess

El archivo `.htaccess` configura:
- Passenger para ejecutar Node.js
- Rutas de la API (`/api/*`)
- Servir el frontend como SPA
- Redirecciones

**Importante:** Ajusta las rutas según tu usuario de cPanel.

---

## 🔧 Proceso de Despliegue (Resumen)

1. **Base de Datos**
   - Crear BD en cPanel
   - Ejecutar `01_schema.sql`
   - Ejecutar `02_data.sql`

2. **Backend**
   - Configurar Node.js App en cPanel
   - Subir archivos del backend
   - **Reemplazar con archivos corregidos**
   - Configurar variables de entorno
   - Instalar dependencias (`npm install`)
   - Iniciar aplicación

3. **Frontend**
   - Configurar API URL en `api.config.js`
   - Subir archivos a `public_html/`
   - Copiar `.htaccess`

4. **Verificación**
   - Probar login
   - Verificar funcionalidades
   - Revisar logs

---

## 📞 Soporte y Documentación

### Guías Incluidas

| Archivo | Descripción |
|---------|-------------|
| `GUIA_DESPLIEGUE_COMPLETA.md` | Guía paso a paso de despliegue |
| `GUIA_FUNCIONAMIENTO.md` | Cómo funciona la aplicación |
| `INSTRUCCIONES_SUBIR_BACKEND.md` | Instrucciones específicas para backend |
| `INSTRUCCIONES_SUBIR_FRONTEND.md` | Instrucciones específicas para frontend |
| `CREDENCIALES_ADMIN.md` | Credenciales iniciales del admin |

### Credenciales Iniciales

**Usuario:** `admin@clinica.com`  
**Contraseña:** `admin123`

> ⚠️ **IMPORTANTE:** Cambia esta contraseña después del primer login.

---

## 🔐 Seguridad

### Checklist Post-Despliegue

- [ ] Cambiar contraseña del administrador
- [ ] Cambiar `JWT_SECRET` a un valor único
- [ ] Verificar que HTTPS esté habilitado
- [ ] Configurar backups automáticos de BD
- [ ] No compartir credenciales de BD
- [ ] Revisar permisos de archivos y carpetas

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module '../config/db'"
**Solución:** Verifica que todos los archivos estén subidos correctamente.

### Error: "The server does not support SSL connections"
**Solución:** Reemplaza `config/db.js` con `archivos_corregidos/db.js`.

### Error: "error de sintaxis en o cerca de «(»"
**Solución:** Reemplaza `services/usuario.service.js` con `archivos_corregidos/usuario.service.js`.

### Error 401: Unauthorized
**Solución:** Genera un nuevo hash de contraseña con `generate-password-hash.js`.

**Para más detalles, consulta:** `GUIA_DESPLIEGUE_COMPLETA.md` → Sección "Solución de Problemas"

---

## 📊 Compatibilidad

- **Node.js:** 20.x
- **PostgreSQL:** 9.2+ (optimizado para 9.2)
- **Servidor:** Apache/LiteSpeed con Passenger
- **Navegadores:** Chrome, Firefox, Edge, Safari (últimas versiones)

---

## 📝 Notas Importantes

1. **PostgreSQL 9.2:** Los archivos corregidos son específicos para esta versión. Si tu servidor tiene PostgreSQL 9.4+, puedes usar los archivos originales del backend.

2. **Archivos Corregidos:** Siempre usa los archivos de `archivos_corregidos/` para garantizar compatibilidad.

3. **Backups:** Realiza backups de la base de datos antes de cualquier actualización.

4. **Logs:** Revisa los logs de Node.js y Apache regularmente para detectar problemas.

---

## 📅 Versión

**Versión del Paquete:** 1.0  
**Fecha:** Diciembre 2024  
**Compatible con:** PostgreSQL 9.2+, Node.js 20.x  
**Última actualización:** 24/12/2024

---

## 📧 Contacto

Para soporte técnico o consultas, revisa primero las guías incluidas en este paquete.

---

**¡Listo para desplegar! 🚀**

Comienza leyendo **[GUIA_DESPLIEGUE_COMPLETA.md](./GUIA_DESPLIEGUE_COMPLETA.md)**
