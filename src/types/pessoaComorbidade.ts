import type { Comorbidade } from "./comorbidade";

export interface PessoaComorbidade {
  id: number;
  dataDiagnostico?: string;
  observacao?: string;
  status: string;
  comorbidade: Comorbidade;
}