// auth-service/src/server.js
// Carrega as variáveis de ambiente do .env
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes"); // Caminho relativo dentro de src/

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("[Auth Service] MongoDB conectado com sucesso!"))
  .catch((err) => {
    console.error("[Auth Service] Erro de conexão com MongoDB:", err.message);
    // Opcional: Terminar o processo se a conexão com o DB falhar na inicialização
    // process.exit(1);
  });

// Rotas de Autenticação
app.use("/api/auth", authRoutes);

// Rota de teste simples para verificar se o serviço está online
app.get("/api/auth/health", (req, res) => {
  res.json({
    status: "Auth Service UP",
    port: PORT,
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`[Auth Service] rodando na porta ${PORT}`);
});
