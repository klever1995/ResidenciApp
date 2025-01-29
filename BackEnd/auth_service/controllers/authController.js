const authService = require('../services/authService');

const login = (req, res) => {
  const { username, password } = req.body;
  
  // Verify the username and password (this must be done by consulting the database)
  // Example
  const userId = 5; // Supongamos que obtienes el ID del usuario
  
  // If the credentials are correct, we generate a token
  const token = authService.createToken(userId);
  
  res.json({ token });
};

const validate = (req, res) => {
  const { token } = req.body;
  const isValid = authService.validateToken(token);
  
  if (isValid) {
    res.json({ message: 'Token is valid' });
  } else {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = { login, validate };
