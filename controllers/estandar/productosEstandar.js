const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const { ProductoEstandar, CategoriaEstandar, MarcaEstandar,
        PresentacionEstandar, ProductoVarianteEstandar } = require('../../models/index');

exports.getAllProductosEstandar = async (req, res) => {
    try {
        const productos = await ProductoEstandar.findAll({
            where: { activo: 1 }, 
            include: [
                { model: CategoriaEstandar,  as: 'categoria',   attributes: ['id', 'nombre', 'codigo'] },
                { model: MarcaEstandar,       as: 'marca',        attributes: ['id', 'nombre'] },
                { model: PresentacionEstandar,as: 'presentacion', attributes: ['id', 'nombre', 'abreviatura'] }
            ],
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Productos encontrados", {
            data: productos,
            count: productos.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProductoEstandarById = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await ProductoEstandar.findByPk(id, {  
            include: [
                { model: CategoriaEstandar,       as: 'categoria',   attributes: ['id', 'nombre'] },
                { model: MarcaEstandar,            as: 'marca',        attributes: ['id', 'nombre'] },
                { model: PresentacionEstandar,     as: 'presentacion', attributes: ['id', 'nombre', 'abreviatura'] },
                { model: ProductoVarianteEstandar, as: 'variantes',    where: { activo: 1 }, required: false }
            ]
        });

        if (!producto) {
            return ResponseHandler.sendNotFound(res, `Producto con ID ${id} no encontrado`);
        }

        ResponseHandler.sendSuccess(res, "Producto encontrado", { data: producto });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProductosByRubro = async (req, res) => {
    try {
        const { rubroId } = req.params;

        const productos = await ProductoEstandar.findAll({
            where: {
                rubro_id: rubroId,
                activo: 1
            },
            include: [
                { model: CategoriaEstandar,       as: 'categoria',  attributes: ['id', 'nombre', 'categoria_padre_id'] },
                { model: MarcaEstandar,            as: 'marca',       attributes: ['id', 'nombre'] },
                { model: PresentacionEstandar,     as: 'presentacion',attributes: ['id', 'nombre', 'abreviatura'] },
                { model: ProductoVarianteEstandar, as: 'variantes',   where: { activo: 1 }, required: false }
            ],
            order: [
                [{ model: CategoriaEstandar, as: 'categoria' }, 'nombre', 'ASC'],
                ['nombre', 'ASC']
            ]
        });

        if (!productos.length) {
            return ResponseHandler.sendNotFound(res, `No hay productos para el rubro ID ${rubroId}`);
        }

        ResponseHandler.sendSuccess(res, "Productos del rubro encontrados", {
            data: productos,
            count: productos.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getProductosByCategoria = async (req, res) => {
    try {
        const { categoriaId } = req.params;

        const productos = await ProductoEstandar.findAll({
            where: {
                categoria_id: categoriaId,
                activo: 1
            },
            include: [
                { model: MarcaEstandar,            as: 'marca',      attributes: ['id', 'nombre'] },
                { model: ProductoVarianteEstandar, as: 'variantes',  where: { activo: 1 }, required: false }
            ],
            order: [['nombre', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Productos de la categoría encontrados", {
            data: productos,
            count: productos.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createProductoEstandar = async (req, res) => {
    try {
        const {
            rubro_id, categoria_id, marca_id, presentacion_id,
            nombre, descripcion, unidad_medida, caracteristicas,
            codigo_barras
        } = req.body;

        if (!rubro_id || !categoria_id || !presentacion_id || !nombre) {
            return ResponseHandler.sendBadRequest(res, "rubro_id, categoria_id, presentacion_id y nombre son obligatorios");
        }

        const nuevoProducto = await ProductoEstandar.create({
            rubro_id,
            categoria_id,
            marca_id: marca_id || null,
            presentacion_id,
            nombre,
            descripcion,
            unidad_medida: unidad_medida || 'UND',
            caracteristicas,
            codigo_barras: codigo_barras || null,
            activo: 1
        });

        ResponseHandler.sendCreated(res, "Producto estándar creado correctamente", {
            data: nuevoProducto
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateProductoEstandar = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await ProductoEstandar.findByPk(id);
        if (!producto) {
            return ResponseHandler.sendNotFound(res, `Producto con ID ${id} no encontrado`);
        }

        await producto.update(req.body);

        ResponseHandler.sendSuccess(res, "Producto actualizado correctamente", {
            data: producto
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deactivateProductoEstandar = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await ProductoEstandar.findByPk(id);
        if (!producto) {
            return ResponseHandler.sendNotFound(res, `Producto con ID ${id} no encontrado`);
        }

        await producto.update({ activo: 0 });

        ResponseHandler.sendSuccess(res, "Producto desactivado del catálogo correctamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};