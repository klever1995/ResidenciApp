const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');

// Configuración de CORS
router.use(cors()); // Esto permitirá solicitudes desde cualquier origen

// Ruta para generar un token
router.post('/login', authController.login);

// Ruta para verificar un token
router.post('/validate', authController.validate);

module.exports = router;
