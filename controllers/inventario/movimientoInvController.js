const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const {MovimientoInventario} = require('../../models/index');

exports.getAllMovimientosByIdProduct = async(req, res)=>{
    try {
        const movimientos = await MovimientoInventario.findAll({
            where : {
                producto_id : req.params.id
            },
            order : [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length ===0) {
            return ResponseHandler.sendNotFound(res, "No existen movimientos de ese producto")
        };

        ResponseHandler.sendSuccess(res, "Movimientos encontrados",{
            data : movimientos,
            count : movimientos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getAllMovimientosByIdTrabajador = async (req, res)=>{
    try {
        const movimientos = await MovimientoInventario.findAll({
            where : {
                trabajador_id : req.params.id
            },
            order : [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length === 0) {
            return ResponseHandler.sendNotFound(res, "No se encontraron movimientos");
        }

        ResponseHandler.sendSuccess(res, "Movimientos encontrados",{
            data : movimientos,
            count : movimientos.length
        })
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getAllMovimientosByIdTienda = async(req, res)=>{
    try {
        const movimientos = await MovimientoInventario.findAll({
            where : {
                tienda_id : req.params.id
            },
            order : [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length === 0) {
            return ResponseHandler.sendNotFound(res, "No existen movimientos de la tienda");
        }

        ResponseHandler.sendSuccess(res, "Movimientos encontrados",{
            data : movimientos,
            count : movimientos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    };
};

exports.getAllMovimientosByTipo = async(req, res)=>{
    try {
        const { tipo } = req.query;

        if (!tipo) {
            return ResponseHandler.sendValidationError(res, "El tipo del movimiento es requerido");
        }

        const movimientos = await MovimientoInventario.findAll({
            where : {
                tipo_movimiento : {
                    [Op.like] : tipo.toLowerCase()
                }
            },
            order : [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length === 0) {
            return ResponseHandler.sendNotFound(res, "No se encontro un movimiento de este tipo");
        }

        ResponseHandler.sendSuccess(res, "Movimientos Encontrados",{
            data : movimientos,
            count : movimientos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getAllMovimientosTodayByIdTienda=async(req, res)=>{
    try {
        const hoy = new Date();
        const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

        const movimientos = await MovimientoInventario.findAll({
            where : {
                tienda_id: req.params.id,
                fecha_movimiento: {
                    [Op.between]: [inicioDia, finDia]
                }
            },
            order : [['fecha_movimiento','DESC']]
        });

        if (movimientos.length === 0) {
            return ResponseHandler.sendNotFound(res, "No hay movimientos en esta tienda dle dia de hoy");
        }
        
        ResponseHandler.sendSuccess(res, "Movimientos de hoy",{
            data : movimientos,
            count : movimientos.length
        })
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getMovimientosByRangoFechas=async(req, res)=>{
    try {
        const { fecha_inicio, fecha_fin, tienda_id, producto_id } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return ResponseHandler.sendValidationError(res, "Las fechas de inicio y fin son requeridas");
        }

        let whereClause = {
            fecha_movimiento: {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            }
        };

        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        }
        if (producto_id) {
            whereClause.producto_id = producto_id;
        }

        const movimientos = await MovimientoInventario.findAll({
            where : whereClause
        });

        if (movimientos.length === 0) {
            return ResponseHandler.sendNotFound(res, "No hay movimientos en esas fechas");
        }

        ResponseHandler.sendSuccess(res, "Movimientos encontrados", {
            data : movimientos,
            count : movimientos.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getResumenMovimientos=async(req, res)=>{
    try {
        const {fecha_inicio, fecha_fin, tienda_id} = req.query;

        let whereClause = {};

        if (fecha_fin && fecha_fin) {
            whereClause.fecha_movimiento = {
                [Op.between] : [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        }

        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        };

        const movimientos = await MovimientoInventario.findAll({
            where : whereClause
        });

        if (movimientos.length === 0) {
            ResponseHandler.sendNotFound(res, "No se encontraron movimientos");
        }

        ResponseHandler.sendSuccess(res, "Movimientos encontrados",{
            data : movimientos,
            count : movimientos.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.createMovimiento=async(req, res)=>{
    try {
        const response = await MovimientoInventario.create(req.body);
        ResponseHandler.sendCreated(res, "Se creo correctamente el movimiento", response);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getMovimientoById=async(req, res)=>{
    try {
        const movimiento = await MovimientoInventario.findOne({
            where : {
                id : req.params.id
            }
        });

        if (!movimiento) {
            return ResponseHandler.sendNotFound(res, "No se encontro movimiento");
        }

        ResponseHandler.sendSuccess(res, "Movimiento encontrado", movimiento)
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}