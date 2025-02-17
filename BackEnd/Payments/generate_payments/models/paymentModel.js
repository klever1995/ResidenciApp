const db = require("../config/db");

const Payment = {
  async createPayment(student_id, amount, status) {
    try {
      const query = `
        INSERT INTO Payments (student_id, amount, status)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [student_id, amount, status];
      const result = await db.query(query, values);
      return result.rows[0]; // Devuelve el pago creado
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Payment;