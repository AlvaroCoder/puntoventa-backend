const router = require("express").Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const ordenCompraController = require("../../controllers/logistica/ordenCompraController");

router.get(
  "/ordenes-compra",
  authMiddleware,
  ordenCompraController.getOrdenCompraByUserId,
);
router.get(
  "/ordenes-compra/:id",
  authMiddleware,
  ordenCompraController.getOrdenCompraById,
);

router.post(
  "/ordenes-compra",
  authMiddleware,
  ordenCompraController.createOrdenCompra,
);
router.put(
  "/ordenes-compra/:id",
  authMiddleware,
  ordenCompraController.updateOrdenCompra,
);

module.exports = router;
