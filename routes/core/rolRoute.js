const router = require('express').Router();
const rolController = require('../../controllers/core/rolController');
const adminMiddleware = require('../../middlewares/adminMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', rolController.getAllRoles);
router.get('/buscar/:termino', rolController.searchRoles);
router.get('/verificar-nombre/:nombre', rolController.verificarNombreRol);
router.get('/:id', rolController.getRolById);

router.use(adminMiddleware)

router.post('/', rolController.createRol);
router.put('/:id', rolController.updateRol);
router.delete('/:id', rolController.deleteRol);

module.exports = router;
