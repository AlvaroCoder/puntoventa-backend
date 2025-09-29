const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/core/usuarioController');
const authMiddleware = require('../../middlewares/authMiddleware');
const adminMiddleware = require('../../middlewares/adminMiddleware');

router.get('/verificar-email/:email', usuarioController.verificarEmail);
router.get('/verificar-documento/:documento', usuarioController.verificarDocumento);

router.use(authMiddleware);

router.get('/me', usuarioController.getUsuarioActual);
router.put('/me', usuarioController.updatePerfil);

router.patch('/:id/cambiar-password', usuarioController.cambiarPassword);
router.patch('/:id/ultimo-login', usuarioController.actualizarUltimoLogin);

router.use(adminMiddleware);

router.get('/', usuarioController.getAllUsuarios);
router.get('/buscar/:termino', usuarioController.searchUsuario);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);
router.patch('/:id/estado', usuarioController.toggleEstadoUsuario);

module.exports = router;
