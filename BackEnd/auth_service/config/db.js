const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'AuthService'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error de conexión: ' + err.stack);
      return;
    }
    console.log('Conectado como ID ' + db.threadId);
  });
  

module.exports = db;
