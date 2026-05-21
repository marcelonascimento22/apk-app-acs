import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useFamilia(id?: number | string) {
  if(!id){
    return useQuery({
      queryKey: ['familia'],
      queryFn: async () => {
        const res = await api.get(`/familia`);
        return res.data;
      }
    });
  }else{
    return useQuery({
      queryKey: ['pessoa', id],
      queryFn: async () => {
        const res = await api.get(`/familia/${id}`);
        return res.data;
      },
      enabled: !!id,
    });
  }
  
}