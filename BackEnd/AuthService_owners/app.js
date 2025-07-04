require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Obtener el puerto desde el .env, con un valor por defecto
const PORT = process.env.PORT || 8000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
