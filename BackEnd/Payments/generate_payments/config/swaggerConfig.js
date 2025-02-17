const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Pagos",
      version: "1.0.0",
      description: "Documentación del microservicio de pagos",
    },
    servers: [
      {
        url: "http://localhost:9002", // Cambiar puerto si es necesario
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"], // Indica dónde están las rutas documentadas
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
