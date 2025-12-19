/**
 * Tipo Soporte Service
 * Handles support type-related API calls
 */

import { get } from './api.service.js';

/**
 * Get all support types
 * @returns {Promise<Array>} List of support types
 */
export async function getTiposSoporte() {
    const response = await get('/tipos-soporte');
    return response.tipos || response || [];
}
