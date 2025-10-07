const ProductoController = require('../../controllers/inventario/productoController');
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get("/empresa/:id", ProductoController.getAllProductsByIdEmpresa);
router.get("/categoria", ProductoController.getAllProductsByCategoria);
router.get("/id/:id", ProductoController.getProductoById);
router.get('/buscar/:termino', ProductoController.searchProductos);
router.get('/bajo-stock', ProductoController.getProductosBajoStock);
router.get('/verificar-codigo/:codigo', ProductoController.verificarCodigoProducto);

router.post("/", ProductoController.createProducto);
router.post("/:id/estado", ProductoController.toggleEstadoProducto)

router.put("/",ProductoController.updateProducto);
router.put("/stock", ProductoController.actualizarStock);
router.put('/precio', ProductoController.actualizarPrecio);

router.delete("/", ProductoController.deleteProducto);

module.exports = router;