const express = require("express");
const router = express.Router();
const { getPayments, getPaymentById } = require("../controllers/paymentController");

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Obtener todos los pagos
 *     description: Devuelve la lista de todos los pagos registrados.
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida con éxito.
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obtener detalles de un pago
 *     description: Devuelve los detalles de un pago específico por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago encontrado.
 *       404:
 *         description: Pago no encontrado.
 */

router.get("/", getPayments);  // Ver todos los pagos
router.get("/:id", getPaymentById);  // Ver un pago específico por ID

module.exports = router;
