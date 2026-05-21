import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Vacina } from "../types/vacina";

export function useVacina(pessoaId?: number) {
  return useQuery({
    queryKey: ['vacinas', pessoaId],
    queryFn: async () => {
      const res = await api.get<Vacina[]>(`/vacinacao/pessoa/${pessoaId}`);
      return res.data;
    },
    enabled: !!pessoaId, 
  });
}

export function useVacinas() {
  return useQuery({
    queryKey: ['vacinas'],
    queryFn: async () => {
      const v = await api.get<Vacina[]>(`/vacina/`);
      ////console.log('Vacinas:', v.data); // Log para verificar os dados
      return v.data;
    },
  });
}