// src/infra/database/models/userModel.js
// Definição do modelo de usuário para o Sequelize.
// Esta camada faz parte da Infraestrutura na Clean Architecture.
const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Garante que o e-mail seja único no banco de dados
    },
  },
  {
    // Opcional: Adiciona timestamps automáticos (createdAt, updatedAt)
    timestamps: true,
    tableName: "users", // Nome da tabela no banco de dados (opcional, padrão é plural do nome do modelo)
  }
);

module.exports = { UserModel };
