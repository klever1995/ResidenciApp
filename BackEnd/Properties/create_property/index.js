require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware para parsear JSON
app.use(express.json());

//Endpoint para crear una propiedad
app.post('/properties', async (req, res) => {
    const { title, address, owner_id, price } = req.body;

    if(!title || !address || !owner_id || !price) {
        return res.status(400).json({ message: 'Faltan datos, estos datos son obligatorios' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO properties (title, address, owner_id, price) VALUES (?, ?, ?, ?)', 
            [title, address, owner_id, price]
        );
        res.status(201).json({ message: 'Propiedad creada con éxito', id: result.insertId});
    }catch(error){
        console.error('Error al crear la propiedad', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});