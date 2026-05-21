import { useQuery } from "@tanstack/react-query";
import api from '../services/api';

export function useComorbidadePessoa(id?: number | string) {

  if(id) {
    return useQuery({
      queryKey: ['pessoa-comorbidades', id],
      queryFn: async () => {
        const res = await api.get(`/pessoa-comorbidade/pessoa/${id}`);
        return res.data;
      },
      enabled: !!id,
    });
  } else {
    return useQuery({
      queryKey: [id],
      queryFn: async () => {
        const res = await api.get(`/pessoa-comorbidade`);
        return res.data;
      }
    });
  }
    
  
}
