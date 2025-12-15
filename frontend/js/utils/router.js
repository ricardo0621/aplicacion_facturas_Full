/**
 * Simple SPA Router
 * Handles hash-based routing
 */

const routes = {};
let currentRoute = null;

/**
 * Register a route
 * @param {string} path - Route path (e.g., 'dashboard', 'facturas', 'factura/:id')
 * @param {Function} handler - Route handler function
 */
export function registerRoute(path, handler) {
    routes[path] = handler;
}

/**
 * Navigate to a route
 * @param {string} path - Route path
 * @param {Object} params - Route parameters
 */
export function navigateTo(path, params = {}) {
    window.location.hash = path;
}

/**
 * Get current route
 * @returns {string} Current route path
 */
export function getCurrentRoute() {
    return currentRoute;
}

/**
 * Parse route parameters
 * @param {string} pattern - Route pattern (e.g., 'factura/:id')
 * @param {string} path - Actual path (e.g., 'factura/123')
 * @returns {Object|null} Parsed parameters or null if no match
 */
function parseParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
        return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].substring(1);
            params[paramName] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
            return null;
        }
    }

    return params;
}

/**
 * Handle route change
 */
function handleRouteChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    currentRoute = hash;

    // Try exact match first
    if (routes[hash]) {
        routes[hash]({});
        return;
    }

    // Try pattern matching
    for (const pattern in routes) {
        const params = parseParams(pattern, hash);
        if (params !== null) {
            routes[pattern](params);
            return;
        }
    }

    // No match found, go to dashboard
    console.warn('Route not found:', hash);
    navigateTo('dashboard');
}

/**
 * Initialize router
 */
export function initRouter() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
}

/**
 * Update active navigation link
 * @param {string} activeView - Active view name
 */
export function updateActiveNav(activeView) {
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === activeView) {
            link.classList.add('active');
        }
    });
}
