/**
 * Provider Service
 * Handles provider-related API calls
 */

import { get, post, put, del } from './api.service.js';

/**
 * Get all providers
 * @returns {Promise<Array>} List of providers
 */
export async function getProviders() {
    const response = await get('/proveedores');
    return response.proveedores || response || [];
}

/**
 * Get provider by ID
 * @param {number} id - Provider ID
 * @returns {Promise<Object>} Provider details
 */
export async function getProviderById(id) {
    const response = await get(`/proveedores/${id}`);
    return response.proveedor || response;
}

/**
 * Create new provider
 * @param {Object} data - Provider data
 * @returns {Promise<Object>} Created provider
 */
export async function createProvider(data) {
    return post('/proveedores', data);
}

/**
 * Update provider
 * @param {number} id - Provider ID
 * @param {Object} data - Provider data
 * @returns {Promise<Object>} Updated provider
 */
export async function updateProvider(id, data) {
    return put(`/proveedores/${id}`, data);
}

/**
 * Delete provider
 * @param {number} id - Provider ID
 * @returns {Promise<Object>} Response
 */
export async function deleteProvider(id) {
    return del(`/proveedores/${id}`);
}
