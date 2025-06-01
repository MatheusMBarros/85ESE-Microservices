const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('User Service está rodando!');
});

// Aqui virão as rotas CRUD para usuários

app.listen(PORT, () => {
  console.log(`User Service rodando na porta ${PORT}`);
});