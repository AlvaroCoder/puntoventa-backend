const router = require('express').Router();
const registroAsistenciaController = require('../../controllers/core/registroAsistencia');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', registroAsistenciaController.getAllRegistrosAsistencia);
router.get('/trabajador/:idTrabajador', registroAsistenciaController.getRegistroByIdTrabajador);
router.get('/tienda/:tiendaId', registroAsistenciaController.getRegistroByIdTienda);
router.get('/:id', registroAsistenciaController.getRegistroAsistenciaById);

router.post('/entrada', registroAsistenciaController.registrarEntrada);
router.post('/salida', registroAsistenciaController.registrarSalida);

router.post('/', registroAsistenciaController.createRegistroAsistencia);
router.put('/:id', registroAsistenciaController.updateRegistroAsistencia);

module.exports = router;
