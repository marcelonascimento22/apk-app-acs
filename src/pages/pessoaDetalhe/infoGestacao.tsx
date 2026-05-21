import formatDate from "../../utils/formatDate"
import { useGestacao } from "../../hooks/useGestacao";
import { useParams } from "react-router-dom";

const InfoGestacao = () => {
  const { id } = useParams();
  
  const { data: gestacao } = useGestacao(id)

  //////console.log('Gestação: ', gestacao)
  return(
    <>
    {gestacao && gestacao.length > 0 && (
      <>
      <label className="font-semibold block mb-1 mt-6">Gestantação</label>
      
      {
        gestacao && gestacao.length > 0 ?
          ( 
            <>
            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
            

            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100">

                  <th className="border px-4 py-2">Alto Risco</th>
                  <th className="border px-4 py-2">Data da Ultima Mestruação</th>
                  <th className="border px-4 py-2">Observação</th>
                  <th className="border px-4 py-2">Data Prevista Parto</th>
                  
                </tr>
              </thead>

              <tbody>
                
                  <tr key={gestacao[0].id} className="hover:bg-gray-100">

                  
                      <td className="border px-4 py-2">
                          {gestacao[0].altoRisco ? 'Sim' : 'Não'}
                      </td>

                      <td className="border px-4 py-2">
                          {gestacao[0].dataUltimaMenstruacao
  || '-'}
                      </td>

                      <td className="border px-4 py-2">
                          {gestacao[0].observacoes || '-'}
                      </td>
                    
                      <td className="border px-4 py-2">
                          {formatDate(gestacao[0].dataPrevistaParto) || '-'}
                      </td>

                    
                  </tr>
              
              </tbody>
            </table>
          </div>



          {/* MOBILE */}
              <div className="md:hidden flex flex-col gap-4">
                
                  <div key={gestacao[0].id} className="border rounded-lg p-4 shadow">

                    <p><strong>Alto Risco:</strong> {gestacao[0].altoRisco ? 'Sim' : 'Não'}</p>
                    <p><strong>Data da Ultima Mestruação:</strong> {gestacao[0].dataUltimaMenstruacao
  || '-'}</p>
                    <p><strong>Observações:</strong> {gestacao[0].observacoes || '-'}</p>
                    <p><strong>Data Prevista Parto</strong> {formatDate(String(gestacao[0].dataPrevistaParto)) || '-'}</p>               

                  </div>

              </div>
            </>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
                <p className="font-bold">Nenhuma registro encontrado</p>
                <p>Não há registros de gravidez para esta pessoa.</p>
            </div>
          )
        

      }
      </>
    )}  
    </>
  );
    
}

export default InfoGestacao;