const express = require('express');
const router = express.Router();
const usuarioContoller = require('../controllers/usuarioController');

router.post('/signup', usuarioContoller.createUsuario);

router.post('/login', usuarioContoller.loginUsuario);

module.exports = router;