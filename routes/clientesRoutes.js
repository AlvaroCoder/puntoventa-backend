const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { clientMiddleware } = require('../middlewares/clientMiddleware');

router.get('/data-dni',clientesController.getDataSunatCliente);

router.get('/', clientMiddleware, clientesController.getAllClientes);

router.post('/', clientMiddleware, clientesController.createCliente);

router.delete('/', clientMiddleware,clientesController.deleteCliente);

router.put('/', clientMiddleware,clientesController.updateCliente);

router.get("/credit", clientMiddleware, clientesController.getCreditCliente)

module.exports = router;