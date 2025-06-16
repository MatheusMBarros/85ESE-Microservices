// src/usecases/GetUserById.js
// Caso de uso para obter um usuário pelo ID.
class GetUserById {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executa o caso de uso para obter um usuário.
   * @param {string} id - O ID do usuário a ser obtido.
   * @returns {Promise<User|null>} - O usuário encontrado ou null.
   */
  async execute(id) {
    return this.userRepository.findById(id);
  }
}

module.exports = GetUserById;
