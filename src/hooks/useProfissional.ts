import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useProfissionais() {
  return useQuery({
    queryKey: ['profissionais'],
    queryFn: async () => {
      const res = await api.get(`/profissionais/`);
      ////console.log('Profissionais', res.data);
      return res.data;
    },
   
  });
}

export function useProfissional(id?: number | string) {
  return useQuery({
    queryKey: ['profissionais', id],
    queryFn: async () => {
      const res = await api.get(`/profissionais/${id}`);
      ////console.log(`Profissional ${id}`, res.data);
      return res.data;
    },
    enabled: !!id,
  });
}