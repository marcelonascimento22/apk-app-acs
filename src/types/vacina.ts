export interface Lotes {
    id: number;
    codigo: string;
    validade?: string;
  };

export interface Vacina {
  id: number;
  nomeVacina?: string | null;
  dataAplicacao?: string;
  dose?: number;
  lotes: Lotes[];
  pessoa?: {
    id: number;
    nome: string;
    cpf: string;
    sus: string;
    telefone?: string;
  };
};