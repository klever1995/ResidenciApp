require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 2002;

// Ruta para obtener todas las propiedades
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las propiedades:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Ruta para obtener un usuario por ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrada.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la propiedad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});