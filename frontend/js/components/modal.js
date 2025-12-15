/**
 * Modal Component
 * Reusable modal dialog
 */

let currentModal = null;

/**
 * Create and show modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string|HTMLElement} options.content - Modal content (HTML string or element)
 * @param {Array} options.buttons - Array of button objects {text, class, onClick}
 * @param {boolean} options.closeOnOverlay - Close modal when clicking overlay (default: true)
 * @param {Function} options.onClose - Callback when modal closes
 * @returns {HTMLElement} Modal overlay element
 */
export function showModal(options = {}) {
    const {
        title = 'Modal',
        content = '',
        buttons = [],
        closeOnOverlay = true,
        onClose = null
    } = options;

    // Close existing modal
    if (currentModal) {
        hideModal();
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Modal header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" aria-label="Cerrar">&times;</button>
    `;

    // Modal body
    const body = document.createElement('div');
    body.className = 'modal-body';

    if (typeof content === 'string') {
        body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        body.appendChild(content);
    }

    // Modal footer (if buttons provided)
    let footer = null;
    if (buttons.length > 0) {
        footer = document.createElement('div');
        footer.className = 'modal-footer';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `btn ${btn.class || 'btn-secondary'}`;
            button.textContent = btn.text || 'Button';
            button.addEventListener('click', () => {
                if (btn.onClick) {
                    btn.onClick();
                }
                if (btn.closeOnClick !== false) {
                    hideModal();
                }
            });
            footer.appendChild(button);
        });
    }

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    if (footer) {
        modal.appendChild(footer);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Show modal with animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // Close button handler
    const closeBtn = header.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        hideModal();
    });

    // Overlay click handler
    if (closeOnOverlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideModal();
            }
        });
    }

    // ESC key handler
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    };
    document.addEventListener('keydown', escHandler);

    // Store cleanup function
    overlay._cleanup = () => {
        document.removeEventListener('keydown', escHandler);
        if (onClose) {
            onClose();
        }
    };

    currentModal = overlay;

    return overlay;
}

/**
 * Hide current modal
 */
export function hideModal() {
    if (!currentModal) return;

    currentModal.classList.remove('active');

    setTimeout(() => {
        if (currentModal._cleanup) {
            currentModal._cleanup();
        }
        if (currentModal.parentElement) {
            currentModal.parentElement.removeChild(currentModal);
        }
        currentModal = null;
    }, 300);
}

/**
 * Show confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
export function showConfirm(title, message, onConfirm, onCancel = null) {
    return showModal({
        title,
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary',
                onClick: onCancel
            },
            {
                text: 'Confirmar',
                class: 'btn-primary',
                onClick: onConfirm
            }
        ]
    });
}

/**
 * Show alert modal
 * @param {string} title - Modal title
 * @param {string} message - Alert message
 * @param {Function} onClose - Callback when closed
 */
export function showAlert(title, message, onClose = null) {
    return showModal({
        title,
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: 'Aceptar',
                class: 'btn-primary',
                onClick: onClose
            }
        ]
    });
}

/**
 * Get current modal element
 * @returns {HTMLElement|null} Current modal overlay
 */
export function getCurrentModal() {
    return currentModal;
}

/**
 * Alias for hideModal for compatibility
 */
export const closeModal = hideModal;
