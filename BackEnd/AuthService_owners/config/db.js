const mysql = require('mysql2/promise'); // 🔹 Usamos mysql2 con soporte para Promises

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'AuthServices',
    waitForConnections: true,
    connectionLimit: 10, // 🔹 Manejo eficiente de conexiones
    queueLimit: 0
});

// Probar conexión
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Conectado a la base de datos como ID:', connection.threadId);
        connection.release(); // 🔹 Liberamos la conexión
    } catch (error) {
        console.error('❌ Error de conexión a la BD:', error.message);
    }
})();

module.exports = db;
