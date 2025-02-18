const Payment = require("../models/paymentModel");

const generatePayment = async (req, res) => {
  const { student_id, amount } = req.body;

  if (!student_id || !amount) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const payment_id = await Payment.createPayment(student_id, amount);
    res.status(201).json({ message: "Pago generado exitosamente", payment_id });
  } catch (error) {
    console.error("Error al generar el pago:", error);
    res.status(500).json({ message: "Error al generar el pago", error: error.message });
  }
};

module.exports = { generatePayment };
