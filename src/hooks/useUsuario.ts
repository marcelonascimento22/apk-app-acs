import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useUsuario(id?: number | string) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const res = await api.get(`/usuarios/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
