import formatDate from "../../utils/formatDate"
import { useParams } from "react-router-dom";
import { useState } from "react";
import AgendaModal from "../../components/ModalAgenda";
import { useAgendamentosPorPessoa } from "../../hooks/useAgendamentosPorPessoa";
import cancelarAgendamento from "../../services/cancelarAgendamento";

const InfoAgendamentos = () => {
  const { id } = useParams<{ id: string }>();
  
  const idNumber = Number(id);

  const { data: agendamentos, refetch } = useAgendamentosPorPessoa(idNumber);

  const [open, setOpen] = useState(false);

  const handleCancelar = async (id: number) => {
    try {
      await cancelarAgendamento(id);

      alert("Agendamento cancelado com sucesso");     
      await refetch(); 

    } catch (error) {
      alert("Erro ao cancelar agendamento");
    }
  };

  ////console.log('consultas: ', consultas)
  //////console.log('consultas.length: ', consultas?.length)
 // //console.log('agendamentos: ', agendamentos)
  return(
    <>
      <label className="font-semibold block mb-1 mt-6">
        Consultas Agendadas
      </label>

    {
      agendamentos && agendamentos.length > 0 ? 
      (

        <>

            {/** MOVEL  */}
            <div className="md:hidden space-y-3">
              {agendamentos?.map((agendamento: any) => (
                <>
                {agendamento.status === "AGENDADO" ? (
                  <div
                    key={agendamento.id}
                    className="border p-4 rounded shadow-sm"
                  >
                    <div className="font-bold">
                      {(
                            `${agendamento.slot?.agenda?.profissional?.usuario?.nome} - 
                            ${agendamento.slot?.agenda?.profissional?.especialidade || 'Especialidade não especificada'}`
                            ) || "Profissional não especificado"}
                    </div>
                    

                    <div>
                      ⏰ {agendamento.slot?.horario?.slice(0, 5) ?? "--:--"}
                    </div>

                    <div>
                      📅 {formatDate(agendamento.data)}
                    </div>

                    <div className="text-sm mt-1">
                      Status: {agendamento.observacao || "-"}
                    </div>
                    <div className="text-sm mt-1">
                      Status: {agendamento.status || "Pendente"}
                    </div>
                    {agendamento.status !== "CANCELADO" && (
                      <button
                        onClick={() => handleCancelar(agendamento.id)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  ): ''}
                </>
              ))}
            </div>


            {/* DESKTOP */}

            <div className="hidden md:block overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Profissional</th>
                    <th className="border px-4 py-2">Horário</th>
                    <th className="border px-4 py-2">Data</th>
                    <th className="border px-4 py-2">Observação</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {agendamentos?.map((agendamento: any) => (
                    <>
                    {
                      agendamento.status === "AGENDADO" ? (
                      <tr key={agendamento.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(
                            `${agendamento.slot?.agenda?.profissional?.usuario?.nome} - 
                            ${agendamento.slot?.agenda?.profissional?.especialidade || 'Especialidade não especificada'}`
                            ) || "Profissional não especificado"}
                        </td>

                        <td className="border px-4 py-2">
                          {agendamento.slot?.horario?.slice(0, 5) ?? "--:--"}
                        </td>

                        <td className="border px-4 py-2">
                          {formatDate(agendamento.data)}
                        </td>

                        <td className="border px-4 py-2">
                          {agendamento.observacao || "-"}
                        </td>

                        <td className="border px-4 py-2">
                          {agendamento.status || "Pendente"}
                        </td>

                        <td className="border px-4 py-2 ">
                          <div className="flex justify-center">
                            {agendamento.status !== "CANCELADO" && (
                              <button
                                onClick={() => handleCancelar(agendamento.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                        ) :   ''
                    }
                    </>
                  ))}
                </tbody>
              </table>
            </div>
        
               

          
        
        
        </>
      ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
              <p className="font-bold">Nenhuma registro encontrado</p>
              <p>Não há registros de agendamentos para esta pessoa.</p>
          </div>
        )
    }
    

    <button
      onClick={() => setOpen(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      Agendar Consulta
    </button>

    <AgendaModal
      isOpen={open}
      onClose={() => setOpen(false)}
      pessoaId={idNumber}
    />
    
    </>
  );
    
}

export default InfoAgendamentos;