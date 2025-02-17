const amqp = require("amqplib");
const mysql = require("mysql2/promise");
const redis = require("redis");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Configuración del servidor WebSockets
const app = require("express")();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" },
});

// Redis
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();

// Configuración de MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar a RabbitMQ y consumir mensajes
async function consumeReservations() {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
        const channel = await connection.createChannel();
        const queue = "reservationQueue";

        await channel.assertQueue(queue, { durable: true });

        console.log(`📥 Esperando mensajes en la cola: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const reservationData = JSON.parse(msg.content.toString());
                console.log("📩 Mensaje recibido:", reservationData);

                try {
                    // Guardar la reservación en la base de datos
                    const insertQuery = `
                        INSERT INTO reservations (student_id, property_id, reservation_date, status)
                        VALUES (?, ?, ?, ?)
                    `;
                    await db.execute(insertQuery, [
                        reservationData.student_id,
                        reservationData.property_id,
                        reservationData.reservation_date,
                        reservationData.status || "pending",
                    ]);

                    // Guardar en Redis para acceso rápido
                    await redisClient.set(`reservation:${reservationData.id}`, JSON.stringify(reservationData));

                    console.log("✅ Reservación guardada en MySQL y Redis");

                    // Enviar notificación en tiempo real con WebSockets
                    io.emit("new_reservation", reservationData);
                    console.log("📢 Notificación enviada a WebSockets");

                    // Confirmar que el mensaje fue procesado y eliminarlo de la cola
                    channel.ack(msg);
                } catch (error) {
                    console.error("❌ Error procesando la reservación:", error);
                }
            }
        });
    } catch (error) {
        console.error("❌ Error conectando a RabbitMQ:", error);
    }
}

// Iniciar el servidor WebSockets
server.listen(9010, () => {
    console.log("🚀 WebSockets corriendo en el puerto 9010");
});

// Ejecutar el consumidor
consumeReservations();
