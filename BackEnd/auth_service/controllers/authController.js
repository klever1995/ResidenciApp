const authService = require('../services/authService');

const login = (req, res) => {
  const { username, password } = req.body;
  
  // Verificar el usuario y contraseña (esto se debe hacer consultando la base de datos)
  // Este es un ejemplo básico, deberías validar el usuario correctamente
  const userId = 5; // Supongamos que obtienes el ID del usuario
  
  // Si las credenciales son correctas, generamos un token
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
