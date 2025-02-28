const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { clientMiddleware } = require('../middlewares/clientMiddleware');

router.get('/data-dni',clientesController.getDataSunatCliente);
// Ruta para obtener todos los clientes
router.get('/', clientMiddleware, clientesController.getAllClientes);
// Ruta para crear un cliente
router.post('/', clientMiddleware, clientesController.createCliente);
// Ruta de eliminar un cliente
router.delete('/', clientMiddleware,clientesController.deleteCliente);
// Ruta de actualizar un cliente
router.put('/', clientMiddleware,clientesController.updateCliente);

module.exports = router;