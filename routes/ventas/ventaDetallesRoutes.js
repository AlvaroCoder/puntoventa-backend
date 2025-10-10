const router = require('express').Router();
const VentaDetalleController = require('../../controllers/ventas/ventaDetallesController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', VentaDetalleController.getAllVentaDetalles);

router.post('/', VentaDetalleController.createVentaDetalle);

router.put('/:id', VentaDetalleController.updateVentaDetalle);

module.exports = router;
