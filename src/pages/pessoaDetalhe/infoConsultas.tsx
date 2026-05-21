import formatDate from "../../utils/formatDate"
import { useConsultas } from "../../hooks/useConsultas";
import { useParams } from "react-router-dom";

const InfoConsultas = () => {
  const { id } = useParams<{ id: string }>();
  
  const idNumber = Number(id);
  
  const { data: consultas } = useConsultas(idNumber)
  

 //console.log('consultas: ', consultas)
  //////console.log('consultas.length: ', consultas?.length)
  //////console.log('agendamentos: ', agendamentos)
  return(
    <>
    
    



      {/* 🔹 CONSULTAS (histórico ou outra entidade) */}
      <label className="font-semibold block mb-1 mt-6">
        Histórico de Consultas
      </label>

    {
      consultas && consultas.length > 0 ? 
      (

        <>
        
               
        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100">

                <th className="border px-4 py-2">Data</th>
                <th className="border px-4 py-2">Profissional</th>
                <th className="border px-4 py-2">Tipo</th>
                <th className="border px-4 py-2">Diagnostico</th>
                <th className="border px-4 py-2">Prescrição</th>
                <th className="border px-4 py-2">Descrição</th>
                <th className="border px-4 py-2">Status</th>
                
              </tr>
            </thead>

            <tbody>

              {  
                consultas?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-100">

                  
                      <td className="border px-4 py-2">
                          {formatDate(String(c.dataConsulta)) || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {c.profissionalId || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {c.diagnostico || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {c.prescricao || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {
                          c.tipo === 'prenatal' ? 'Pré-natal' :
                          c.tipo === 'rotina' ? 'Rotina' :
                          c.tipo === 'urgencia' ? 'Urgência' :
                          c.tipo === 'visita_domiciliar' ? 'Visita Domiciliar' :
                          '-'
                          }
                      </td>

                      <td className="border px-4 py-2">
                          {c.descricao || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {c.status || '-'}
                      </td>

                    
                  </tr>
                ))

              }
               
              
                
             
            </tbody>
          </table>
        </div>



        {/* MOBILE */}
        <div className="md:hidden flex flex-col gap-4">

          {  
            consultas?.map((c: any) => (
          
            <div key={c.id} className="border rounded-lg p-4 shadow">

              <p><strong>Data:</strong> {formatDate(String(c.dataConsulta)) || '-'}</p>
              <p><strong>Profissional:</strong> {c.profissionalId || '-'}</p>
              <p><strong>Tipo:</strong> {c.tipo || '-'}</p>
              <p><strong>Observações:</strong> {c.observacoes || '-'}</p>
              <p><strong>Status:</strong> {c.status || '-'}</p>
              

            </div>
            ))
          }

        </div>
          
        
        
        </>
      ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
              <p className="font-bold">Nenhuma registro encontrado</p>
              <p>Não há registros de consultas para esta pessoa.</p>
          </div>
        )
    }
    
    </>
  );
    
}

export default InfoConsultas;