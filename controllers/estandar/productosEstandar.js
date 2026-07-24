const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const { ProductoEstandar, CategoriaEstandar, MarcaEstandar, PresentacionEstandar, ProductoVarianteEstandar, Producto, InventarioTienda } = require('../../models/index');
const { generateSKU }=require('../../lib/generateSKU');
exports.getAllProductosEstandar = async (req, res) => {
    try {        
        const productos = await ProductoEstandar.findAll({  
            where: { activo: 1 },
                include: [                           
                {
                    model: CategoriaEstandar,
                    as: 'categoria',
                    attributes: ['id', 'nombre']
                },
                {
                    model: MarcaEstandar,
                    as: 'marca',
                    attributes: ['id', 'nombre']
                },
                {
                    model: PresentacionEstandar,
                    as: 'presentacion',
                    attributes: ['id', 'nombre', 'abreviatura']
                }
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
                { model: CategoriaEstandar, as: 'categoria', attributes: ['id', 'nombre'] },
                { model: MarcaEstandar, as: 'marca', attributes: ['id', 'nombre'] },
                { model: PresentacionEstandar, as: 'presentacion', attributes: ['id', 'nombre', 'abreviatura'] },
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
                { model: CategoriaEstandar, as: 'categoria',  attributes: ['id', 'nombre', 'categoria_padre_id'] },
                { model: MarcaEstandar, as: 'marca', attributes: ['id', 'nombre'] },
                { model: PresentacionEstandar, as: 'presentacion',attributes: ['id', 'nombre', 'abreviatura'] },
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

/**
 * POST /api/estandar/importar-empresa
 * Copia productos del catálogo estándar a la tabla productos de la empresa autenticada.
 *
 * Body:
 *   producto_ids  {number[]}  IDs de productos_estandar a importar (requerido)
 *   categoria_id  {number}    Categoría propia de la empresa a asignar (requerido)
 *   precio_venta  {number}    Precio de venta por defecto para todos (requerido)
 *   precio_compra {number}    Precio de compra por defecto (opcional)
 *   aplica_igv    {boolean}   Si aplica IGV (opcional, default false)
 *   tienda_id     {number}    Si se envía, crea registro en inventario_tienda con stock 0 (opcional)
 *   overrides     {Array}     Precio por producto individual: [{ producto_estandar_id, precio_venta, precio_compra }]
 */
exports.importarAEmpresa = async (req, res) => {
    try {
        const { producto_ids, categoria_id, precio_venta, precio_compra, aplica_igv, tienda_id, overrides } = req.body;
        const empresa_id = req.user.empresa_id;
        console.log("EMPRESA ID : "+empresa_id);
        
        if (!empresa_id) {
            return ResponseHandler.sendForbidden(res, "No se pudo determinar la empresa del usuario autenticado");
        }
        if (!Array.isArray(producto_ids) || producto_ids.length === 0) {
            return ResponseHandler.sendValidationError(res, "producto_ids debe ser un array no vacío");
        }
        if (!categoria_id) {
            return ResponseHandler.sendValidationError(res, "categoria_id es requerido");
        }
        if (precio_venta === undefined || precio_venta === null) {
            return ResponseHandler.sendValidationError(res, "precio_venta es requerido");
        }

        const overridesMap = {};
        if (Array.isArray(overrides)) {
            overrides.forEach(o => { overridesMap[o.producto_estandar_id] = o; });
        }

        const productosEstandar = await ProductoEstandar.findAll({
            where: { id: { [Op.in]: producto_ids }, activo: true }
        });

        if (!productosEstandar.length) {
            return ResponseHandler.sendNotFound(res, "No se encontraron productos estándar activos con los IDs proporcionados");
        }

        const importados = [];
        const omitidos = [];

        for (const estandar of productosEstandar) {
            try {
                if (estandar.codigo_barras) {
                    const existente = await Producto.findOne({
                        where: { codigo_barras: estandar.codigo_barras, empresa_id }
                    });
                    if (existente) {
                        omitidos.push({
                            producto_estandar_id: estandar.id,
                            nombre: estandar.nombre,
                            razon: `Ya existe un producto con código de barras ${estandar.codigo_barras}`
                        });
                        continue;
                    }
                }
                const codigoSKU = generateSKU(estandar.nombre, estandar.rubro_id, estandar.categoria_id);
                const override = overridesMap[estandar.id] || {};
                const objToUpload= {
                    empresa_id,
                    categoria_id,
                    nombre: estandar.nombre,
                    descripcion: estandar.descripcion || null,
                    precio_venta: override.precio_venta ?? precio_venta,
                    precio_compra: override.precio_compra ?? precio_compra ?? null,
                    unidad_medida: estandar.unidad_medida || 'UNIDAD',
                    imagen_url: estandar.imagen_url || null,
                    codigo : codigoSKU,
                    codigo_barras: estandar.codigo_barras || null,
                    aplica_igv: aplica_igv ?? false,
                    activo: true
                }
                const nuevoProducto = await Producto.create(objToUpload);

                if (tienda_id) {
                    await InventarioTienda.create({
                        producto_id: nuevoProducto.id,
                        tienda_id,
                        stock_disponible: 0,
                        stock_minimo: 0
                    });
                }

                importados.push(nuevoProducto);
            } catch (itemErr) {
                omitidos.push({
                    producto_estandar_id: estandar.id,
                    nombre: estandar.nombre,
                    razon: itemErr.message || "Error al crear el producto"
                });
            }
        }

        ResponseHandler.sendSuccess(res, "Importación completada", {
            total_importados: importados.length,
            total_omitidos: omitidos.length,
            importados,
            omitidos
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

