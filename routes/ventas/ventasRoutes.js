const routes = require('express').Router();
const VentaController = require('../../controllers/ventas/ventaController');
const authMiddleware = require('../../middlewares/authMiddleware');

routes.use(authMiddleware);

routes.get('/:id', VentaController.getVentaById);
routes.get('/', VentaController.getVentasFiltradas);
routes.get('/cliente/:id', VentaController.getVentasByClienteId);
routes.get('/fechas', VentaController.getVentasByFechaRange);
routes.get('/estado/:estado' , VentaController.getVentasByEstado);

routes.post('/', VentaController.createVenta);

routes.put('/:id', VentaController.updateVenta);

routes.delete('/:id', VentaController.deleteVenta);

module.exports = routes;