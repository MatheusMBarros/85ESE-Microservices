const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const AgendaModel = sequelize.define(
  "Agenda",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: { // ID do usuário que fez o agendamento
      type: DataTypes.UUID,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dataHora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'confirmado' // ex: confirmado, cancelado
    }
  },
  {
    timestamps: true,
    tableName: "agendas",
  }
);

module.exports = { AgendaModel };