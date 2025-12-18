/**
 * Document Types Service
 * Handles document type operations
 */

import { get } from './api.service.js';

/**
 * Get all document types
 * @param {boolean} activeOnly - Return only active types
 * @returns {Promise<Array>} Document types
 */
export async function getDocumentTypes(activeOnly = true) {
    const queryParam = activeOnly ? '' : '?activos=false';
    const response = await get(`/tipos-soporte${queryParam}`);
    return response.tipos || [];
}

/**
 * Get document type by ID
 * @param {number} id - Document type ID
 * @returns {Promise<Object>} Document type
 */
export async function getDocumentTypeById(id) {
    const response = await get(`/tipos-soporte/${id}`);
    return response.tipo;
}
