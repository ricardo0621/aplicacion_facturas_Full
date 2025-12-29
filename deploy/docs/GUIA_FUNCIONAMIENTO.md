# 📖 Guía de Funcionamiento - Sistema de Gestión de Facturas

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Roles y Permisos](#roles-y-permisos)
4. [Flujo de Trabajo de Facturas](#flujo-de-trabajo-de-facturas)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Casos de Uso](#casos-de-uso)
7. [Reglas de Negocio](#reglas-de-negocio)

---

## 🎯 Descripción General

El **Sistema de Gestión de Facturas** es una aplicación web diseñada para gestionar el ciclo completo de aprobación de facturas en una clínica, desde la carga inicial hasta el pago final.

### Características Principales

- ✅ **Gestión de Facturas:** Crear, aprobar, rechazar, corregir y pagar facturas
- ✅ **Workflow Flexible:** Flujo de aprobación configurable por rutas
- ✅ **Gestión de Documentos:** Subir y gestionar múltiples documentos de soporte
- ✅ **Control de Usuarios:** Gestión de usuarios con roles y permisos
- ✅ **Búsqueda Avanzada:** Filtros múltiples para encontrar facturas
- ✅ **Historial Completo:** Trazabilidad de todas las acciones
- ✅ **Estadísticas:** Dashboard con métricas en tiempo real

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Backend:**
- Node.js 20.x
- Express.js
- PostgreSQL 9.2+
- JWT para autenticación
- bcryptjs para encriptación

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Arquitectura modular (Views, Services, Components)
- SPA (Single Page Application)

**Servidor:**
- Apache/LiteSpeed con Passenger
- cPanel para gestión

### Estructura de la Base de Datos

```
usuarios
├── usuario_id (PK)
├── nombre
├── email (unique)
├── password_hash
├── tipo_documento
├── numero_documento
├── area
├── cargo
└── activo

roles
├── rol_id (PK)
├── codigo (unique)
└── nombre

usuario_roles (relación muchos a muchos)
├── usuario_id (FK)
└── rol_id (FK)

proveedores
├── proveedor_id (PK)
├── nit (unique)
├── nombre
└── activo

estados
├── estado_id (PK)
├── codigo (unique)
└── nombre

facturas
├── factura_id (PK)
├── numero_factura
├── proveedor_id (FK)
├── fecha_factura
├── monto
├── concepto
├── estado_id (FK)
├── usuario_creador_id (FK)
└── fecha_creacion

documentos_factura
├── documento_id (PK)
├── factura_id (FK)
├── tipo_documento
├── nombre_archivo
├── ruta_archivo
└── fecha_subida

historial_factura
├── historial_id (PK)
├── factura_id (FK)
├── usuario_id (FK)
├── accion
├── estado_anterior_id (FK)
├── estado_nuevo_id (FK)
├── observacion
└── fecha_accion

tipos_soporte
├── tipo_soporte_id (PK)
├── codigo (unique)
├── nombre
└── activo
```

---

## 👥 Roles y Permisos

### 1. SUPER_ADMIN (Administrador)

**Permisos:**
- ✅ Gestión completa de usuarios
- ✅ Gestión de roles y permisos
- ✅ Gestión de proveedores
- ✅ Gestión de tipos de soporte
- ✅ Ver todas las facturas
- ✅ Eliminar facturas y documentos
- ✅ Búsqueda avanzada
- ✅ Acceso a estadísticas globales

**Casos de Uso:**
- Crear/editar/desactivar usuarios
- Asignar roles a usuarios
- Configurar el sistema
- Resolver problemas técnicos

---

### 2. RUTA_1 (Cargador de Facturas)

**Permisos:**
- ✅ Crear nuevas facturas
- ✅ Subir documentos de soporte
- ✅ Ver facturas propias
- ✅ Corregir facturas devueltas (EN_GESTION)
- ✅ Eliminar/agregar documentos durante corrección

**Flujo de Trabajo:**
1. Crea una nueva factura
2. Sube documentos de soporte
3. Envía a aprobación (→ RUTA_2)
4. Si es devuelta (EN_GESTION), puede corregir y reenviar

**Restricciones:**
- ❌ No puede aprobar facturas
- ❌ Solo ve sus propias facturas
- ❌ No puede eliminar facturas aprobadas

---

### 3. RUTA_2 (Aprobador Inicial)

**Permisos:**
- ✅ Ver facturas pendientes de su aprobación
- ✅ Aprobar facturas (→ RUTA_3)
- ✅ Rechazar facturas (→ RECHAZADA)
- ✅ Devolver para corrección (→ EN_GESTION)
- ✅ Agregar observaciones

**Flujo de Trabajo:**
1. Revisa facturas en estado PENDIENTE_RUTA_2
2. Verifica documentos y datos
3. Decide:
   - **Aprobar** → Pasa a RUTA_3
   - **Rechazar** → Factura rechazada (final)
   - **Devolver** → Regresa a RUTA_1 para corrección

**Restricciones:**
- ❌ No puede editar datos de la factura
- ❌ No puede agregar/eliminar documentos
- ❌ Solo puede agregar observaciones

---

### 4. RUTA_3 (Contabilidad)

**Permisos:**
- ✅ Ver facturas aprobadas por RUTA_2
- ✅ Aprobar facturas (→ RUTA_4)
- ✅ Rechazar facturas (→ RECHAZADA)
- ✅ Devolver para corrección (→ EN_GESTION)
- ✅ **Requiere soporte de pago obligatorio**

**Flujo de Trabajo:**
1. Revisa facturas en estado PENDIENTE_RUTA_3
2. **Verifica que haya soporte de pago** (obligatorio)
3. Decide:
   - **Aprobar** → Pasa a RUTA_4
   - **Rechazar** → Factura rechazada
   - **Devolver** → Regresa a RUTA_1

**Regla Especial:**
- 🔒 **Soporte de Pago Obligatorio:** No puede aprobar sin documento de soporte de pago

---

### 5. RUTA_4 (Tesorería/Pago)

**Permisos:**
- ✅ Ver facturas aprobadas por RUTA_3
- ✅ Marcar como PAGADA
- ✅ Subir evidencia de pago
- ✅ Rechazar facturas (→ RECHAZADA)

**Flujo de Trabajo:**
1. Revisa facturas en estado PENDIENTE_RUTA_4
2. Realiza el pago
3. Sube evidencia de pago
4. Marca como PAGADA (estado final)

**Restricciones:**
- ❌ No puede devolver a rutas anteriores
- ❌ Solo puede rechazar o pagar

---

## 🔄 Flujo de Trabajo de Facturas

### Estados de Factura

```
BORRADOR → PENDIENTE_RUTA_2 → PENDIENTE_RUTA_3 → PENDIENTE_RUTA_4 → PAGADA
                ↓                    ↓                    ↓              ↓
           EN_GESTION          EN_GESTION          EN_GESTION      RECHAZADA
                ↓                    ↓                    ↓
           RECHAZADA            RECHAZADA            RECHAZADA
```

### Descripción de Estados

| Estado | Descripción | Quién puede actuar |
|--------|-------------|-------------------|
| **BORRADOR** | Factura creada pero no enviada | RUTA_1 |
| **PENDIENTE_RUTA_2** | Esperando aprobación inicial | RUTA_2 |
| **PENDIENTE_RUTA_3** | Esperando aprobación contable | RUTA_3 |
| **PENDIENTE_RUTA_4** | Esperando pago | RUTA_4 |
| **EN_GESTION** | Devuelta para corrección | RUTA_1 |
| **PAGADA** | Factura pagada (final) | - |
| **RECHAZADA** | Factura rechazada (final) | - |
| **ANULADA** | Factura anulada (final) | SUPER_ADMIN |

---

## 📦 Módulos del Sistema

### 1. Módulo de Autenticación

**Funcionalidades:**
- Login con email y contraseña
- Generación de JWT token
- Validación de sesión
- Logout

**Endpoints:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

---

### 2. Módulo de Usuarios

**Funcionalidades:**
- Crear usuarios
- Editar usuarios
- Desactivar/activar usuarios
- Asignar roles
- Gestionar permisos

**Endpoints:**
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Desactivar usuario
- `POST /api/usuarios/:id/roles` - Asignar roles

**Campos de Usuario:**
- Nombre completo
- Email (único)
- Tipo de documento (CC, CE, PA)
- Número de documento
- Área
- Cargo
- Roles asignados

---

### 3. Módulo de Facturas

**Funcionalidades:**
- Crear facturas
- Listar facturas (con filtros por rol)
- Ver detalle de factura
- Procesar factura (aprobar/rechazar/devolver)
- Corregir factura
- Ver historial de factura

**Endpoints:**
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `GET /api/facturas/:id` - Obtener factura
- `PUT /api/facturas/:id` - Actualizar factura
- `POST /api/facturas/:id/procesar` - Procesar factura
- `POST /api/facturas/:id/corregir` - Corregir factura
- `GET /api/facturas/:id/historial` - Ver historial

**Campos de Factura:**
- Número de factura
- Proveedor (NIT y nombre)
- Fecha de factura
- Monto
- Concepto
- Estado actual
- Usuario creador
- Documentos adjuntos

---

### 4. Módulo de Documentos

**Funcionalidades:**
- Subir documentos
- Listar documentos de una factura
- Eliminar documentos (con permisos)
- Descargar documentos

**Endpoints:**
- `POST /api/facturas/:id/documentos` - Subir documento
- `GET /api/facturas/:id/documentos` - Listar documentos
- `DELETE /api/documentos/:id` - Eliminar documento
- `GET /api/documentos/:id/download` - Descargar documento

**Tipos de Documentos:**
- Factura original
- Orden de compra
- Remisión
- Soporte de pago (obligatorio en RUTA_3)
- Evidencia de pago
- Otros

---

### 5. Módulo de Proveedores

**Funcionalidades:**
- Crear proveedores
- Editar proveedores
- Desactivar/activar proveedores
- Buscar proveedores

**Endpoints:**
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor
- `GET /api/proveedores/:id` - Obtener proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Desactivar proveedor

---

### 6. Módulo de Búsqueda Avanzada

**Funcionalidades:**
- Búsqueda por múltiples criterios
- Filtros combinados
- Exportación de resultados

**Filtros Disponibles:**
- Número de factura
- NIT del proveedor
- Nombre del proveedor
- Rango de fechas
- Rango de montos
- Estado
- Usuario creador
- Concepto (texto libre)

**Endpoint:**
- `POST /api/facturas/busqueda-avanzada` - Búsqueda avanzada

---

### 7. Módulo de Estadísticas

**Funcionalidades:**
- Total de facturas por estado
- Monto total por estado
- Facturas pendientes por ruta
- Estadísticas del usuario actual

**Endpoint:**
- `GET /api/facturas/estadisticas` - Obtener estadísticas

**Métricas:**
- Total de facturas
- Facturas pendientes de aprobación
- Facturas pagadas
- Facturas rechazadas
- Monto total procesado
- Monto pendiente de pago

---

## 💼 Casos de Uso

### Caso 1: Crear y Aprobar una Factura

**Actores:** RUTA_1, RUTA_2, RUTA_3, RUTA_4

**Flujo Normal:**

1. **RUTA_1** crea una nueva factura:
   - Ingresa número de factura
   - Selecciona proveedor
   - Ingresa fecha y monto
   - Escribe concepto
   - Sube documentos de soporte
   - Envía a aprobación

2. **RUTA_2** revisa la factura:
   - Ve la factura en "Pendientes"
   - Revisa datos y documentos
   - Aprueba la factura

3. **RUTA_3** (Contabilidad) revisa:
   - Ve la factura en "Pendientes"
   - Verifica que haya soporte de pago
   - Aprueba la factura

4. **RUTA_4** (Tesorería) procesa el pago:
   - Ve la factura en "Pendientes"
   - Realiza el pago
   - Sube evidencia de pago
   - Marca como PAGADA

**Resultado:** Factura completada exitosamente

---

### Caso 2: Devolver Factura para Corrección

**Actores:** RUTA_2, RUTA_1

**Flujo:**

1. **RUTA_2** revisa una factura
2. Encuentra errores (datos incorrectos, documentos faltantes)
3. Selecciona "Devolver para Corrección"
4. Agrega observación explicando el problema
5. La factura pasa a estado EN_GESTION

6. **RUTA_1** recibe la notificación
7. Ve la factura en "En Gestión"
8. Lee la observación
9. Corrige los datos
10. Agrega/elimina documentos si es necesario
11. Reenvía a aprobación

**Resultado:** Factura corregida y reenviada

---

### Caso 3: Rechazar una Factura

**Actores:** RUTA_2, RUTA_3, o RUTA_4

**Flujo:**

1. Cualquier aprobador revisa una factura
2. Determina que la factura no debe procesarse
3. Selecciona "Rechazar"
4. Agrega observación explicando el motivo
5. La factura pasa a estado RECHAZADA (final)

**Resultado:** Factura rechazada, no puede procesarse más

---

## 📜 Reglas de Negocio

### 1. Creación de Facturas

- ✅ Solo RUTA_1 puede crear facturas
- ✅ Número de factura debe ser único
- ✅ Debe tener al menos un documento adjunto
- ✅ Monto debe ser mayor a 0
- ✅ Fecha de factura no puede ser futura

### 2. Aprobación de Facturas

- ✅ Debe seguir el flujo secuencial (RUTA_2 → RUTA_3 → RUTA_4)
- ✅ No se puede saltar rutas
- ✅ Cada aprobador solo ve facturas de su ruta
- ✅ Las observaciones son obligatorias al rechazar o devolver

### 3. Soporte de Pago (RUTA_3)

- 🔒 **Obligatorio:** RUTA_3 no puede aprobar sin soporte de pago
- ✅ El soporte debe ser subido antes de aprobar
- ✅ Puede ser subido por RUTA_1 o RUTA_3

### 4. Corrección de Facturas

- ✅ Solo RUTA_1 puede corregir
- ✅ Solo facturas en estado EN_GESTION pueden corregirse
- ✅ RUTA_1 puede editar todos los campos
- ✅ RUTA_1 puede agregar/eliminar documentos

### 5. Eliminación

- 🔒 Solo SUPER_ADMIN puede eliminar facturas
- ✅ No se pueden eliminar facturas PAGADAS
- ✅ La eliminación es permanente (no soft delete)

### 6. Seguridad

- ✅ Todas las contraseñas se almacenan con hash bcrypt
- ✅ Autenticación mediante JWT
- ✅ Tokens expiran después de 24 horas
- ✅ Validación de permisos en cada endpoint

---

## 🎨 Interfaz de Usuario

### Pantallas Principales

1. **Login** (`login.html`)
   - Formulario de inicio de sesión
   - Recuperación de contraseña (futuro)

2. **Dashboard** (`index.html`)
   - Estadísticas generales
   - Facturas recientes
   - Acciones rápidas

3. **Facturas**
   - Listado de facturas
   - Filtros por estado
   - Crear nueva factura
   - Ver detalle de factura

4. **Usuarios** (Solo SUPER_ADMIN)
   - Listado de usuarios
   - Crear/editar usuarios
   - Asignar roles

5. **Proveedores**
   - Listado de proveedores
   - Crear/editar proveedores

6. **Búsqueda Avanzada**
   - Filtros múltiples
   - Resultados paginados

---

## 📊 Reportes y Auditoría

### Historial de Factura

Cada factura mantiene un registro completo de:
- Quién la creó
- Quién la aprobó/rechazó en cada ruta
- Cambios de estado
- Observaciones agregadas
- Documentos agregados/eliminados
- Fecha y hora de cada acción

### Trazabilidad

- ✅ Todas las acciones quedan registradas
- ✅ No se pueden modificar registros históricos
- ✅ Incluye información del usuario que realizó la acción
- ✅ Incluye timestamps precisos

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2024  
**Desarrollado para:** Clínica San Francisco
