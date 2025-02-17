require("dotenv").config();
const mysql = require("mysql2/promise");
const amqp = require("amqplib");

const QUEUE = "reservationQueue";

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function startConsumer() {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });

        console.log("[✔] Esperando mensajes de la cola...");

        channel.consume(QUEUE, async (msg) => {
            if (msg !== null) {
                const reservation = JSON.parse(msg.content.toString());
                console.log("[✔] Mensaje recibido:", reservation);

                const conn = await db.getConnection();
                try {
                    await conn.beginTransaction();

                    // Verificar si la reservación existe y está en estado 'pending'
                    const [reservationCheck] = await conn.execute(
                        "SELECT id, status FROM Reservations WHERE student_id = ? AND property_id = ? AND reservation_date = ? FOR UPDATE",
                        [reservation.student_id, reservation.property_id, reservation.reservation_date]
                    );

                    if (reservationCheck.length === 0) {
                        console.log("⚠️ La reservación no existe.");
                        await conn.rollback();
                        channel.ack(msg);
                        return;
                    }

                    if (reservationCheck[0].status !== "pending") {
                        console.log("⚠️ La reservación ya fue confirmada o cancelada.");
                        await conn.rollback();
                        channel.ack(msg);
                        return;
                    }

                    // Marcar la reservación como confirmada
                    await conn.execute(
                        "UPDATE Reservations SET status = 'confirmed' WHERE id = ?",
                        [reservationCheck[0].id]
                    );

                    console.log("[✔] Reservación confirmada");

                    // 🔒 Bloquear la propiedad seleccionada para evitar conflictos
                    const [propertyCheck] = await conn.execute(
                        "SELECT is_available FROM PropertyServices.Properties WHERE id = ? FOR UPDATE",
                        [reservation.property_id]
                    );

                    if (propertyCheck.length === 0) {
                        console.log("⚠️ La propiedad no existe.");
                        await conn.rollback();
                        channel.ack(msg);
                        return;
                    }

                    if (propertyCheck[0].is_available === "no disponible") {
                        console.log("⚠️ La propiedad ya estaba ocupada.");
                        await conn.rollback();
                        channel.ack(msg);
                        return;
                    }

                    console.log("[🛠] Actualizando propiedad con ID:", reservation.property_id);

                    // Marcar la propiedad como 'no disponible'
                    await conn.execute(
                        "UPDATE PropertyServices.Properties SET is_available = 'no disponible' WHERE id = ?",
                        [reservation.property_id]
                    );

                    await conn.commit();
                    console.log("[✔] Propiedad marcada como 'no disponible'.");
                    channel.ack(msg);
                } catch (error) {
                    await conn.rollback();
                    console.error("❌ Error al procesar la reservación:", error);
                } finally {
                    conn.release();
                }
            }
        });
    } catch (error) {
        console.error("❌ Error en el consumidor:", error);
    }
}

startConsumer();
