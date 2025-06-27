class ListAgendas {
  constructor(agendaRepository) {
    this.agendaRepository = agendaRepository;
  }

  async execute(filters = {}) {
    if (filters.usuarioId) {
      return this.agendaRepository.findByUserId(filters.usuarioId);
    }
    return this.agendaRepository.findAll();
  }
}
module.exports = ListAgendas;