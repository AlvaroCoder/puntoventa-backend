const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const ResponseHandler = require('../../lib/responseHanlder');
const { CajaTienda, CajaMovimiento, CajaSesiones, Trabajador } = require('../../models');

const getTrabajador = async (usuarioId) => {
    return await Trabajador.findOne({ where: { usuario_id: usuarioId, activo: true } });
};

exports.getAllCajas = async (req, res) => {
    try {
        const { tienda_id, activa } = req.query;
        const whereClause = {};

        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        } else if (!req.user.esAdmin && req.user.tienda_id) {
            whereClause.tienda_id = req.user.tienda_id;
        }

        if (activa !== undefined) {
            whereClause.activa = activa === 'true';
        }

        const cajas = await CajaTienda.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Cajas obtenidas exitosamente", {
            data: cajas,
            count: cajas.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getCajaById = async (req, res) => {
    try {
        const caja = await CajaTienda.findByPk(req.params.id);

        if (!caja) {
            return ResponseHandler.sendNotFound(res, "Caja no encontrada");
        }

        ResponseHandler.sendSuccess(res, "Caja encontrada", caja);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createCaja = async (req, res) => {
    try {
        const { tienda_id, nombre, codigo, saldo_inicial, moneda } = req.body;

        if (!tienda_id || !nombre || !codigo) {
            return ResponseHandler.sendValidationError(res, "tienda_id, nombre y codigo son requeridos");
        }

        const cajaExistente = await CajaTienda.findOne({ where: { codigo } });
        if (cajaExistente) {
            return ResponseHandler.sendForbidden(res, "Ya existe una caja con ese código");
        }

        const caja = await CajaTienda.create({
            tienda_id,
            nombre,
            codigo,
            saldo_inicial: saldo_inicial || 0,
            saldo_actual: saldo_inicial || 0,
            moneda: moneda || 'PEN'
        });

        ResponseHandler.sendSuccess(res, "Caja creada exitosamente", caja, 201);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateCaja = async (req, res) => {
    try {
        const caja = await CajaTienda.findByPk(req.params.id);

        if (!caja) {
            return ResponseHandler.sendNotFound(res, "Caja no encontrada");
        }

        const { nombre, codigo, moneda, activa } = req.body;

        if (codigo && codigo !== caja.codigo) {
            const codigoExistente = await CajaTienda.findOne({ where: { codigo } });
            if (codigoExistente) {
                return ResponseHandler.sendForbidden(res, "Ya existe una caja con ese código");
            }
        }

        await caja.update({ nombre, codigo, moneda, activa });

        ResponseHandler.sendSuccess(res, "Caja actualizada exitosamente", caja);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.openCaja = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const cajaId = req.params.id;
        const { monto_apertura, observaciones } = req.body;

        if (monto_apertura === undefined || monto_apertura === null) {
            await transaction.rollback();
            return ResponseHandler.sendValidationError(res, "monto_apertura es requerido");
        }

        const trabajador = await getTrabajador(req.user.id);
        if (!trabajador) {
            await transaction.rollback();
            return ResponseHandler.sendNotFound(res, "No se encontró un trabajador activo asociado a tu cuenta");
        }

        const caja = await CajaTienda.findByPk(cajaId);
        if (!caja) {
            await transaction.rollback();
            return ResponseHandler.sendNotFound(res, "Caja no encontrada");
        }

        if (!caja.activa) {
            await transaction.rollback();
            return ResponseHandler.sendForbidden(res, "La caja está inactiva");
        }

        const sesionAbierta = await CajaSesiones.findOne({ where: { caja_id: cajaId, estado: 'abierta' } });
        if (sesionAbierta) {
            await transaction.rollback();
            return ResponseHandler.sendForbidden(res, "Ya existe una sesión abierta para esta caja");
        }

        const saldoAnterior = parseFloat(caja.saldo_actual) || 0;
        const montoApertura = parseFloat(monto_apertura);
        const saldoNuevo = saldoAnterior + montoApertura;

        const sesion = await CajaSesiones.create({
            caja_id: cajaId,
            tienda_id: caja.tienda_id,
            trabajador_apertura_id: trabajador.id,
            monto_apertura: montoApertura,
            estado: 'abierta',
            fecha_apertura: new Date(),
            observaciones
        }, { transaction });

        await CajaMovimiento.create({
            caja_id: cajaId,
            trabajador_id: trabajador.id,
            tipo_movimiento: 'apertura',
            monto: montoApertura,
            saldo_anterior: saldoAnterior,
            saldo_nuevo: saldoNuevo,
            concepto: 'Apertura de caja',
            observaciones
        }, { transaction });

        await caja.update({ saldo_actual: saldoNuevo }, { transaction });

        await transaction.commit();

        ResponseHandler.sendSuccess(res, "Caja abierta exitosamente", {
            sesion,
            saldo_actual: saldoNuevo
        }, 201);
    } catch (err) {
        await transaction.rollback();
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.closeCaja = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const cajaId = req.params.id;
        const { monto_cierre_real, observaciones } = req.body;

        if (monto_cierre_real === undefined || monto_cierre_real === null) {
            await transaction.rollback();
            return ResponseHandler.sendValidationError(res, "monto_cierre_real es requerido");
        }

        const trabajador = await getTrabajador(req.user.id);
        if (!trabajador) {
            await transaction.rollback();
            return ResponseHandler.sendNotFound(res, "No se encontró un trabajador activo asociado a tu cuenta");
        }

        const sesion = await CajaSesiones.findOne({ where: { caja_id: cajaId, estado: 'abierta' } });
        if (!sesion) {
            await transaction.rollback();
            return ResponseHandler.sendNotFound(res, "No existe una sesión abierta para esta caja");
        }

        const caja = await CajaTienda.findByPk(cajaId);
        const montoCierreSistema = parseFloat(caja.saldo_actual);
        const montoCierreReal = parseFloat(monto_cierre_real);
        const diferencia = montoCierreReal - montoCierreSistema;

        await sesion.update({
            trabajador_cierre_id: trabajador.id,
            monto_cierre_sistema: montoCierreSistema,
            monto_cierre_real: montoCierreReal,
            diferencia,
            estado: 'cerrada',
            fecha_cierre: new Date(),
            observaciones: observaciones || sesion.observaciones
        }, { transaction });

        await CajaMovimiento.create({
            caja_id: cajaId,
            trabajador_id: trabajador.id,
            tipo_movimiento: 'cierre',
            monto: montoCierreSistema,
            saldo_anterior: montoCierreSistema,
            saldo_nuevo: 0,
            concepto: 'Cierre de caja',
            observaciones
        }, { transaction });

        await caja.update({ saldo_actual: 0 }, { transaction });

        await transaction.commit();

        ResponseHandler.sendSuccess(res, "Caja cerrada exitosamente", {
            sesion,
            monto_cierre_sistema: montoCierreSistema,
            monto_cierre_real: montoCierreReal,
            diferencia
        });
    } catch (err) {
        await transaction.rollback();
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getSesionActual = async (req, res) => {
    try {
        const sesion = await CajaSesiones.findOne({
            where: { caja_id: req.params.id, estado: 'abierta' }
        });

        if (!sesion) {
            return ResponseHandler.sendNotFound(res, "No hay sesión activa para esta caja");
        }

        ResponseHandler.sendSuccess(res, "Sesión activa obtenida", sesion);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getSesionesByCaja = async (req, res) => {
    try {
        const { estado, limit = 20, offset = 0 } = req.query;

        const whereClause = { caja_id: req.params.id };
        if (estado) whereClause.estado = estado;

        const sesiones = await CajaSesiones.findAll({
            where: whereClause,
            order: [['fecha_apertura', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        ResponseHandler.sendSuccess(res, "Sesiones obtenidas exitosamente", {
            data: sesiones,
            count: sesiones.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.addMovimiento = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const cajaId = req.params.id;
        const { tipo_movimiento, monto, concepto, observaciones, referencia_id, referencia_tipo } = req.body;

        if (!['ingreso', 'egreso', 'ajuste'].includes(tipo_movimiento)) {
            await transaction.rollback();
            return ResponseHandler.sendValidationError(res, "tipo_movimiento debe ser: ingreso, egreso o ajuste");
        }

        if (!monto || parseFloat(monto) <= 0) {
            await transaction.rollback();
            return ResponseHandler.sendValidationError(res, "monto debe ser mayor a 0");
        }

        const trabajador = await getTrabajador(req.user.id);
        if (!trabajador) {
            await transaction.rollback();
            return ResponseHandler.sendNotFound(res, "No se encontró un trabajador activo asociado a tu cuenta");
        }

        const sesionAbierta = await CajaSesiones.findOne({ where: { caja_id: cajaId, estado: 'abierta' } });
        if (!sesionAbierta) {
            await transaction.rollback();
            return ResponseHandler.sendForbidden(res, "No hay sesión abierta para registrar movimientos");
        }

        const caja = await CajaTienda.findByPk(cajaId);
        const saldoAnterior = parseFloat(caja.saldo_actual);
        const montoMovimiento = parseFloat(monto);

        let saldoNuevo;
        if (tipo_movimiento === 'egreso') {
            if (saldoAnterior < montoMovimiento) {
                await transaction.rollback();
                return ResponseHandler.sendForbidden(res, "Saldo insuficiente para realizar el egreso");
            }
            saldoNuevo = saldoAnterior - montoMovimiento;
        } else {
            saldoNuevo = saldoAnterior + montoMovimiento;
        }

        const movimiento = await CajaMovimiento.create({
            caja_id: cajaId,
            trabajador_id: trabajador.id,
            tipo_movimiento,
            monto: montoMovimiento,
            saldo_anterior: saldoAnterior,
            saldo_nuevo: saldoNuevo,
            concepto,
            observaciones,
            referencia_id,
            referencia_tipo
        }, { transaction });

        await caja.update({ saldo_actual: saldoNuevo }, { transaction });

        await transaction.commit();

        ResponseHandler.sendSuccess(res, "Movimiento registrado exitosamente", {
            movimiento,
            saldo_actual: saldoNuevo
        }, 201);
    } catch (err) {
        await transaction.rollback();
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getMovimientos = async (req, res) => {
    try {
        const cajaId = req.params.id;
        const { solo_sesion_actual, limit = 50, offset = 0 } = req.query;

        const whereClause = { caja_id: cajaId };

        if (solo_sesion_actual === 'true') {
            const sesion = await CajaSesiones.findOne({ where: { caja_id: cajaId, estado: 'abierta' } });
            if (sesion) {
                whereClause.fecha_hora = { [Op.gte]: sesion.fecha_apertura };
            }
        }

        const movimientos = await CajaMovimiento.findAll({
            where: whereClause,
            order: [['fecha_hora', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        ResponseHandler.sendSuccess(res, "Movimientos obtenidos exitosamente", {
            data: movimientos,
            count: movimientos.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};
