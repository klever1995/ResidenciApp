const express = require("express");
const router = express.Router();
const { generatePayment } = require("../controllers/paymentController");
 
/**
 * @swagger
 * /payments/generate:
 *   post:
 *     summary: Generar un nuevo pago
 *     description: Crea un pago para una reservación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Pago creado con éxito.
 *       400:
 *         description: Error en la solicitud.
 */
router.post("/generate", generatePayment);
 
module.exports = router;
