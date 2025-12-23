# Configuración para Frontend - Producción

## Archivo a Modificar

`frontend/js/config/config.js`

## Cambio Necesario

### ANTES (Desarrollo):
```javascript
export const CONFIG = {
    API_BASE_URL: 'http://localhost:3200/api',
    // ...
};
```

### DESPUÉS (Producción):
```javascript
export const CONFIG = {
    API_BASE_URL: 'https://tudominio.com/api',  // ← CAMBIA ESTO
    // ...
};
```

## Instrucciones

1. **Antes de subir el frontend**, edita el archivo `frontend/js/config/config.js`
2. Cambia `http://localhost:3200/api` por la URL de tu API en producción
3. Guarda el archivo
4. Sube todos los archivos del frontend a `public_html/`

## Ejemplos de URLs

- Si tu dominio es `facturas.clinica.com`:
  ```javascript
  API_BASE_URL: 'https://facturas.clinica.com/api',
  ```

- Si usas un subdirectorio `tudominio.com/facturas`:
  ```javascript
  API_BASE_URL: 'https://tudominio.com/facturas/api',
  ```

- Si la API está en un subdominio diferente `api.tudominio.com`:
  ```javascript
  API_BASE_URL: 'https://api.tudominio.com/api',
  ```

## IMPORTANTE

⚠️ **HTTPS:** Asegúrate de usar `https://` en producción, no `http://`
⚠️ **Sin barra final:** No pongas `/` al final de la URL
⚠️ **Incluye /api:** La URL debe terminar en `/api`
