import api from "./api";

const cancelarAgendamento = async (id: number) => {
  const response = await api.patch(`/agendamentos/${id}/cancelar`);
  return response.data;
};

export default cancelarAgendamento;