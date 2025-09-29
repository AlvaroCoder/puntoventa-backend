const router = require('express').Router();
const trabajadoresController = require('../../controllers/core/trabajadorController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware)

router.get('/', trabajadoresController.getAllTrabajadores);
router.get('/buscar/:termino', trabajadoresController.searchTrabajadores);
router.get('/empresa/:empresaId', trabajadoresController.getTrabajadorByEmpresa);
router.get('/tienda/:tiendaId', trabajadoresController.getTrabajadoresByIdTienda);
router.get('/verificar-documento/:documento', trabajadoresController.verificarDocumentoTrabajador);
router.get('/:id', trabajadoresController.getTrabajadorById);

router.post('/', trabajadoresController.createTrabajador);
router.put('/:id', trabajadoresController.updateTrabajador);
router.patch('/:id/estado', trabajadoresController.toggleEstadoTrabajador);
router.patch('/:id/salario', trabajadoresController.actualizarSalarioTrabajador);
router.delete('/:id', trabajadoresController.deleteTrabajador);

module.exports = router;