import { useEffect, useMemo, useState } from "react";
import { criarAgendamento } from "../services/criarAgendamento";
import getDisponibilidade from "../services/getDisponibilidade";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "../services/api";

interface Slot {
  id: number;
  horario: string;
  capacidade: number;
  ocupados: number;
}

interface Agenda {
  id: number;
  dataPrevista: string;
  observacoes: string;
  profissional: {
    id: number;
    usuario: {
      id: number;
      nome: string;
    };
    especialidade: string;
  };
  slots: Slot[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pessoaId: number;
}

const toLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};

export default function AgendaModal({ isOpen, onClose, pessoaId }: Props) {
  const [data, setData] = useState("");
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [agendandoId, setAgendandoId] = useState<number | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [feriados, setFeriados] = useState<string[]>([]);

  // 🔹 Atalho ESC para fechar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 🔹 Busca inicial de dados
  useEffect(() => {
    if (!isOpen) return;

    // Feriados 2026
    fetch("https://brasilapi.com.br/api/feriados/v1/2026")
      .then(res => res.json())
      .then(json => setFeriados(json.map((f: any) => f.date)))
      .catch(err => console.error("Erro feriados:", err));

    // Dias com agenda configurada
    api.get("/agenda/dias-disponiveis")
      .then(res => setDiasDisponiveis(res.data))
      .catch(err => console.error("Erro dias disponíveis:", err));
  }, [isOpen]);

  // 🔹 Busca horários quando seleciona data
  useEffect(() => {
  if (!data) return;

  const fetchDisponibilidade = async () => {
    try {
      setLoading(true);
      //console.log("Chamando API para a data:", data); // Verifique se isso aparece
      const response = await getDisponibilidade(data);
      
      //console.log("Retorno da API:", response); // Se vier [], o erro é no backend/banco
      
      setAgendas(response || []);
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDisponibilidade();
}, [data, pessoaId]); // 'data' PRECISA estar aqui

  // 🔹 Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setData("");
      setAgendas([]);
      setAberto(null);
    }
  }, [isOpen]);

  // 🔹 Cálculos de data (Memo)
  const feriadosDate = useMemo(() => feriados.map(toLocalDate), [feriados]);
  const diasDisponiveisDate = useMemo(() => 
    diasDisponiveis.map(d => toLocalDate(d.slice(0, 10))), 
    [diasDisponiveis]
  );
  const selectedDate = useMemo(() => (data ? toLocalDate(data) : undefined), [data]);

  const handleAgendar = async (slotId: number) => {
    if (agendandoId) return;
    try {
      setAgendandoId(slotId);
      await criarAgendamento({ pessoaId, slotId, data, observacao: "-" });
      alert("Agendado com sucesso!");
      
      // Atualização otimista da UI
      setAgendas(prev => prev.map(agenda => ({
        ...agenda,
        slots: agenda.slots.map(slot => 
          slot.id === slotId ? { ...slot, ocupados: slot.ocupados + 1 } : slot
        )
      })));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erro ao agendar");
    } finally {
      setAgendandoId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agendar Consulta</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pessoa ID: {pessoaId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="overflow-y-auto p-6 space-y-6">
          
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
              modifiers={{ disponivel: diasDisponiveisDate, feriado: feriadosDate }}
              modifiersStyles={{
                disponivel: { fontWeight: 'bold', textDecoration: 'underline', color: '#16a34a' },
                feriado: { color: '#dc2626', backgroundColor: '#fef2f2' }
              }}
              disabled={(date) => {
                const dTime = startOfDay(date).getTime();
                const isDisponivel = diasDisponiveisDate.some(d => startOfDay(d).getTime() === dTime);
                const isFeriado = feriadosDate.some(f => startOfDay(f).getTime() === dTime);
                return !isDisponivel || isFeriado;
              }}
            />
          </div>

          {/* LISTA DE PROFISSIONAIS E HORÁRIOS */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Horários para {data ? format(toLocalDate(data), "dd/MM/yyyy") : '...'}</h3>
            
            {loading && (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-500">Buscando vagas...</span>
              </div>
            )}

            {!loading && data && agendas.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed text-gray-500">
                Nenhuma agenda encontrada para este dia.
              </div>
            )}

            {!loading && agendas.map((agenda) => {
              const slotsOrdenados = [...agenda.slots].sort((a, b) => a.horario.localeCompare(b.horario));
              const isAberto = aberto === agenda.id;

              return (
                <div key={agenda.id} className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setAberto(isAberto ? null : agenda.id)}
                    className={`w-full flex justify-between items-center p-4 text-left ${isAberto ? 'bg-green-50' : 'bg-white'}`}
                  >
                    <div>
                      <p className="font-bold text-gray-800">{agenda.profissional.usuario.nome}</p>
                      <p className="text-sm text-green-600">{agenda.profissional.especialidade}</p>
                    </div>
                    <span className={`transition-transform ${isAberto ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {isAberto && (
                    <div className="p-4 bg-white border-t grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slotsOrdenados.map((slot) => {
                        const carregandoEste = agendandoId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            disabled={slot.ocupados > 0}
                            onClick={() => handleAgendar(slot.id)}
                            className={`
                              px-3 py-2 rounded text-sm font-medium transition-colors
                              ${slot.ocupados > 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                              }
                              ${carregandoEste ? "opacity-50 cursor-wait" : ""}
                            `}
                          >
                            {carregandoEste ? "..." : `${slot.horario.slice(0, 5)}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}