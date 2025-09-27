const EmpresaModelo = require('../../models/core/empresa');
const ResponseHandler = require('../../lib/responseHanlder');

exports.getAllEmpresas = async(req, res)=>{
    try {
        const empresas = await EmpresaModelo.findAll();
        ResponseHandler.sendSuccess(res,"Empresas recibidas", empresas);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getEmpresaById=async(req, res)=>{
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) {
            ResponseHandler.sendNotFound(res, "Empresa no encontrada")
        }
        ResponseHandler.sendSuccess(res, "Empresa encontrada", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.createEmpresa=async(req,res)=>{
    try {
        const empresa = await EmpresaModelo.create(req.body);
        ResponseHandler.created("Empresa creada correctamente", empresa);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
}

exports.updateEmpresa=async(req, res)=>{
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) {
            ResponseHandler.sendNotFound(res, "No existe esa empresa");
        }
        await empresa.update(req.body);
        ResponseHandler.accepted("Se actualizo correctamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.deleteEmpresa=async(req,res)=>{
    try {
        const empresa = await EmpresaModelo.findByPk(req.params.id);
        if (!empresa) {
            ResponseHandler.sendNotFound(res, "No existe esa empresa");
        }
        await empresa.destroy();
        ResponseHandler.sendSuccess("Se elimino correctamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
}