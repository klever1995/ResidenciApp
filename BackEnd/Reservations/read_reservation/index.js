const express = require ("express");
const mysql = require ("mysql2");
const cors = require('cors');
const dotenv = require ("dotenv");

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
  console.log("Conectado a MySQL exitosamente");
});

// Configuración de CORS
app.use(cors()); // Esto permitirá solicitudes desde cualquier origen

// Obtener todas las reservaciones
app.get("/reservations", (req, res) => {
  db.query("SELECT * FROM Reservations", (err, results) => {
    if (err) {
      console.error("Error al obtener reservaciones:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener una reservación por ID
app.get("/reservations/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Reservations WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error al obtener la reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (result.length === 0) return res.status(404).json({ error: "Reservación no encontrada" });
    res.json(result[0]);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Servicio corriendo en el puerto ${PORT}`);
});
