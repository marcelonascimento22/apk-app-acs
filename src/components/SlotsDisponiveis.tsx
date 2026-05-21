interface Slot {
  id: number;
  horario: string;
  capacidade: number;
}

interface Props {
  slots: Slot[];
  onAgendar: (id: number) => void;
  agendandoId: number | null;
}

export default function SlotsDisponiveis({
  slots,
  onAgendar,
  agendandoId,
}: Props) {

  //const {data: agendamentos} = useAgendamentos();

    ////console.log("slots recebidos:", slots);

  if (!slots.length) {
    return (
      <p className="text-gray-500 text-center">
        Nenhum horário disponível
      </p>
    );
  }

  // 🔹 calcula ocupação por slot
  /*
  const ocupacao = (agendamentos || []).reduce((acc: any, a: any) => {
    const slotId = a.slot.id;

    if (!acc[slotId]) acc[slotId] = 0;

    acc[slotId]++;
    return acc;
  }, {});*/

  // 🔹 calcula slots com status
  const slotsComStatus = slots.map((slot: any) => {
    const ocupados = (slot.ocupados) || 0;
    const disponiveis = slot.capacidade - ocupados;

    return {
      ...slot,
      ocupados,
      disponiveis,
    };
  });

  ////console.log("AGENDAMENTOS:", agendamentos);


//console.log("slots:", slots);


  return (

    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {slotsComStatus.map((slot) => {
        const indisponivel = slot.disponiveis <= 0;
        const carregando = agendandoId === slot.id;
         
        return (
          
          <button
            key={slot.id}
            disabled={indisponivel || carregando}
            onClick={() => onAgendar(slot.id)}
            className={`p-3 rounded border text-center transition
              ${
                indisponivel
                  ? "bg-red-100 cursor-not-allowed"
                  : "bg-green-100 hover:bg-green-200"
              }
              ${carregando ? "opacity-50" : ""}
            `}
          >
            {/* HORÁRIO */}
            <div className="font-bold text-lg">
              {slot.horario ? slot.horario.slice(0, 5) : "--:--"}
            </div>

            {/* VAGAS */}
            <div className="text-sm mt-1">
              {indisponivel
                ? "Lotado"
                : `${slot.disponiveis} vagas`}
            </div>

            {/* LOADING */}
            {carregando && (
              <div className="text-xs mt-1">
                Agendando...
              </div>
            )}
          </button>
        );
      })
      } 
    </div>
  );
}