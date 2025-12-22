const express = require('express');
const router = express.Router();
const exportController = require('../controller/export.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @route POST /api/export/facturas
 * @desc Export invoices to Excel
 * @access Private
 */
router.post('/facturas', verifyToken, exportController.exportInvoicesToExcel);

module.exports = router;
