const Payment = require("../models/paymentModel");

const generatePayment = async (req, res) => {
  const { student_id, amount, status } = req.body;

  // Validar los datos de entrada
  if (!student_id || !amount || !status) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    // Llamar al método del modelo para crear el pago
    await Payment.createPayment(student_id, amount, status);
    res.status(201).json({ message: "Pago generado exitosamente" }); // Solo devuelve el mensaje
  } catch (error) {
    res.status(500).json({ message: "Error al generar el pago", error: error.message });
  }
};

module.exports = { generatePayment };