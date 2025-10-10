const router = require('express').Router();
const CreditoController = require('../../controllers/ventas/creditoClienteController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/venta/:id', CreditoController.getCreditoClienteByVentaId);
router.get('/cliente/:id', CreditoController.getCreditoClienteByClienteId);
router.get('/:id', CreditoController.getCreditoClienteById);
router.get('/estado/:estado', CreditoController.getCreditosByEstado);
router.get('/vencidos', CreditoController.getCreditosVencidos);
router.get('/resumen', CreditoController.getResumenCreditos);

router.put('/:id', CreditoController.updateCreditoCliente);
router.put('/estado/:id', CreditoController.actualizarEstadoCredito);
router.put('/saldo/:id', CreditoController.actualizarSaldoPendiente)

router.post('/', CreditoController.createCreditoCliente);

router.delete('/:id', CreditoController.deleteCreditoCliente);

module.exports = router;