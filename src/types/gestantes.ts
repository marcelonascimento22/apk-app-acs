export interface Gestantes {
  id: number;
  dataUltimaMenstruacao: string;
  dataPrevistaParto: string;
  altoRisco: boolean;
  observacoes: string | null;
  pessoa: {
    id: number;
    nome: string;
    dataNascimento?: string;
    cpf: string;
    sus: number;
    telefone?: string;
  };
};