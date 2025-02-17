const authService = require('../services/authService');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`🔍 Intentando login para: ${email}`);
        const [rows] = await db.execute("SELECT * FROM StudentService.Students WHERE email = ?", [email]);

        if (rows.length === 0) {
            console.warn("❌ Usuario no encontrado");
            return res.status(401).json({ error: "❌ Usuario owner no encontrado" });
        }

        const student = rows[0];

        if (!student.password) {
            console.error("❌ Error: El campo 'password' es NULL en la base de datos.");
            return res.status(500).json({ error: "❌ Error interno del servidor" });
        }

        const passwordMatch = await bcrypt.compare(password, student.password);
        if (!passwordMatch) {
            console.warn("❌ Contraseña incorrecta");
            return res.status(401).json({ error: "❌ Contraseña incorrecta" });
        }

        const { token, student_id } = await authService.createToken(student.id);

        console.log(`✅ Login exitoso - Student ID: ${student.id}`);

        res.json({ token, student_id });

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
        res.json({ valid: true, student_id: decoded.student_id });
    } catch (error) {
        console.error("❌ Token inválido:", error);
        res.status(401).json({ error: "❌ Token inválido" });
    }
};

// ✅ Exporta `login` y `validate`
module.exports = { login, validate };
