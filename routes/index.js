const router = require('express').Router();

router.use('/usuarios', require('./core/usuarioRoutes'));
router.use('/empresas', require('./core/empresaRoute'));
router.use('/registro-asistencia', require('./core/registroAsistenciaRoute'));
router.use('/tienda', require('./core/tiendaRoutes'));
router.use('/trabajador', require('./core/trabajadoresRoute'));
router.use('/rol', require('./core/rolRoute'));
router.use('/producto', require('./inventario/productRoutes'));
router.use('/movimiento', require('./inventario/movimientoInvRoutes'));
router.use('/categoria', require('./inventario/categoriaProductosRoutes'));
router.use('/inventario', require('./inventario/inventarioTiendaRoutes'));
router.use("/proveedor", require('./inventario/proveedorRoutes'));
router.use('/ventas', require('./ventas/ventasRoutes'));
router.use('/creditos', require('./ventas/creditosRoutes'))
router.use('/cliente', require('./ventas/clienteRoutes'));
router.use('/venta-detalles', require('./ventas/ventaDetallesRoutes'));

module.exports = router;