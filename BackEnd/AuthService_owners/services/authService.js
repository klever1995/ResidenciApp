const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
require('dotenv').config(); // Asegúrate de que dotenv esté cargado

// Función para crear el token
const createToken = async (ownerId) => {
    try {
        const token = jwt.sign(
            { owner_id: ownerId }, // El payload
            process.env.JWT_SECRET, // La clave secreta para firmar el token
            { expiresIn: '1h' } // Opcional, la expiración del token
        );
        return { token, owner_id: ownerId };
    } catch (error) {
        console.error("❌ Error al generar el token:", error);
        throw new Error("Error al generar el token");
    }
};

// Función para verificar el token
const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("❌ Error al verificar el token:", error);
        throw new Error("Token inválido");
    }
};

module.exports = { createToken, verifyToken };
