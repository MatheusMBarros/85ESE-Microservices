class AgendaRepository {
  async save(agenda) { throw new Error("Método não implementado"); }
  async findById(id) { throw new Error("Método não implementado"); }
  async findAll() { throw new Error("Método não implementado"); }
  async update(id, updates) { throw new Error("Método não implementado"); }
  async delete(id) { throw new Error("Método não implementado"); }
  async findByUserId(userId) { throw new Error("Método não implementado"); }
}

module.exports = AgendaRepository;