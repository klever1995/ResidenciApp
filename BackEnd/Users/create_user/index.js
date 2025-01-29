require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 2001;

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

//Middleware for parsear JSON
app.use(express.json());

//Endpoint for create a property
app.post('/users', async (req, res) => {
    const { username, email, password, role } = req.body;

    if(!username || !email || !password || !role ){
        return res.status(400).json({ message: 'Faltan datos, estos datos son obligatorios' });
    }

    try {
        // Generate the password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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

//Start Server
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});