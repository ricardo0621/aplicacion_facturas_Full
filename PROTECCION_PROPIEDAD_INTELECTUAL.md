# 🔒 GUÍA DE PROTECCIÓN DE PROPIEDAD INTELECTUAL

## 📋 Recomendaciones para Proteger tu Desarrollo

### 1. **Licencia de Software** ✅

He creado `LICENSE.md` con una licencia personalizada que:
- Establece tu autoría
- Restringe el uso comercial
- Prohíbe la redistribución sin autorización
- Requiere tu autorización para modificaciones comerciales

**Acción:** Edita `LICENSE.md` y completa:
- `[TU NOMBRE COMPLETO]`
- `[TU EMAIL]`
- `[TU TELÉFONO]`

---

### 2. **Headers de Copyright en Código**

He creado `COPYRIGHT_HEADER.js` con un header que debes agregar al inicio de cada archivo principal:

**Archivos donde agregar:**
- `Backend/server.js`
- `Backend/config/db.js`
- `Backend/services/*.js`
- `Backend/controller/*.js`
- `frontend/js/app.js`

**Ejemplo:**
```javascript
/**
 * Copyright (c) 2024 [TU NOMBRE]. Todos los derechos reservados.
 * Sistema de Gestión de Facturas - Clínica San Francisco
 * Licencia Propietaria - Ver LICENSE.md
 */
```

---

### 3. **Marca de Agua en la Interfaz**

Agrega tu crédito visible en el footer de la aplicación:

```html
<!-- En index.html y login.html -->
<footer class="app-footer">
    <p>&copy; 2024 Clínica San Francisco</p>
    <p class="developer-credit">
        Desarrollado por <strong>[TU NOMBRE]</strong> | 
        <a href="mailto:[TU EMAIL]">[TU EMAIL]</a>
    </p>
</footer>
```

**CSS:**
```css
.developer-credit {
    font-size: 0.75rem;
    color: var(--gray-400);
    margin-top: 0.5rem;
}
```

---

### 4. **Contrato de Desarrollo**

Crea un contrato formal que incluya:

#### **Elementos Clave:**

1. **Propiedad Intelectual**
   - Tú eres el autor y propietario del código
   - La clínica tiene licencia de uso, no de propiedad

2. **Alcance de la Licencia**
   - Uso exclusivo para la Clínica San Francisco
   - No transferible a terceros
   - No puede ser vendido o sublicenciado

3. **Mantenimiento y Soporte**
   - Solo tú o personas autorizadas pueden dar soporte
   - Tarifa por hora/mes para mantenimiento
   - Tarifa por nuevas funcionalidades

4. **Confidencialidad**
   - El código fuente es confidencial
   - No puede ser compartido con terceros

5. **Penalizaciones**
   - Multas por uso no autorizado
   - Derecho a desactivar el sistema si se viola el contrato

**Plantilla de Contrato:**
```
CONTRATO DE LICENCIA DE SOFTWARE

Entre:
- DESARROLLADOR: [TU NOMBRE], identificado con [CÉDULA]
- CLIENTE: Clínica San Francisco, NIT [NIT]

OBJETO: Licencia de uso del Sistema de Gestión de Facturas

CLÁUSULAS:
1. PROPIEDAD INTELECTUAL
   El código fuente es propiedad exclusiva del DESARROLLADOR.

2. LICENCIA
   Se otorga licencia de uso no exclusiva e intransferible.

3. RESTRICCIONES
   - No redistribuir el código
   - No modificar sin autorización
   - No eliminar créditos del desarrollador

4. SOPORTE
   - Soporte básico: $XXX/mes
   - Nuevas funcionalidades: $XXX/hora
   - Solo el DESARROLLADOR puede dar soporte

5. VIGENCIA
   Indefinida mientras se cumplan los términos.

Firmas:
_________________          _________________
[TU NOMBRE]                Representante Legal
Desarrollador              Clínica San Francisco
```

---

### 5. **Protección Técnica**

#### **A. Ofuscación de Código (Opcional)**

Para el frontend, puedes ofuscar el código JavaScript:

```bash
npm install -g javascript-obfuscator
javascript-obfuscator frontend/js/app.js --output frontend/js/app.min.js
```

#### **B. Variables de Entorno Críticas**

Usa variables de entorno para funcionalidades críticas:

```javascript
// En server.js
const LICENSE_KEY = process.env.LICENSE_KEY;
const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL;

// Verificación de licencia
if (!LICENSE_KEY || LICENSE_KEY !== 'TU_CLAVE_SECRETA') {
    console.error('Licencia inválida. Contactar a ' + DEVELOPER_EMAIL);
    process.exit(1);
}
```

#### **C. Marca de Agua en Logs**

```javascript
// Al inicio de server.js
console.log('='.repeat(60));
console.log('Sistema de Gestión de Facturas');
console.log('Copyright (c) 2024 [TU NOMBRE]');
console.log('Licencia Propietaria - Uso Autorizado');
console.log('='.repeat(60));
```

---

### 6. **Registro de Derechos de Autor**

