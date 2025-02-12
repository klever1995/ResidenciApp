require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Configuración de multer para almacenar imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para actualizar una propiedad por ID, incluyendo la imagen de forma opcional
app.put('/upproperties/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, address, owner_id, price, description, is_available } = req.body;
  const image = req.file ? req.file.buffer : null; // Guardar imagen si se envía

  // Validación: al menos un campo debe enviarse para actualizar
  if (!title && !address && !owner_id && !price && !description && !is_available && !image) {
    return res.status(400).json({ message: 'Debes enviar al menos un campo para actualizar.' });
  }

  try {
    // Construcción dinámica de la consulta SQL
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
    if (image) {
      fields.push('image = ?');
      values.push(image);
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
