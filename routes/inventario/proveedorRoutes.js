const ProveedorController = require('../../controllers/inventario/proveedorController');
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get("/:id", ProveedorController.getProveedorById);
router.get("/empresa/:id", ProveedorController.getAllProvedoresByIdEmpresa);
router.get("/proveedor/:ruc", ProveedorController.getProveedorByRuc);
router.get("/search/:termino", ProveedorController.searchProveedores);
router.get("/activos", ProveedorController.getProveedoresActivos);

router.post("/", ProveedorController.createProveedor);
router.post("/estado/:id",ProveedorController.toggleEstadoProveedor);

router.put("/", ProveedorController.actualizarProveedor);

router.delete("/", ProveedorController.deleteProveedor);

module.exports = router;