const express = require('express');
const router = express.Router();
const usuarioContoller = require('../controllers/usuarioController');

// Crear usuario
router.post('/signup', usuarioContoller.createUsuario);
// Iniciar Sesion de usuario
router.post('/login', usuarioContoller.loginUsuario);

module.exports = router;