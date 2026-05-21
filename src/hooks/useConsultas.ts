import { useQuery } from '@tanstack/react-query';
import api from '../services/api';


export function useConsultas(id?: number | string) {
  return useQuery({
    queryKey: [ 'consulta', id],
    queryFn: async () => {
      const res = await api.get(`/consulta/pessoa/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}