require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 6004;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Path to delete a user by ID
app.delete('/dstudents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Students WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario estudiante no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario estudiante eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el usuario estudiante:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
