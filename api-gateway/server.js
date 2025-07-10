const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
const authMiddleware = require("./src/authMiddleware");

// --- Adições para Prometheus ---
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = client.register;

// Coleta métricas padrão com um prefixo para o API Gateway
collectDefaultMetrics({ prefix: "api_gateway_" });

// Cria um contador para requisições HTTP que passam pelo Gateway
const httpRequestCounter = new client.Counter({
  name: "api_gateway_http_requests_total",
  help: "Total number of HTTP requests processed by API Gateway",
  labelNames: ["method", "route", "status_code"],
});
// --- Fim Adições para Prometheus ---

const app = express();
const PORT = process.env.PORT || 3000;

// URLs dos serviços a partir das variáveis de ambiente
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const AGENDA_SERVICE_URL = process.env.AGENDA_SERVICE_URL;

app.use(express.json());

// --- Middleware para contar requisições no Gateway ---
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

// Rota de Health Check do Gateway
app.get("/", (req, res) => {
  res.send("API Gateway está rodando!");
});

// --- Endpoint para Métricas do Prometheus ---
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// --- Fim Endpoint para Métricas do Prometheus ---

// Configuração dos proxies para cada serviço

// As rotas de autenticação (/login, /register) são públicas e não precisam de autenticação via middleware
if (AUTH_SERVICE_URL) {
  app.use(
    "/api/auth",
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api/auth": "/api/auth", // Reescreve o caminho, se necessário
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Gateway] Redirecionando para Auth Service: ${req.method} ${req.path}`
        );
      },
    })
  );
}

// Rotas de usuário são protegidas pelo middleware de autenticação
if (USER_SERVICE_URL) {
  app.use(
    "/api/users",
    authMiddleware, // Aplica o middleware de autenticação
    createProxyMiddleware({
      target: USER_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api/users": "/api/users",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Gateway] Redirecionando para User Service: ${req.method} ${req.path}`
        );
      },
    })
  );
}

// Rotas de agenda são protegidas pelo middleware de autenticação
if (AGENDA_SERVICE_URL) {
  app.use(
    "/api/agendas",
    authMiddleware, // Aplica o middleware de autenticação
    createProxyMiddleware({
      target: AGENDA_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api/agendas": "/api/agendas",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Gateway] Redirecionando para Agenda Service: ${req.method} ${req.path}`
        );
      },
    })
  );
}

// Tratamento de erro para rotas não encontradas no gateway
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada no API Gateway." });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
  // Avisos úteis na inicialização se as URLs dos serviços não estiverem definidas
  if (!AUTH_SERVICE_URL || !USER_SERVICE_URL || !AGENDA_SERVICE_URL) {
    console.warn(
      "AVISO: Uma ou mais URLs de serviço não estão definidas nas variáveis de ambiente. O roteamento pode não funcionar corretamente."
    );
  } else {
    console.log(`> /api/auth -> ${AUTH_SERVICE_URL}`);
    console.log(`> /api/users -> ${USER_SERVICE_URL}`);
    console.log(`> /api/agendas -> ${AGENDA_SERVICE_URL}`);
  }
});
