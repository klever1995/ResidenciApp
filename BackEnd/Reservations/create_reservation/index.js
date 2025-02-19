const express = require("express");
const http = require("http"); // Agregar HTTP Server
const socketIo = require("socket.io"); // Importar socket.io
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const redis = require("redis"); // Importar Redis
const axios = require("axios"); // Importar Axios para llamadas HTTP

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

const redisClient = redis.createClient(); // Crear cliente Redis
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();

app.use(express.json());
app.use(cors({
    origin: "*",
}));

// Nueva ruta para WebSockets
app.get("/ws", (req, res) => {
    res.send("WebSocket server is running.");
});

io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado a WebSockets");

    socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado de WebSockets");
    });
});

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Reservaciones",
            version: "1.0.0",
            description: "Documentación de la API de Reservaciones",
        },
        servers: [{ url: "http://localhost:4001" }],
    },
    apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("📜 Swagger documentado en: http://localhost:4001/api-docs");

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

function notifyClients(event, data) {
    io.emit(event, data);
}

app.post("/creservations", async (req, res) => {
    const { student_name, owner_name, reservation_date, status } = req.body;

    if (!student_name || !owner_name || !reservation_date) {
        return res.status(400).send("❌ Faltan campos requeridos");
    }

    try {
        console.log("Buscando estudiante con nombre:", student_name);
        const studentQuery = `SELECT id FROM StudentService.Students WHERE LOWER(username) = LOWER(?) LIMIT 1;`;
        const [studentRows] = await db.promise().query(studentQuery, [student_name]);

        if (studentRows.length === 0) {
            return res.status(404).send("❌ Estudiante no encontrado");
        }
        const student_id = studentRows[0].id;

        console.log("Buscando propiedad con propietario:", owner_name);
        const propertyQuery = `SELECT id, price FROM PropertyServices.Properties WHERE usernameOwner = ? LIMIT 1`;
        const [propertyRows] = await db.promise().query(propertyQuery, [owner_name]);

        if (propertyRows.length === 0) {
            return res.status(404).send("❌ Propiedad no encontrada");
        }
        const property_id = propertyRows[0].id;
        const amount = propertyRows[0].price;

        const insertQuery = `INSERT INTO Reservations (student_id, property_id, reservation_date, status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.promise().query(insertQuery, [student_id, property_id, reservation_date, status || "pending"]);

        const reservationData = {
            id: result.insertId,
            student_id,
            property_id,
            reservation_date,
            status: status || "pending",
        };

        await redisClient.set(`reservation:${reservationData.id}`, JSON.stringify(reservationData));
        console.log("✅ Reservación almacenada en Redis");

        notifyClients("new_reservation", reservationData);

        const statusMapping = {
            "pending": "unpaid",   
            "confirmed": "paid",   
            "cancelled": "cancelled"
        };
        
        const invoiceStatus = statusMapping[status] || "unpaid";

        // Llamada a BillingService para crear la factura
        const billingResponse = await axios.post("http://127.0.0.1:5001/invoice", {
            student_id: reservationData.student_id,
            reservation_id: reservationData.id,
            amount: amount,
            status: "pending",
        });
        console.log("📄 Factura generada:", billingResponse.data);

        res.status(201).json({
            message: "✅ Reservación creada y factura generada",
            data: reservationData,
        });
    } catch (err) {
        console.error("❌ Error creando la reservación:", err);
        res.status(500).send("Error en el servidor");
    }
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
