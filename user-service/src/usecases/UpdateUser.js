// src/usecases/UpdateUser.js
// Caso de uso para atualizar as informações de um usuário.
class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executa o caso de uso para atualizar um usuário.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {object} userData - Os dados para atualização (ex: { name, email }).
   * @returns {Promise<User|null>} - O usuário atualizado ou null se não encontrado.
   * @throws {Error} Se os dados de atualização forem inválidos ou se o e-mail já estiver em uso.
   */
  async execute(id, userData) {
    if (Object.keys(userData).length === 0) {
      throw new Error("Dados de atualização são obrigatórios.");
    }

    // Se o e-mail estiver sendo atualizado, verificar duplicidade
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser && existingUser.id !== id) {
        throw new Error("E-mail já cadastrado para outro usuário.");
      }
    }

    return this.userRepository.update(id, userData);
  }
}

module.exports = UpdateUser;
