const bcrypt = require('bcrypt');

(async () => {
    const plainPassword = "kevin123"; // La contraseña en texto plano
    const saltRounds = 10; // Número de rondas de encriptación

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log("Nueva contraseña encriptada:", hashedPassword);
})();