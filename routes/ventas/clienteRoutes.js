const router = require('express').Router();
const ClienteController = require('../../controllers/ventas/clienteController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/:id', ClienteController.getClienteById);
router.get('/empresa/:id', ClienteController.getAllClientesByIdEmpresa);
router.get('/documento', ClienteController.getClienteByNumeroDocumento);
router.get('/validacion', ClienteController.validacionCliente);
router.get('/categoria/:categoria', ClienteController.getClientesByCategoria);
router.get('/verificar-documento', ClienteController.verificarDocumentoCliente);

router.post('/', ClienteController.createCliente);

router.put('/:id', ClienteController.updateCliente);

router.delete('/:id', ClienteController.deleteCliente);

module.exports = router;