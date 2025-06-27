class Agenda {
  constructor({ id, usuarioId, titulo, descricao, dataHora, status = 'confirmado' }) {
    if (!usuarioId) {
      throw new Error("ID do usuário é obrigatório.");
    }
    if (!titulo || titulo.trim() === "") {
      throw new Error("Título do agendamento é obrigatório.");
    }
    if (!dataHora || isNaN(new Date(dataHora))) {
      throw new Error("Data e hora do agendamento são obrigatórias e devem ser válidas.");
    }
    
    this.id = id;
    this.usuarioId = usuarioId;
    this.titulo = titulo;
    this.descricao = descricao;
    this.dataHora = new Date(dataHora);
    this.status = status;
  }
}

module.exports = Agenda;