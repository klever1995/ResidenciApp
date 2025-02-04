require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(5000, () => {
  console.log('Auth service running on port 5000');
});
