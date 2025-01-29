const express = require ("express");
const mysql = require ("mysql2");
const dotenv = require ("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.post("/reservations", (req, res) => {
    const { user_id, property_id, reservation_date, status } = req.body;

    if(!user_id || !property_id || !reservation_date || !status) {
        res.status(400).send("Please provide all required fields");
    }
    
    const query = `INSERT INTO reservations (user_id, property_id, reservation_date, status) VALUES (?, ?, ?, ?)`;
    db.query(query, [user_id, property_id, reservation_date, status || 'pending'], (err, result) => {
        if (err) {
            console.error("Error create reservation: " + err.stack);
            return res.status(500).send("Error en el servidor");
        }
        res.status(201).send("Reservation created successfully");
    });
}); 

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});