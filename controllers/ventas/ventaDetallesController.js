const { VentaDetalle } = require('../../models/index');
const ResponseHandler = require('../../lib/responseHanlder');

exports.getAllVentaDetalles = async (req, res) => {
    try {
        const { venta_id, producto_id } = req.query;

        if (!venta_id || !producto_id) {
            return ResponseHandler.sendValidationError(res, "Faltan parámetros obligatorios: venta_id y producto_id");
        }

        let whereClause = {}; 

        if (venta_id) {
            whereClause.venta_id = venta_id;
        };

        if (producto_id) {
            whereClause.producto_id = producto_id;
        }

        
        const ventaDetalles = await VentaDetalle.findAll({
            where : whereClause
        });

        ResponseHandler.sendSuccess(res, "Detalles de ventas obtenidos exitosamente", ventaDetalles);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.createVentaDetalle = async (req, res) => {
    try {
        const venta = await VentaDetalle.create(req.body);
        ResponseHandler.sendSuccess(res, "Detalle de venta creado exitosamente", venta);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    };
};

exports.updateVentaDetalle = async (req, res) => {
    try {
        const ventaDetalle = await VentaDetalle.findByPk(req.params.id);
        if (!ventaDetalle) {
            return ResponseHandler.sendNotFound(res, "Detalle de venta no encontrado");
        };

        await ventaDetalle.update(req.body);
        ResponseHandler.sendSuccess(res, "Detalle de venta actualizado exitosamente", ventaDetalle);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

