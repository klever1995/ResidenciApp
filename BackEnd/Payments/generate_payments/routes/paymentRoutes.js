const express = require("express");
const router = express.Router();
const { generatePayment } = require("../controllers/paymentController");

/**
 * @swagger
 * /api/payments:
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
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago creado con éxito.
 *       400:
 *         description: Error en la solicitud.
 */

// Ruta para generar un nuevo pago
router.post("/", async (req, res) => {
    try {
        const { student_id, amount, status } = req.body;

        // Validar parámetros
        if (!student_id || !amount || !status) {
            return res.status(400).json({ error: "Faltan parámetros: student_id, amount o status" });
        }

        // Lógica para generar el pago
        const paymentResult = await generatePayment(student_id, amount, status);

        if (paymentResult.success) {
            return res.status(201).json({ message: "Pago creado con éxito." });
        } else {
            return res.status(400).json({ error: "Error al crear el pago." });
        }
    } catch (error) {
        console.error("Error generando el pago:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta adicional para generar el pago con lógica separada
router.post("/generate", generatePayment);

module.exports = router;
