const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const RegistrosAsistenciaModel = require('../../models/core/registroAsistencia');

exports.getAllRegistrosAsistencia=async(req, res)=>{
    try {
        const registros = await RegistrosAsistenciaModel.findAll();
        ResponseHandler.sendSuccess(res,"Registros encontrados", registros);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getRegistroAsistenciaById=async(req, res)=>{
    try {
        const registro = await RegistrosAsistenciaModel.findByPk(req.params.id);
        if (!registro) {
            ResponseHandler.notFound("No se encontro registro");
        }
        ResponseHandler.accepted("Registro encontrado", registro);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.createRegistroAsistencia=async(req,res)=>{
    try {
        const registro = await RegistrosAsistenciaModel.create(req.body);
        ResponseHandler.sendSuccess(res, "Registro creado correctamente", registro);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.registrarEntrada=async(req, res)=>{
    try {
        const {
            trabajador_id, tienda_id, fecha, hora_entrada, observaciones, ip_dispositivo
        } = req.body;

        const registroExistente = await RegistrosAsistenciaModel.findOne({
            where : {
                trabajador_id,
                fecha,
                tienda_id
            }
        });

        if (registroExistente) {
            if (registroExistente.hora_entrada) {
                ResponseHandler.conflict("Ya existe un registro de entrada ara este trabajador");
            }

            await registroExistente.update({
                hora_entrada,
                observaciones : observaciones || registroExistente.observaciones,
                ip_dispositivo : ip_dispositivo || registroExistente.ip_dispositivo
            });

            ResponseHandler.sendSuccess(res, "Hora de entrada registrada exitosamente", registroExistente);
        }

        const registro = await RegistrosAsistenciaModel.create({
            trabajador_id,
            tienda_id,
            fecha, 
            hora_entrada,
            observaciones,
            ip_dispositivo,
            tipo_registro : "digital"  
        });

        ResponseHandler.sendCreated(res,"Registro creado correctamente", registro);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.registrarSalida=async(req, res)=>{
    try {
        const { trabajador_id, tienda_id, fecha, hora_salida, observaciones } = req.body;
        const registro = await RegistrosAsistenciaModel.findOne({
            where: {
              trabajador_id,
              fecha,
              tienda_id
            }
        });

        if (!registro) {
            ResponseHandler.sendNotFound(res, "No existe el registro de asistencia");
        }
        if (registro.hora_salida) {
            ResponseHandler.sendValidationError(res, "Ya existe un registro con esta hora de salida")
        }
        await registro.update({
            hora_salida,
            observaciones : observaciones || registro.observaciones
        });

        ResponseHandler.sendSuccess(res, "Hora de salida guardada correctamente", registro);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
};

exports.updateRegistroAsistencia=async(req, res)=>{
    try {
        const registro = await RegistrosAsistenciaModel.findByPk(req.params.id);
        if (!registro) {
            ResponseHandler.sendNotFound(res, "No se encontro registro");
        }
        await registro.update(req.body);
        ResponseHandler.sendSuccess(res, "Se actualizo correctamente el registro");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getRegistroByIdTrabajador=async(req,res)=>{
    try {
        const { idTrabajador } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        let whereClause = {idTrabajador : idTrabajador};
        if (fechaFin && fechaInicio) {
            whereClause.fecha = {
                [Op.between] : [fechaInicio, fechaFin]
            }
        };

        const registros = await RegistrosAsistenciaModel.findAll({
            where : whereClause,
            order : [['fecha','DESC']]
        });

        ResponseHandler.sendSuccess(res, "Registros encontrados",registros);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getRegistroByIdTienda=async(req, res)=>{
    try {
        const { tiendaId } = req.params;
        const { fecha } = req.query;
        
        let whereClause = { tienda_id: tiendaId };
        
        if (fecha) {
          whereClause.fecha = fecha;
        }
        const registros = await RegistrosAsistenciaModel.findAll({
            where: whereClause,
            order: [['fecha', 'DESC'], ['hora_entrada', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Registro de tienda encontrado", registros);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}