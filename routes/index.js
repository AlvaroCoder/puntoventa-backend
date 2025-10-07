const router = require('express').Router();

router.use('/usuarios', require('./core/usuarioRoutes'));
router.use('/empresas', require('./core/empresaRoute'));
router.use('/registro-asistencia', require('./core/registroAsistenciaRoute'));
router.use('/tienda', require('./core/tiendaRoutes'));
router.use('/trabajador', require('./core/trabajadoresRoute'));
router.use('/rol', require('./core/rolRoute'));
router.use('/producto', require('./inventario/productRoutes'));


module.exports = router;