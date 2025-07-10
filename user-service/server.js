// user-service/src/server.js
// Carrega as variáveis de ambiente do .env
require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/infra/database/index"); // Importa a instância do Sequelize
const { UserModel } = require("./src/infra/database/models/userModel"); // Importa o modelo para sincronizar (se necessário para sync)
const userRoutes = require("./src/interfaces/http/userRoutes"); // Rotas HTTP do usuário

// --- Adições para Prometheus ---
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = client.register;

// Coleta métricas padrão com um prefixo para o serviço de Usuários
collectDefaultMetrics({ prefix: "user_service_" });
const httpRequestCounter = new client.Counter({
  name: "user_service_http_requests_total",
  help: "Total number of HTTP requests for User Service",
  labelNames: ["method", "route", "status_code"],
});
// --- Fim Adições para Prometheus ---

// --- Adições para Swagger ---
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const jsyaml = require("js-yaml");
const fs = require("fs");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "User Service API",
    version: "1.0.0",
    description: "Documentação da API do serviço de Usuários.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3002}/api`,
      description: "Servidor de Desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    "./src/interfaces/http/*.js", // Caminho para seus arquivos de rota
    "./src/infra/database/models/*.js", // Caminho para seus modelos Sequelize (se contiverem JSDoc)
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Salva o swagger.yaml para ser usado pelo pipeline
const outputPath = "./swagger.yaml"; // Caminho na raiz do serviço
fs.writeFileSync(outputPath, jsyaml.dump(swaggerSpec), "utf8");
console.log(`Swagger YAML gerado em ${outputPath}`);
// --- Fim Adições para Swagger ---

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// --- Middleware para contar requisições ---
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });
  next();
});
// --- Fim Middleware para contar requisições ---

// Sincroniza os modelos com o banco de dados (cria tabelas se não existirem)
sequelize
  .sync({ force: false }) // 'force: true' recria as tabelas (CUIDADO em produção!)
  .then(() => {
    console.log("[User Service] Banco de dados sincronizado com sucesso!");
  })
  .catch((err) => {
    console.error(
      "[User Service] Erro ao sincronizar o banco de dados:",
      err.message
    );
    // process.exit(1); // Opcional: Terminar o processo se a sincronização falhar
  });

// Rotas de Usuário
// Todas as rotas definidas em userRoutes estarão sob /api/users
app.use("/api/users", userRoutes);

// Rota de teste simples para verificar se o serviço está online
app.get("/api/users/health", (req, res) => {
  // Verifica o status da conexão com o banco de dados
  const dbStatus = sequelize
    .authenticate()
    .then(() => "Connected")
    .catch(() => "Disconnected");

  dbStatus.then((status) => {
    res.json({ status: "User Service UP", port: PORT, database: status });
  });
});

// --- Endpoint para Métricas do Prometheus ---
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// --- Fim Endpoint para Métricas do Prometheus ---

// --- Servir a documentação Swagger UI ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- Fim Servir a documentação Swagger UI ---

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`[User Service] rodando na porta ${PORT}`);
});
