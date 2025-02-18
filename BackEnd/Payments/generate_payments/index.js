require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const { swaggerUi, specs } = require("./config/swaggerConfig");

const app = express();
const PORT = process.env.PORT || 9002;

app.use(cors());
app.use(bodyParser.json());

app.use("/payments", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
  origin: "*", // Permitir todos los orígenes (puedes restringirlo a tu frontend)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
  console.log("📄 Swagger Docs disponible en: http://localhost:9002/api-docs");
});
