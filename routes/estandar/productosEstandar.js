const express = require('express');
const router = express.Router();
const ProductEstandarController = require('../../controllers/estandar/productosEstandar');

router.get('/', ProductEstandarController.getAllProductosEstandar);

module.exports = router;