const router = require('express').Router();
const cajaController = require('../../controllers/core/cajaController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', cajaController.getAllCajas);
router.post('/', roleMiddleware(4), cajaController.createCaja);
router.get('/:id', cajaController.getCajaById);
router.put('/:id', roleMiddleware(4), cajaController.updateCaja);

router.post('/:id/abrir', roleMiddleware(2), cajaController.openCaja);
router.post('/:id/cerrar', roleMiddleware(2), cajaController.closeCaja);
router.get('/:id/sesion', cajaController.getSesionActual);
router.get('/:id/sesiones', cajaController.getSesionesByCaja);

router.post('/:id/movimiento', roleMiddleware(2), cajaController.addMovimiento);
router.get('/:id/movimientos', cajaController.getMovimientos);

module.exports = router;
