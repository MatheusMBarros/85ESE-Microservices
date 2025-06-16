// src/infra/database/SequelizeUserRepository.js
// Implementação do repositório de usuários usando Sequelize e PostgreSQL.
// Esta classe é parte da Infraestrutura, adaptando a interface do repositório aos detalhes do banco de dados.
const UserRepository = require("../../repositories/UserRepository");
const { UserModel } = require("./models/userModel");
const User = require("../../domain/User");

class SequelizeUserRepository extends UserRepository {
  /**
   * Salva um novo usuário no banco de dados.
   * @param {User} user - A entidade User a ser salva.
   * @returns {Promise<User>} - O usuário salvo.
   */
  async save(user) {
    try {
      // Cria o registro no banco de dados
      const created = await UserModel.create(user);
      // Retorna uma nova instância da entidade de domínio User
      return new User(created.toJSON());
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("E-mail já cadastrado.");
      }
      console.error("Erro no repositório ao salvar usuário:", error);
      throw new Error(`Erro ao salvar usuário: ${error.message}`);
    }
  }

  /**
   * Encontra um usuário pelo ID no banco de dados.
   * @param {string} id - O ID do usuário.
   * @returns {Promise<User|null>} - O usuário encontrado ou null.
   */
  async findById(id) {
    const userModel = await UserModel.findByPk(id);
    return userModel ? new User(userModel.toJSON()) : null;
  }

  /**
   * Encontra um usuário pelo email no banco de dados.
   * @param {string} email - O email do usuário.
   * @returns {Promise<User|null>} - O usuário encontrado ou null.
   */
  async findByEmail(email) {
    const userModel = await UserModel.findOne({ where: { email } });
    return userModel ? new User(userModel.toJSON()) : null;
  }

  /**
   * Atualiza as informações de um usuário existente.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {object} updates - As propriedades a serem atualizadas.
   * @returns {Promise<User|null>} - O usuário atualizado ou null se não encontrado.
   */
  async update(id, updates) {
    const userModel = await UserModel.findByPk(id);
    if (!userModel) {
      return null;
    }
    try {
      await userModel.update(updates);
      return new User(userModel.toJSON());
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("E-mail já cadastrado para outro usuário.");
      }
      console.error("Erro no repositório ao atualizar usuário:", error);
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Deleta um usuário pelo ID.
   * @param {string} id - O ID do usuário a ser deletado.
   * @returns {Promise<boolean>} - True se o usuário foi deletado, False caso contrário.
   */
  async delete(id) {
    const deletedRows = await UserModel.destroy({
      where: { id },
    });
    return deletedRows > 0;
  }

  /**
   * Lista todos os usuários.
   * @returns {Promise<User[]>} - Uma lista de todos os usuários.
   */
  async findAll() {
    const userModels = await UserModel.findAll();
    return userModels.map((userModel) => new User(userModel.toJSON()));
  }
}

module.exports = SequelizeUserRepository;
