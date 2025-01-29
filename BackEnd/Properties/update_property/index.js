require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// Configuración de CORS
app.use(cors()); // Esto permitirá solicitudes desde cualquier origen

// Middleware para parsear JSON
app.use(express.json());

// Ruta para actualizar una propiedad por ID
app.put('/properties/:id', async (req, res) => {
  const { id } = req.params;
  const { title, address, owner_id, price } = req.body;

  // Validación: Al menos uno de los campos debe estar presente
  if (!title && !address && !owner_id && !price) {
    return res
      .status(400)
      .json({ message: 'Debes enviar al menos un campo para actualizar.' });
  }

  try {
    // Construir consulta SQL dinámica
    const fields = [];
    const values = [];

    if (title) {
      fields.push('title = ?');
      values.push(title);
    }
    if (address) {
      fields.push('address = ?');
      values.push(address);
    }
    if (owner_id) {
      fields.push('owner_id = ?');
      values.push(owner_id);
    }
    if (price) {
      fields.push('price = ?');
      values.push(price);
    }

    // Agregar ID al final de los valores
    values.push(id);

    const query = `UPDATE Properties SET ${fields.join(', ')} WHERE id = ?`;

    // Ejecutar la consulta
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada.' });
    }

    res.status(200).json({ message: 'Propiedad actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar la propiedad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
