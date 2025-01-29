require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Path to get all properties
app.get('/properties', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Properties');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las propiedades:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Route to get a property by ID
app.get('/properties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Properties WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la propiedad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});