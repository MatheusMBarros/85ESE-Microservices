class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      return null;
    }

    await this.userRepository.delete(userId);
    return true;
  }
}

module.exports = DeleteUser;
