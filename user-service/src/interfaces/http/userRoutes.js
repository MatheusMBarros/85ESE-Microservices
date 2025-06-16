//src/interfaces/http/userRoutes.js
// Define as rotas HTTP para o serviço de usuários.
// Esta camada é parte das Interfaces da Clean Architecture,
// adaptando as requisições HTTP para os casos de uso.
const express = require("express");
const router = express.Router();

// Importa as entidades de domínio e casos de uso
const User = require("../../domain/User");
const CreateUser = require("../../usecases/CreateUser");
const GetUserById = require("../../usecases/GetUserById");
const UpdateUser = require("../../usecases/UpdateUser");
const ListUsers = require("../../usecases/ListUsers");

// Importa a implementação do repositório
const SequelizeUserRepository = require("../../infra/database/SequelizeUserRepository");

// Instancia o repositório
const userRepository = new SequelizeUserRepository();

// Instancia os casos de uso com a injeção de dependência do repositório
const createUser = new CreateUser(userRepository);
const getUserById = new GetUserById(userRepository);
const updateUser = new UpdateUser(userRepository);
const listUsers = new ListUsers(userRepository);

// Middleware para tratamento de erros genéricos
const handleError = (res, err) => {
  if (err.message.includes("E-mail já cadastrado")) {
    return res.status(409).json({ error: err.message }); // Conflict
  }
  if (err.message.includes("Dados de atualização são obrigatórios")) {
    return res.status(400).json({ error: err.message }); // Bad Request
  }
  if (
    err.message.includes("Nome do usuário é obrigatório") ||
    err.message.includes("E-mail do usuário é inválido")
  ) {
    return res.status(400).json({ error: err.message }); // Bad Request
  }
  console.error("Erro interno do servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor." });
};

// Rota para criar um novo usuário (POST /api/users)
router.post("/", async (req, res) => {
  try {
    console.log("chamou");
    const { name, email } = req.body;
    // Cria uma nova instância de User a partir dos dados da requisição
    const newUser = new User({ name, email });
    const result = await createUser.execute(newUser);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// Rota para listar todos os usuários (GET /api/users)
router.get("/", async (req, res) => {
  try {
    const users = await listUsers.execute();
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err);
  }
});

// Rota para obter um usuário pelo ID (GET /api/users/:id)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById.execute(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// Rota para atualizar um usuário pelo ID (PUT /api/users/:id)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body; // Dados para atualização
    const updatedUser = await updateUser.execute(id, userData);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para atualização." });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    handleError(res, err);
  }
});

// Rota para deletar um usuário pelo ID (DELETE /api/users/:id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUser.execute(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para exclusão." });
    }
    res.status(204).send(); // No Content (sucesso na exclusão sem retorno de corpo)
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
