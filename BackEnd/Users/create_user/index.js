require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 2001;

//Middleware para parsear JSON
app.use(express.json());

//Endpoint para crear una propiedad
app.post('/users', async (req, res) => {
    const { username, email, password, role } = req.body;

    if(!username || !email || !password || !role ){
        return res.status(400).json({ message: 'Faltan datos, estos datos son obligatorios' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            [username, email, password, role]
        );
        res.status(201).json({ message: 'Usuario creado con éxito', id: result.insertId});
    }catch(error){
        console.error('Error al crear el usuario', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});