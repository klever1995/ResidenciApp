require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 6003;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

// Middleware for parsear JSON
app.use(express.json());

// Path to update a user by ID
app.put('/upstudents/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, university, career, birthdate, age, identity_card, phone } = req.body;

  // Validation: At least one of the fields must be present
  if (!username && !email && !password && !university && !career && !birthdate && !age && !identity_card && !phone) {
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
    if (university) {
      fields.push('university = ?');
      values.push(university);
    }
    if (career) {
        fields.push('career = ?');
        values.push(career);
    }
    if (birthdate) {
        fields.push('birthdate = ?');
        values.push(birthdate);
    }
    if (age) {
        fields.push('age = ?');
        values.push(age);
    }
    if (identity_card) {
        fields.push('identity_card = ?');
        values.push(identity_card);
    }
    if (phone) {
        fields.push('phone = ?');
        values.push(phone);
    }
    

    // Add ID to the end of the values
    values.push(id);

    const query = `UPDATE Students SET ${fields.join(', ')} WHERE id = ?`;

    // Execute the query
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario estudiante no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario estudiante actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar el usuario estudiante:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
