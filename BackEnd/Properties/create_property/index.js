require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware for parsear JSON
app.use(express.json());

// Configuration of CORS
app.use(cors()); // This will allow requests from any source

//Endpoint for create a property
app.post('/cproperties', async (req, res) => {
    const { title, address, owner_id, price, description, is_available } = req.body;

    if(!title || !address || !owner_id || !price || !description || !is_available) {
        return res.status(400).json({ message: 'Faltan datos, estos datos son obligatorios' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO properties (title, address, owner_id, price, description, is_available) VALUES (?, ?, ?, ?, ?, ?)', 
            [title, address, owner_id, price, description, is_available]
        );
        res.status(201).json({ message: 'Propiedad creada con éxito', id: result.insertId});
    }catch(error){
        console.error('Error al crear la propiedad', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//Start server
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});