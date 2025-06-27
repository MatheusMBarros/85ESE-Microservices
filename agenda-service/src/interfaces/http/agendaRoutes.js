const express = require('express');
const router = express.Router();

const Agenda = require('../../domain/Agenda');
const CreateAgenda = require('../../usecases/CreateAgenda');
const GetAgendaById = require('../../usecases/GetAgendaById');
const ListAgendas = require('../../usecases/ListAgendas');
const UpdateAgenda = require('../../usecases/UpdateAgenda');
const DeleteAgenda = require('../../usecases/DeleteAgenda');

const SequelizeAgendaRepository = require('../../infra/database/SequelizeAgendaRepository');

const agendaRepository = new SequelizeAgendaRepository();

const createAgenda = new CreateAgenda(agendaRepository);
const getAgendaById = new GetAgendaById(agendaRepository);
const listAgendas = new ListAgendas(agendaRepository);
const updateAgenda = new UpdateAgenda(agendaRepository);
const deleteAgenda = new DeleteAgenda(agendaRepository);

const handleError = (res, err) => {
  if (err.message.includes("obrigatório") || err.message.includes("inválido")) {
    return res.status(400).json({ error: err.message });
  }
  console.error("Erro interno do servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor." });
};

router.post('/', async (req, res) => {
  try {
    const { usuarioId, titulo, descricao, dataHora } = req.body;
    const newAgenda = new Agenda({ usuarioId, titulo, descricao, dataHora });
    const result = await createAgenda.execute(newAgenda);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const agendas = await listAgendas.execute(filters);
    res.status(200).json(agendas);
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agenda = await getAgendaById.execute(id);
    if (!agenda) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }
    res.status(200).json(agenda);
  } catch (err) {
    handleError(res, err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateAgenda.execute(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Agendamento não encontrado para atualização." });
    }
    res.status(200).json(updated);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteAgenda.execute(id);
    if (!deleted) {
      return res.status(404).json({ error: "Agendamento não encontrado para exclusão." });
    }
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;