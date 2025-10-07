const MovimientoInventarioController = require('../../controllers/inventario/movimientoInvController');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = require('express').Router();

router.use(authMiddleware);

router.get('/:id', MovimientoInventarioController.getMovimientoById);

router.get('/product/:id', MovimientoInventarioController.getAllMovimientosByIdProduct);
router.get('/trabajador/:id', MovimientoInventarioController.getAllMovimientosByIdTrabajador);
router.get('/tienda/:id', MovimientoInventarioController.getAllMovimientosByIdTienda);
router.get('/tipo', MovimientoInventarioController.getAllMovimientosByTipo);
router.get('/tienda/today/:id', MovimientoInventarioController.getAllMovimientosTodayByIdTienda);
router.get('/fechas', MovimientoInventarioController.getMovimientosByRangoFechas);
router.get('/resumen', MovimientoInventarioController.getResumenMovimientos);

router.post('/', MovimientoInventarioController.createMovimiento);

module.exports = router;