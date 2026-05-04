const router = require('express').Router();
const ClienteController = require('../../controllers/ventas/clienteController');
const authMiddleware = require('../../middlewares/authMiddleware');
const ResponseHandler = require('../../lib/responseHanlder');

router.use(authMiddleware);

router.get('/empresa/:id', ClienteController.getAllClientesByIdEmpresa);
router.get('/buscar/:termino', ClienteController.searchClientes);
router.get('/categoria/:categoria', ClienteController.getClientesByCategoria);
router.get('/documento', ClienteController.getClienteByNumeroDocumento);
router.get('/validacion', ClienteController.validacionCliente);
router.get('/verificar-documento', ClienteController.verificarDocumentoCliente);

router.get('/:id', ClienteController.getClienteById);

router.post('/importar-excel', (req, res, next) => {
    ClienteController.uploadExcel(req, res, (err) => {
        if (err) return ResponseHandler.sendValidationError(res, err.message);
        next();
    });
}, ClienteController.importarClientesExcel);

router.post('/', ClienteController.createCliente);

router.put('/:id', ClienteController.updateCliente);
router.patch('/:id/categoria', ClienteController.updateCategoriaCliente);

router.delete('/:id', ClienteController.deleteCliente);

module.exports = router;
