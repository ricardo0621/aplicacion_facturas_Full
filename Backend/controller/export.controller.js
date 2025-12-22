const ExcelJS = require('exceljs');
const facturaService = require('../services/factura.service');

/**
 * Export invoices to Excel
 */
exports.exportInvoicesToExcel = async (req, res) => {
    try {
        const userId = req.user.usuario_id;
        const filters = req.body;

        // Get invoices using busquedaAvanzada (respects only search filters, not user filter)
        const facturas = await facturaService.busquedaAvanzada(filters, userId);

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Facturas');

        // Define columns
        worksheet.columns = [
            { header: 'Número de Factura', key: 'numero_factura', width: 20 },
            { header: 'Proveedor', key: 'proveedor_nombre', width: 30 },
            { header: 'NIT', key: 'nit_proveedor', width: 15 },
            { header: 'Monto', key: 'monto', width: 15 },
            { header: 'Estado', key: 'estado_nombre', width: 25 },
            { header: 'Fecha Emisión', key: 'fecha_emision', width: 15 },
            { header: 'Fecha Creación', key: 'fecha_creacion', width: 20 },
            { header: 'Concepto', key: 'concepto', width: 40 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2563EB' } // Primary blue color
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 25;

        // Add data rows
        facturas.forEach(factura => {
            const row = worksheet.addRow({
                numero_factura: factura.numero_factura,
                proveedor_nombre: factura.proveedor_nombre || '-',
                nit_proveedor: factura.nit_proveedor || '-',
                monto: factura.monto,
                estado_nombre: factura.estado_nombre || '-',
                fecha_emision: factura.fecha_emision ? new Date(factura.fecha_emision) : '-',
                fecha_creacion: factura.fecha_creacion ? new Date(factura.fecha_creacion) : '-',
                concepto: factura.concepto || '-'
            });

            // Format currency column
            if (typeof factura.monto === 'number') {
                row.getCell('monto').numFmt = '$#,##0.00';
            }

            // Format date columns
            if (factura.fecha_emision) {
                row.getCell('fecha_emision').numFmt = 'dd/mm/yyyy';
            }
            if (factura.fecha_creacion) {
                row.getCell('fecha_creacion').numFmt = 'dd/mm/yyyy hh:mm AM/PM';
            }
        });

        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `Facturas_${timestamp}.xlsx`;

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).json({
            error: 'Error al exportar a Excel',
            message: error.message
        });
    }
};
