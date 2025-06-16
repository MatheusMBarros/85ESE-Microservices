// src/repositories/UserRepository.js
// Interface abstrata (ou contrato) para o repositório de usuários.
// Esta interface é parte da camada de interfaces da Clean Architecture,
// permitindo que os casos de uso definam o que precisam de um repositório,
// sem saber a sua implementação.
class UserRepository {
  /**
   * Salva um novo usuário ou atualiza um existente.
   * @param {User} user - A entidade User a ser salva.
   * @returns {Promise<User>} - O usuário salvo/atualizado.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async save(user) {
    throw new Error(
      "O método save() deve ser implementado pela classe concreta."
    );
  }

  /**
   * Encontra um usuário pelo ID.
   * @param {string} id - O ID do usuário.
   * @returns {Promise<User|null>} - O usuário encontrado ou null se não existir.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async findById(id) {
    throw new Error(
      "O método findById() deve ser implementado pela classe concreta."
    );
  }

  /**
   * Encontra um usuário pelo email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<User|null>} - O usuário encontrado ou null se não existir.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async findByEmail(email) {
    throw new Error(
      "O método findByEmail() deve ser implementado pela classe concreta."
    );
  }

  /**
   * Atualiza as informações de um usuário existente.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {object} updates - As propriedades a serem atualizadas.
   * @returns {Promise<User|null>} - O usuário atualizado ou null se não encontrado.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async update(id, updates) {
    throw new Error(
      "O método update() deve ser implementado pela classe concreta."
    );
  }

  /**
   * Deleta um usuário pelo ID.
   * @param {string} id - O ID do usuário a ser deletado.
   * @returns {Promise<boolean>} - True se o usuário foi deletado, False caso contrário.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async delete(id) {
    throw new Error(
      "O método delete() deve ser implementado pela classe concreta."
    );
  }

  /**
   * Lista todos os usuários.
   * @returns {Promise<User[]>} - Uma lista de todos os usuários.
   * @throws {Error} Se a implementação não for fornecida.
   */
  async findAll() {
    throw new Error(
      "O método findAll() deve ser implementado pela classe concreta."
    );
  }
}

module.exports = UserRepository;
