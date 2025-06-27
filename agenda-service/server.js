const express = require('express');
require('dotenv').config();
const { sequelize } = require('./src/infra/database'); // Importa a instância do Sequelize
const agendaRoutes = require('./src/interfaces/http/agendaRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware para parsear JSON
app.use(express.json());

// Sincroniza o Sequelize e inicia o servidor
// O `authenticate` já é chamado dentro do index.js
sequelize.sync() // .sync() cria as tabelas se não existirem
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
    
    // Rota de Health Check
    app.get('/', (req, res) => {
      res.send('Agenda Service está rodando!');
    });

    // Monta as rotas de agendamento
    app.use('/api/agendas', agendaRoutes);

    app.listen(PORT, () => {
      console.log(`Agenda Service rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Não foi possível sincronizar os modelos com o banco de dados:', err);
    process.exit(1);
  });