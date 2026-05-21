import type { Familia } from "./familia";

export interface Pessoa {
  id: number;
  nome: string;
  cpf?: string;
  sus?: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  familiaId?: number;
  familia?: Familia;
  
}

export interface CreatePessoaDto {
  nome: string;
  cpf: string;
  sus: string;
  dataNascimento: string;
  sexo: string;
  telefone?: string;
  familia?: any;
  familiaId?: number;
}