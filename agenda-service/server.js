const express = require("express");
require("dotenv").config();
const { sequelize } = require("./src/infra/database"); // Importa a instância do Sequelize
const agendaRoutes = require("./src/interfaces/http/agendaRoutes");

// --- Adições para Prometheus ---
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = client.register;

// Coleta métricas padrão (CPU, memória, etc.) com um prefixo para o serviço
collectDefaultMetrics({ prefix: "agenda_service_" });

// Cria um contador para requisições HTTP recebidas pelo serviço
const httpRequestCounter = new client.Counter({
  name: "agenda_service_http_requests_total",
  help: "Total number of HTTP requests for Agenda Service",
  labelNames: ["method", "route", "status_code"],
});
// --- Fim Adições para Prometheus ---

// --- Adições para Swagger ---
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const jsyaml = require("js-yaml");
const fs = require("fs"); // Módulo para manipulação de arquivos

// Definição básica da especificação OpenAPI (Swagger) para este serviço
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Agenda Service API",
    version: "1.0.0",
    description: "Documentação da API do serviço de Agendamento.",
  },
  servers: [
    {
      // A URL pode ser ajustada para o ambiente de produção/desenvolvimento
      url: `http://localhost:${process.env.PORT || 3003}/api`,
      description: "Servidor de Desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      // Definição para autenticação JWT (Bearer Token)
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      // Aplica autenticação JWT globalmente para este serviço (pode ser sobrescrito por rota)
      bearerAuth: [],
    },
  ],
};

// Opções para o swagger-jsdoc encontrar as anotações JSDoc no seu código
const swaggerOptions = {
  swaggerDefinition,
  apis: [
    "./src/interfaces/http/*.js", // Caminho para seus arquivos de rota onde estão as anotações
    "./src/domain/entities/*.js", // Caminho para seus modelos/entidades (se contiverem anotações JSDoc para schemas)
  ],
};

// Gera a especificação OpenAPI a partir das opções
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Salva o swagger.yaml na raiz do serviço. Este arquivo será coletado pelo pipeline CI/CD.
const outputPath = "./swagger.yaml";
fs.writeFileSync(outputPath, jsyaml.dump(swaggerSpec), "utf8");
console.log(`Swagger YAML gerado em ${outputPath}`);
// --- Fim Adições para Swagger ---

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// --- Middleware para contar requisições para o Prometheus ---
app.use((req, res, next) => {
  // Escuta o evento 'finish' da resposta para capturar o status code final
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

// Sincroniza o Sequelize com o banco de dados (cria tabelas se não existirem)
sequelize
  .sync()
  .then(() => {
    console.log("Modelos sincronizados com o banco de dados.");

    // Rota de Health Check básica
    app.get("/", (req, res) => {
      res.send("Agenda Service está rodando!");
    });

    // --- Endpoint para Métricas do Prometheus ---
    app.get("/metrics", async (req, res) => {
      res.set("Content-Type", register.contentType); // Define o cabeçalho Content-Type correto
      res.end(await register.metrics()); // Retorna as métricas formatadas
    });
    // --- Fim Endpoint para Métricas do Prometheus ---

    // --- Servir a documentação Swagger UI ---
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // --- Fim Servir a documentação Swagger UI ---

    // Monta as rotas de agendamento sob o prefixo /api/agendas
    app.use("/api/agendas", agendaRoutes);

    // Inicia o servidor na porta configurada
    app.listen(PORT, () => {
      console.log(`Agenda Service rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Não foi possível sincronizar os modelos com o banco de dados:",
      err
    );
    process.exit(1); // Encerra o processo se a conexão com o DB falhar
  });
