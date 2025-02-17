const express = require ("express");
const mysql = require ("mysql2");
const cors = require('cors');
const dotenv = require ("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const http = require("http"); // Agregar HTTP Server
const socketIo = require("socket.io"); // Importar socket.io

dotenv.config();
const app = express();
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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
              url: "http://localhost:4003", // Ajusta según sea necesario
          },
      ],
  },
  apis: ["./index.js"], // Agregamos este archivo ya que ahí están las rutas
};

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL - update-reservation");
});

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("📜 Swagger documentado en: http://localhost:4003/api-docs");

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Actualizar una reservación
 *     description: Modifica los datos de una reservación existente.
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
 *               reservation_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-25"
 *               status:
 *                 type: string
 *                 example: "cancelled"
 *     responses:
 *       200:
 *         description: Reservación actualizada correctamente
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error en el servidor
 */


// Route to update a reservation
app.put("/upreservations/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Debe proporcionar un estado válido para actualizar" });
  }

  const query = "UPDATE Reservations SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    // Emitir evento WebSocket 🚀
    notifyClients("update_reservation", { id, reservation_date, status });

    res.status(200).json({ message: "✅ Reservación actualizada" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Reservación no encontrada" });
    }

    res.json({ message: "✅ Reservación actualizada correctamente" });
  });
});

// Start server
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Microservicio de actualización corriendo en el puerto ${PORT}`);
});
