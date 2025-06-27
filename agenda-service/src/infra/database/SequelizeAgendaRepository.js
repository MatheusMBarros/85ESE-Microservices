const AgendaRepository = require('../../repositories/AgendaRepository');
const { AgendaModel } = require('./models/agendaModel');
const Agenda = require('../../domain/Agenda');

class SequelizeAgendaRepository extends AgendaRepository {
  async save(agenda) {
    const created = await AgendaModel.create(agenda);
    return new Agenda(created.toJSON());
  }

  async findById(id) {
    const model = await AgendaModel.findByPk(id);
    return model ? new Agenda(model.toJSON()) : null;
  }

  async findAll() {
    const models = await AgendaModel.findAll();
    return models.map(model => new Agenda(model.toJSON()));
  }

  async update(id, updates) {
    const model = await AgendaModel.findByPk(id);
    if (!model) return null;
    await model.update(updates);
    return new Agenda(model.toJSON());
  }

  async delete(id) {
    const deletedRows = await AgendaModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  async findByUserId(usuarioId) {
    const models = await AgendaModel.findAll({ where: { usuarioId } });
    return models.map(model => new Agenda(model.toJSON()));
  }
}

module.exports = SequelizeAgendaRepository;