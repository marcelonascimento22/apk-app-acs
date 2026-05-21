
import { useState } from 'react';



import NovaVacinacao from './vacinacao/NovaVacinacao';
import NovaVacina from './vacinacao/NovaVacina';
import NovoLote from './vacinacao/NovoLote';
import VacinasAplicadas from './vacinacao/VacinasAplicadas';
import MapaCobertura from './vacinacao/MapaCobertura';

const VacinaList = () => {
  
  const [abaAtiva, setAbaAtiva] = useState<
    "mapa" | "tabela" | "nova_vacinacao" | "nova_vacina" | "novo_lote"
  >("mapa");
                                                






  /*
  //console.log('Pessoas para o mapa:', pessoas);
  //console.log('Total de pessoas:', total);
  //console.log('Total de Vacinados:', vacinados);
  //console.log('Total de Não Vacinados:', naoVacinados);
  //console.log('Cobertura vacinal:', cobertura);
  */

  return (

    <div className="relative p-4 ">

      {/* BOTÕES RESPONSIVOS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 mb-4">
        <button
          className={`w-full px-3 py-2 rounded text-sm transition ${
            abaAtiva === "mapa"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setAbaAtiva("mapa")}
        >
          Mapa
        </button>

        <button
          className={`w-full px-3 py-2 rounded text-sm transition ${
            abaAtiva === "tabela"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setAbaAtiva("tabela")}
        >
          Tabela
        </button>

        <button
          className={`w-full px-3 py-2 rounded text-sm transition ${
            abaAtiva === "nova_vacinacao"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setAbaAtiva("nova_vacinacao")}
        >
          Nova Vacinação
        </button>

        <button
          className={`w-full px-3 py-2 rounded text-sm transition ${
            abaAtiva === "nova_vacina"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setAbaAtiva("nova_vacina")}
        >
          Nova Vacina
        </button>

        <button
          className={`w-full px-3 py-2 rounded text-sm transition ${
            abaAtiva === "novo_lote"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setAbaAtiva("novo_lote")}
        >
          Novo Lote
        </button>
      </div>
    
      <div className="bg-white rounded shadow p-4">

        {abaAtiva === "nova_vacinacao" && <NovaVacinacao />}

        {abaAtiva === "nova_vacina" && <NovaVacina />}

        {abaAtiva === "novo_lote" && <NovoLote />}

        {abaAtiva === "tabela" &&  <VacinasAplicadas />}

        {abaAtiva === "mapa" && <MapaCobertura/>}
      </div>

    </div>
  );
};

export default VacinaList;