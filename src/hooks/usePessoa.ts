// src/hooks/usePessoa.ts

import { useQuery } from '@tanstack/react-query';
import { pessoaRepository } from '../database/repositories/pessoaRepository';

export function usePessoa(id?: number | string) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: async () => {
      return await pessoaRepository.findById(Number(id));
    },
    enabled: !!id,
  });
}

export function usePessoas() {
  return useQuery({
    queryKey: ['pessoa'],
    queryFn: async () => {
      return await pessoaRepository.findAll();
    },
  });
}