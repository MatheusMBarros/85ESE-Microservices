const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Gateway Service está rodando!');
});

// Aqui virão as configurações de proxy e rotas para outros serviços

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});