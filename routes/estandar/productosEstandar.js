const express = require('express');
const router = express.Router();
const ProductEstandarController = require('../../controllers/estandar/productosEstandar');

router.get('/', ProductEstandarController.getAllProductosEstandar);
router.get('/:id', ProductEstandarController.getProductoEstandarById);
router.get('/rubro/:rubroId', ProductEstandarController.getProductosByRubro);
router.get('/categoria/:categoriaId', ProductEstandarController.getProductosByCategoria);

router.post('/', ProductEstandarController.createProductoEstandar);
router.put('/:id', ProductEstandarController.updateProductoEstandar);
router.put('/deactivate/:id', ProductEstandarController.deactivateProductoEstandar);

module.exports = router;