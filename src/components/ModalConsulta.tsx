import { useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export function ModalConsulta({ agendamento, onClose, onSuccess }: any) {
  const [descricao, setDescricao] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [prescricao, setPrescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);
    const isCancelamento = agendamento.status === "CANCELADO";

  async function salvar() {

    try {
      setLoading(true);
        //console.log('Agendamento para salvar', agendamento)
        ////console.log('Data', new Date().toLocaleDateString("sv-SE"))
        await api.post("/consulta/atender", {
            pessoaId: agendamento.pessoa.id,
            dataConsulta: String(new Date().toLocaleDateString("sv-SE")),
            tipo, 
            profissionalId: agendamento.slot.agenda.profissional.id, 
            descricao,
            diagnostico,
            prescricao,
            status: agendamento.status,
            agendamentoId: agendamento.id, // opcional (se backend usar)
        });

        ////console.log('request', resquest)
        

      onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Erro completo:", err.response?.data);
      } else {
        console.error("Erro desconhecido:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  //console.log('Agendamento no modal', agendamento)
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-full max-w-lg">
        <h2 className="text-lg font-bold mb-2">
          {agendamento.status === "CANCELADO"
            ? "Cancelar Atendimento"
            : "Atendimento"}
        </h2>

        {isCancelamento ? (
          <textarea
            placeholder="Motivo do cancelamento"
            className="w-full border p-2 mb-2"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        ) : (
          <>
        <label htmlFor="tipoConsulta" className="block mb-1 font-semibold">Tipo de Consulta</label>
          <select
            id="tipoConsulta"
            className="w-full border p-2 mb-2"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          > 
            <option value='rotina' selected>Rotina</option>
            <option value='prenatal'>Prenatal</option>
            <option value='urgencia'>Urgencia</option>
            <option value='visita_domiciliar'>Visita Domiciliar</option>
          </select>
        
        
        <label className="block mb-1 font-semibold">Descrição
          <textarea
            placeholder="Descrição"
            className="w-full border p-2 mb-2"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        <label className="block mb-1 font-semibold">Diagnóstico
          <input
            placeholder="Diagnóstico"
            className="w-full border p-2 mb-2"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
          />
        </label>

        <label className="block mb-1 font-semibold">Prescrição
          <input
            placeholder="Prescrição"
            className="w-full border p-2 mb-2"
            value={prescricao}
            onChange={(e) => setPrescricao(e.target.value)}
          />
        </label>
        </>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={salvar}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Salvando..." : isCancelamento ? "Confirmar Cancelamento" : "Finalizar Atendimento"}
          </button>
        </div>

      </div>
    </div>
  );
}