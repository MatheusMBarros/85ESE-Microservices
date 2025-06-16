// src/infra/database/index.js
// Configuração da conexão com o banco de dados PostgreSQL usando Sequelize.
// Esta camada é parte da Infraestrutura na Clean Architecture.
const { Sequelize } = require("sequelize");

// Instancia o Sequelize com as variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Desabilita o log de queries do Sequelize para não poluir o console
    dialectOptions: {
      // Ajustes para produção se necessário, ex: SSL
    },
  }
);

// Tenta autenticar a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => console.log("Conectado ao PostgreSQL com sucesso!"))
  .catch((err) =>
    console.error("Não foi possível conectar ao banco de dados:", err.message)
  );

module.exports = { sequelize };
