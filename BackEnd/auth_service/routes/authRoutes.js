const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');

// Configuration of CORS
router.use(cors()); // This will allow requests from any source

// Path to generate a token
router.post('/login', authController.login);

// Path to verify a token
router.post('/validate', authController.validate);

module.exports = router;
