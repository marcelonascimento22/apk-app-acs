import { api } from './api';

export const loginService = async (email: string , senha: string) => {
  return api.post('/auth/login', { email, senha }); // Faltou o 'return'! Retorna undefined.
};