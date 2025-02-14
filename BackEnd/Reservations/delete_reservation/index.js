const express = require ("express");
const mysql = require ("mysql2");
const dotenv = require ("dotenv");
const cors = require('cors');

dotenv.config();
const app = express();

// Conexión MySQL
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
  console.log("Conectado a MySQL - delete-reservation");
});

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Delete a reservation by ID
app.delete("/dreservations/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Debe proporcionar un ID válido para eliminar la reservación" });
  }

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
