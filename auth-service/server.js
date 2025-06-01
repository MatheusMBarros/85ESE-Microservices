const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Auth Service está rodando!');
});

// Aqui virão as rotas de /register, /login, etc.

app.listen(PORT, () => {
  console.log(`Auth Service rodando na porta ${PORT}`);
});