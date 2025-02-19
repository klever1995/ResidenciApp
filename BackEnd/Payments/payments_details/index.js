const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/paymentRoutes");
const { swaggerUi, specs } = require("./config/swaggerConfig");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas del microservicio
app.use("/payments", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
  origin: "*", // Permitir todos los orígenes (puedes restringirlo a tu frontend)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const PORT = process.env.PORT || 9003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`);
  console.log("📄 Swagger Docs disponible en: http://localhost:9003/api-docs");

});
