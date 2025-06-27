class CreateAgenda {
  constructor(agendaRepository) {
    this.agendaRepository = agendaRepository;
  }
  async execute(agendaData) {
    return this.agendaRepository.save(agendaData);
  }
}
module.exports = CreateAgenda;