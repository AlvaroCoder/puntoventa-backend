const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const RolModel = require('../../models/core/rol');

exports.getAllRoles=async(req, res)=>{
    try {
        const { nombre, nivel_min, nivel_max } = req.query;
    
        let whereClause = {};
        
        if (nombre) {
          whereClause.nombre = { [Op.like]: `%${nombre}%` };
        }
        
        if (nivel_min !== undefined || nivel_max !== undefined) {
          whereClause.nivel_permiso = {};
          
            if (nivel_min !== undefined) {
                whereClause.nivel_permiso[Op.gte] = parseInt(nivel_min);
            }
            
            if (nivel_max !== undefined) {
                whereClause.nivel_permiso[Op.lte] = parseInt(nivel_max);
            }
        }

        const roles = await RolModel.findAll({
            where: whereClause,
            order: [['nivel_permiso', 'ASC'], ['nombre', 'ASC']]
        });
          
        ResponseHandler.sendSuccess(res, "Roles obtenidos exitosamente", {
            data: roles,
            count: roles.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getRolById=async(req, res)=>{
    try {
        const rol = await RolModel.findByPk(req.params.id);
        
        if (!rol) {
          return ResponseHandler.sendNotFound(res, 'Rol no encontrado');
        }
        
        ResponseHandler.sendSuccess(res, "Rol obtenido exitosamente", rol);
      } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
      }
}

exports.createRol = async (req, res) => {
    try {
      const rol = await RolModel.create(req.body);
      ResponseHandler.sendCreated(res, "Rol creado exitosamente", rol);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateRol = async (req, res) => {
    try {
      const rol = await RolModel.findByPk(req.params.id);
      
      if (!rol) {
        return ResponseHandler.sendNotFound(res, 'Rol no encontrado');
      }
      
      await rol.update(req.body);
      ResponseHandler.sendSuccess(res, "Rol actualizado exitosamente", rol);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteRol=async(req, res)=>{
    try {
        const rol = await RolModel.findByPk(req.params.id);
    
        if (!rol) {
          return ResponseHandler.sendNotFound(res, 'Rol no encontrado');
        }

        await rol.destroy();
        ResponseHandler.sendSuccess(res, "Rol eliminado exitosamente");

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.searchRoles=async(req,res)=>{
    try {
        const { termino } = req.params;
    
        const roles = await Rol.findAll({
          where: {
            nombre: { [Op.like]: `%${termino}%` }
          },
          order: [['nivel_permiso', 'ASC']]
        });
        
        ResponseHandler.sendSuccess(res, "Búsqueda de roles completada", {
          data: roles,
          count: roles.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handleSequelizeError(err));
    }
}

exports.verificarNombreRol=async(req,res)=>{
    try {
        const { nombre } = req.params;
        const { exclude_id } = req.query;
        
        let whereClause = { nombre: nombre };
        
        if (exclude_id) {
          whereClause.id = { [Op.ne]: exclude_id };
        }
        
        const rolExistente = await RolModel.findOne({ where: whereClause });
        ResponseHandler.sendSuccess(res, "Verificación de nombre completada", {
            disponible: !rolExistente,
            nombre: nombre
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}