// src/domain/User.js
// Representa a entidade de domínio do usuário.
// Esta camada é a mais interna da Clean Architecture, contendo as regras de negócio mais essenciais.
class User {
  constructor({ id, name, email }) {
    // Validações básicas de domínio
    if (!name || name.trim() === "") {
      throw new Error("Nome do usuário é obrigatório.");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("E-mail do usuário é inválido ou obrigatório.");
    }

    this.id = id;
    this.name = name;
    this.email = email;
  }

  // Métodos de negócio específicos do domínio podem ser adicionados aqui
  // Ex: `updateName(newName)` ou `changeEmail(newEmail)` com validações
}

module.exports = User;