En Colombia, puedes registrar tu software en:

**Dirección Nacional de Derecho de Autor (DNDA)**
- Sitio: https://www.derechodeautor.gov.co
- Costo: Aproximadamente $50.000 - $100.000 COP
- Tiempo: 1-2 meses

**Documentos necesarios:**
- Formulario de registro
- Copia del código fuente (en CD/USB)
- Documento de identidad
- Pago de derechos

---

### 7. **Cláusula de Desactivación Remota**

Implementa un "kill switch" que puedas activar si detectas uso no autorizado:

```javascript
// En server.js
const axios = require('axios');

async function verificarLicencia() {
    try {
        const response = await axios.get('https://tu-servidor.com/api/verificar-licencia', {
            params: {
                cliente: 'clinica-san-francisco',
                key: process.env.LICENSE_KEY
            }
        });
        
        if (!response.data.activa) {
            console.error('LICENCIA INACTIVA. Contactar a ricardocastillo19910621@gmail.com');
            process.exit(1);
        }
    } catch (error) {
        // Si no puede verificar, permitir uso por 7 días
        console.warn('No se pudo verificar licencia. Modo gracia activado.');
    }
}

// Verificar cada 24 horas
setInterval(verificarLicencia, 24 * 60 * 60 * 1000);
```

---

### 8. **Documentación de Autoría**

Crea un archivo `AUTORIA.md`:

```markdown
# AUTORÍA Y DESARROLLO

## Desarrollador Principal
- **Nombre:** Ricardo Andres Castillo Rojas
- **Email:** ricardocastillo19910621@gmail.com
- **Teléfono:** 3178870489

## Historial de Desarrollo
- **Inicio:** Diciembre 2025
- **Versión 1.0:** 29 de Diciembre de 202
- **Horas invertidas:** ~120 horas
- **Líneas de código:** ~15,000

## Tecnologías Utilizadas
- Backend: Node.js, Express.js
- Frontend: HTML, CSS, JavaScript
- Base de Datos: PostgreSQL 9.2
- Hosting: Dongee (cPanel + Passenger)

## Características Desarrolladas
- Sistema de autenticación
- Gestión de usuarios y roles
- Flujo de aprobación multinivel
- Gestión de documentos
- Búsqueda avanzada
- Historial de cambios

## Propiedad Intelectual
Este software es propiedad intelectual exclusiva de [TU NOMBRE].
Ver LICENSE.md para términos de uso.
```

---

### 9. **Backup del Código Fuente**

Mantén copias de seguridad:

1. **Git Privado:** GitHub/GitLab/Bitbucket (repositorio privado)
2. **Nube:** Google Drive, Dropbox, OneDrive
3. **Local:** Disco duro externo
4. **Timestamp:** Usa servicios de timestamp para probar fecha de creación

---

### 10. **Comunicación con el Cliente**

Envía un email formal a la clínica:

```
Asunto: Términos de Licencia - Sistema de Gestión de Facturas

Estimados,

Adjunto los términos de licencia del Sistema de Gestión de Facturas
desarrollado para la Clínica San Francisco.

Puntos clave:
1. El código fuente es de mi propiedad intelectual
2. Se otorga licencia de uso no exclusiva
3. El soporte debe ser contratado conmigo
4. No se permite redistribución del código

Por favor, revisar y firmar el contrato adjunto.

Saludos,
[TU NOMBRE]
[TU EMAIL]
[TU TELÉFONO]
```

---

## 📋 Checklist de Protección

- [ ] Completar LICENSE.md con tus datos
- [ ] Agregar headers de copyright a archivos principales
- [ ] Agregar crédito en el footer de la aplicación
- [ ] Crear contrato de licencia formal
- [ ] Firmar contrato con la clínica
- [ ] Registrar derechos de autor en DNDA (opcional)
- [ ] Crear AUTORIA.md con tus datos
- [ ] Hacer backup del código en 3 lugares
- [ ] Enviar email formal con términos
- [ ] Implementar verificación de licencia (opcional)

---

## ⚖️ Aspectos Legales en Colombia

### Ley 23 de 1982 (Derechos de Autor)
- El software está protegido automáticamente al crearlo
- No es obligatorio registrarlo, pero es recomendable
- Tienes derechos morales (autoría) y patrimoniales (económicos)

### Código Civil
- Puedes establecer contratos de licencia
- Las cláusulas de confidencialidad son válidas
- Puedes cobrar por mantenimiento y soporte

---

## 💡 Recomendaciones Finales

1. **Siempre usa contratos escritos**
2. **Mantén evidencia de tu autoría** (commits de git, emails, etc.)
3. **Cobra por soporte y mantenimiento**
4. **No entregues el código fuente completo** sin contrato
5. **Usa licencias restrictivas**, no open source
6. **Documenta todo** (horas, cambios, comunicaciones)
7. **Haz backups regulares**
8. **Considera registrar en DNDA** para mayor protección legal

---

**Recuerda:** Tu trabajo tiene valor. Protégelo adecuadamente.
