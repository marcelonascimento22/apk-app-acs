import { api } from "./api";

export async function cancelarAgenda(agendaId: number, obs: string) {
  const request = await api.patch(`/agenda/${agendaId}/cancelar`, {
    obs
  });
  
  return request;
}