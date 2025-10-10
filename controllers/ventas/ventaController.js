const ResponseHandler = require('../../lib/responseHanlder');
const {Venta} = require('../../models/index');

exports.createVenta = async (req, res) => {
    try {
        const { 
            empresa_id, 
            tienda_id, 
            caja_id, 
            trabajador_id, 
            cliente_id, 
            numero_venta, 
            subtotal, 
            total 
        } = req.body;

        if (!empresa_id || !tienda_id || !caja_id || !trabajador_id || !cliente_id || 
            !numero_venta || subtotal === undefined || total === undefined) {
            return ResponseHandler.sendValidationError(res, "empresa_id, tienda_id, caja_id, trabajador_id, cliente_id, numero_venta, subtotal y total son requeridos");
        }

        const impuesto = req.body.impuesto || 0;
        const descuento = req.body.descuento || 0;
        const totalCalculado = parseFloat(subtotal) + parseFloat(impuesto) - parseFloat(descuento);

        if (Math.abs(parseFloat(total) - totalCalculado) > 0.01) { 
            return ResponseHandler.sendValidationError(res, "El total no coincide con el cálculo: subtotal + impuesto - descuento");
        }

        const ventaExistente = await Venta.findOne({
            where: { numero_venta: numero_venta }
        });

        if (ventaExistente) {
            return ResponseHandler.sendValidationError(res, "Ya existe una venta con este número");
        }

        const venta = await Venta.create(req.body);
        ResponseHandler.sendSuccess(res, "Venta creada exitosamente", venta);
    } catch (error ) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
}

exports.getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findByPk(id);

        if (!venta) {
            return ResponseHandler.sendNotFound(res, "Venta no encontrada");
        }

        ResponseHandler.sendSuccess(res, "Venta encontrada", venta);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};


exports.getVentasFiltradas = async (req, res) =>{
    try {
        
        let whereClause ={};
        const { empresaId , trabajadorId, tiendaId, cajaId } = req.query;
        if (empresaId) {
            whereClause.empresaId = empresaId;
        }

        if (trabajadorId) {
            whereClause.trabajadorId = trabajadorId;
        }

        if (tiendaId) {
            whereClause.tiendaId = tiendaId;
        };

        if (cajaId) {
            whereClause.cajaId = cajaId;
        }

        const ventas = await Venta.findAll({ where: whereClause, order : [['fecha_venta', 'DESC']] });

        ResponseHandler.sendSuccess(res, "Ventas encontradas", {
            data: ventas,
            count: ventas.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findByPk(id);

        if (!venta) {
            return ResponseHandler.sendNotFound(res, "Venta no encontrada");
        }

        if (req.body.subtotal !== undefined || req.body.impuesto !== undefined || 
            req.body.descuento !== undefined || req.body.total !== undefined) {
            
            const subtotal = req.body.subtotal !== undefined ? req.body.subtotal : venta.subtotal;
            const impuesto = req.body.impuesto !== undefined ? req.body.impuesto : venta.impuesto;
            const descuento = req.body.descuento !== undefined ? req.body.descuento : venta.descuento;
            const total = req.body.total !== undefined ? req.body.total : venta.total;
            
            const totalCalculado = parseFloat(subtotal) + parseFloat(impuesto) - parseFloat(descuento);
            
            if (Math.abs(parseFloat(total) - totalCalculado) > 0.01) {
                return ResponseHandler.sendValidationError(res, "El total no coincide con el cálculo: subtotal + impuesto - descuento");
            }
        }

        if (req.body.numero_venta && req.body.numero_venta !== venta.numero_venta) {
            const ventaConNumero = await Venta.findOne({
                where: { 
                    numero_venta: req.body.numero_venta,
                    id: { [Op.ne]: id }
                }
            });

            if (ventaConNumero) {
                return ResponseHandler.sendValidationError(res, "Ya existe otra venta con este número");
            }
        };

        await venta.update(req.body);
        ResponseHandler.sendSuccess(res, "Venta actualizada exitosamente", venta);

    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
}

exports.deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findByPk(id);

        if (!venta) {
            return ResponseHandler.sendNotFound(res, "Venta no encontrada");
        }

        await venta.destroy();
        ResponseHandler.sendSuccess(res, "Venta eliminada exitosamente");
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
}


exports.getVentasByClienteId = async (req, res) => {
    try {
        const { id } = req.params;
        const ventas = await Venta.findAll({
            where: { cliente_id: id },
            order: [['fecha_venta', 'DESC']],
        });

        ResponseHandler.sendSuccess(res, "Ventas encontradas", {
            data: ventas,
            count: ventas.length
        });

    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getVentasByFechaRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return ResponseHandler.sendValidationError(res, "startDate y endDate son requeridos");
        }

        const ventas = await Venta.findAll({
            where: {
                fecha_venta: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            order: [['fecha_venta', 'DESC']],
        });

        ResponseHandler.sendSuccess(res, "Ventas encontradas", {
            data: ventas,
            count: ventas.length
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
}

exports.getVentasByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const { empresa_id, tienda_id, fecha_inicio, fecha_fin } = req.query;

        const estadosValidos = ['completada', 'pendiente', 'cancelada', 'reembolsada'];
        if (!estadosValidos.includes(estado)) {
            return ResponseHandler.sendValidationError(res, "Estado no válido");
        }

        let whereClause = { estado: estado };
        
        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        }

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_venta = {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        }

        const ventas = await Venta.findAll({
            where: whereClause,
            order: [['fecha_venta', 'DESC']]
        });

        ResponseHandler.sendSuccess(res, `Ventas en estado ${estado} obtenidas exitosamente`, {
            data: ventas,
            count: ventas.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
}