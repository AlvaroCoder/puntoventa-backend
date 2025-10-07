const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const {Producto} = require('../../models/index');

exports.getAllProductsByIdEmpresa=async(req, res)=>{
    try {
        const productos = await Producto.findAll({
            where : {
                empresa_id : req.params.id
            },
            order : [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Productos encontrados", {
            data : productos,
            count : productos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getAllProductsByCategoria=async(req, res)=>{
    try {
        const {empresa_id, categoria_id} = req.query;

        if (!empresa_id || !categoria_id) {
            return ResponseHandler.sendValidationError(res, "Debes ingresar el id");
        }

        const productos = await Producto.findAll({
            where : {
                empresa_id,
                categoria_id
            },
            order : [['stock_actual', 'DESC']]
        });

        ResponseHandler.sendSuccess(res, "Productos encontrados", {
            data : productos,
            count : productos.length
        })
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProductoById=async(req, res)=>{
    try {
        const producto = await Producto.findOne({
            where : {
                id :  req.params.id
            }
        });

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "No se encontro producto");
        }

        ResponseHandler.sendSuccess(res, "Producto encontrado", producto);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createProducto=async(req, res)=>{
    try {
        const producto = await Producto.create(req.body);
        ResponseHandler.sendCreated(res, "El producto ha sido creado correctamente!", producto);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.actualizarStock=async(req, res)=>{
    try {
        const { stock_actual, stock_minimo } = req.body;

        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "Producto no encontrado");
        }

        if (stock_actual === undefined && stock_minimo === undefined) {
            return ResponseHandler.sendValidationError(res, "Debe proporcionar stock_actual o stock_minimo para actualizar");
        }

        const updates = {};
        if (stock_actual !== undefined) updates.stock_actual = stock_actual;
        if (stock_minimo !== undefined) updates.stock_minimo = stock_minimo;

        await producto.update(updates);

        ResponseHandler.sendSuccess(res, "Stock actualizado exitosamente", producto);


    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "Producto no encontrado");
        }

        await producto.update(req.body);
        ResponseHandler.sendSuccess(res, "Producto actualizado exitosamente", producto);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "Producto no encontrado");
        }

        await producto.destroy();
        ResponseHandler.sendSuccess(res, "Producto eliminado exitosamente");

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.toggleEstadoProducto = async (req, res) => {
    try {
        const { activo } = req.body;
        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "Producto no encontrado");
        }

        await producto.update({ activo });

        const mensaje = activo ? "Producto activado exitosamente" : "Producto desactivado exitosamente";
        ResponseHandler.sendSuccess(res, mensaje, producto);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.searchProductos = async (req, res)=>{
    try {
        const { termino } = req.params;
        const { empresa_id, categoria_id } = req.query;

        let whereClause = {
            [Op.or]: [
                { nombre: { [Op.like]: `%${termino}%` } },
                { codigo: { [Op.like]: `%${termino}%` } },
                { descripcion: { [Op.like]: `%${termino}%` } },
                { codigo_barras: { [Op.like]: `%${termino}%` } }
            ]
        };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        if (categoria_id) {
            whereClause.categoria_id = categoria_id;
        }

        const productos = await Producto.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Búsqueda de productos completada", {
            data: productos,
            count: productos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getProductosBajoStock=async(req, res)=>{
    try {
        const { empresa_id } = req.query;

        let whereClause = {
            stock_actual: { [Op.lte]: Producto.sequelize.col('stock_minimo') }
        };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        const productosBajoStock = await Producto.findAll({
            where: whereClause,
            order: [['stock_actual', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Productos con stock bajo obtenidos exitosamente", {
            data: productosBajoStock,
            count: productosBajoStock.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.actualizarPrecio=async(req, res)=>{
    try {
        const { precio_venta, precio_compra, impuesto_porcentaje } = req.body;
        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return ResponseHandler.sendNotFound(res, "Producto no encontrado");
        }

        const updates = {};
        if (precio_venta !== undefined) updates.precio_venta = precio_venta;
        if (precio_compra !== undefined) updates.precio_compra = precio_compra;
        if (impuesto_porcentaje !== undefined) updates.impuesto_porcentaje = impuesto_porcentaje;

        await producto.update(updates);
        ResponseHandler.sendSuccess(res, "Precios actualizados exitosamente", producto);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.verificarCodigoProducto=async(req, res)=>{
    try {
        
        const { codigo } = req.params;
        const { empresa_id, exclude_id } = req.query;

        let whereClause = { codigo: codigo.toUpperCase() };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        if (exclude_id) {
            whereClause.id = { [Op.ne]: exclude_id };
        }

        const productoExistente = await Producto.findOne({ where: whereClause });

        ResponseHandler.sendSuccess(res, "Verificación completada", {
            disponible: !productoExistente,
            codigo: codigo.toUpperCase()
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}
