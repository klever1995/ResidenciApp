require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 2003;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para actualizar un usuario por ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  // Validación: Al menos uno de los campos debe estar presente
  if (!username && !email && !password && !role) {
    return res
      .status(400)
      .json({ message: 'Debes enviar al menos un campo para actualizar.' });
  }

  try {
    // Construir consulta SQL dinámica
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

    // Agregar ID al final de los valores
    values.push(id);

    const query = `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`;

    // Ejecutar la consulta
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
