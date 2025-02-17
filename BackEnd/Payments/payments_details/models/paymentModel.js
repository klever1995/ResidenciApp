const db = require("../config/db");

const getAllPayments = async () => {
  try {
    const result = await db.query("SELECT * FROM Payments ORDER BY created_at DESC");
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getPaymentById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM Payments WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllPayments, getPaymentById };
