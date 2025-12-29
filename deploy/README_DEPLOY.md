# 📦 Paquete de Despliegue - Sistema de Gestión de Facturas

## 🎯 Estado del Proyecto

✅ **COMPLETAMENTE FUNCIONAL**

- ✅ Login funcionando
- ✅ Gestión de usuarios
- ✅ Creación de facturas
- ✅ Subida de documentos
- ✅ Descarga de documentos
- ✅ Flujo de aprobación
- ✅ Compatible con PostgreSQL 9.2

---

## 📂 Estructura del Paquete

```
deploy/
├── README_DEPLOY.md                    # ← Este archivo (índice principal)
├── .htaccess                           # Configuración Apache/Passenger
├── .env.example                        # Ejemplo de variables de entorno
│
├── 📁 archivos_corregidos/             # Archivos listos para subir
│   ├── db.js                           # Configuración de base de datos
│   ├── usuario.service.js              # Servicio de usuarios (PG 9.2)
│   ├── factura.service.js              # Servicio de facturas
│   ├── factura.controller.js           # Controlador de facturas
│   ├── factura.route.js                # Rutas de facturas
│   ├── server.js                       # Servidor principal
│   ├── multer.middleware.js            # Middleware de uploads
│   ├── invoice-detail.view.js          # Vista de detalle de factura
│   └── generate-password-hash.js       # Generador de hashes
│
├── 📁 sql/                             # Scripts de base de datos
│   ├── 01_schema.sql                   # Esquema completo
│   └── 02_fix_admin_password.sql       # Corrección de contraseña admin
│
└── 📁 docs/                            # Documentación
    ├── GUIA_DESPLIEGUE.md              # Guía paso a paso
    ├── GUIA_FUNCIONAMIENTO.md          # Cómo funciona el sistema
    ├── CREDENCIALES.md                 # Credenciales de acceso
    └── SOLUCION_PROBLEMAS.md           # Solución de problemas comunes
```

---

## 🚀 Guía Rápida de Despliegue

### 1. Preparar Base de Datos

```sql
-- En phpPgAdmin, ejecutar:
-- 1. sql/01_schema.sql (si es instalación nueva)
-- 2. sql/02_fix_admin_password.sql
```

### 2. Configurar Variables de Entorno

En **Setup Node.js App** → **Environment variables**:

```env
DATABASE_URL=postgresql://clinica2_facturas_user:PASSWORD@localhost:5432/clinica2_clinica_facturas
JWT_SECRET=clinica_sf_jwt_secret_2024_muy_segura_y_larga_12345
NODE_ENV=production
PORT=3500
SOPORTES_PATH=/home3/clinica2/facturas_uploads
```

### 3. Subir Archivos del Backend

Desde `archivos_corregidos/` subir a `/home3/clinica2/facturas-api/`:

- `server.js` → `server.js`
- `db.js` → `config/db.js`
- `usuario.service.js` → `services/usuario.service.js`
- `factura.service.js` → `services/factura.service.js`
- `factura.controller.js` → `controller/factura.controller.js`
- `factura.route.js` → `routes/factura.route.js`
- `multer.middleware.js` → `middlewares/multer.middleware.js`

### 4. Subir Archivos del Frontend

- `.htaccess` → `/home3/clinica2/facturas.clinicasanfrancisco.com.co/.htaccess`
- `invoice-detail.view.js` → `/home3/clinica2/facturas.clinicasanfrancisco.com.co/js/views/invoice-detail.view.js`

### 5. Crear Directorio de Uploads

```bash
mkdir -p /home3/clinica2/facturas_uploads
chmod 755 /home3/clinica2/facturas_uploads
```

### 6. Reiniciar Aplicación

- **Setup Node.js App** → **RESTART**
- Esperar 30 segundos

### 7. Probar

- **URL:** https://facturas.clinicasanfrancisco.com.co
- **Usuario:** admin@clinica.com
- **Contraseña:** admin123

---

## 📚 Documentación Completa

### Para Despliegue
- **`docs/GUIA_DESPLIEGUE.md`** - Guía detallada paso a paso

### Para Uso del Sistema
- **`docs/GUIA_FUNCIONAMIENTO.md`** - Cómo usar el sistema
- **`docs/CREDENCIALES.md`** - Usuarios y contraseñas

### Para Solución de Problemas
- **`docs/SOLUCION_PROBLEMAS.md`** - Problemas comunes y soluciones

---

## 🔧 Archivos Corregidos

Todos los archivos en `archivos_corregidos/` han sido corregidos para:

1. ✅ **Compatibilidad PostgreSQL 9.2** - Sin funciones modernas
2. ✅ **Rutas dinámicas** - Usan `process.env.SOPORTES_PATH`
3. ✅ **SSL deshabilitado** - Compatible con Dongee
4. ✅ **Passenger** - Configurado para `/api`
5. ✅ **Descargas funcionales** - Rutas `/api/soportes_facturas`

---

## ⚙️ Configuración del Servidor

### Estructura de Directorios en Servidor

```
/home3/clinica2/
├── facturas-api/                              # Backend Node.js
├── facturas_uploads/                          # Archivos subidos
└── facturas.clinicasanfrancisco.com.co/       # Frontend
    └── .htaccess                              # Configuración Apache
```

### Passenger Configuration

El `.htaccess` incluye:

```apache
PassengerAppRoot "/home3/clinica2/facturas-api"
PassengerBaseURI "/api"
PassengerNodejs "/home3/clinica2/nodevenv/facturas-api/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
```

---

## 🎯 Características del Sistema

### Roles de Usuario
- **ADMIN** - Administración completa
- **RUTA_1** - Carga de facturas
- **RUTA_2** - Validación inicial
- **RUTA_3** - Contabilidad
- **RUTA_4** - Aprobación final

### Flujo de Trabajo
1. RUTA_1 carga factura → EN_GESTION
2. RUTA_2 valida → RUTA_2
3. RUTA_3 procesa → RUTA_3
4. RUTA_4 aprueba → APROBADA

### Funcionalidades
- ✅ Gestión de usuarios y roles
- ✅ Gestión de proveedores
- ✅ Gestión de tipos de soporte
- ✅ Carga de facturas con documentos
- ✅ Flujo de aprobación multinivel
- ✅ Historial de cambios
- ✅ Búsqueda avanzada
- ✅ Descarga de documentos

---

## 🔐 Credenciales Predeterminadas

**Administrador:**
- Email: `admin@clinica.com`
- Contraseña: `admin123`

> ⚠️ **IMPORTANTE:** Cambiar la contraseña después del primer login

---

## 📞 Soporte

Para problemas o dudas, consultar:
- `docs/SOLUCION_PROBLEMAS.md` - Problemas comunes
- `docs/GUIA_FUNCIONAMIENTO.md` - Documentación del sistema

---

## 📋 Checklist de Despliegue

- [ ] Base de datos creada y configurada
- [ ] Variables de entorno configuradas
- [ ] Archivos del backend subidos (7 archivos)
- [ ] Archivos del frontend subidos (2 archivos)
- [ ] Directorio `facturas_uploads` creado
- [ ] Permisos configurados (755)
- [ ] Aplicación reiniciada
- [ ] Login probado
- [ ] Carga de factura probada
- [ ] Descarga de documento probada

---

**Versión:** 1.0 Final  
**Fecha:** 29/12/2024  
**Estado:** ✅ Producción  
**Hosting:** Dongee (cPanel + Passenger)  
**Node.js:** 20.x  
**PostgreSQL:** 9.2
