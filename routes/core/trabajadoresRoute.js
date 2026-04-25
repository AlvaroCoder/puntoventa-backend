const router = require('express').Router();
const trabajadoresController = require('../../controllers/core/trabajadorController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

router.use(authMiddleware);

// Lectura — todos los autenticados
router.get('/', trabajadoresController.getAllTrabajadores);
router.get('/buscar/:termino', trabajadoresController.searchTrabajadores);
router.get('/empresa/:empresaId', trabajadoresController.getTrabajadorByEmpresa);
router.get('/empresa/:empresaId/cuota', trabajadoresController.getCuotaTrabajadores);
router.get('/tienda/:tiendaId', trabajadoresController.getTrabajadoresByIdTienda);
router.get('/verificar-documento/:documento', trabajadoresController.verificarDocumentoTrabajador);
router.get('/:id', trabajadoresController.getTrabajadorById);

// Escritura — solo Supervisor (nivel 4) o Dueño
router.post('/', roleMiddleware(4), trabajadoresController.createTrabajador);
router.put('/:id', roleMiddleware(4), trabajadoresController.updateTrabajador);
router.patch('/:id/estado', roleMiddleware(4), trabajadoresController.toggleEstadoTrabajador);
router.patch('/:id/salario', roleMiddleware(4), trabajadoresController.actualizarSalarioTrabajador);
router.delete('/:id', roleMiddleware(4), trabajadoresController.deleteTrabajador);

module.exports = router;
