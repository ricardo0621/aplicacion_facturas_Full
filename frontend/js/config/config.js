/**
 * Frontend Configuration
 * Centralized configuration for the application
 */

export const CONFIG = {
    // API Configuration - Using direct port since app is on root domain
    API_BASE_URL: 'https://facturas.clinicasanfrancisco.com.co:3500/api',

    // Storage Keys
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'current_user',

    // Polling & Updates
    POLLING_INTERVAL: 30000, // 30 seconds

    // File Upload
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],

    // Pagination
    DEFAULT_PAGE_SIZE: 20,

    // Date Format
    DATE_FORMAT: 'DD/MM/YYYY',
    DATETIME_FORMAT: 'DD/MM/YYYY hh:mm A',

    // Timezone
    TIMEZONE: 'America/Bogota'
};

// Export API_BASE_URL separately for convenience
export const API_BASE_URL = CONFIG.API_BASE_URL;

/**
 * Application Constants
 */
export const CONSTANTS = {
    // Roles
    ROLES: {
        SUPER_ADMIN: 'SUPER_ADMIN',
        RUTA_1: 'RUTA_1',
        RUTA_2: 'RUTA_2',
        RUTA_2_CONTROL_INTERNO: 'RUTA_2_CONTROL_INTERNO',
        RUTA_2_DIRECCION_MEDICA: 'RUTA_2_DIRECCION_MEDICA',
        RUTA_2_DIRECCION_FINANCIERA: 'RUTA_2_DIRECCION_FINANCIERA',
        RUTA_2_DIRECCION_ADMINISTRATIVA: 'RUTA_2_DIRECCION_ADMINISTRATIVA',
        RUTA_2_DIRECCION_GENERAL: 'RUTA_2_DIRECCION_GENERAL',
        RUTA_3: 'RUTA_3',
        RUTA_4: 'RUTA_4'
    },

    // Estados
    ESTADOS: {
        RUTA_1: 'RUTA_1',
        RUTA_2: 'RUTA_2',
        RUTA_2_CONTROL_INTERNO: 'RUTA_2_CONTROL_INTERNO',
        RUTA_2_DIRECCION_MEDICA: 'RUTA_2_DIRECCION_MEDICA',
        RUTA_2_DIRECCION_FINANCIERA: 'RUTA_2_DIRECCION_FINANCIERA',
        RUTA_2_DIRECCION_ADMINISTRATIVA: 'RUTA_2_DIRECCION_ADMINISTRATIVA',
        RUTA_2_DIRECCION_GENERAL: 'RUTA_2_DIRECCION_GENERAL',
        RUTA_3: 'RUTA_3',
        RUTA_4: 'RUTA_4',
        FINALIZADA: 'FINALIZADA',
        ANULADA: 'ANULADA'
    },

    // Acciones
    ACCIONES: {
        CARGAR: 'CARGAR',
        APROBAR: 'APROBAR',
        RECHAZAR: 'RECHAZAR',
        CORREGIR: 'CORREGIR',
        ANULAR: 'ANULAR',
        PAGAR: 'PAGAR'
    },

    // Estado Labels (for display)
    ESTADO_LABELS: {
        'RUTA_1': 'En Gestión',
        'RUTA_2': 'En Revisión General',
        'RUTA_2_CONTROL_INTERNO': 'En Control Interno',
        'RUTA_2_DIRECCION_MEDICA': 'En Dirección Médica',
        'RUTA_2_DIRECCION_FINANCIERA': 'En Dirección Financiera',
        'RUTA_2_DIRECCION_ADMINISTRATIVA': 'En Dirección Administrativa',
        'RUTA_2_DIRECCION_GENERAL': 'En Dirección General',
        'RUTA_3': 'En Contabilidad',
        'RUTA_4': 'En Tesorería',
        'FINALIZADA': 'Finalizada/Pagada',
        'ANULADA': 'Anulada'
    },

    // Role Labels (for display)
    ROLE_LABELS: {
        'SUPER_ADMIN': 'Super Administrador',
        'RUTA_1': 'Gestor de Facturas',
        'RUTA_2': 'Revisor General',
        'RUTA_2_CONTROL_INTERNO': 'Control Interno',
        'RUTA_2_DIRECCION_MEDICA': 'Dirección Médica',
        'RUTA_2_DIRECCION_FINANCIERA': 'Dirección Financiera',
        'RUTA_2_DIRECCION_ADMINISTRATIVA': 'Dirección Administrativa',
        'RUTA_2_DIRECCION_GENERAL': 'Dirección General',
        'RUTA_3': 'Contabilidad',
        'RUTA_4': 'Tesorería'
    },

    // Accion Labels (for display)
    ACCION_LABELS: {
        'CARGAR': 'Cargada',
        'APROBAR': 'Aprobada',
        'RECHAZAR': 'Rechazada',
        'CORREGIR': 'Corregida',
        'ANULAR': 'Anulada',
        'PAGAR': 'Pagada'
    },

    // Estado Colors (for badges)
    ESTADO_COLORS: {
        'RUTA_1': 'gray',
        'RUTA_2': 'primary',
        'RUTA_2_CONTROL_INTERNO': 'primary',
        'RUTA_2_DIRECCION_MEDICA': 'primary',
        'RUTA_2_DIRECCION_FINANCIERA': 'primary',
        'RUTA_2_DIRECCION_ADMINISTRATIVA': 'primary',
        'RUTA_2_DIRECCION_GENERAL': 'primary',
        'RUTA_3': 'warning',
        'RUTA_4': 'warning',
        'FINALIZADA': 'success',
        'ANULADA': 'danger'
    }
};
