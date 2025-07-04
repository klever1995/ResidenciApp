const db = require('../config/db'); // Asegúrate de que la ruta al archivo db.js es correcta
const bcrypt = require('bcrypt');
const authService = require('../services/authService');

const login = async (req, res) => {
    // Depuración: Verifica el cuerpo de la solicitud
    console.log("Cuerpo de la solicitud:", req.body);

    const { email, password } = req.body;

    // Validación de campos
    if (!email || !password) {
        console.error("❌ Error: Email o contraseña no proporcionados");
        return res.status(400).json({ error: "❌ Email y contraseña son requeridos" });
    }

    try {
        console.log(`🔍 Intentando login para: ${email}`);

        // Consulta SQL para buscar el propietario por email
        const [rows] = await db.execute("SELECT * FROM OwnerService.Owners WHERE email = ?", [email]);

        // Verifica si el propietario existe
        if (rows.length === 0) {
            console.warn("❌ Propietario no encontrado");
            return res.status(401).json({ error: "❌ Usuario owner no encontrado" });
        }

        const owner = rows[0];

        // Verifica si la contraseña está definida en la base de datos
        if (!owner.password) {
            console.error("❌ Error: El campo 'password' es NULL en la base de datos.");
            return res.status(500).json({ error: "❌ Error interno del servidor" });
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, owner.password);
        if (!passwordMatch) {
            console.warn("❌ Contraseña incorrecta");
            return res.status(401).json({ error: "❌ Contraseña incorrecta" });
        }

        // Genera un token de autenticación
        const { token, owner_id } = await authService.createToken(owner.id);

        console.log(`✅ Login exitoso - Owner ID: ${owner.id}`);

        // Devuelve el token y el ID del propietario
        res.json({ token, owner_id });

    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
        res.status(500).json({ error: "❌ Error interno del servidor" });
    }
};

const validate = async (req, res) => {
    // Extrae el token del header de autorización
    const token = req.headers.authorization?.split(' ')[1];

    // Verifica si el token fue proporcionado
    if (!token) {
        return res.status(401).json({ error: "❌ Token no proporcionado" });
    }

    try {
        // Verifica el token
        const decoded = await authService.verifyToken(token);
        res.json({ valid: true, owner_id: decoded.owner_id });
    } catch (error) {
        console.error("❌ Token inválido:", error);
        res.status(401).json({ error: "❌ Token inválido" });
    }
};

module.exports = { login, validate };