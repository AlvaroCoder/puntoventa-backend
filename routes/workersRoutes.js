const express = require('express');
const router = express.Router();
const workersController = require('../controllers/workersController');

router.get('/', workersController.getAllWorkers);

router.post('/', workersController.createWorker);

router.delete('/', workersController.deleteWorker);

module.exports = router;