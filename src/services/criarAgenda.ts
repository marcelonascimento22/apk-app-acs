import { api } from "./api";

type CriarAgendaPayload = {
    dataPrevista: string;
    profissionalId: number;
    horaInicio: string;
    horaFim: string;
    quantidadeAtendimentos: number;
    observacoes: string;
}
const CriarAgenda = async (payload: CriarAgendaPayload) => {
    //console.log("Payload para criar agenda:", payload);
    const res = await api.post('/agenda', payload);
    //console.log("Resposta da criação de agenda:", res.data);
    return res.data;
}
export default CriarAgenda;
