const EmpresaModelo = require('../../models/core/empresa');
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
        if (!empresa) return ResponseHandler.sendNotFound(res, "Empresa no encontrada"); // FIX BUG-06
        ResponseHandler.sendSuccess(res, "Empresa encontrada", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

// Obtiene la empresa del usuario autenticado (dueño)
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
    try {
        const empresa = await EmpresaModelo.create(req.body);
        ResponseHandler.sendSuccess(res, "Empresa creada correctamente", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) return ResponseHandler.sendNotFound(res, "No existe esa empresa"); // FIX BUG-06
        await empresa.update(req.body);
        ResponseHandler.sendSuccess(res, "Empresa actualizada correctamente", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) return ResponseHandler.sendNotFound(res, "No existe esa empresa"); // FIX BUG-06
        await empresa.destroy();
        ResponseHandler.sendSuccess(res, "Se eliminó correctamente"); // FIX BUG-06: res como primer arg
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};
