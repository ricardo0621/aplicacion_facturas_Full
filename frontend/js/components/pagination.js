/**
 * Pagination Component
 * Reusable pagination controls with page size selector
 */

/**
 * Create pagination controls
 * @param {Object} options - Pagination options
 * @param {number} options.currentPage - Current page number (1-indexed)
 * @param {number} options.pageSize - Items per page
 * @param {number} options.totalItems - Total number of items
 * @param {Function} options.onPageChange - Callback when page changes
 * @param {Function} options.onPageSizeChange - Callback when page size changes
 * @returns {string} HTML string for pagination controls
 */
export function createPagination({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const pageSizeOptions = [5, 10, 25, 50, 100];

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: var(--radius-md); margin-top: 1rem;">
            <!-- Page Size Selector -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="color: var(--gray-300); font-size: 0.875rem;">Mostrar:</label>
                <select id="pageSizeSelector" class="form-select" style="width: auto; padding: 0.25rem 0.5rem;">
                    ${pageSizeOptions.map(size => `
                        <option value="${size}" ${size === pageSize ? 'selected' : ''}>${size}</option>
                    `).join('')}
                </select>
                <span style="color: var(--gray-400); font-size: 0.875rem;">por página</span>
            </div>

            <!-- Page Info -->
            <div style="color: var(--gray-300); font-size: 0.875rem;">
                Mostrando <strong>${startItem}</strong>-<strong>${endItem}</strong> de <strong>${totalItems}</strong> facturas
            </div>

            <!-- Navigation Controls -->
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button 
                    id="btnFirstPage" 
                    class="btn btn-sm btn-secondary" 
                    ${currentPage === 1 ? 'disabled' : ''}
                    style="padding: 0.25rem 0.75rem;"
                >
                    « Primera
                </button>
                <button 
                    id="btnPrevPage" 
                    class="btn btn-sm btn-secondary" 
                    ${currentPage === 1 ? 'disabled' : ''}
                    style="padding: 0.25rem 0.75rem;"
                >
                    ‹ Anterior
                </button>
                <span style="color: var(--gray-300); font-size: 0.875rem; padding: 0 0.5rem;">
                    Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong>
                </span>
                <button 
                    id="btnNextPage" 
                    class="btn btn-sm btn-secondary" 
                    ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
                    style="padding: 0.25rem 0.75rem;"
                >
                    Siguiente ›
                </button>
                <button 
                    id="btnLastPage" 
                    class="btn btn-sm btn-secondary" 
                    ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
                    style="padding: 0.25rem 0.75rem;"
                >
                    Última »
                </button>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to pagination controls
 * @param {Function} onPageChange - Callback when page changes
 * @param {Function} onPageSizeChange - Callback when page size changes
 */
export function attachPaginationListeners(onPageChange, onPageSizeChange) {
    // Page size selector
    const pageSizeSelector = document.getElementById('pageSizeSelector');
    if (pageSizeSelector) {
        pageSizeSelector.addEventListener('change', (e) => {
            onPageSizeChange(parseInt(e.target.value));
        });
    }

    // Navigation buttons
    document.getElementById('btnFirstPage')?.addEventListener('click', () => onPageChange(1));
    document.getElementById('btnPrevPage')?.addEventListener('click', () => onPageChange('prev'));
    document.getElementById('btnNextPage')?.addEventListener('click', () => onPageChange('next'));
    document.getElementById('btnLastPage')?.addEventListener('click', () => onPageChange('last'));
}

/**
 * Get paginated items from array
 * @param {Array} items - Array of items to paginate
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Array} Paginated items
 */
export function getPaginatedItems(items, currentPage, pageSize) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
}
