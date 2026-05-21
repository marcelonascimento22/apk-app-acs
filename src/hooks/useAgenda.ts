import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

interface Slot {
  id: number;
  horario: string;
  capacidade: number;
  ocupados: number;
}

interface Profissional {
  id: number;
  usuario: {
    id: number;
    nome: string;
  };
  especialidade: string;
}

interface Agenda {
  id: number;
  dataPrevista: string;
  profissional: Profissional;
  observacoes: string;
  slots: Slot[];
}

export function useAgenda() {
  return useQuery<Agenda[]>({
    queryKey: ['agenda'],
    queryFn: async () => {
      const res = await api.get('/agenda');
      ////console.log('Dados da agenda recebidos:', res.data);
      return res.data;
    },
  });
}