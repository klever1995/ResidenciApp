const amqp = require("amqplib");

async function sendTestMessage() {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
        const channel = await connection.createChannel();
        const queue = "reservationQueue";

        await channel.assertQueue(queue, { durable: true });

        const testMessage = { student_id: 1, property_id: 10, reservation_date: "2025-02-16", status: "pending" };
        console.log(`[📤] Enviando mensaje de prueba a RabbitMQ:`, testMessage);

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(testMessage)), { persistent: true });

        setTimeout(() => {
            console.log("✅ Mensaje enviado con éxito");
            connection.close();
        }, 500);
    } catch (error) {
        console.error("❌ Error enviando mensaje a RabbitMQ:", error);
    }
}

sendTestMessage();
