require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 7004;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Path to delete a user by ID
app.delete('/downers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Owners WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario propietario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario propietario eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el usuario propietario:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
