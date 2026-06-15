import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { comorbidadeRepository } from "../database/repositories/ComorbidadeRepository";

export function useListaComorbidade() {
  return useQuery({
    queryKey: ["comorbidades"],
    queryFn: async () => {
      const local =
        await comorbidadeRepository.findAll();

      if (local.length > 0) {
        return local;
      }

      const res =
        await api.get("/comorbidade");

      return res.data;
    },
  });
}