const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Ruta para obtener todos los clientes
router.get('/', clientesController.getAllClientes);
// Ruta para crear un cliente
router.post('/', clientesController.createCliente);
// Ruta de eliminar un cliente
router.delete('/',clientesController.deleteCliente);
// Ruta de actualizar un cliente
router.put('/',clientesController.updateCliente);

module.exports = router;