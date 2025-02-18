const pool = require("../config/db");

const Payment = {
  createPayment: async (student_id, amount) => {
    const query = `INSERT INTO Payments (student_id, amount) VALUES ($1, $2) RETURNING id`;
    const values = [student_id, amount];

    try {
      const result = await pool.query(query, values);
      return result.rows[0].id; // Devuelve el ID del pago creado
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Payment;
