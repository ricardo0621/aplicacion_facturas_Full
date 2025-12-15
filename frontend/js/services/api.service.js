/**
 * API Service
 * Centralized API communication layer
 */

import { CONFIG } from '../config/config.js';
import { getToken, logout } from '../utils/auth.js';
import { showToast } from '../components/toast.js';

/**
 * Make API request
 * @param {string} endpoint - API endpoint (without /api prefix)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function fetchAPI(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge options
    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Handle unauthorized
        if (response.status === 401) {
            showToast('Sesión expirada', 'Por favor inicie sesión nuevamente', 'error');
            logout();
            throw new Error('Unauthorized');
        }

        // Parse response
        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
            const errorMessage = data.message || data.error || 'Error en la solicitud';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} Response data
 */
export async function get(endpoint, params = {}) {
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return fetchAPI(url, {
        method: 'GET'
    });
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>} Response data
 */
export async function post(endpoint, data = {}) {
    return fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>} Response data
 */
export async function put(endpoint, data = {}) {
    return fetchAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export async function del(endpoint) {
    return fetchAPI(endpoint, {
        method: 'DELETE'
    });
}

/**
 * Upload file(s)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise<any>} Response data
 */
export async function upload(endpoint, formData) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    const headers = {};

    // Add auth token if available
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        // Handle unauthorized
        if (response.status === 401) {
            showToast('Sesión expirada', 'Por favor inicie sesión nuevamente', 'error');
            logout();
            throw new Error('Unauthorized');
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.message || data.error || 'Error al subir archivo';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

/**
 * Download file
 * @param {string} endpoint - API endpoint
 * @param {string} filename - Filename for download
 */
export async function download(endpoint, filename) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    const headers = {};
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error('Error al descargar archivo');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Download Error:', error);
        showToast('Error', 'No se pudo descargar el archivo', 'error');
        throw error;
    }
}
