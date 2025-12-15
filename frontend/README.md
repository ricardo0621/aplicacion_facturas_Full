# Frontend - Gestor de Facturas

Sistema de gestión de facturas con interfaz moderna y flujo de trabajo multinivel.

## 🚀 Características

- ✅ **Autenticación JWT** con gestión de sesión
- ✅ **Dashboard interactivo** con estadísticas en tiempo real
- ✅ **Gestión de facturas** con filtros y búsqueda
- ✅ **Flujo de aprobación** multinivel (RUTA_1 → RUTA_2 → RUTA_3 → RUTA_4)
- ✅ **Control de acceso** basado en roles
- ✅ **Diseño responsive** y moderno
- ✅ **Notificaciones** toast en tiempo real
- ✅ **Modales** para confirmaciones y acciones

## 📁 Estructura del Proyecto

```
frontend/
├── css/
│   └── styles.css              # Sistema de diseño completo
├── js/
│   ├── config/
│   │   └── config.js           # Configuración y constantes
│   ├── utils/
│   │   ├── auth.js             # Utilidades de autenticación
│   │   ├── formatters.js       # Formateadores de datos
│   │   └── router.js           # Router SPA
│   ├── services/
│   │   ├── api.service.js      # Servicio API genérico
│   │   └── invoice.service.js  # Servicio de facturas
│   ├── components/
│   │   ├── modal.js            # Componente modal
│   │   └── toast.js            # Componente toast
│   └── views/
│       ├── invoices.view.js    # Vista lista de facturas
│       └── invoice-detail.view.js  # Vista detalle de factura
├── assets/
│   └── images/                 # Imágenes
├── app.js                      # Punto de entrada principal
├── index.html                  # Dashboard principal
├── login.html                  # Página de login
└── README.md                   # Este archivo
```

## 🎨 Sistema de Diseño

### Colores

- **Primary**: Azul (#3b82f6) - Acciones principales
- **Success**: Verde (#22c55e) - Estados exitosos  
- **Warning**: Naranja (#f59e0b) - Advertencias
- **Danger**: Rojo (#ef4444) - Errores y rechazos
- **Gray**: Escala de grises para texto y fondos

### Tipografía

- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

### Componentes

- Cards con glassmorphism
- Botones con gradientes y animaciones
- Formularios con validación visual
- Tablas responsive
- Badges de estado
- Modales animados
- Toasts de notificación

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

1. Login en `/login.html`
2. Token almacenado en `localStorage`
3. Token enviado en header `Authorization: Bearer <token>`
4. Logout automático si el token expira

## 📱 Vistas Implementadas

### 1. Login (`login.html`)
- Formulario de autenticación
- Validación de credenciales
- Redirección al dashboard

### 2. Dashboard (`index.html`)
- Estadísticas en tiempo real
- Facturas recientes
- Acciones rápidas
- Navegación principal

### 3. Lista de Facturas (`#facturas`)
- Tabla con todas las facturas
- Filtros por estado, número, proveedor
- Paginación
- Navegación a detalle

### 4. Detalle de Factura (`#factura/:id`)
- Información completa
- Documentos adjuntos
- Historial de acciones
- Botones de acción según rol:
  - **RUTA_1**: Enviar a revisión, Corregir
  - **RUTA_2**: Aprobar, Rechazar
  - **RUTA_3**: Aprobar, Rechazar, Agregar observación
  - **RUTA_4**: Marcar como pagada, Rechazar
  - **SUPER_ADMIN**: Anular factura

## 🛠️ Configuración del Backend

Para servir el frontend, agregar al `server.js` del backend:

```javascript
const path = require('path');
const express = require('express');

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta catch-all para SPA (debe ir al final, después de las rutas API)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
});
```

## 🚀 Uso

### Desarrollo

1. Iniciar el backend:
   ```bash
   cd Backend
   npm start
   ```

2. Abrir navegador:
   ```
   http://localhost:3500/login.html
   ```

3. Credenciales de prueba:
   - Email: `admin@clinica.com`
   - Password: `admin123`

### Navegación

- **Dashboard**: `http://localhost:3500/` o `#dashboard`
- **Facturas**: `#facturas`
- **Detalle**: `#factura/123`
- **Usuarios**: `#usuarios` (solo admin)
- **Proveedores**: `#proveedores` (solo admin)
- **Búsqueda**: `#busqueda`

## 📋 Roles y Permisos

### RUTA_1 - Gestor de Facturas
- Crear facturas
- Enviar a revisión
- Corregir datos (edición completa)

### RUTA_2 - Direcciones
- Aprobar facturas
- Rechazar facturas
- Ver historial

### RUTA_3 - Contabilidad
- Aprobar facturas
- Rechazar facturas
- Agregar observaciones

### RUTA_4 - Tesorería
- Marcar como pagada
- Rechazar facturas
- Aprobar pago final

### SUPER_ADMIN
- Acceso total
- Gestión de usuarios
- Gestión de proveedores
- Anular facturas

## 🔄 Flujo de Trabajo

```
RUTA_1 (Carga) 
    ↓ Enviar a Revisión
RUTA_2 (Revisión)
    ↓ Aprobar
RUTA_3 (Contabilidad)
    ↓ Aprobar
RUTA_4 (Tesorería)
    ↓ Pagar
FINALIZADA

Rechazar: RUTA_4 → RUTA_3 → RUTA_2 → RUTA_1
```

## 🎯 Próximas Funcionalidades

- [ ] Formulario de creación de facturas
- [ ] Gestión de usuarios (CRUD)
- [ ] Gestión de proveedores (CRUD)
- [ ] Búsqueda avanzada
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones en tiempo real
- [ ] Upload de documentos con drag & drop
- [ ] Historial detallado con timeline
- [ ] Filtros avanzados
- [ ] Reportes y estadísticas

## 🐛 Debugging

### Problemas Comunes

1. **Error 401 (Unauthorized)**
   - Verificar que el token esté en localStorage
   - Verificar que el backend esté corriendo
   - Revisar que las credenciales sean correctas

2. **No carga las facturas**
   - Abrir DevTools → Console
   - Verificar errores de red
   - Verificar que el endpoint `/api/facturas` funcione

3. **Estilos no se cargan**
   - Verificar que `styles.css` exista
   - Verificar la ruta en el HTML
   - Limpiar caché del navegador

## 📝 Notas de Desarrollo

- El frontend es una SPA (Single Page Application) con router basado en hash
- Todos los módulos usan ES6 modules (`import`/`export`)
- Los estilos usan variables CSS para fácil personalización
- Las vistas se cargan dinámicamente según la ruta
- El estado se gestiona localmente en cada vista

## 📄 Licencia

© 2025 Clínica San Francisco. Todos los derechos reservados.
