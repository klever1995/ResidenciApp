require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3004;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Path to delete a property by ID
app.delete('/dproperties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Properties WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada.' });
    }

    res.status(200).json({ message: 'Propiedad eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
