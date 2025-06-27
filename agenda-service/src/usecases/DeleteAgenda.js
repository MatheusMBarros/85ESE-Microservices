class DeleteAgenda {
  constructor(agendaRepository) {
    this.agendaRepository = agendaRepository;
  }
  async execute(id) {
    return this.agendaRepository.delete(id);
  }
}
module.exports = DeleteAgenda;