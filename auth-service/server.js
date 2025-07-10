// auth-service/src/server.js
// Carrega as variáveis de ambiente do .env
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes"); // Caminho relativo dentro de src/

// --- Adições para Prometheus ---
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = client.register;

// Coleta métricas padrão com um prefixo para o serviço de Autenticação
collectDefaultMetrics({ prefix: "auth_service_" });

// Cria um contador para requisições HTTP recebidas
const httpRequestCounter = new client.Counter({
  name: "auth_service_http_requests_total",
  help: "Total number of HTTP requests for Auth Service",
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
    title: "Auth Service API",
    version: "1.0.0",
    description: "Documentação da API do serviço de Autenticação.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3001}/api`,
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
    "./src/routes/*.js", // Caminho para seus arquivos de rota
    "./src/models/*.js", // Caminho para seus modelos (se contiverem JSDoc)
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Salva o swagger.yaml para ser usado pelo pipeline
const outputPath = "./swagger.yaml"; // Caminho na raiz do serviço
fs.writeFileSync(outputPath, jsyaml.dump(swaggerSpec), "utf8");
console.log(`Swagger YAML gerado em ${outputPath}`);
// --- Fim Adições para Swagger ---

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

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

// Conexão com o MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("[Auth Service] MongoDB conectado com sucesso!"))
  .catch((err) => {
    console.error("[Auth Service] Erro de conexão com MongoDB:", err.message);
    // Opcional: Terminar o processo se a conexão com o DB falhar na inicialização
    // process.exit(1);
  });

// Rotas de Autenticação
app.use("/api/auth", authRoutes);

// Rota de teste simples para verificar se o serviço está online
app.get("/api/auth/health", (req, res) => {
  res.json({
    status: "Auth Service UP",
    port: PORT,
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
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
  console.log(`[Auth Service] rodando na porta ${PORT}`);
});
