# 🔐 CREDENCIALES DE ADMINISTRADOR

## 📋 Información de Login

**Usuario:** `admin@clinica.com`  
**Contraseña:** `admin123`

---

## ⚠️ PROBLEMA: Hash de Contraseña Corrupto

El script SQL original tiene un hash de contraseña incompleto. Necesitas ejecutar este SQL en tu base de datos para arreglarlo.

---

## ✅ SOLUCIÓN: Ejecutar este SQL

Abre **phpPgAdmin** en cPanel y ejecuta:

```sql
-- Actualizar contraseña del usuario admin a 'admin123'
UPDATE usuarios 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye.IU0Cumc1j4QN6Y9iScLhAyWYLbcQze'
WHERE email = 'admin@clinica.com';
```

Este hash corresponde a la contraseña: **`admin123`**

---

## 🧪 Probar Login

Después de ejecutar el SQL:

1. Ve a: `https://facturas.clinicasanfrancisco.com.co/login.html`
2. Usuario: `admin@clinica.com`
3. Contraseña: `admin123`

---

## 🔒 IMPORTANTE - Cambiar Contraseña

Una vez que entres al sistema:

1. Ve a **Usuarios**
2. Edita el usuario `admin@clinica.com`
3. Cambia la contraseña a una segura
4. Guarda los cambios

---

## 📝 Alternativa: Crear Usuario Nuevo

Si prefieres crear un usuario nuevo desde cero:

```sql
-- Eliminar usuario admin anterior (opcional)
DELETE FROM usuario_roles WHERE usuario_id IN (SELECT usuario_id FROM usuarios WHERE email = 'admin@clinica.com');
DELETE FROM usuarios WHERE email = 'admin@clinica.com';

-- Crear nuevo usuario admin
INSERT INTO usuarios (nombre, email, password_hash, tipo_documento, numero_documento, area, cargo, activo, puede_buscar_facturas) 
VALUES (
    'Administrador', 
    'admin@clinica.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.IU0Cumc1j4QN6Y9iScLhAyWYLbcQze', 
    'CC', 
    '1234567890', 
    'Sistemas', 
    'Administrador', 
    true, 
    true
);

-- Asignar rol SUPER_ADMIN
INSERT INTO usuario_roles (usuario_id, rol_id) 
SELECT u.usuario_id, r.rol_id 
FROM usuarios u, roles r 
WHERE u.email = 'admin@clinica.com' AND r.codigo = 'SUPER_ADMIN';
```

---

## ✅ Verificar

Después de ejecutar el SQL, verifica:

```sql
SELECT email, nombre, activo FROM usuarios WHERE email = 'admin@clinica.com';
```

Deberías ver el usuario admin activo.
