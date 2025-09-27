const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const TiendaModel = require('../../models/core/tienda');
exports.getAllTiendas=async(req, res)=>{
    try {
        const { empresa_id, activa } = req.query;
        let whereClause = {};
        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }
        if (activa !== undefined) {
            whereClause.activa = activa === 'true';
        }
        const tiendas = await TiendaModel.findAll({
            where : whereClause,
            order : [['nombre','ASC']]
        });
        ResponseHandler.sendSuccess(res, "Tiendas obtenidas", tiendas);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTiendaById = async (req, res) => {
    try {
      const tienda = await TiendaModel.findByPk(req.params.id);
      
      if (!tienda) {
        return ResponseHandler.sendNotFound(res, 'Tienda no encontrada');
      }
      
      ResponseHandler.sendSuccess(res, "Tienda obtenida exitosamente", tienda);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createTienda = async (req, res) => {
    try {
      const tienda = await TiendaModel.create(req.body);
      ResponseHandler.sendCreated(res, "Tienda creada exitosamente", tienda);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateTienda = async (req, res) => {
    try {
      const tienda = await TiendaModel.findByPk(req.params.id);
      
      if (!tienda) {
        return ResponseHandler.sendNotFound(res, 'Tienda no encontrada');
      }
      
      await tienda.update(req.body);
      ResponseHandler.sendSuccess(res, "Tienda actualizada exitosamente", tienda);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteTienda = async (req, res) => {
  try {
    const tienda = await TiendaModel.findByPk(req.params.id);
    
    if (!tienda) {
      return ResponseHandler.sendNotFound(res, 'Tienda no encontrada');
    }
    
    await tienda.destroy();
    ResponseHandler.sendSuccess(res, "Tienda eliminada exitosamente");
  } catch (err) {
    ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
  }
};

exports.toggleEstadoTienda = async (req, res) => {
    try {
      const { activa } = req.body;
      const tienda = await TiendaModel.findByPk(req.params.id);
      
      if (!tienda) {
        return ResponseHandler.sendNotFound(res, 'Tienda no encontrada');
      }
      
      await tienda.update({ activa });
      
      const mensaje = activa ? "Tienda activada exitosamente" : "Tienda desactivada exitosamente";
      ResponseHandler.sendSuccess(res, mensaje, tienda);
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getTiendasByEmpresa = async (req, res) => {
    try {
      const { empresaId } = req.params;
      const { activa } = req.query;
      
      let whereClause = { empresa_id: empresaId };
      
      if (activa !== undefined) {
        whereClause.activa = activa === 'true';
      }
      
      const tiendas = await TiendaModel.findAll({
        where: whereClause,
        order: [['nombre', 'ASC']]
      });
      
      ResponseHandler.sendSuccess(res, "Tiendas de la empresa obtenidas exitosamente", {
        data: tiendas,
        count: tiendas.length
      });
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.searchTiendas = async (req, res) => {
    try {
      const { termino } = req.params;
      const { empresa_id } = req.query;
      
      let whereClause = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { codigo: { [Op.like]: `%${termino}%` } },
          { responsable: { [Op.like]: `%${termino}%` } }
        ]
      };
      
      if (empresa_id) {
        whereClause.empresa_id = empresa_id;
      }
      
      const tiendas = await TiendaModel.findAll({
        where: whereClause,
        order: [['nombre', 'ASC']]
      });
      
      ResponseHandler.sendSuccess(res, "Búsqueda de tiendas completada", {
        data: tiendas,
        count: tiendas.length
      });
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.verificarCodigoTienda = async (req, res) => {
    try {
      const { codigo } = req.params;
      const { empresa_id, exclude_id } = req.query;
      
      let whereClause = { codigo: codigo.toUpperCase() };
      
      if (empresa_id) {
        whereClause.empresa_id = empresa_id;
      }
      
      if (exclude_id) {
        whereClause.id = { [Op.ne]: exclude_id };
      }
      
      const tiendaExistente = await TiendaModel.findOne({ where: whereClause });
      
      ResponseHandler.sendSuccess(res, "Verificación completada", {
        disponible: !tiendaExistente,
        codigo: codigo.toUpperCase()
      });
    } catch (err) {
      ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};