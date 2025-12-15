/**
 * Authentication Utilities
 * Handles token management and user session
 */

import { CONFIG } from '../config/config.js';

/**
 * Get authentication token from localStorage
 * @returns {string|null} Token or null if not found
 */
export function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token
 */
export function setToken(token) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
}

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem(CONFIG.USER_KEY);
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Set current user in localStorage
 * @param {Object} user - User object
 */
export function setCurrentUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
}

/**
 * Remove current user from localStorage
 */
export function removeCurrentUser() {
    localStorage.removeItem(CONFIG.USER_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * Logout user - clear all auth data
 */
export function logout() {
    removeToken();
    removeCurrentUser();
    window.location.href = '/login.html';
}

/**
 * Check if user has specific role
 * @param {string} role - Role code to check
 * @returns {boolean} True if user has the role
 */
export function hasRole(role) {
    const user = getCurrentUser();
    if (!user || !user.roles) return false;

    return user.roles.some(r => r.codigo === role);
}

/**
 * Check if user has any of the specified roles
 * @param {string[]} roles - Array of role codes
 * @returns {boolean} True if user has any of the roles
 */
export function hasAnyRole(roles) {
    return roles.some(role => hasRole(role));
}

/**
 * Get user's primary role (first role)
 * @returns {string|null} Role code or null
 */
export function getPrimaryRole() {
    const user = getCurrentUser();
    if (!user || !user.roles || user.roles.length === 0) return null;

    return user.roles[0].codigo;
}

/**
 * Check if token is expired (basic check)
 * @returns {boolean} True if token appears expired
 */
export function isTokenExpired() {
    const token = getToken();
    if (!token) return true;

    try {
        // Decode JWT payload (basic decode, not verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds

        return Date.now() >= exp;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth() {
    if (!isAuthenticated() || isTokenExpired()) {
        logout();
        return false;
    }
    return true;
}
