/**
 * Invoice Service
 * Handles all invoice-related API calls
 */

import { get, post, put, del, upload } from './api.service.js';

/**
 * Get all invoices with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} List of invoices
 */
export async function getInvoices(filters = {}) {
    const response = await get('/facturas', filters);
    return response.facturas || response || [];
}

/**
 * Get invoice by ID
 * @param {number} id - Invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export async function getInvoiceById(id) {
    const response = await get(`/facturas/${id}`);
    return response.factura || response;
}

/**
 * Create new invoice
 * @param {FormData} formData - Invoice data with files
 * @returns {Promise<Object>} Created invoice
 */
export async function createInvoice(formData) {
    return upload('/facturas', formData);
}

/**
 * Update invoice state
 * @param {number} id - Invoice ID
 * @param {Object} data - State update data
 * @returns {Promise<Object>} Updated invoice
 */
export async function updateInvoiceState(id, data) {
    return put(`/facturas/${id}/estado`, data);
}

/**
 * Correct invoice data (RUTA_1)
 * @param {number} id - Invoice ID
 * @param {Object} data - Correction data
 * @returns {Promise<Object>} Updated invoice
 */
export async function correctInvoiceData(id, data) {
    return put(`/facturas/${id}/corregir-datos`, data);
}

/**
 * Delete invoice document
 * @param {number} facturaId - Invoice ID (not used but kept for compatibility)
 * @param {number} documentoId - Document ID
 * @returns {Promise<Object>} Response
 */
export async function deleteInvoiceDocument(facturaId, documentoId) {
    return del(`/facturas/documentos/${documentoId}`);
}

/**
 * Add invoice document
 * @param {number} id - Invoice ID
 * @param {FormData} formData - Document data
 * @returns {Promise<Object>} Response
 */
export async function addInvoiceDocument(id, formData) {
    return upload(`/facturas/${id}/documentos`, formData);
}

/**
 * Get invoice history
 * @param {number} id - Invoice ID
 * @returns {Promise<Array>} Invoice history
 */
export async function getInvoiceHistory(id) {
    return get(`/facturas/${id}/historial`);
}

/**
 * Approve invoice
 * @param {number} id - Invoice ID
 * @param {string} observacion - Optional observation
 * @returns {Promise<Object>} Response
 */
export async function approveInvoice(id, observacion = '') {
    return updateInvoiceState(id, {
        accion: 'APROBAR',
        observacion
    });
}

/**
 * Reject invoice
 * @param {number} id - Invoice ID
 * @param {string} observacion - Rejection reason
 * @returns {Promise<Object>} Response
 */
export async function rejectInvoice(id, observacion) {
    return updateInvoiceState(id, {
        accion: 'RECHAZAR',
        observacion
    });
}

/**
 * Mark invoice as paid (RUTA_4)
 * @param {number} id - Invoice ID
 * @param {string} observacion - Optional observation
 * @returns {Promise<Object>} Response
 */
export async function markAsPaid(id, observacion = '') {
    return updateInvoiceState(id, {
        accion: 'PAGAR',
        observacion
    });
}

/**
 * Annul invoice
 * @param {number} id - Invoice ID
 * @param {string} observacion - Annulment reason
 * @returns {Promise<Object>} Response
 */
export async function annulInvoice(id, observacion) {
    return updateInvoiceState(id, {
        accion: 'ANULAR',
        observacion
    });
}
