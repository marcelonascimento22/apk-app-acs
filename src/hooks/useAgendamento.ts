import { useQuery } from '@tanstack/react-query';
import api from '../services/api';


export function useAgendamentos() {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const res = await api.get('/agendamentos');
      return res.data;
    },
  });
}

export function useAgendamento(id: number | string) {
  return useQuery({
    queryKey: ['agendamento', id],
    queryFn: async () => {
      const res = await api.get(`/agendamentos/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}