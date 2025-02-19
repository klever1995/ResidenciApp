require('dotenv').config(); // Para cargar las variables de entorno desde el archivo .env
const mysql = require('mysql2/promise'); // Usamos mysql2 con soporte para Promises

// Crea la conexión usando las variables de entorno
const db = mysql.createPool({
    host: process.env.DB_HOST, // Utiliza las variables de entorno
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Manejo eficiente de conexiones
    queueLimit: 0
});

// Probar la conexión
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Conectado a la base de datos como ID:', connection.threadId);
        connection.release(); // Liberamos la conexión
    } catch (error) {
        console.error('❌ Error de conexión a la BD:', error.message);
    }
})();

module.exports = db; // Exporta la conexión para usarla en otros archivos
