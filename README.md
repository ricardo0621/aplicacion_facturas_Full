# 📊 Sistema de Gestión de Facturas - Clínica San Francisco

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE.md)

Sistema integral de gestión y seguimiento de facturas con flujo de aprobación multinivel, diseñado específicamente para optimizar el proceso de validación y pago de facturas en entornos clínicos.

---

## 📋 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Tecnologías](#-tecnologías)
4. [Requisitos Previos](#-requisitos-previos)
5. [Instalación](#-instalación)
6. [Configuración](#-configuración)
7. [Flujo de Trabajo](#-flujo-de-trabajo)
8. [Roles y Permisos](#-roles-y-permisos)
9. [API Reference](#-api-reference)
10. [Frontend](#-frontend)
11. [Base de Datos](#-base-de-datos)
12. [Seguridad](#-seguridad)
13. [Deployment](#-deployment)
14. [Troubleshooting](#-troubleshooting)
15. [Mantenimiento](#-mantenimiento)
16. [Licencia](#-licencia)

---

## ✨ Características Principales

### Gestión de Facturas
- ✅ **Carga masiva de documentos** con soporte para múltiples tipos de archivos (PDF, imágenes)
- ✅ **Seguimiento en tiempo real** del estado de cada factura
- ✅ **Historial completo** de acciones y cambios con timestamps
- ✅ **Sistema de observaciones** por cada nivel de aprobación
- ✅ **Nomenclatura inteligente** de archivos con formato descriptivo

### Flujo de Aprobación
- ✅ **Workflow multinivel** configurable (4 rutas de aprobación)
- ✅ **Aprobación selectiva** por direcciones especializadas
- ✅ **Rechazo lineal** con retorno a ruta anterior
- ✅ **Corrección flexible** según el nivel de usuario

### Control de Acceso
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **RBAC (Role-Based Access Control)** con 10 roles predefinidos
- ✅ **Permisos granulares** por acción y estado
- ✅ **Sesiones persistentes** con renovación automática

### Interfaz de Usuario
- ✅ **Dashboard interactivo** con estadísticas en tiempo real
- ✅ **Búsqueda avanzada** con filtros múltiples
- ✅ **Diseño responsive** optimizado para móviles y tablets
- ✅ **Notificaciones toast** para feedback inmediato
- ✅ **Modales confirmación** para acciones críticas

### Reportes y Auditoría
- ✅ **Exportación a Excel** de listados de facturas
- ✅ **Historial de auditoría** completo por factura
- ✅ **Contador de pendientes** actualizado automáticamente
- ✅ **Filtros por usuario** para seguimiento personalizado

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA)                       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Login      │  │   Facturas   │                         │
│  └──────────────┘  └──────────────┘                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Usuarios    │  │ Proveedores  │  │   Búsqueda   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middlewares (Auth, CORS)                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Controllers  │→ │   Services   │→ │    Utils     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Constants & Workflow Logic              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ PostgreSQL Driver
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Usuarios   │  │   Facturas   │  │ Proveedores  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Historial   │  │  Documentos  │  │    Roles     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ File System
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE (File System)                     │
│              Documentos PDF, Excel, Imágenes                 │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
nuevo_facturas/
├── Backend/                      # Servidor Node.js
│   ├── config/                   # Configuración de base de datos
│   │   └── db.config.js
│   ├── constants/                # Constantes centralizadas
│   │   ├── index.js
│   │   ├── estados.js
│   │   ├── roles.js
│   │   └── acciones.js
│   ├── controller/               # Controladores de rutas
│   │   ├── auth.controller.js
│   │   ├── factura.controller.js
│   │   ├── usuario.controller.js
│   │   ├── proveedor.controller.js
│   │   ├── tipoSoporte.controller.js
│   │   └── busqueda.controller.js
│   ├── services/                 # Lógica de negocio
│   │   ├── factura.service.js
│   │   ├── usuario.service.js
│   │   ├── proveedor.service.js
│   │   └── tipoSoporte.service.js
│   ├── routes/                   # Definición de endpoints
│   │   ├── auth.route.js
│   │   ├── factura.route.js
│   │   ├── usuario.route.js
│   │   ├── proveedor.route.js
│   │   ├── tipoSoporte.route.js
│   │   └── busqueda.route.js
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   ├── utils/                    # Utilidades
│   │   └── workflow.js
│   ├── scripts/                  # Scripts de utilidad
│   │   ├── create-admin.js
│   │   └── test-connection.js
│   ├── sql/                      # Scripts SQL
│   │   └── database_schema.sql
│   ├── logs/                     # Logs del sistema
│   ├── server.js                 # Punto de entrada
│   ├── package.json
│   └── README.md
│
├── frontend/                     # Aplicación web (SPA)
│   ├── css/
│   │   └── styles.css            # Sistema de diseño completo
│   ├── js/
│   │   ├── config/
│   │   │   └── config.js         # Configuración global
│   │   ├── utils/
│   │   │   ├── auth.js           # Autenticación
│   │   │   ├── formatters.js     # Formateadores
│   │   │   └── router.js         # Router SPA
│   │   ├── services/
│   │   │   ├── api.service.js    # Cliente API genérico
│   │   │   └── invoice.service.js
│   │   ├── components/
│   │   │   ├── modal.js          # Componente modal
│   │   │   └── toast.js          # Notificaciones
│   │   └── views/
│   │       ├── invoices.view.js
│   │       ├── invoice-detail.view.js
│   │       └── create-invoice.view.js
│   ├── assets/
│   │   └── images/
│   ├── index.html                # Dashboard principal
│   ├── login.html                # Página de login
│   ├── app.js                    # Punto de entrada
│   └── README.md
│
├── deploy/                       # Archivos de deployment
├── .git/                         # Control de versiones
├── LICENSE.md                    # Licencia
├── COPYRIGHT_HEADER.js           # Header de copyright
└── README.md                     # Este archivo
```

---

## 🛠️ Tecnologías

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 4.21.2 | Framework web |
| **PostgreSQL** | 12+ | Base de datos relacional |
| **JWT** | 9.0.2 | Autenticación y autorización |
| **bcryptjs** | 2.4.3 | Encriptación de contraseñas |
| **Multer** | 1.4.5 | Carga de archivos |
| **ExcelJS** | 4.4.0 | Generación de reportes Excel |
| **CORS** | 2.8.5 | Control de acceso entre orígenes |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vanilla JavaScript** | ES6+ | Lógica de aplicación |
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos y animaciones |
| **ES6 Modules** | - | Modularización del código |
| **Fetch API** | - | Comunicación con backend |

### Base de Datos
- **PostgreSQL 12+** con soporte para:
  - Transacciones ACID
  - Índices optimizados
  - Foreign Keys con cascadas
  - Triggers para auditoría

---

## 📦 Requisitos Previos

### Software Requerido
- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **PostgreSQL** >= 12.0 ([Descargar](https://www.postgresql.org/download/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **Git** (opcional, para control de versiones)

### Navegadores Soportados
- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14

### Recursos del Sistema
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Disco**: Mínimo 500MB para aplicación + espacio para documentos
- **CPU**: Dual-core o superior

---

## 🚀 Instalación

### 1. Clonar el Repositorio (si aplica)
```bash
git clone <repository-url>
cd nuevo_facturas
```

### 2. Instalar Dependencias del Backend
```bash
cd Backend
npm install
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local
```bash
# Crear base de datos
createdb gestor_facturas

# Ejecutar schema
psql -U postgres -d gestor_facturas -f sql/database_schema.sql
```

#### Opción B: PostgreSQL en la Nube (Neon, AWS RDS, etc.)
```bash
# Conectar y ejecutar schema
psql "postgresql://usuario:password@host:5432/database?sslmode=require" -f sql/database_schema.sql
```

### 4. Crear Usuario Administrador
```bash
node scripts/create-admin.js
```

Esto creará:
- **Email**: `admin@clinica.com`
- **Password**: `admin123`
- **Rol**: `SUPER_ADMIN`

> ⚠️ **Importante**: Cambiar la contraseña del administrador después del primer login.

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la carpeta `Backend/`:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestor_facturas
DB_USER=postgres
DB_PASSWORD=tu_password_seguro

# Servidor
PORT=3500
NODE_ENV=development

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
JWT_EXPIRATION=24h

# Archivos
UPLOAD_PATH=D:\\FacturasClinica
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.xlsx,.xls,.jpg,.jpeg,.png

# CORS
CORS_ORIGIN=http://localhost:3500
```

### Configuración de Producción

Para entornos de producción, modificar:

```env
NODE_ENV=production
CORS_ORIGIN=https://tudominio.com
JWT_EXPIRATION=8h
```

### Crear Directorio de Uploads

```bash
# Windows
mkdir D:\FacturasClinica

# Linux/Mac
mkdir -p /var/www/facturas
```

---

## 🔄 Flujo de Trabajo

### Diagrama de Estados

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DE FACTURA                  │
└─────────────────────────────────────────────────────────────┘

    [CREACIÓN]
        ↓
    ┌─────────────┐
    │   RUTA_1    │ ← Usuario carga factura
    │  (Gestión)  │
    └─────────────┘
        ↓ Enviar a Revisión
    ┌─────────────────────────────────────────────┐
    │              RUTA_2 (Revisión)              │
    │  ┌──────────────────┐  ┌─────────────────┐ │
    │  │ Dir. Administrativa│  │ Dir. Financiera │ │
    │  └──────────────────┘  └─────────────────┘ │
    │  ┌──────────────────┐  ┌─────────────────┐ │
    │  │   Dir. Médica    │  │ Control Interno │ │
    │  └──────────────────┘  └─────────────────┘ │
    └─────────────────────────────────────────────┘
        ↓ Aprobar
    ┌─────────────┐
    │   RUTA_3    │ ← Contabilidad
    │(Contabilidad)│
    └─────────────┘
        ↓ Aprobar
    ┌─────────────┐
    │   RUTA_4    │ ← Tesorería
    │ (Tesorería) │
    └─────────────┘
        ↓ Pagar
    ┌─────────────┐
    │ FINALIZADA  │ ✓ Proceso completado
    └─────────────┘

    Rechazo (Lineal):
    RUTA_4 → RUTA_3 → RUTA_2 → RUTA_1

    Anulación:
    Cualquier estado → ANULADA (Solo SUPER_ADMIN)
```

### Estados de Factura

| Estado | Código | Descripción |
|--------|--------|-------------|
| **Gestión** | `RUTA_1` | Factura cargada o devuelta para corrección |
| **Revisión Administrativa** | `RUTA_2_DIRECCION_ADMINISTRATIVA` | En revisión por Dirección Administrativa |
| **Revisión Financiera** | `RUTA_2_DIRECCION_FINANCIERA` | En revisión por Dirección Financiera |
| **Revisión Médica** | `RUTA_2_DIRECCION_MEDICA` | En revisión por Dirección Médica |
| **Control Interno** | `RUTA_2_CONTROL_INTERNO` | En revisión por Control Interno |
| **Contabilidad** | `RUTA_3` | En revisión contable |
| **Tesorería** | `RUTA_4` | Pendiente de pago |
| **Finalizada** | `FINALIZADA` | Factura pagada |
| **Anulada** | `ANULADA` | Factura cancelada |

### Acciones Disponibles

#### Corrección de Facturas

| Ruta | Tipo de Corrección | Permisos |
|------|-------------------|----------|
| **RUTA_1** | **Avanzada** | Editar todos los datos, eliminar/agregar documentos, modificar proveedor |
| **RUTA_2** | **Solo Observación** | Agregar comentarios únicamente |
| **RUTA_3** | **Simple** | Agregar observación + documento opcional |
| **RUTA_4** | **Solo Observación** | Agregar comentarios únicamente |

---

## 👥 Roles y Permisos

### Matriz de Permisos

| Rol | Crear Factura | Aprobar | Rechazar | Corregir | Anular | Gestión Usuarios | Gestión Proveedores |
|-----|---------------|---------|----------|----------|--------|------------------|---------------------|
| **SUPER_ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RUTA_1** | ✅ | ❌ | ❌ | ✅ (Avanzada) | ❌ | ❌ | ❌ |
| **RUTA_2_DIRECCION_ADMINISTRATIVA** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **RUTA_2_DIRECCION_FINANCIERA** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **RUTA_2_DIRECCION_MEDICA** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **RUTA_2_CONTROL_INTERNO** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **RUTA_3** | ❌ | ✅ | ✅ | ✅ (Simple) | ❌ | ❌ | ❌ |
| **RUTA_4** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Descripción de Roles

#### SUPER_ADMIN
- Acceso total al sistema
- Gestión de usuarios y proveedores
- Anulación de facturas
- Acceso a todas las rutas

#### RUTA_1 - Gestor de Facturas
- Carga de facturas con documentos
- Corrección avanzada (edición completa)
- Envío a revisión
- Visualización de facturas propias

#### RUTA_2_* - Direcciones de Revisión
- Aprobación/rechazo en su área específica
- Visualización de facturas asignadas
- Agregar observaciones

#### RUTA_3 - Contabilidad
- Aprobación/rechazo contable
- Corrección simple (observación + documento)
- Validación de datos financieros

#### RUTA_4 - Tesorería
- Aprobación final de pago
- Marcar factura como pagada
- Rechazo a contabilidad

---

## 📡 API Reference

### Base URL
```
http://localhost:3500/api
```

### Autenticación

Todas las rutas (excepto login) requieren token JWT en el header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Autenticación

**POST** `/auth/login`
```json
// Request
{
  "email": "usuario@clinica.com",
  "password": "password123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "usuario_id": 1,
    "nombre": "Juan Pérez",
    "email": "usuario@clinica.com",
    "roles": ["RUTA_1"]
  }
}
```

#### Facturas

**GET** `/facturas`
```
Query Parameters:
- estado: string (opcional)
- usuario_id: number (opcional)
- proveedor_id: number (opcional)
- numero_factura: string (opcional)
- limit: number (default: 50)
- offset: number (default: 0)

Response 200: Array de facturas
```

**GET** `/facturas/:id`
```json
// Response 200
{
  "factura_id": 123,
  "numero_factura": "FAC-2025-001",
  "proveedor": {
    "proveedor_id": 5,
    "nombre": "Proveedor XYZ",
    "nit": "900123456-7"
  },
  "monto": 1500000,
  "fecha_emision": "2025-12-30",
  "estado": "RUTA_2_DIRECCION_ADMINISTRATIVA",
  "documentos": [...],
  "historial": [...]
}
```

**POST** `/facturas`
```
Content-Type: multipart/form-data

Fields:
- numero_factura: string
- proveedor_id: number
- fecha_emision: date
- monto: number
- concepto: string
- rol_aprobador_ruta2: string
- documentos: File[] (múltiples archivos)

Response 201: Factura creada
```

**PUT** `/facturas/:id/estado`
```json
// Request
{
  "accion": "APROBAR", // o "RECHAZAR"
  "observacion": "Aprobado correctamente",
  "documento": File (opcional)
}

// Response 200
{
  "message": "Estado actualizado",
  "nuevo_estado": "RUTA_3"
}
```

**PUT** `/facturas/:id/corregir-datos`
```json
// Request (RUTA_1 únicamente)
{
  "numero_factura": "FAC-2025-002",
  "proveedor_id": 6,
  "monto": 2000000,
  "concepto": "Actualizado",
  "observacion": "Corrección de datos"
}

// Response 200
{
  "message": "Factura corregida"
}
```

**DELETE** `/facturas/:facturaId/documentos/:documentoId/correccion`
```
Response 200: Documento eliminado
```

**POST** `/facturas/:id/documentos/correccion`
```
Content-Type: multipart/form-data
Field: documento (File)

Response 201: Documento agregado
```

#### Usuarios

**GET** `/usuarios`
```
Response 200: Array de usuarios
```

**POST** `/usuarios`
```json
// Request
{
  "nombre": "María López",
  "email": "maria@clinica.com",
  "password": "password123",
  "tipo_documento": "CC",
  "numero_documento": "1234567890",
  "area": "Contabilidad",
  "cargo": "Contador",
  "roles": ["RUTA_3"]
}

// Response 201: Usuario creado
```

#### Proveedores

**GET** `/proveedores`
```
Response 200: Array de proveedores
```

**POST** `/proveedores`
```json
// Request
{
  "nit": "900123456-7",
  "nombre": "Proveedor ABC",
  "direccion": "Calle 123",
  "telefono": "3001234567",
  "email": "contacto@proveedor.com"
}

// Response 201: Proveedor creado
```

#### Búsqueda Avanzada

**GET** `/busqueda/facturas`
```
Query Parameters:
- numero_factura: string
- nit_proveedor: string
- nombre_proveedor: string
- estado: string
- usuario_creacion: string

Response 200: Resultados de búsqueda
```

**GET** `/busqueda/proveedores`
```
Response 200: Lista de proveedores para dropdown
```

**GET** `/busqueda/usuarios`
```
Response 200: Lista de usuarios para dropdown
```

### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para la acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto de datos (ej: email duplicado) |
| 500 | Internal Server Error - Error del servidor |

---

## 🎨 Frontend

### Sistema de Diseño

#### Paleta de Colores

```css
/* Colores Principales */
--primary: #3b82f6;      /* Azul - Acciones principales */
--success: #22c55e;      /* Verde - Estados exitosos */
--warning: #f59e0b;      /* Naranja - Advertencias */
--danger: #ef4444;       /* Rojo - Errores y rechazos */

/* Escala de Grises */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;
```

#### Tipografía

- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Tamaños**: Sistema de escala modular

#### Componentes UI

- **Cards**: Glassmorphism con sombras suaves
- **Botones**: Gradientes y animaciones hover
- **Formularios**: Validación visual en tiempo real
- **Tablas**: Responsive con scroll horizontal
- **Badges**: Colores según estado
- **Modales**: Animaciones de entrada/salida
- **Toasts**: Notificaciones no intrusivas

### Arquitectura Frontend

El frontend utiliza **ES6 Modules** para modularización:

```javascript
// config/config.js
export const CONFIG = {
    API_BASE_URL: '/api',
    TOKEN_KEY: 'token',
    POLLING_INTERVAL: 30000
};

// utils/auth.js
export function getToken() { ... }
export function getCurrentUser() { ... }

// services/api.service.js
export async function fetchAPI(endpoint, options) { ... }

// components/modal.js
export function showModal(title, content) { ... }
```

### Navegación (SPA)

El sistema utiliza hash routing:

```
/#dashboard          → Dashboard principal
/#facturas           → Lista de facturas
/#factura/123        → Detalle de factura
/#usuarios           → Gestión de usuarios (admin)
/#proveedores        → Gestión de proveedores (admin)
/#busqueda           → Búsqueda avanzada
```

### Iniciar Frontend

```bash
# El frontend se sirve automáticamente desde el backend
cd Backend
npm start

# Abrir navegador en:
# http://localhost:3500/login.html
```

---

## 🗄️ Base de Datos

### Diagrama ER

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   USUARIOS  │───────│USUARIO_ROLES │───────│    ROLES    │
└─────────────┘       └──────────────┘       └─────────────┘
      │                                             
      │ usuario_creacion_id                         
      ↓                                             
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  FACTURAS   │───────│   FACTURA_   │       │ PROVEEDORES │
│             │       │  DOCUMENTOS  │       │             │
└─────────────┘       └──────────────┘       └─────────────┘
      │                     │                       ↑
      │                     │                       │
      │                     │ tipo_soporte_id       │ proveedor_id
      ↓                     ↓                       │
┌─────────────┐       ┌──────────────┐             │
│   FACTURA_  │       │    TIPOS_    │─────────────┘
│  HISTORIAL  │       │   SOPORTE    │
└─────────────┘       └──────────────┘
      │
      │ estado_id
      ↓
┌─────────────┐
│   ESTADOS   │
└─────────────┘
```

### Tablas Principales

#### `usuarios`
```sql
- usuario_id (PK, SERIAL)
- nombre (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- tipo_documento (VARCHAR)
- numero_documento (VARCHAR)
- area (VARCHAR)
- cargo (VARCHAR)
- activo (BOOLEAN)
- created_at (TIMESTAMP)
```

#### `facturas`
```sql
- factura_id (PK, SERIAL)
- numero_factura (VARCHAR, UNIQUE)
- proveedor_id (FK → proveedores)
- fecha_emision (DATE)
- monto (DECIMAL)
- concepto (TEXT)
- estado_id (FK → estados)
- estado_retorno_id (FK → estados)
- usuario_creacion_id (FK → usuarios)
- rol_aprobador_ruta2 (VARCHAR)
- is_anulada (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `factura_historial`
```sql
- historial_id (PK, SERIAL)
- factura_id (FK → facturas)
- usuario_id (FK → usuarios)
- accion (VARCHAR)
- estado_anterior_id (FK → estados)
- estado_nuevo_id (FK → estados)
- observacion (TEXT)
- created_at (TIMESTAMP)
```

#### `factura_documentos`
```sql
- documento_id (PK, SERIAL)
- factura_id (FK → facturas)
- tipo_soporte_id (FK → tipos_soporte)
- nombre_archivo (VARCHAR)
- ruta_archivo (VARCHAR)
- es_correccion (BOOLEAN)
- created_at (TIMESTAMP)
```

### Índices Optimizados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_facturas_estado ON facturas(estado_id);
CREATE INDEX idx_facturas_proveedor ON facturas(proveedor_id);
CREATE INDEX idx_facturas_numero ON facturas(numero_factura);
CREATE INDEX idx_historial_factura ON factura_historial(factura_id);
CREATE INDEX idx_documentos_factura ON factura_documentos(factura_id);
```

### Backup y Restauración

#### Backup Manual
```bash
# Backup completo
pg_dump -U postgres gestor_facturas > backup_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump -U postgres --data-only gestor_facturas > data_backup.sql

# Backup solo schema
pg_dump -U postgres --schema-only gestor_facturas > schema_backup.sql
```

#### Restauración
```bash
# Restaurar backup completo
psql -U postgres gestor_facturas < backup_20251230.sql

# Restaurar solo datos
psql -U postgres gestor_facturas < data_backup.sql
```

#### Backup Automatizado (Linux/Mac)
```bash
# Agregar a crontab
0 2 * * * pg_dump -U postgres gestor_facturas > /backups/facturas_$(date +\%Y\%m\%d).sql
```

---

## 🔒 Seguridad

### Autenticación y Autorización

#### JWT (JSON Web Tokens)
- Tokens firmados con algoritmo HS256
- Expiración configurable (default: 24h)
- Renovación automática en cada request
- Almacenamiento seguro en localStorage

#### Encriptación de Contraseñas
- Algoritmo: bcrypt
- Salt rounds: 10
- Validación de fortaleza en frontend

### Protección de Datos

#### SQL Injection
- Uso de **prepared statements** en todas las queries
- Validación de entrada en controllers
- Sanitización de datos en services

#### XSS (Cross-Site Scripting)
- Escapado de HTML en outputs
- Content Security Policy headers
- Validación de inputs en frontend

#### CSRF (Cross-Site Request Forgery)
- Tokens CSRF en formularios críticos
- Validación de origen en requests

### CORS (Cross-Origin Resource Sharing)

```javascript
// Backend configuración
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3500',
    credentials: true,
    optionsSuccessStatus: 200
};
```

### Manejo de Archivos

#### Validaciones
- **Tipos permitidos**: PDF, Excel (.xlsx, .xls), Imágenes (JPG, PNG)
- **Tamaño máximo**: 10MB por archivo
- **Nomenclatura**: `{numero_factura}_{tipo_soporte}_{timestamp}.ext`
- **Almacenamiento**: Fuera del webroot

#### Prevención de Path Traversal
```javascript
// Validación de nombres de archivo
const sanitizedFilename = path.basename(filename);
const safePath = path.join(UPLOAD_PATH, sanitizedFilename);
```

### Mejores Prácticas

✅ **Variables de entorno** para datos sensibles  
✅ **HTTPS** en producción  
✅ **Rate limiting** en endpoints críticos  
✅ **Logs de auditoría** para acciones importantes  
✅ **Validación de roles** en cada endpoint  
✅ **Timeout de sesión** configurable  
✅ **Sanitización** de inputs  

---

## 🚀 Deployment

### Deployment en cPanel

#### 1. Preparar Archivos
```bash
# Comprimir proyecto
zip -r proyecto.zip Backend/ frontend/

# Subir a cPanel via FTP o File Manager
```

#### 2. Configurar Node.js en cPanel
1. Ir a **Setup Node.js App**
2. Crear nueva aplicación:
   - **Node.js version**: 18.x
   - **Application mode**: Production
   - **Application root**: `/home/usuario/Backend`
   - **Application URL**: `https://tudominio.com`
   - **Application startup file**: `server.js`

#### 3. Variables de Entorno
En cPanel → Node.js App → Environment Variables:
```
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_NAME=gestor_facturas
DB_USER=usuario_db
DB_PASSWORD=password_seguro
JWT_SECRET=clave_secreta_produccion
NODE_ENV=production
PORT=3500
UPLOAD_PATH=/home/usuario/facturas_uploads
```

#### 4. Instalar Dependencias
```bash
# SSH en cPanel
cd ~/Backend
npm install --production
```

#### 5. Configurar Base de Datos
```bash
# Conectar a PostgreSQL y ejecutar schema
psql "postgresql://usuario:password@host:5432/database" -f sql/database_schema.sql

# Crear admin
node scripts/create-admin.js
```

#### 6. Iniciar Aplicación
En cPanel → Node.js App → Click en **Start App**

### Deployment en VPS (Ubuntu/Debian)

#### 1. Instalar Dependencias del Sistema
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Configurar PostgreSQL
```bash
# Crear usuario y base de datos
sudo -u postgres psql
CREATE DATABASE gestor_facturas;
CREATE USER gestor_user WITH PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE gestor_facturas TO gestor_user;
\q

# Ejecutar schema
psql -U gestor_user -d gestor_facturas -f sql/database_schema.sql
```

#### 3. Configurar Aplicación
```bash
# Clonar/copiar proyecto
cd /var/www
sudo mkdir facturas
sudo chown $USER:$USER facturas
cd facturas

# Instalar dependencias
cd Backend
npm install --production

# Configurar .env
nano .env
# (Agregar variables de producción)

# Crear admin
node scripts/create-admin.js
```

#### 4. Configurar PM2
```bash
# Iniciar aplicación
pm2 start server.js --name "gestor-facturas"

# Configurar inicio automático
pm2 startup
pm2 save

# Ver logs
pm2 logs gestor-facturas
```

#### 5. Configurar Nginx (Reverse Proxy)
```nginx
# /etc/nginx/sites-available/facturas
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/facturas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Configurar SSL (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com

# Renovación automática
sudo certbot renew --dry-run
```

### Monitoreo y Logs

#### PM2 Monitoring
```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs gestor-facturas --lines 100

# Reiniciar aplicación
pm2 restart gestor-facturas

# Ver métricas
pm2 monit
```

#### Logs de la Aplicación
```bash
# Logs del sistema (Backend/logs/)
tail -f Backend/logs/error.log
tail -f Backend/logs/access.log
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

**Síntoma**: `Error: connect ECONNREFUSED`

**Solución**:
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar credenciales en .env
cat Backend/.env | grep DB_

# Probar conexión
node Backend/scripts/test-connection.js
```

#### 2. Error 401 (Unauthorized)

**Síntoma**: Todas las peticiones devuelven 401

**Solución**:
- Verificar que el token esté en localStorage
- Verificar que JWT_SECRET sea el mismo en .env
- Limpiar localStorage y hacer login nuevamente
```javascript
localStorage.clear();
location.reload();
```

#### 3. Archivos No se Suben

**Síntoma**: Error al subir documentos

**Solución**:
```bash
# Verificar permisos del directorio
ls -la D:\FacturasClinica

# Crear directorio si no existe
mkdir -p D:\FacturasClinica

# Verificar variable UPLOAD_PATH en .env
echo $UPLOAD_PATH
```

#### 4. Frontend No Carga Estilos

**Síntoma**: Página sin estilos CSS

**Solución**:
- Verificar que `frontend/css/styles.css` exista
- Limpiar caché del navegador (Ctrl + Shift + R)
- Verificar consola del navegador para errores 404

#### 5. Error al Crear Usuario

**Síntoma**: `Error: duplicate key value violates unique constraint`

**Solución**:
- El email ya existe en la base de datos
- Usar un email diferente
- Verificar usuarios existentes:
```sql
SELECT email FROM usuarios;
```

#### 6. PM2 No Inicia la Aplicación

**Síntoma**: `Error: Cannot find module`

**Solución**:
```bash
# Reinstalar dependencias
cd Backend
rm -rf node_modules package-lock.json
npm install

# Reiniciar PM2
pm2 delete gestor-facturas
pm2 start server.js --name "gestor-facturas"
```

### Debugging

#### Habilitar Logs Detallados
```javascript
// Backend/server.js
// Agregar middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
```

#### Verificar Estado del Sistema
```bash
# Ver procesos Node.js
ps aux | grep node

# Ver puertos en uso
netstat -tulpn | grep 3500

# Ver logs del sistema
journalctl -u postgresql -n 50
```

---

## 🛠️ Mantenimiento

### Tareas Periódicas

#### Diarias
- ✅ Verificar logs de errores
- ✅ Monitorear espacio en disco
- ✅ Revisar facturas pendientes

#### Semanales
- ✅ Backup de base de datos
- ✅ Limpiar logs antiguos
- ✅ Actualizar dependencias de seguridad

#### Mensuales
- ✅ Auditoría de usuarios activos
- ✅ Revisión de permisos
- ✅ Optimización de base de datos

### Scripts de Mantenimiento

#### Limpiar Logs Antiguos
```bash
# Eliminar logs mayores a 30 días
find Backend/logs -name "*.log" -mtime +30 -delete
```

#### Optimizar Base de Datos
```sql
-- Vacuum y análisis
VACUUM ANALYZE facturas;
VACUUM ANALYZE factura_historial;
VACUUM ANALYZE factura_documentos;

-- Reindexar
REINDEX TABLE facturas;
```

#### Monitorear Tamaño de Base de Datos
```sql
-- Tamaño de base de datos
SELECT pg_size_pretty(pg_database_size('gestor_facturas'));

-- Tamaño por tabla
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Actualizaciones

#### Actualizar Dependencias
```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (con precaución)
npm install package@latest
```

#### Actualizar Node.js
```bash
# Verificar versión actual
node -v

# Actualizar con nvm (recomendado)
nvm install 18
nvm use 18
```

---

## 📞 Soporte y Contacto

### Información del Proyecto
- **Versión**: 2.0 (Modular)
- **Última Actualización**: 2025-12-30
- **Autor**: Ricardo Andres Castillo
- **Organización**: Clínica San Francisco

### Recursos Adicionales
- **Documentación Backend**: `Backend/README.md`
- **Documentación Frontend**: `frontend/README.md`
- **Setup Base de Datos**: `Backend/SETUP_DATABASE.md`
- **Protección IP**: `PROTECCION_PROPIEDAD_INTELECTUAL.md`

### Reportar Problemas
Para reportar bugs o solicitar nuevas funcionalidades, contactar al administrador del sistema.

---

## 📄 Licencia

© 2025 Clínica San Francisco. Todos los derechos reservados.

Este software es propiedad exclusiva de Clínica San Francisco y está protegido por las leyes de propiedad intelectual. El uso, copia, modificación o distribución no autorizada está estrictamente prohibido.

Ver [LICENSE.md](./LICENSE.md) para más detalles.

---

## 🎯 Roadmap

### Versión 2.1 (Q1 2026)
- [ ] Notificaciones por email
- [ ] Dashboard con gráficos estadísticos
- [ ] Exportación masiva a PDF
- [ ] Firma digital de documentos

### Versión 2.2 (Q2 2026)
- [ ] App móvil (React Native)
- [ ] Integración con sistemas contables
- [ ] OCR para extracción de datos
- [ ] Reportes personalizables

### Versión 3.0 (Q3 2026)
- [ ] Inteligencia Artificial para validación
- [ ] Workflow configurable por UI
- [ ] Multi-tenancy
- [ ] API pública con rate limiting

---

**Estado del Proyecto**: ✅ Producción | 🔄 Mantenimiento Activo

**Última Revisión**: 30 de Diciembre de 2025
