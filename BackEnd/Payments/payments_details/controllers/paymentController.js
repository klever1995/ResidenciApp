const Payment = require("../models/paymentModel");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pagos", error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pago", error: error.message });
  }
};

module.exports = { getPayments, getPaymentById };
