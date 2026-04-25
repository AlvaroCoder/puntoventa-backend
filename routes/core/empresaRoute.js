const router = require('express').Router();
const empresaController = require('../../controllers/core/empresaController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

// /mi-empresa debe ir ANTES de /:id para no ser interpretado como parámetro
router.get('/mi-empresa', empresaController.getMiEmpresa);

router.get('/', empresaController.getAllEmpresas);
router.get('/:id', empresaController.getEmpresaById);

router.post('/', empresaController.createEmpresa);
router.put('/:id', empresaController.updateEmpresa);
router.delete('/:id', empresaController.deleteEmpresa);

module.exports = router;
