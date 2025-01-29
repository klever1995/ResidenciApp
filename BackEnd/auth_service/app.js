require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Auth service running on port 5000');
});
