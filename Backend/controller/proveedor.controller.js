const pool = require('../config/db');

// Listar todos los proveedores
const listarProveedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al listar proveedores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo proveedor
const crearProveedor = async (req, res) => {
    const { nit, nombre, direccion, telefono, email, contacto } = req.body;

    if (!nit || !nombre) {
        return res.status(400).json({ error: 'NIT y Nombre son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO proveedores (nit, nombre, direccion, telefono, email, contacto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nit, nombre, direccion, telefono, email, contacto]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Ya existe un proveedor con ese NIT' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
    const { id } = req.params;
    const { nit, nombre, direccion, telefono, email, contacto } = req.body;

    try {
        const result = await pool.query(
            `UPDATE proveedores 
             SET nit = $1, nombre = $2, direccion = $3, telefono = $4, email = $5, contacto = $6 
             WHERE id = $7 RETURNING *`,
            [nit, nombre, direccion, telefono, email, contacto, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un proveedor (soft delete o físico dependiendo de reglas de negocio)
// Aquí haremos soft delete desactivándolo
const eliminarProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM proveedores WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json({ message: 'Proveedor eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    listarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};
