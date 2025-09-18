const express = require('express');
const router = express.Router();
const tiendaController = require('../controllers/tiendaController');
const {clientMiddleware} = require('../middlewares/clientMiddleware');

router.get("/", clientMiddleware, tiendaController.getAllTiendasByIdUsuario);

router.post('/', clientMiddleware, tiendaController.createTienda);

router.put('/', clientMiddleware, tiendaController.updateTienda);

router.delete('/', clientMiddleware, tiendaController.deleteTienda);

module.exports = router;
