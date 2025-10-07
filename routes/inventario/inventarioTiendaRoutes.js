const InventarioTiendaController = require('../../controllers/inventario/inventarioTiendaController');
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', InventarioTiendaController.getAllInventarios);
router.get('/:id', InventarioTiendaController.getInventarioById);
router.get('/tienda/:id', InventarioTiendaController.getIventarioByIdTienda);
router.get('/producto/:id', InventarioTiendaController.getInventariosByIdProducto);
router.get('/producto-tienda/:producto_id/:tienda_id', InventarioTiendaController.getInventarioByProductoTienda);

router.post('/', InventarioTiendaController.createInventario);

router.put('/', InventarioTiendaController.updateInventario);
router.put('/stock', InventarioTiendaController.actualizarStock);

module.exports = router;