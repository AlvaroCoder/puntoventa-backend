const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const TrabajadorModel = require('../../models/core/trabajador');

exports.getAllTrabajadores=async()=>{
    try {
        const { empresa_id, tienda_id, activo } = req.query;
    
        let whereClause = {};
        
        if (empresa_id) {
          whereClause.empresa_id = empresa_id;
        }
        
        if (tienda_id) {
          whereClause.tienda_id = tienda_id;
        }
        if (activo !== undefined) {
            whereClause.activo = activo === 'true';
          }
          
          const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            order: [['nombre_completo', 'ASC']]
          });
          
          ResponseHandler.sendSuccess(res, "Trabajadores obtenidos exitosamente", {
            data: trabajadores,
            count: trabajadores.length
          });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getTrabajadorById = async (req, res) => {
    try {
      const trabajador = await TrabajadorModel.findByPk(req.params.id);
      
      if (!trabajador) {
        return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
      }
      
      ResponseHandler.sendSuccess(res, "Trabajador obtenido exitosamente", trabajador);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createTrabajador = async (req, res) => {
    try {
      const trabajador = await TrabajadorModel.create(req.body);
      ResponseHandler.sendCreated(res, "Trabajador creado exitosamente", trabajador);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateTrabajador = async (req, res) => {
    try {
      const trabajador = await TrabajadorModel.findByPk(req.params.id);
      
      if (!trabajador) {
        return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
      }
      
      await trabajador.update(req.body);
      ResponseHandler.sendSuccess(res, "Trabajador actualizado exitosamente", trabajador);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteTrabajador = async (req, res) => {
    try {
      const trabajador = await TrabajadorModel.findByPk(req.params.id);
      
      if (!trabajador) {
        return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
      }
      
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
      
      if (!trabajador) {
        return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
      }
      
      await trabajador.update({ activo });
      
      const mensaje = activo ? "Trabajador activado exitosamente" : "Trabajador desactivado exitosamente";
      ResponseHandler.sendSuccess(res, mensaje, trabajador);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTrabajadorByEmpresa=async(req,res)=>{
    try {
        const { empresaId } = req.params;
        const { activo, tienda_id } = req.query;
        
        let whereClause = { empresa_id: empresaId };
        
        if (activo !== undefined) {
            whereClause.activo = activo === 'true';
          }
          
        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        }

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
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

exports.getTrabajadoresByIdTienda=async(req,res)=>{
    try {
        const { tiendaId } = req.params;
        const { activo } = req.query;
        
        let whereClause = { tienda_id: tiendaId };
        
        if (activo !== undefined) {
          whereClause.activo = activo === 'true';
        }

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            order: [['nombre_completo', 'ASC']]
          });
          
        ResponseHandler.sendSuccess(res,"Trabajadores obtenidos", trabajadores);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.searchTrabajadores=async(req, res)=>{
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

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
          }
          
        if (tienda_id) {
            whereClause.tienda_id = tienda_id;
        }

        const trabajadores = await TrabajadorModel.findAll({
            where: whereClause,
            order: [['nombre_completo', 'ASC']]
          });
          
        ResponseHandler.sendSuccess(res, "Búsqueda de trabajadores completada", {
            data: trabajadores,
            count: trabajadores.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.verificarDocumentoTrabajador=async(req,res)=>{
    try {
        const { documento } = req.params;
        const { exclude_id } = req.query;
        
        let whereClause = { numero_documento: documento };
        
        if (exclude_id) {
          whereClause.id = { [Op.ne]: exclude_id };
        }
        
        const trabajadorExistente = await TrabajadorModel.findOne({ where: whereClause });
        
        ResponseHandler.sendSuccess(res, "Verificación completada", {
          disponible: !trabajadorExistente,
          documento: documento
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.actualizarSalarioTrabajador=async(req,res)=>{
    try {
        const { salario_base } = req.body;
        const trabajador = await TrabajadorModel.findByPk(req.params.id);
        
        if (!trabajador) {
          return ResponseHandler.sendNotFound(res, 'Trabajador no encontrado');
        }
        
        if (salario_base < 0) {
          return ResponseHandler.sendValidationError(res, "El salario base no puede ser negativo");
        }
        await trabajador.update({ salario_base });
        ResponseHandler.sendSuccess(res, "Salario actualizado exitosamente", trabajador);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}
