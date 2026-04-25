const router = require('express').Router();
const rubroController = require('../../controllers/core/rubroController');

router.get('/', rubroController.obtenerRubros);
router.get('/rubro/:id', rubroController.obtenerRubroPorId);
router.post('/', rubroController.crearRubro);
router.put('/:id', rubroController.actualizarRubro);
router.delete('/eliminar/:id', rubroController.eliminarRubro);

module.exports = router;