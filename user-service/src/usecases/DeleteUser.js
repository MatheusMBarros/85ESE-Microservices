class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    // Ajustado para usar findById() que é o método correto da interface UserRepository
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    await this.userRepository.delete(userId);
    return true; // Retorna true para indicar que a exclusão foi bem-sucedida
  }
}

module.exports = DeleteUser;
