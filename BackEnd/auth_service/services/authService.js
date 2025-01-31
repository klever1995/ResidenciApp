const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' }); //Token expires in 1 hour
};

//To verify the token
const verifyToken = (token) => {
    try{
        return jwt.verify(token, SECRET_KEY);
    }catch(err){
        return null;
    }
};

//To create a new token
const createToken = (userId) => {
    const token = generateToken(userId);

    const query = 'INSERT INTO Tokens (user_id, token) VALUES ( ?, ?)';
    db.query(query, [userId, token], (err, result) => {
        if(err) throw err;
        console.log('Token creado', result);
    });

    return token;
};

//To check if the token is valid
const validateToken = (token) => {
    const decoded = verifyToken(token);
    if(decoded){
        const query = 'SELECT * FROM Tokens WHERE token = ?';
        db.query(query, [ token ], (err, results) => {
            if(err) throw err;
            if(results.length > 0){
                return true; //Valid token
            } else{
                return false; //Invalid token
            }
        });
    } else{
        return false; //Invalid token
    }	
};

module.exports = { createToken, validateToken };
