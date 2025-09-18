const express = require('express');
const router = express.Router();
const workersController = require('../controllers/workersController');

router.get('/', workersController.getAllWorkersByIdUsuario);

router.get("/id", workersController.getWorkerDataById);

router.get("/estado", workersController.getWorkerByEstado);3

router.post('/', workersController.createWorker);

router.delete('/', workersController.deleteWorker);

router.put('/', workersController.updateWorker);

module.exports = router;