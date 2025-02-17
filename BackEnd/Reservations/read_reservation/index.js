const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Ajusta según sea necesario
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Configuración de MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Conectado a MySQL exitosamente");
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
    servers: [
      {
        url: "http://localhost:4002",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("📜 Swagger documentado en: http://localhost:4002/api-docs");

// Configuración de CORS
app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /readreservations:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida correctamente
 *       500:
 *         description: Error en el servidor
 */
app.get("/readreservations", (req, res) => {
  const query = `
    SELECT 
        r.id, 
        s.username AS student_name, 
        p.usernameOwner AS owner_name, 
        r.reservation_date, 
        r.status 
    FROM Reservations r
    JOIN StudentService.Students s ON r.student_id = s.id
    JOIN PropertyServices.Properties p ON r.property_id = p.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener reservaciones:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

/**
 * @swagger
 * /readreservations/{id}:
 *   get:
 *     summary: Obtener una reservación por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error en el servidor
 */
app.get("/readreservations/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
        r.id, 
        s.username AS student_name, 
        p.usernameOwner AS owner_name, 
        r.reservation_date, 
        r.status 
    FROM Reservations r
    JOIN StudentService.Students s ON r.student_id = s.id
    JOIN PropertyServices.Properties p ON r.property_id = p.id
    WHERE r.id = ?;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al obtener la reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "❌ Reservación no encontrada" });
    }
    res.json(result[0]);
  });
});

// Configuración de WebSockets
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado a WebSocket");

  socket.on("reservation_updated", (data) => {
    console.log("🔄 Actualización de reservación recibida:", data);
    io.emit("update_reservations", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado de WebSocket");
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4002;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
