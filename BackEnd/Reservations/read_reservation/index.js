const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const http = require("http");
const socketIo = require("socket.io");


dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Connection MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL exitosamente");
});

const swaggerOptions = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "API de Reservaciones",
          version: "1.0.0",
          description: "Documentación de la API de Reservaciones",
      },
      servers: [{ url: "http://localhost:4002" }],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("📜 Swagger documentado en: http://localhost:4002/api-docs");

// Configuration of CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado a WebSockets");

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Emitir cambios en reservas
const emitReservationUpdate = () => {
  io.emit("reservationUpdated");
};

// Get all reservations
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

// Obtener una reservación por ID
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

// Start server
const PORT = process.env.PORT || 4002;
server.listen(PORT, () => {
  console.log(`Servicio corriendo en el puerto ${PORT}`);
});
