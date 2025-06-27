// Carrega as variáveis de ambiente do .env
require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/infra/database/index"); // Importa a instância do Sequelize
const { UserModel } = require("./src/infra/database/models/userModel"); // Importa o modelo para sincronizar
const userRoutes = require("./src/interfaces/http/userRoutes"); // Rotas HTTP do usuário

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Sincroniza os modelos com o banco de dados (cria tabelas se não existirem)
// Force: true irá recriar as tabelas (bom para dev, CUIDADO em prod)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("[User Service] Banco de dados sincronizado com sucesso!");
  })
  .catch((err) => {
    console.error(
      "[User Service] Erro ao sincronizar o banco de dados:",
      err.message
    );
    // process.exit(1); // Opcional: Terminar o processo se a sincronização falhar
  });

// Rotas de Usuário
// Todas as rotas definidas em userRoutes estarão sob /api/users
app.use("/api/users", userRoutes);

// Rota de teste simples para verificar se o serviço está online
app.get("/api/users/health", (req, res) => {
  // Verifica o status da conexão com o banco de dados
  const dbStatus = sequelize
    .authenticate()
    .then(() => "Connected")
    .catch(() => "Disconnected");

  dbStatus.then((status) => {
    res.json({ status: "User Service UP", port: PORT, database: status });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`[User Service] rodando na porta ${PORT}`);
});
