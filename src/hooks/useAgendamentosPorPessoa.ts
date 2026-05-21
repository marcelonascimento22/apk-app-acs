import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useAgendamentosPorPessoa(pessoaId: number) {
  return useQuery({
    queryKey: ["agendamentos", pessoaId],
    queryFn: async () => {
      const res = await api.get(`/agendamentos/pessoa/${pessoaId}`);
      ////console.log("Agendamentos por pessoa:", res.data);
      return res.data;
    },
    enabled: !!pessoaId,
  });
}