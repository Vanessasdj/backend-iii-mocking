const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/backend-mocking";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
const usersRouter = require("./src/routes/users.router");
const petsRouter = require("./src/routes/pets.router");
const mocksRouter = require("./src/routes/mocks.router");

// Routes
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend III - Sistema de Mocking",
    endpoints: {
      users: "/api/users",
      pets: "/api/pets",
      mocks: "/api/mocks",
    },
    mockingEndpoints: {
      mockingpets: "/api/mocks/mockingpets",
      mockingusers: "/api/mocks/mockingusers",
      generateData: "POST /api/mocks/generateData",
    },
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
