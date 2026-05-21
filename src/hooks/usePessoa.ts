import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function usePessoa(id?: number | string) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: async () => {
      const res = await api.get(`/pessoa/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function usePessoas() {
  return useQuery({
    queryKey: ['pessoa'],
    queryFn: async () => {
      const res = await api.get(`/pessoa/`);
      //console.log('Pessoas:', res.data); // Log para verificar os dados
      return res.data;
    },
  });
}