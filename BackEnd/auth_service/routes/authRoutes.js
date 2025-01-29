const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para generar un token
router.post('/login', authController.login);

// Ruta para verificar un token
router.post('/validate', authController.validate);

module.exports = router;
