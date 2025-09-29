const router = require('express').Router();
const tiendaController = require('../../controllers/core/tiendaController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tiendaController.getAllTiendas);
router.get('/buscar/:termino', tiendaController.searchTiendas);
router.get('/empresa/:empresaId', tiendaController.getTiendasByEmpresa);
router.get('/verificar-codigo/:codigo', tiendaController.verificarCodigoTienda);
router.get('/:id', tiendaController.getTiendaById);

router.post('/', tiendaController.createTienda);
router.put('/:id', tiendaController.updateTienda);
router.patch('/:id/estado', tiendaController.toggleEstadoTienda);
router.delete('/:id', tiendaController.deleteTienda);

module.exports=router;
