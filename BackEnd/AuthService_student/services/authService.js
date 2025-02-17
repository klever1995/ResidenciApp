const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Genera un token con el ID del propietario
const generateToken = (ownerId) => {
    return jwt.sign({ ownerId }, SECRET_KEY, { expiresIn: '1h' });
};

// Crea un nuevo token y lo almacena en la BD
const createToken = async (ownerId) => {
    try {
        const token = generateToken(ownerId);

        // 🔹 Ahora usamos `await db.execute(...)` correctamente
        const query = 'INSERT INTO Tokens_Students (student_id, token) VALUES (?, ?)';
        await db.execute(query, [ownerId, token]);

        console.log('✅ Token creado exitosamente para student_id:', ownerId);

        return { token, owner_id: ownerId }; // 🔹 Retorna también el owner_id

    } catch (err) {
        console.error("❌ Error al crear el token:", err);
        throw new Error("Error en la autenticación");
    }
};

module.exports = { createToken };
