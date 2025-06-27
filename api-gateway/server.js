const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
const authMiddleware = require("./src/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// URLs dos serviços a partir das variáveis de ambiente
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const AGENDA_SERVICE_URL = process.env.AGENDA_SERVICE_URL;

app.use(express.json());

// Rota de Health Check do Gateway
app.get("/", (req, res) => {
  res.send("API Gateway está rodando!");
});

// Configuração dos proxies para cada serviço

// As rotas de autenticação (/login, /register) são públicas
if (AUTH_SERVICE_URL) {
  app.use(
    "/api/auth",
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api/auth": "/api/auth", // Assumindo que o auth-service espera o /api/auth no path
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
    authMiddleware,
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
    authMiddleware,
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

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
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
