require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 7002;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Path to get all users
app.get('/rowners', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Owners');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios propietarios:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Route to get a user by ID
app.get('/rowners/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Owners WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario propietario no encontrado.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario propietario:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});