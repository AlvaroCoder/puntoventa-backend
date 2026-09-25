const models = require('../../models');
const sequelize = require("../../config/db");
const EmpresaModelo = models.Empresa;
const SuscripcionEmpresaModelo = models.SuscripcionEmpresa;
const PlanSuscripcion = models.PlanSuscripcion;

const ResponseHandler = require('../../lib/responseHanlder');

exports.getAllEmpresas = async (req, res) => {
    try {
        const empresas = await EmpresaModelo.findAll();
        ResponseHandler.sendSuccess(res, "Empresas recibidas", empresas);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getEmpresaById = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) return ResponseHandler.sendNotFound(res, "Empresa no encontrada");
        ResponseHandler.sendSuccess(res, "Empresa encontrada", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getMiEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findOne({ where: { usuario_id: req.user.id } });
        if (!empresa) return ResponseHandler.sendNotFound(res, "No tienes una empresa registrada");
        ResponseHandler.sendSuccess(res, "Empresa obtenida", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createEmpresa = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      usuario_id,
      rubro_id,
      plan_actual_id,
      nombre_empresa,
      nombre_comercial,
      ruc,
      direccion,
      telefono,
      email,
      logo_url,
      moneda_base,
    } = req.body;

    if (!nombre_comercial || !rubro_id || !plan_actual_id) {
      await t.rollback();
      return ResponseHandler.sendValidationError(
        res,
        "Faltan campos obligatorios: nombre_comercial, rubro_id, plan_actual_id",
      );
    }

    const plan = await PlanSuscripcion.findByPk(plan_actual_id, {
      transaction: t,
    });
    if (!plan) {
      await t.rollback();
      return ResponseHandler.sendValidationError(
        res,
        "El plan seleccionado no existe",
      );
    }

    const empresa = await EmpresaModelo.create(
      {
        usuario_id: usuario_id ?? null,
        rubro_id,
        plan_actual_id,
        nombre_empresa: nombre_empresa?.trim(),
        nombre_comercial: nombre_comercial?.trim(),
        ruc: ruc ?? null,
        direccion: direccion ?? null,
        telefono: telefono ?? null,
        email: email?.toLowerCase() ?? null,
        logo_url: logo_url ?? null,
        moneda_base: moneda_base ?? "PEN",
        activo: true,
      },
      { transaction: t },
    );

    const ahora = new Date();
    const finTrial = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

    await SuscripcionEmpresaModelo.create(
    {
        empresa_id: empresa.id,
        plan_id: plan_actual_id,
        estado: "trial",
        es_trial: true,
        fecha_inicio: ahora.toISOString().split("T")[0],
        fecha_fin_trial: finTrial.toISOString().split("T")[0],
        fecha_fin: null, 
        fecha_proximo_pago: null, 
        metodo_pago: null,
        ciclo_facturacion: "mensual",
    },
    { transaction: t },
    );

    await t.commit();

    ResponseHandler.sendSuccess(
      res,
      "Empresa creada correctamente",
      {
        empresa,
        suscripcion: {
          estado: "trial",
          dias_restantes: 30,
          fecha_fin_trial: finTrial.toISOString().split("T")[0],
          plan: plan.nombre,
        },
      },
      201,
    );
  } catch (err) {
    console.log("Error : ",err);
    
    await t.rollback();
    ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
  }
};


exports.updateEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) return ResponseHandler.sendNotFound(res, "No existe esa empresa");
        await empresa.update(req.body);
        ResponseHandler.sendSuccess(res, "Empresa actualizada correctamente", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) return ResponseHandler.sendNotFound(res, "No existe esa empresa"); 
        await empresa.destroy();
        ResponseHandler.sendSuccess(res, "Se eliminó correctamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.validateRucEmpresa = async (req, res) => {
    try {
        const { ruc } = req.params;
        const empresa = await EmpresaModelo.findOne({
            where: {
                ruc
            }
        });

        ResponseHandler.sendSuccess(res, "Empresa encontrada",empresa )
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}
