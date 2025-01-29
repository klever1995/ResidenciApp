const express = require ("express");
const mysql = require ("mysql2");
const dotenv = require ("dotenv");

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

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL - update-reservation");
});

// Ruta para actualizar una reservación
app.put("/reservations/:id", (req, res) => {
  const { id } = req.params;
  const { reservation_date, status } = req.body;

  if (!reservation_date && !status) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo a actualizar" });
  }

  const query = "UPDATE Reservations SET reservation_date = ?, status = ? WHERE id = ?";
  db.query(query, [reservation_date, status, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar reservación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "Reservación no encontrada" });
    res.json({ message: "Reservación actualizada" });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Microservicio de actualización corriendo en el puerto ${PORT}`);
});
