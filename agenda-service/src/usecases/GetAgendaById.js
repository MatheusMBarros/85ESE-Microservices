class GetAgendaById {
    constructor(agendaRepository) { this.agendaRepository = agendaRepository; }
    async execute(id) { return this.agendaRepository.findById(id); }
}
module.exports = GetAgendaById;