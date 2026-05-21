import api from './api';

type CriarAgendamentoPayload = {
  pessoaId: number;
  slotId: number;
  data: string; // ✅ obrigatório
  observacao?: string;
  status?: string;
};

export const criarAgendamento = async (payload: CriarAgendamentoPayload) => {
  ////console.log("Criando agendamento com payload:", payload);
  const res = await api.post('/agendamentos', payload);
  ////console.log("Agendamento Criado", res.data);
  return res.data;
};