const CategoriaProducto = require('../../controllers/inventario/categoriaProductosController');
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', CategoriaProducto.getAllCategorias);
router.get('/:id', CategoriaProducto.getCategoriaById);
router.get('/empresa/:id', CategoriaProducto.getCategoriasByIdEmpresa);
router.get('/verificar/:codigo', CategoriaProducto.verificarCodigoCategoria);

router.post('/', CategoriaProducto.createCategoria);
router.post('/estado/:id', CategoriaProducto.toggleEstadoCategoria);

router.put('/', CategoriaProducto.updateCategoria);    

router.delete('/', CategoriaProducto.deleteCategoria);

module.exports = router;