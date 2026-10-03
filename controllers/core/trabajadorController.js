const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../config/db');
const ResponseHandler = require('../../lib/responseHanlder');
const models = require('../../models');

const TrabajadorModel = models.Trabajador;
const UsuarioModelo = models.Usuario;
const RolModelo = models.Rol;
const SuscripcionEmpresa = models.SuscripcionEmpresa;
const PlanSuscripcion = models.PlanSuscripcion;
const TrabajadorRolModel = models.TrabajadorRoles;

const includeRol = [
    { model: RolModelo, as: 'rol', attributes: ['id', 'nombre', 'nivel_permiso'] }
];

exports.getAllTrabajadores = async (req, res) => {
    try {
        const { empresa_id, tienda_id, activo } = req.query;
        let whereClause = {};
        if (empresa_id) whereClause.empresa_id = empresa_id;
        if (tienda_id) whereClause.tienda_id = tienda_id;
        if (activo !== undefined) whereClause.activo = activo === 'true';

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            include: includeRol,
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Trabajadores obtenidos exitosamente", {
            data: trabajadores,
            count: trabajadores.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTrabajadorById = async (req, res) => {
    try {
        const trabajador = await TrabajadorModel.findByPk(req.params.id, { include: includeRol });
        if (!trabajador) return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
        ResponseHandler.sendSuccess(res, "Trabajador obtenido exitosamente", trabajador);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTrabajadorByIdUsuario = async (req, res) => {
    try {
        const trabajador = await TrabajadorModel.findOne({
          where: { usuario_id: req.params.userId },
        });
         if (!trabajador)return ResponseHandler.sendNotFound(res, "Trabajador no encontrado");
         ResponseHandler.sendSuccess(
           res,
           "Trabajador obtenido exitosamente",
           trabajador,
         );
    } catch (err) {
                ResponseHandler.send(
                  res,
                  ResponseHandler.handlerSequelizeError(err),
                );

    }
}

exports.createTrabajador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            usuario_id, email, empresa_id,nombre_completo, tipo_documento, numero_documento,
            telefono, codigo_empleado, fecha_contratacion, salario_base, rol_id, tienda_id
        } = req.body;

        if (!empresa_id ) {
            await t.rollback();
            return ResponseHandler.sendValidationError(res,
                "Faltan campos obligatorios: password, email, empresa_id, tienda_id, nombre_completo, numero_documento"
            );
        }

        const suscripcion = await SuscripcionEmpresa.findOne({
            where: { empresa_id, estado: 'activa' },
            include: [{ model: PlanSuscripcion, as: 'plan', attributes: ['limite_empleados', 'nombre'] }],
            transaction : t
        });

        const limiteEmpleados = suscripcion?.plan?.limite_empleados ?? 2;
        const totalActuales = await TrabajadorModel.count({ where: { empresa_id, activo: true }, transaction : t });

        if (totalActuales >= limiteEmpleados) {
            await t.rollback();
            return ResponseHandler.sendForbidden(res,
                `Has alcanzado el límite de ${limiteEmpleados} empleado(s) para tu plan "${suscripcion?.plan?.nombre ?? 'actual'}". Actualiza tu plan para agregar más trabajadores.`
            );
        }

        const nuevoTrabajador = await TrabajadorModel.create({
            empresa_id,
            usuario_id,
            nombre_completo: nombre_completo.trim().toUpperCase(),
            tipo_documento: tipo_documento ?? 'DNI',
            numero_documento,
            email: email.toLowerCase(),
            telefono: telefono ?? null,
            codigo_empleado: codigo_empleado || `EMP-${Date.now()}`,
            fecha_contratacion: fecha_contratacion ?? new Date(),
            salario_base: salario_base ?? 1150.0,
            activo: true
        }, { transaction: t });

        await TrabajadorRolModel.create(
          {
            trabajador_id: nuevoTrabajador.id,
            rol_id,
            tienda_id: tienda_id ?? null,
            activo: true,
          },
          { transaction: t },
        );

        const trabajadorConRol = await TrabajadorModel.findByPk(nuevoTrabajador.id, { transaction: t });
        
        await t.commit();

        ResponseHandler.sendSuccess(res, "Trabajador creado exitosamente", {
            trabajador: trabajadorConRol,
            cuota: { total: totalActuales + 1, limite: limiteEmpleados, disponibles: limiteEmpleados - (totalActuales + 1) }
        }, 201);

    } catch (err) {
        console.log("Error : ",err)
        await t.rollback();
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateTrabajador = async (req, res) => {
    try {
        const trabajador = await TrabajadorModel.findByPk(req.params.id);
        if (!trabajador) return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');

        const { usuario_id, empresa_id, ...datosActualizables } = req.body;
        await trabajador.update(datosActualizables);

        const actualizado = await TrabajadorModel.findByPk(trabajador.id, { include: includeRol });
        ResponseHandler.sendSuccess(res, "Trabajador actualizado exitosamente", actualizado);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteTrabajador = async (req, res) => {
    try {
        const trabajador = await TrabajadorModel.findByPk(req.params.id);
        if (!trabajador) return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
        await trabajador.destroy();
        ResponseHandler.sendSuccess(res, "Trabajador eliminado exitosamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.toggleEstadoTrabajador = async (req, res) => {
    try {
        const { activo } = req.body;
        const trabajador = await TrabajadorModel.findByPk(req.params.id);
        if (!trabajador) return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
        await trabajador.update({ activo });
        const mensaje = activo ? "Trabajador activado exitosamente" : "Trabajador desactivado exitosamente";
        ResponseHandler.sendSuccess(res, mensaje, trabajador);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTrabajadorRol = async (req, res) => {
    try {
        const { trabajador_id } = req.query;
        const trabajadorRol = await TrabajadorRolModel.findAll({
            where: { trabajador_id }
        });
        ResponseHandler.sendSuccess(res, "Trabajador encontrado", trabajadorRol);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
}

exports.getTrabajadorByEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { activo, tienda_id } = req.query;
        let whereClause = { empresa_id: empresaId };
        if (activo !== undefined) whereClause.activo = activo === 'true';
        if (tienda_id) whereClause.tienda_id = tienda_id;

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            include: includeRol,
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Trabajadores de la empresa obtenidos exitosamente", {
            data: trabajadores,
            count: trabajadores.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getCuotaTrabajadores = async (req, res) => {
    try {
        const { empresaId } = req.params;

        const suscripcion = await SuscripcionEmpresa.findOne({
            where: { empresa_id: empresaId, estado: 'activa' },
            include: [{ model: PlanSuscripcion, as: 'plan', attributes: ['limite_empleados', 'nombre'] }]
        });

        const limiteEmpleados = suscripcion?.plan?.limite_empleados ?? 1;
        const total = await TrabajadorModel.count({ where: { empresa_id: empresaId, activo: true } });

        ResponseHandler.sendSuccess(res, "Cuota de trabajadores obtenida", {
            total,
            limite: limiteEmpleados,
            disponibles: Math.max(0, limiteEmpleados - total),
            plan: suscripcion?.plan?.nombre ?? 'Sin plan activo',
            cuota_llena: total >= limiteEmpleados
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTrabajadoresByIdTienda = async (req, res) => {
    try {
        const { tiendaId } = req.params;
        const { activo } = req.query;
        let whereClause = { tienda_id: tiendaId };
        if (activo !== undefined) whereClause.activo = activo === 'true';

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            include: includeRol,
            order: [['nombre_completo', 'ASC']]
        });
        ResponseHandler.sendSuccess(res, "Trabajadores obtenidos", trabajadores);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.searchTrabajadores = async (req, res) => {
    try {
        const { termino } = req.params;
        const { empresa_id, tienda_id } = req.query;
        let whereClause = {
            [Op.or]: [
                { nombre_completo: { [Op.like]: `%${termino}%` } },
                { numero_documento: { [Op.like]: `%${termino}%` } },
                { email: { [Op.like]: `%${termino}%` } },
                { codigo_empleado: { [Op.like]: `%${termino}%` } }
            ]
        };
        if (empresa_id) whereClause.empresa_id = empresa_id;
        if (tienda_id) whereClause.tienda_id = tienda_id;

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            include: includeRol,
            order: [['nombre_completo', 'ASC']]
        });
        ResponseHandler.sendSuccess(res, "Búsqueda completada", { data: trabajadores, count: trabajadores.length });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.verificarDocumentoTrabajador = async (req, res) => {
    try {
        const { documento } = req.params;
        const { exclude_id } = req.query;
        let whereClause = { numero_documento: documento };
        if (exclude_id) whereClause.id = { [Op.ne]: exclude_id };

        const existe = await TrabajadorModel.findOne({ where: whereClause });
        ResponseHandler.sendSuccess(res, "Verificación completada", { disponible: !existe, documento });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.actualizarSalarioTrabajador = async (req, res) => {
    try {
        const { salario_base } = req.body;
        const trabajador = await TrabajadorModel.findByPk(req.params.id);
        if (!trabajador) return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
        if (salario_base < 0) return ResponseHandler.sendValidationError(res, "El salario base no puede ser negativo");
        await trabajador.update({ salario_base });
        ResponseHandler.sendSuccess(res, "Salario actualizado exitosamente", trabajador);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};
