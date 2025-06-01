const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// Conexão com MongoDB (exemplo básico)
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado ao Agenda Service'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Agenda Service está rodando!');
});

// Aqui virão as rotas CRUD para agendamentos

app.listen(PORT, () => {
  console.log(`Agenda Service rodando na porta ${PORT}`);
});