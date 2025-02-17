const express = require ("express");
const mysql = require ("mysql2");
const dotenv = require ("dotenv");
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const http = require("http"); // Agregar HTTP Server
const socketIo = require("socket.io"); // Importar socket.io

dotenv.config();
const app = express();

// Conexión MySQL
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
              url: "http://localhost:4004", // Ajusta según sea necesario
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
  console.log("Conectado a MySQL - delete-reservation");
});

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("📜 Swagger documentado en: http://localhost:4004/api-docs");

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Eliminar una reservación
 *     description: Elimina una reservación de la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reservación a eliminar
 *     responses:
 *       200:
 *         description: Reservación eliminada correctamente
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error en el servidor
 */

// Delete a reservation by ID
app.delete("/dreservations/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Debe proporcionar un ID válido para eliminar la reservación" });
  }

   // Emitir evento WebSocket 🚀
   notifyClients("delete_reservation", { id });

   res.status(200).json({ message: "✅ Reservación eliminada" });

  const query = "DELETE FROM Reservations WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Reservación no encontrada" });
    }

    res.json({ message: "✅ Reservación eliminada correctamente" });
  });
});


// Start server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Microservicio de eliminación corriendo en el puerto ${PORT}`);
});
