const { Op } = require('sequelize');
const { InventarioTienda } = require('../../models/index');
const ResponseHandler = require('../../lib/responseHanlder');
exports.getAllInventarios = async(req, res)=>{
    try {
        const { producto_id, tienda_id, stock_minimo } = req.query;

        let whereClause = {};

        if (producto_id) {
            whereClause.producto_id = producto_id;
        }

        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        }

        if (stock_minimo !== undefined) {
            whereClause.stock_disponible = { [Op.like] : InventarioTienda};
        }

        const inventarios = await InventarioTienda.findAll({
            where : whereClause,
            order: [['producto_id', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Inventarios obtenidos exitosamente", {
            data: inventarios,
            count: inventarios.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    };
};

exports.getInventarioById=async(req, res)=>{
    try {
        const inventario = await InventarioTienda.findByPk(req.params.id);

        if (!inventario) {
            return ResponseHandler.sendNotFound(res, "No se encontraron inventarios");
        }

        ResponseHandler.sendSuccess(res, "Inventario obtenido exitosamente", inventario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getInventarioByProductoTienda = async (req, res) => {
    try {
        const { producto_id, tienda_id } = req.params;
        
        const inventario = await InventarioTienda.findOne({
            where: {
                producto_id,
                tienda_id
            }
        });
        
        if (!inventario) {
            return ResponseHandler.sendNotFound(res, 'Registro de inventario no encontrado');
        }
        
        ResponseHandler.sendSuccess(res, "Inventario obtenido exitosamente", inventario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createInventario = async (req, res) => {
    try {
        const inventario = await InventarioTienda.create(req.body);
        ResponseHandler.sendCreated(res, "Registro de inventario creado exitosamente", inventario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateInventario = async (req, res) => {
    try {
        const inventario = await InventarioTienda.findByPk(req.params.id);
        
        if (!inventario) {
            return ResponseHandler.sendNotFound(res, 'Registro de inventario no encontrado');
        }
        
        await inventario.update(req.body);
        ResponseHandler.sendSuccess(res, "Inventario actualizado exitosamente", inventario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.actualizarStock = async (req, res) => {
    try {
        const { stock_disponible, stock_minimo } = req.body;
        const inventario = await InventarioTienda.findByPk(req.params.id);
        
        if (!inventario) {
            return ResponseHandler.sendNotFound(res, 'Registro de inventario no encontrado');
        }
        
        const updates = {};
        if (stock_disponible !== undefined) updates.stock_disponible = stock_disponible;
        if (stock_minimo !== undefined) updates.stock_minimo = stock_minimo;
        
        await inventario.update(updates);
        ResponseHandler.sendSuccess(res, "Stock actualizado exitosamente", inventario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getIventarioByIdTienda=async(req, res)=>{
    try {
        const { bajo_stock } = req.query;
        
        let whereClause = { tienda_id: req.params.id };

        if (bajo_stock === 'true') {
            whereClause.stock_disponible = { [Op.lte] : InventarioTienda.raw("stock_minimo")}
        }

        const inventarios = await InventarioTienda.findAll({
            where: whereClause,
            order: [['producto_id', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Inventario de Tienda obtenido correctamente", {
            data : inventarios,
            count : inventarios.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getInventariosByIdProducto = async (req, res) => {
    try {        
        const inventarios = await InventarioTienda.findAll({
            where: { producto_id: req.params.id },
            order: [['tienda_id', 'ASC']]
        });
        
        ResponseHandler.sendSuccess(res, "Inventarios del producto obtenidos exitosamente", {
            data: inventarios,
            count: inventarios.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};