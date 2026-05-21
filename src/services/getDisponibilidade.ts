import api from './api';

async function getDisponibilidade(data?: string) {
  const url = data ? `/disponibilidade/${data}` : `/disponibilidade`;

  const res = await api.get(url);
  //console.log("Agendamentos Disponíveis", res.data);

  return res.data;
}

export default getDisponibilidade;