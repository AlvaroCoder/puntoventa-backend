const { Op } = require('sequelize');
const {CategoriaProducto} = require('../../models/index');
const ResponseHandler = require('../../lib/responseHanlder');

exports.getAllCategorias=async(req, res)=>{
    try {
        const { empresa_id, activa, nombre } = req.query;
        let whereClause = {};

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        if (activa!==undefined) { 
            whereClause.activa = activa === 'true' ;
        }

        if (nombre) {
            whereClause.nombre = { [Op.like]: `%${nombre}%` };
        }

        const categorias = await CategoriaProducto.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Categorías obtenidas exitosamente", {
            data: categorias,
            count: categorias.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err ));
    }
}

exports.getCategoriaById= async (req, res)=>{
    try {
        const categoria = await CategoriaProducto.findByPk(req.params.id);

        if (!categoria) {
            return ResponseHandler.sendNotFound(res, "No se encontro la categoria");
        }

        ResponseHandler.sendSuccess(res, "Categoría obtenida exitosamente", categoria);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.createCategoria= async (req, res)=>{
    try {
        const categoria = await CategoriaProducto.create(req.body);
        ResponseHandler.sendSuccess(res, "Categoria creada exitosamente", categoria);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateCategoria=async(req, res)=>{
    try {
        const categoria = await CategoriaProducto.findByPk(req.params.id);

        if (!categoria) {
            return ResponseHandler.sendNotFound(res, "No se encuentra la categoria");
        }

        await categoria.update(req.body);

        ResponseHandler.sendSuccess(res, "Categoria actualizada correctamente", categoria);
   
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteCategoria=async(req, res)=>{
    try {
        const categoria = await CategoriaProducto.findByPk(req.params.id);
        
        if (!categoria) {
            return ResponseHandler.sendNotFound(res, 'Categoría no encontrada');
        }

        await categoria.destroy();
        ResponseHandler.sendSuccess(res, "Categoria eliminada correctamente");

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.toggleEstadoCategoria=async(req, res)=>{
    try {
        const { activa } = req.body;
        const categoria = await CategoriaProducto.findByPk(req.params.id);

        if (!categoria) {
            return ResponseHandler.sendNotFound(res, 'Categoría no encontrada');
        };

        await categoria.update({ activa });

        const mensaje = activa ? "Categoría activada exitosamente" : "Categoría desactivada exitosamente";
        ResponseHandler.sendSuccess(res, mensaje, categoria);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getCategoriasByIdEmpresa=async(req, res)=>{
    try {
        const { activa } = req.query;

        let whereClause = { empresa_id : req.params.id };

        if (activa !== undefined) {
            whereClause.activa = activa === 'true';
        }

        const categorias = await CategoriaProducto.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Categorias de la empresa obtenida",{
            data : categorias,
            count : categorias.length
        })
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.verificarCodigoCategoria=async(req, res)=>{
    try {
        const { codigo } = req.params;
        const { empresa_id, exclude_id } = req.query;

        let whereClause = { codigo : codigo.toUpperCase() };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        if (exclude_id) {
            whereClause.id = { [Op.ne] : exclude_id };
        }

        const categoriaExistente = await CategoriaProducto.findOne({ where: whereClause });

        ResponseHandler.send(res, "Verificación completa", {
            disponible : !categoriaExistente,
            codigo : codigo.toUpperCase()
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

