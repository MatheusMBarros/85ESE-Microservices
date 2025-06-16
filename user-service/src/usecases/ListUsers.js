//src/usecases/ListUsers.js
// Caso de uso para listar todos os usuários.
class ListUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executa o caso de uso para listar usuários.
   * @returns {Promise<User[]>} - Uma lista de usuários.
   */
  async execute() {
    return this.userRepository.findAll();
  }
}

module.exports = ListUsers;