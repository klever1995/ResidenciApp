const authService = require('../services/authService');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`🔍 Intentando login para: ${email}`);
        const [rows] = await db.execute("SELECT * FROM OwnerService.Owners WHERE email = ?", [email]);

        if (rows.length === 0) {
            console.warn("❌ Usuario no encontrado");
            return res.status(401).json({ error: "❌ Usuario owner no encontrado" });
        }

        const owner = rows[0];

        if (!owner.password) {
            console.error("❌ Error: El campo 'password' es NULL en la base de datos.");
            return res.status(500).json({ error: "❌ Error interno del servidor" });
        }

        const passwordMatch = await bcrypt.compare(password, owner.password);
        if (!passwordMatch) {
            console.warn("❌ Contraseña incorrecta");
            return res.status(401).json({ error: "❌ Contraseña incorrecta" });
        }

        const { token, owner_id } = await authService.createToken(owner.id);

        console.log(`✅ Login exitoso - Owner ID: ${owner.id}`);

        res.json({ token, owner_id });

    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
        res.status(500).json({ error: "❌ Error interno del servidor" });
    }
};

// ✅ Agrega la función `validate`
const validate = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del header

    if (!token) {
        return res.status(401).json({ error: "❌ Token no proporcionado" });
    }

    try {
        const decoded = await authService.verifyToken(token); // Verifica el token
        res.json({ valid: true, owner_id: decoded.owner_id });
    } catch (error) {
        console.error("❌ Token inválido:", error);
        res.status(401).json({ error: "❌ Token inválido" });
    }
};

// ✅ Exporta `login` y `validate`
module.exports = { login, validate };
