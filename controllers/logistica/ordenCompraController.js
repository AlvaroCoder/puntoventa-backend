const { Op } = require('sequelize');
const sequelize = require("../../config/db");
const ResponseHandler = require('../../lib/responseHanlder');
const { OrdenesCompra } = require('../../models');

exports.getOrdenCompraByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const ordenesCompra = await OrdenesCompra.findAll({
            where: { usuario_id: userId },
            order: [['createdAt', 'DESC']],
        });
        return ResponseHandler.success(res, ordenesCompra);
    } catch (error) {
        console.error('Error fetching ordenes de compra:', error);
        return ResponseHandler.error(res, 'Error fetching ordenes de compra', 500);
    }
};

exports.getOrdenCompraById = async (req, res) => {
    try {
        const { id } = req.params;
        const ordenCompra = await OrdenesCompra.findByPk(id);
        if (!ordenCompra) {
            return ResponseHandler.error(res, 'Orden de compra not found', 404);
        }
        return ResponseHandler.success(res, ordenCompra);
    } catch (error) {
        console.error('Error fetching orden de compra by ID:', error);
        return ResponseHandler.error(res, 'Error fetching orden de compra by ID', 500);
    }
}

exports.createOrdenCompra = async (req, res) => {
    try {
        const { numero, proveedor, almacen, fecha, productos, total, estado } = req.body;
        const newOrdenCompra = await OrdenesCompra.create({
            numero,
            proveedor,
            almacen,
            fecha,
            productos,
            total,
            estado,
            usuario_id: req.user.id,
        });
        return ResponseHandler.success(res, newOrdenCompra, 201);
    } catch (error) {
        console.error('Error creating orden de compra:', error);
        return ResponseHandler.error(res, 'Error creating orden de compra', 500);
    }
};

exports.updateOrdenCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero, proveedor, almacen, fecha, productos, total, estado } = req.body;
        const ordenCompra = await OrdenesCompra.findByPk(id);
        if (!ordenCompra) {
            return ResponseHandler.error(res, 'Orden de compra not found', 404);
        }
        await ordenCompra.update({
            numero,
            proveedor,
            almacen, 
            fecha,
            productos,
            total,
            estado,
        });
        return ResponseHandler.success(res, ordenCompra);
    } catch (error) {
        console.error('Error updating orden de compra:', error);
        return ResponseHandler.error(res, 'Error updating orden de compra', 500);
    }
}