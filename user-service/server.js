//src/infra/server.js
// Ponto de entrada principal do serviço de usuários, configura o Express e o banco de dados.
// Esta camada é a mais externa da Clean Architecture (Frameworks e Drivers).
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require("express");
const app = express();
const userRoutes = require("./src/interfaces/http/userRoutes");
const { sequelize } = require("./src/infra/database/index"); // Importa a instância do Sequelize
const { UserModel } = require("./src/infra/database/models/userModel"); // Importa o modelo para sincronização

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Adiciona as rotas de usuário ao aplicativo Express
// As rotas serão acessíveis sob o prefixo '/api', ex: /api/users
app.use("/users", userRoutes); // <-- Isso é ESSENCIAL

const PORT = process.env.PORT || 3002;

// Sincroniza os modelos do Sequelize com o banco de dados e inicia o servidor
// 'force: false' evita recriar as tabelas a cada inicialização (cuidado em produção com 'true'!)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Modelos do Sequelize sincronizados com o banco de dados.");
    app.listen(PORT, () =>
      console.log(`Serviço de Usuário rodando na porta ${PORT}`)
    );
  })
  .catch((err) => {
    console.error(
      "Falha ao sincronizar modelos ou iniciar o servidor:",
      err.message
    );
    process.exit(1); // Encerra o processo se não conseguir conectar ao DB ou sincronizar
  });
