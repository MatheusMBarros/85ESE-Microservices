// src/usecases/CreateUser.js
// Caso de uso para criar um novo usuário.
// Esta é a camada de Application Business Rules, que orquestra o fluxo de dados.
class CreateUser {
  constructor(userRepository) {
    // Injeção de dependência do repositório, garantindo desacoplamento.
    this.userRepository = userRepository;
  }

  /**
   * Executa o caso de uso para criar um usuário.
   * @param {User} userData - A entidade User a ser criada.
   * @returns {Promise<User>} - O usuário criado.
   * @throws {Error} Se o e-mail já estiver cadastrado ou outros erros de validação/perssistência.
   */
  async execute(userData) {
    // Pode adicionar regras de negócio adicionais aqui antes de persistir
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("E-mail já cadastrado.");
    }
    return this.userRepository.save(userData);
  }
}

module.exports = CreateUser;
