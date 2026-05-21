import { useQuery } from "@tanstack/react-query";
import api from "../services/api";



export function useListaComorbidade(){
    return useQuery({
    queryKey: ['comorbidades'],
    queryFn: async () => {
      const res = await api.get('/comorbidade');
      return res.data;
    },
  });
}