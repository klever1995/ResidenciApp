require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Middleware for parsear JSON
app.use(express.json());

// Route to update a property by ID
app.put('/upproperties/:id', async (req, res) => {
  const { id } = req.params;
  const { title, address, owner_id, price, description, is_available } = req.body;

  // Validation: At least one of the fields must be present
  if (!title && !address && !owner_id && !price && !description && !is_available) {
    return res
      .status(400)
      .json({ message: 'Debes enviar al menos un campo para actualizar.' });
  }

  try {
    // Build dynamic SQL query
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
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }
    if (is_available) {
      fields.push('is_available = ?');
      values.push(is_available);
    }


    // Add ID to the end of the values
    values.push(id);

    const query = `UPDATE Properties SET ${fields.join(', ')} WHERE id = ?`;

    // Execute the query
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

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
