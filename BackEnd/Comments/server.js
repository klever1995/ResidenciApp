// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Configuración del servidor Express
const app = express();
const port = 9001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error de conexión a MongoDB:', err));

// Definir el modelo de Comentarios
const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  created_at: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

// Rutas

// Obtener todos los comentarios
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo comentario
app.post('/comments', async (req, res) => {
  const { author, text } = req.body;

  const newComment = new Comment({
    author,
    text,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
