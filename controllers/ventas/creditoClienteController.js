const { Op } = require('sequelize');
const {CreditoCliente} = require('../../models/index');
const ResponseHandler = require('../../lib/responseHanlder');

exports.getCreditoClienteByVentaId = async (req, res) => {
    try {
        const { id } = req.params;
        const creditos = await CreditoCliente.findAll({
            where: { venta_id: id },
            order: [['fecha_credito', 'DESC']],
        });

        // CORRECCIÓN: Estructura consistente de respuesta
        ResponseHandler.sendSuccess(res, "Créditos encontrados", {
            data: creditos,
            count: creditos.length
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getCreditoClienteByClienteId = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.query; 
        
        let whereClause = { cliente_id: id };
        
        if (estado) {
            whereClause.estado = estado;
        }

        const creditos = await CreditoCliente.findAll({
            where: whereClause,
            order: [['fecha_credito', 'DESC']],
        });

        ResponseHandler.sendSuccess(res, "Créditos encontrados", {
            data: creditos,
            count: creditos.length
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getCreditoClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const credito = await CreditoCliente.findByPk(id);

        if (!credito) {
            return ResponseHandler.sendNotFound(res, "Crédito no encontrado");
        }

        ResponseHandler.sendSuccess(res, "Crédito encontrado", credito);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.createCreditoCliente = async (req, res) => {
    try {
        const { venta_id, cliente_id, monto_total, saldo_pendiente, fecha_credito } = req.body;

        if (!venta_id || !cliente_id || !monto_total || !saldo_pendiente || !fecha_credito) {
            return ResponseHandler.sendValidationError(res, "venta_id, cliente_id, monto_total, saldo_pendiente y fecha_credito son requeridos");
        }

        if (parseFloat(saldo_pendiente) > parseFloat(monto_total)) {
            return ResponseHandler.sendValidationError(res, "El saldo pendiente no puede ser mayor al monto total");
        }

        const creditoExistente = await CreditoCliente.findOne({
            where: { venta_id: venta_id }
        });

        if (creditoExistente) {
            return ResponseHandler.sendConflict(res, "Ya existe un crédito para esta venta");
        }

        const nuevoCredito = await CreditoCliente.create(req.body);
        ResponseHandler.sendCreated(res, "Crédito creado exitosamente", nuevoCredito);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.updateCreditoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const credito = await CreditoCliente.findByPk(id);
        
        if (!credito) {
            return ResponseHandler.sendNotFound(res, "Crédito no encontrado"); // CORRECCIÓN: Usar sendNotFound
        }

        if (req.body.saldo_pendiente !== undefined && req.body.monto_total !== undefined) {
            if (parseFloat(req.body.saldo_pendiente) > parseFloat(req.body.monto_total)) {
                return ResponseHandler.sendValidationError(res, "El saldo pendiente no puede ser mayor al monto total");
            }
        }

        await credito.update(req.body);
        ResponseHandler.sendSuccess(res, "Crédito actualizado exitosamente", credito);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.deleteCreditoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const credito = await CreditoCliente.findByPk(id);
        
        if (!credito) {
            return ResponseHandler.sendNotFound(res, "Crédito no encontrado"); // CORRECCIÓN: Usar sendNotFound
        }

        await credito.destroy();
        ResponseHandler.sendSuccess(res, "Crédito eliminado exitosamente");
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getCreditosByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const { cliente_id } = req.query;

        const estadosValidos = ['pendiente', 'pagado', 'vencido', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return ResponseHandler.sendValidationError(res, "Estado no válido. Debe ser: pendiente, pagado, vencido o cancelado");
        }

        let whereClause = { estado: estado };
        
        if (cliente_id) {
            whereClause.cliente_id = cliente_id;
        }

        const creditos = await CreditoCliente.findAll({
            where: whereClause,
            order: [['fecha_vencimiento', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, `Créditos en estado ${estado} obtenidos exitosamente`, {
            data: creditos,
            count: creditos.length
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getCreditosVencidos = async (req, res) => {
    try {
        const { cliente_id } = req.query;
        const hoy = new Date().toISOString().split('T')[0];

        let whereClause = {
            estado: 'pendiente',
            fecha_vencimiento: {
                [Op.lt]: hoy
            }
        };

        if (cliente_id) {
            whereClause.cliente_id = cliente_id;
        }

        const creditosVencidos = await CreditoCliente.findAll({
            where: whereClause,
            order: [['fecha_vencimiento', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Créditos vencidos obtenidos exitosamente", {
            data: creditosVencidos,
            count: creditosVencidos.length
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.actualizarEstadoCredito = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const credito = await CreditoCliente.findByPk(id);
        
        if (!credito) {
            return ResponseHandler.sendNotFound(res, "Crédito no encontrado");
        }

        // Validar estado
        const estadosValidos = ['pendiente', 'pagado', 'vencido', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return ResponseHandler.sendValidationError(res, "Estado no válido");
        }

        if (estado === 'pagado' && parseFloat(credito.saldo_pendiente) > 0) {
            return ResponseHandler.sendValidationError(res, "No se puede marcar como pagado un crédito con saldo pendiente mayor a 0");
        }

        await credito.update({ estado });
        ResponseHandler.sendSuccess(res, "Estado del crédito actualizado exitosamente", credito);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.actualizarSaldoPendiente = async (req, res) => {
    try {
        const { id } = req.params;
        const { saldo_pendiente } = req.body;

        const credito = await CreditoCliente.findByPk(id);
        
        if (!credito) {
            return ResponseHandler.sendNotFound(res, "Crédito no encontrado");
        }

        if (parseFloat(saldo_pendiente) > parseFloat(credito.monto_total)) {
            return ResponseHandler.sendValidationError(res, "El saldo pendiente no puede ser mayor al monto total");
        }

        if (parseFloat(saldo_pendiente) < 0) {
            return ResponseHandler.sendValidationError(res, "El saldo pendiente no puede ser negativo");
        }

        const nuevoEstado = parseFloat(saldo_pendiente) === 0 ? 'pagado' : credito.estado;

        await credito.update({ 
            saldo_pendiente,
            estado: nuevoEstado
        });

        const mensaje = parseFloat(saldo_pendiente) === 0 
            ? "Saldo actualizado y crédito marcado como pagado" 
            : "Saldo actualizado exitosamente";

        ResponseHandler.sendSuccess(res, mensaje, credito);
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};

exports.getResumenCreditos = async (req, res) => {
    try {
        const { cliente_id } = req.query;

        let whereClause = {};
        if (cliente_id) {
            whereClause.cliente_id = cliente_id;
        }

        const resumen = await CreditoCliente.findAll({
            where: whereClause,
            attributes: [
                'estado',
                [CreditoCliente.sequelize.fn('COUNT', CreditoCliente.sequelize.col('id')), 'total_creditos'],
                [CreditoCliente.sequelize.fn('SUM', CreditoCliente.sequelize.col('monto_total')), 'monto_total'],
                [CreditoCliente.sequelize.fn('SUM', CreditoCliente.sequelize.col('saldo_pendiente')), 'saldo_pendiente']
            ],
            group: ['estado'],
            raw: true
        });

        ResponseHandler.sendSuccess(res, "Resumen de créditos obtenido exitosamente", {
            data: resumen
        });
    } catch (error) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(error));
    }
};