class UpdateAgenda {
  constructor(agendaRepository) {
    this.agendaRepository = agendaRepository;
  }
  async execute(id, updates) {
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("Dados de atualização são obrigatórios.");
    }
    return this.agendaRepository.update(id, updates);
  }
}
module.exports = UpdateAgenda;