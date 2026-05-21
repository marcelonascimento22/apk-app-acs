import { api } from "./api";

const getMinhasVisitas = async () => {
  const userStorage = localStorage.getItem("usuario");

  if (!userStorage) {
    throw new Error("Usuário não autenticado");
  }

  const user = JSON.parse(userStorage);

  if (!user?.id) {
    throw new Error("ID do usuário inválido");
  }

  const res = await api.get(`/visita/minhas-visitas/${user.id}`);

  return res.data;
};

export default getMinhasVisitas;