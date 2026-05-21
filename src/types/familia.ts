import type { Pessoa } from "./pessoa";

export interface Familia {

  id: number; //obrigatório
  endereco?: string;
  descricao?: string;
  numero?: string;
  bairro?: string;
  cep?: string;

  latitude?: number;
  longitude?: number;

  pessoas?: Pessoa[];
}