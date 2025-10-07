const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const Proveedor = require('../../models/inventario/proveedor');

exports.getAllProvedoresByIdEmpresa=async(req, res)=>{
    try {
        const {activo} = req.query;
        let whereClause = { empresa_id : req.params.id };
        if (activo) {
            whereClause.activo = activo === 'true';
        }
        const proveedores = await Proveedor.findAll({
            where : whereClause,
            order : [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Proveedores por empresa",{
            data : proveedores,
            count : proveedores.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProveedorByRuc=async(req, res)=>{
    try {
        const {empresa_id} = req.query;

        let whereClause ={ruc : req.params.ruc}
        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        const proveedor = await Proveedor.findOne({
            where : whereClause
        });

        if (!proveedor) {
            return ResponseHandler.sendNotFound(res, "No se encontro el proveedor");
        }

        ResponseHandler.sendSuccess(res, "Proveedor encontrado", proveedor);
      
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getProveedorById=async(req, res)=>{
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return ResponseHandler.sendNotFound(res, "No existe ese proveedor");
        }

        ResponseHandler.sendSuccess(res, "Proveedor encontrado",proveedor);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createProveedor = async (req, res) => {
    try {
        const { ruc, empresa_id } = req.body;

        if (!ruc || !empresa_id || !req.body.nombre) {
            return ResponseHandler.sendValidationError(res, "RUC, empresa_id y nombre son requeridos");
        }

        const proveedorExistente = await Proveedor.findOne({
            where: {
                ruc: ruc,
                empresa_id: empresa_id
            }
        });

        if (proveedorExistente) {
            return ResponseHandler.sendValidationError(res, "Ya existe un proveedor con este RUC en la empresa");
        }

        const nuevoProveedor = await Proveedor.create(req.body);
        ResponseHandler.sendCreated(res, "Proveedor creado exitosamente", nuevoProveedor);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.actualizarProveedor=async(req, res)=>{
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return ResponseHandler.sendNotFound(res, "Proveedor no encontrado");
        }

        if (req.body.ruc && req.body.ruc !== proveedor.ruc) {
            const proveedorConRuc = await Proveedor.findOne({
                where: {
                    ruc: req.body.ruc,
                    empresa_id: proveedor.empresa_id,
                    id: { [Op.ne]: proveedor.id }
                }
            });

            if (proveedorConRuc) {
                return ResponseHandler.sendConflict(res, "Ya existe otro proveedor con este RUC en la empresa");
            }
        }

        await proveedor.update(req.body);
        ResponseHandler.sendSuccess(res, "Proveedor actualizado exitosamente", proveedor);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return ResponseHandler.sendNotFound(res, "Proveedor no encontrado");
        }

        await proveedor.destroy();
        ResponseHandler.sendSuccess(res, "Proveedor eliminado exitosamente");

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.toggleEstadoProveedor = async (req, res) => {
    try {
        const { activo } = req.body;
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return ResponseHandler.sendNotFound(res, "Proveedor no encontrado");
        }

        await proveedor.update({ activo });

        const mensaje = activo ? "Proveedor activado exitosamente" : "Proveedor desactivado exitosamente";
        ResponseHandler.sendSuccess(res, mensaje, proveedor);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.searchProveedores=async(req, res)=>{
    try {
        const { termino } = req.params;
        const { empresa_id } = req.query;

        let whereClause = {
            [Op.or]: [
                { nombre: { [Op.like]: `%${termino}%` } },
                { ruc: { [Op.like]: `%${termino}%` } },
                { email: { [Op.like]: `%${termino}%` } }
            ]
        };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        const proveedores = await Proveedor.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Búsqueda de proveedores completada", {
            data: proveedores,
            count: proveedores.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProveedoresActivos=async(req, res)=>{
    try {
        const { empresa_id } = req.query;

        let whereClause = { activo: true };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        const proveedores = await Proveedor.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Proveedores activos obtenidos exitosamente", {
            data: proveedores,
            count: proveedores.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

