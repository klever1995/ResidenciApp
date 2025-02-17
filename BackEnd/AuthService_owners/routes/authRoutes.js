const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController'); // ✅ Asegura que la ruta sea correcta

console.log("🔍 authController:", authController); // 📌 Depuración

router.use(cors());

// 🔹 Si `authController.login` no está definido, mostramos un error explícito
if (!authController || !authController.login) {
    throw new Error("❌ authController.login está indefinido. Revisa la importación o la exportación en authController.js.");
}

// Rutas
router.post('/login', authController.login);
router.post('/validate', authController.validate);

module.exports = router;
