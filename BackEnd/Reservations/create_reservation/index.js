const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const amqp = require("amqplib");

dotenv.config();
const app = express();
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("❌ Error conectando a MySQL:", err);
    } else {
        console.log("✅ Conectado a MySQL");
    }
});

// Configuración de CORS
app.use(cors());

// Función para enviar la reservación a RabbitMQ
async function sendToQueue(reservationData) {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
        const channel = await connection.createChannel();
        const queue = "reservationQueue";

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(reservationData)));

        console.log(`[✔] Reservación creada y enviada a RabbitMQ: ${JSON.stringify(reservationData)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error("❌ Error enviando mensaje a RabbitMQ:", error);
    }
}

// Ruta para crear una reservación
app.post("/creservations", async (req, res) => {
    const { student_name, owner_name, reservation_date, status } = req.body;

    if (!student_name || !owner_name || !reservation_date) {
        return res.status(400).send("❌ Faltan campos requeridos");
    }

    try {
        // 🔍 Obtener el student_id basado en student_name
        const studentQuery = `SELECT id FROM StudentService.Students WHERE username = ? LIMIT 1`;
        const [studentRows] = await db.promise().query(studentQuery, [student_name]);

        if (studentRows.length === 0) {
            return res.status(404).send("❌ Estudiante no encontrado");
        }
        const student_id = studentRows[0].id;

        // 🔍 Obtener el property_id basado en owner_name
        const propertyQuery = `SELECT id FROM PropertyServices.Properties WHERE usernameOwner = ? LIMIT 1`;
        const [propertyRows] = await db.promise().query(propertyQuery, [owner_name]);

        if (propertyRows.length === 0) {
            return res.status(404).send("❌ Propiedad no encontrada para este propietario");
        }
        const property_id = propertyRows[0].id;

        // 📌 Insertar la reservación en la base de datos
        const insertQuery = `INSERT INTO reservations (student_id, property_id, reservation_date, status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.promise().query(insertQuery, [student_id, property_id, reservation_date, status || "pending"]);

        const reservationData = {
            id: result.insertId,
            student_id,
            property_id,
            reservation_date,
            status: status || "pending",
        };

        // 🚀 Enviar mensaje a RabbitMQ
        await sendToQueue(reservationData);

        res.status(201).send("✅ Reservación creada y enviada a RabbitMQ");

    } catch (err) {
        console.error("❌ Error creando la reservación:", err);
        res.status(500).send("Error en el servidor");
    }
});


// Iniciar el servidor
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
