import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import formatDate from "../utils/formatDate";
import { DayPicker } from "react-day-picker";
import { ModalConsulta } from "../components/ModalConsulta";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface Agendamento {
  id: number;
  status: string;
  data: string;
  pessoa: {
    id: number;
    nome: string;
  };
  slot: {
    id: number;
    horario: string;
  };
}

const toLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};

export default function Consultar() {
  const [data, setData] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [feriados, setFeriados] = useState<string[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);



    // 🔹 Busca inicial de dados
  useEffect(() => {

    // Feriados 2026
    fetch("https://brasilapi.com.br/api/feriados/v1/2026")
      .then(res => res.json())
      .then(json => setFeriados(json.map((f: any) => f.date)))
      .catch(err => console.error("Erro feriados:", err));

    // Dias com agenda configurada
    api.get("/agenda/dias-disponiveis")
      .then(res => setDiasDisponiveis(res.data))
      .catch(err => console.error("Erro dias disponíveis:", err));
  }, []);

  async function buscarAgendamentos() {
    if (!data) return;

    try {
      setLoading(true);

      const response = await api.get(
        `/agendamentos/minha-agenda?data=${data}`
      );

      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarAgendamentos();
  }, [data]);
/*
  async function atualizarStatus(id: number, status: string) {
    try {
      const response = await api.patch(`/agendamentos/${id}/status`, { status });
      //console.log("Status atualizado:", response.data);

      // Atualiza localmente (melhor UX)
      setAgendamentos(prev =>
        prev.map(ag =>
          ag.id === id ? { ...ag, status } : ag
        )
      );

      // atualiza lista
      buscarAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    }
  }
  */

  async function handleAcao(ag: Agendamento, status: string) {
    // ❌ FALTOU → atualiza direto (sem modal)
    if (status === "FALTOU") {
      try {
        await api.patch(`/agendamentos/${ag.id}/status`, { status });
        buscarAgendamentos();
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // ✅ ATENDIDO ou CANCELADO → abre modal
    setAgendamentoSelecionado({ ...ag, status });
    setModalOpen(true);
  }
  //onsole.log("diasDisponiveis:", diasDisponiveis);

    // 🔹 Cálculos de data (Memo)
    const feriadosDate = useMemo(() => feriados.map(toLocalDate), [feriados]);

    const diasDisponiveisDate = useMemo(() => 
      diasDisponiveis.map((d: any) => {
        if (typeof d === "string") {
          return toLocalDate(d.slice(0, 10));
        }

        if (d.data) {
          return toLocalDate(d.data.slice(0, 10));
        }

        return null;
      }).filter(Boolean),
      [diasDisponiveis]
    );

    const selectedDate = useMemo(() => (data ? toLocalDate(data) : undefined), [data]);

    const diasDisponiveisFiltrado = diasDisponiveisDate.filter(
      (d): d is Date => d !== null
    );

    const feriadosFiltrado = feriadosDate.filter(
      (d): d is Date => d !== null
    );




  ////console.log("Agendamentos:", agendamentos);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">
        Atendimento de Pacientes
      </h1>

      {/* FILTRO DE DATA */}
                {/* CALENDÁRIO */}
                <div className="flex justify-center border rounded-lg p-2 bg-white">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    locale={ptBR}
                    onSelect={(d) => {
                      if (d) {
                        const formatted = format(d, "yyyy-MM-dd");
                        //console.log("Data selecionada:", formatted); // Adicione esse log
                        setData(formatted);
                      }
                    }}
                    modifiers={
                      {
                        disponivel: diasDisponiveisFiltrado,
                        feriado: feriadosFiltrado
                      }
                    }
                    modifiersStyles={{
                      disponivel: { fontWeight: 'bold', textDecoration: 'underline', color: '#16a34a' },
                      feriado: { color: '#dc2626', backgroundColor: '#fef2f2' }
                    }}
                    disabled={(date) => {
                      const dTime = startOfDay(date).getTime();
                      const diasValidos = diasDisponiveisDate.filter(
                        (d): d is Date => d !== null
                      );

                      const isDisponivel = diasValidos.some(
                        d => startOfDay(d).getTime() === dTime
                      );
                      const isFeriado = feriadosDate.some(f => startOfDay(f).getTime() === dTime);
                      return !isDisponivel || isFeriado;
                    }}
                  />
                </div>

      {/* LISTA */}
      {loading && <p className="text-center">Carregando...</p>}

      {!loading && agendamentos.length === 0 && (
        <p className="text-center text-gray-500">
          Nenhum agendamento encontrado
        </p>
      )}

      <div className="space-y-3">
        {agendamentos.map((ag) => (
          <div
            key={ag.id}
            className="border rounded p-3 shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {/* INFO */}
            <div>
              <p className="font-semibold">{ag.pessoa.nome}</p>
              <p className="text-sm text-gray-500">
                  Data: {formatDate(ag.data)} - Horário: {ag.slot.horario}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span className="font-medium">{ag.status}</span>
              </p>
            </div>

            {/* AÇÕES */}
            {ag.status !== 'AGENDADO' ? '' : (
                <div className="flex gap-2 mt-2 md:mt-0 flex-wrap">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleAcao(ag, "ATENDIDO")}
              >
                Atender
              </button>

              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleAcao(ag, "FALTOU")}
              >
                Faltou
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleAcao(ag, "CANCELADO")}
              >
                Cancelar
              </button>
            </div>
            )}
            
          </div>
        ))}
      </div>
      {modalOpen && agendamentoSelecionado && (
        <ModalConsulta
          agendamento={agendamentoSelecionado}
          onClose={() => setModalOpen(false)}
          onSuccess={buscarAgendamentos}
        />
      )}
    </div>
  );
}