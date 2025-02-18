const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Conexión a MySQL
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
  console.log("Conectado a MySQL - update-reservation");
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
    servers: [{ url: "http://localhost:4003" }],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("📜 Swagger documentado en: http://localhost:4003/api-docs");

// WebSockets
io.on("connection", socket => {
  console.log("✅ Cliente conectado al WebSocket");

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado del WebSocket");
  });
});

const notifyClients = (event, data) => {
  io.emit(event, data);
};

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Actualizar una reservación
 *     description: Modifica los datos de una reservación existente según el rol del usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reservación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               role:
 *                 type: string
 *                 example: "student"
 *               status:
 *                 type: string
 *                 example: "cancelled"
 *     responses:
 *       200:
 *         description: Reservación actualizada correctamente
 *       403:
 *         description: No tienes permisos para actualizar esta reservación
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error en el servidor
 */
app.put("/reservations/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, role, status } = req.body;

  if (!user_id || !role || !status) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios" });
  }

  const querySelect = "SELECT student_id, property_id FROM Reservations WHERE id = ?";
  db.query(querySelect, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "❌ Reservación no encontrada" });
    }

    const reservation = results[0];
    let updateQuery;

    if (role === "student" && user_id === reservation.student_id) {
      if (status !== "cancelled") {
        return res.status(403).json({ error: "❌ Un estudiante solo puede cancelar su reservación" });
      }
      updateQuery = "UPDATE Reservations SET status = ? WHERE id = ?";
    } else if (role === "owner") {
      updateQuery = "UPDATE Reservations SET status = ? WHERE id = ?";
    } else {
      return res.status(403).json({ error: "❌ No tienes permisos para actualizar esta reservación" });
    }

    // Obtener invoice_id antes de actualizar la reservación
    const queryInvoice = "SELECT id FROM BillingServices.Invoices WHERE reservation_id = ?";
    db.query(queryInvoice, [id], (err, invoiceResults) => {
      if (err) {
        console.error("❌ Error al obtener factura:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      const invoiceId = invoiceResults.length > 0 ? invoiceResults[0].id : null;

      db.query(updateQuery, [status, id], async (err, result) => {
        if (err) {
          console.error("❌ Error al actualizar reservación:", err);
          return res.status(500).json({ error: "Error en el servidor" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "❌ Reservación no encontrada" });
        }

        notifyClients("update_reservation", { id, status });

        if (status === "cancelled") {
          notifyClients("update_property_status", { property_id: reservation.property_id, status: "available" });
        }

        if (status === "cancelled" && invoiceId) {
          try {
            const billingServiceURL = `http://127.0.0.1:5003/invoice/${invoiceId}`;
            await axios.put(billingServiceURL, { status: "voided" });
            console.log(`✅ Factura ${invoiceId} marcada como 'voided' en BillingService`);
          } catch (error) {
            console.error("❌ Error al actualizar la factura:", error.response?.data || error.message);
            return res.status(500).json({ error: "No se pudo actualizar la factura" });
          }
        }

        res.status(200).json({ message: "✅ Reservación actualizada", id, status });
      });
    });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4003;
server.listen(PORT, () => {
  console.log(`🔌 WebSocket escuchando en el puerto ${PORT}`);
  console.log(`Microservicio de actualización corriendo en el puerto ${PORT}`);
});
