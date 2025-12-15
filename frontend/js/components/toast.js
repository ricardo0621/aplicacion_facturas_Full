/**
 * Toast Notification Component
 * Display temporary notification messages
 */

let toastContainer = null;

/**
 * Initialize toast container
 */
function initToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (0 = no auto-close)
 */
export function showToast(title, message, type = 'info', duration = 5000) {
    initToastContainer();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <p class="toast-message">${message}</p>
        </div>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    // Click to dismiss
    toast.addEventListener('click', () => {
        removeToast(toast);
    });

    return toast;
}

/**
 * Remove toast
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

/**
 * Show success toast
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 */
export function showSuccess(title, message) {
    return showToast(title, message, 'success');
}

/**
 * Show error toast
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 */
export function showError(title, message) {
    return showToast(title, message, 'error');
}

/**
 * Show warning toast
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 */
export function showWarning(title, message) {
    return showToast(title, message, 'warning');
}

/**
 * Show info toast
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 */
export function showInfo(title, message) {
    return showToast(title, message, 'info');
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
