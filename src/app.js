const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/backend-mocking";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers (imports corrigidos para nova estrutura)
const usersRouter = require("./routes/users.router");
const petsRouter = require("./routes/pets.router");
const mocksRouter = require("./routes/mocks.router");
const adoptionsRouter = require("./routes/adoption.router");

// Swagger Documentation
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/adoptions", adoptionsRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend III - Sistema de Mocking",
    endpoints: {
      users: "/api/users",
      pets: "/api/pets",
      mocks: "/api/mocks",
      adoptions: "/api/adoptions",
    },
    mockingEndpoints: {
      mockingpets: "/api/mocks/mockingpets",
      mockingusers: "/api/mocks/mockingusers",
      generateData: "POST /api/mocks/generateData",
    },
    documentation: "/apidocs",
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Acesse: http://localhost:${PORT}`);
      console.log(`🔗 Endpoints disponíveis:`);
      console.log(`   - GET /api/users (Listar usuários)`);
      console.log(`   - GET /api/pets (Listar pets)`);
      console.log(`   - GET /api/mocks/mockingpets (Gerar pets mockados)`);
      console.log(`   - GET /api/mocks/mockingusers (Gerar usuários mockados)`);
      console.log(`   - POST /api/mocks/generateData (Gerar e inserir dados)`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Algo deu errado no servidor!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint não encontrado",
  });
});

module.exports = app;
