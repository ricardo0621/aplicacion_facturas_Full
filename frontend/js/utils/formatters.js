/**
 * Formatting Utilities
 * Helper functions for formatting data
 */

import { CONFIG, CONSTANTS } from '../config/config.js';

/**
 * Format currency (Colombian Peso)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '$0';

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format date to Colombian format
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Include time in format
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '-';

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: CONFIG.TIMEZONE
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
    }

    return new Intl.DateTimeFormat('es-CO', options).format(dateObj);
}

/**
 * Format datetime with 12-hour format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date) {
    return formatDate(date, true);
}

/**
 * Get relative time (e.g., "hace 2 horas")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `Hace ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
    if (diffDay < 7) return `Hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;

    return formatDate(date);
}

/**
 * Get estado label
 * @param {string} estadoCodigo - Estado code
 * @returns {string} Estado label
 */
export function getEstadoLabel(estadoCodigo) {
    return CONSTANTS.ESTADO_LABELS[estadoCodigo] || estadoCodigo;
}

/**
 * Get role label
 * @param {string} rolCodigo - Role code
 * @returns {string} Role label
 */
export function getRoleLabel(rolCodigo) {
    return CONSTANTS.ROLE_LABELS[rolCodigo] || rolCodigo;
}

/**
 * Get accion label
 * @param {string} accionCodigo - Accion code
 * @returns {string} Accion label
 */
export function getAccionLabel(accionCodigo) {
    return CONSTANTS.ACCION_LABELS[accionCodigo] || accionCodigo;
}

/**
 * Get estado badge color
 * @param {string} estadoCodigo - Estado code
 * @returns {string} Badge color class
 */
export function getEstadoBadgeColor(estadoCodigo) {
    return CONSTANTS.ESTADO_COLORS[estadoCodigo] || 'gray';
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '...';
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate NIT format (Colombian)
 * @param {string} nit - NIT to validate
 * @returns {boolean} True if valid NIT format
 */
export function isValidNIT(nit) {
    // Basic validation: numbers and hyphens
    const re = /^[0-9\-]+$/;
    return re.test(nit) && nit.length >= 9;
}

/**
 * Format NIT with separators
 * @param {string} nit - NIT to format
 * @returns {string} Formatted NIT
 */
export function formatNIT(nit) {
    if (!nit) return '';
    // Remove all non-numeric characters
    const cleaned = nit.replace(/\D/g, '');
    // Add separators (example: 123456789 -> 123.456.789)
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
