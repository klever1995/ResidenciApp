require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 2003;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Middleware for parsear JSON
app.use(express.json());

// Path to update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  // Validation: At least one of the fields must be present
  if (!username && !email && !password && !role) {
    return res
      .status(400)
      .json({ message: 'Debes enviar al menos un campo para actualizar.' });
  }

  try {
    // Build dynamic SQL query
    const fields = [];
    const values = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (password) {
      fields.push('password = ?');
      values.push(password);
    }
    if (role) {
      fields.push('role = ?');
      values.push(role);
    }

    // Add ID to the end of the values
    values.push(id);

    const query = `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`;

    // Execute the query
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
