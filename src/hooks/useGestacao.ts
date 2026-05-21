import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useGestacao(id?: number | string) {
  return useQuery({
    queryKey: [ 'gestacao', id],
    queryFn: async () => {
      const res = await api.get(`/gestacao/pessoa/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}