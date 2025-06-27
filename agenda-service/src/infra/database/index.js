const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, 
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Agenda Service conectado ao PostgreSQL com sucesso!"))
  .catch((err) =>
    console.error("Não foi possível conectar ao banco de dados (Agenda Service):", err.message)
  );

module.exports = { sequelize };