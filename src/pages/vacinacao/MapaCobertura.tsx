import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { useVacinas } from "../../hooks/useVacina";

const MapaCobertura = () => {
    const [vacinaId, setVacinaId] = useState<number>(1);
    const [status, setStatus] = useState<'tomou' | 'nao_tomou' | 'todos'>('todos');
    const { data: vacinas } = useVacinas();

    // 🔹 Buscar pessoas para o mapa
    const { data: pessoas } = useQuery({
        queryKey: ['mapa-vacina', vacinaId, status],
        queryFn: async () => {
        const res = await api.get(`/pessoa/vacinacao-status`, {
            params: { vacinaId, status }
        });
        return res.data;
        }
    });

    const iconTomou = L.divIcon({
        className: 'custom-icon',
        html: '<div style="background: green; width: 12px; height: 12px; border-radius: 50%"></div>',
    });

    const iconNaoTomou = L.divIcon({
        className: 'custom-icon',
        html: '<div style="background: red; width: 12px; height: 12px; border-radius: 50%"></div>',
    });

    function getOffsetCoord(lat: number, lng: number) {
        const offset = 0.0001; // ajuste fino
        return [
        lat + (Math.random() - 0.5) * offset,
        lng + (Math.random() - 0.5) * offset,
        ];
    }
    
    const total = pessoas?.length || 0;
    const vacinados = pessoas?.filter((p: any) => p.tomouVacina).length || 0;
    const naoVacinados = total - vacinados;

    const cobertura = total > 0
        ? ((vacinados / total) * 100).toFixed(1)
        : 0;

    return(
        <>
        {/* 🔹 FILTROS */}
        <div className="flex gap-4 mb-4">
          <select 
          className='border p-2 w-full rounded'
          onChange={(e) => setVacinaId(Number(e.target.value))}>
            <option value="">Selecione a vacina</option>
            {vacinas?.map((v: any) => (
                <option key={v.id} value={v.id}>
                {v.nome}
                </option>
            ))}
          </select>

          <select 
          className='border p-2 w-full rounded'
          onChange={(e) => setStatus(e.target.value as any)}>
            <option value="todos">Todos</option>
            <option value="tomou">Tomou</option>
            <option value="nao_tomou">Não tomou</option>
          </select>
        </div>
          
        <div className="relative">
            {/* 🔥 PAINEL SOBRE O MAPA */}
            {status === 'todos' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-6 py-4 flex gap-6 items-center border border-gray-200">

                {/* TOTAL */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-800">{total}</p>
                </div>

                {/* DIVIDER */}
                <div className="w-px h-8 bg-gray-300"></div>

                {/* VACINADOS */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">Vacinados</p>
                  <p className="text-lg font-bold text-green-600">{vacinados}</p>
                </div>

                <div className="w-px h-8 bg-gray-300"></div>

                {/* NÃO VACINADOS */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">Não vacinados</p>
                  <p className="text-lg font-bold text-red-600">{naoVacinados}</p>
                </div>

                <div className="w-px h-8 bg-gray-300"></div>

                {/* COBERTURA */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">Cobertura</p>
                  <p className="text-lg font-bold text-blue-600">
                    {cobertura}%
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* 🔥 MAPA */}
          <MapContainer
            center={[-0.9853, -49.939]} // ajuste pra sua cidade
            zoom={16}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pessoas?.map((pessoa: any) => {
              if (!pessoa.familia?.latitude || !pessoa.familia?.longitude) return null;

              const tomou = pessoa.tomouVacina;

              const [lat, lng] = getOffsetCoord(
                Number(pessoa.familia.latitude),
                Number(pessoa.familia.longitude)
              );

              return (
                <Marker
                  key={pessoa.id}
                  icon={tomou ? iconTomou : iconNaoTomou}
                  position={[lat, lng]}
                >
                  <Popup>
                    <strong>{pessoa.nome}</strong><br />
                    {tomou ? '✅ Vacinado' : '❌ Não vacinado'}
                  </Popup>
                </Marker>
              );
            })}

            {pessoas
              ?.filter((p: any) => p.familia?.latitude && p.familia?.longitude)
              .map((pessoa: any) => {
                const [lat, lng] = getOffsetCoord(
                  Number(pessoa.familia.latitude),
                  Number(pessoa.familia.longitude)
                );

                return (
                  <Marker
                    key={pessoa.id}
                    icon={pessoa.tomouVacina ? iconTomou : iconNaoTomou}
                    position={[lat, lng]}
                  >
                    <Popup>
                      <strong>{pessoa.nome}</strong>
                      <br />
                      {pessoa.tomouVacina ? "✅ Vacinado" : "❌ Não vacinado"}
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
          
        </div>
        
        </>
    )
}

export default  MapaCobertura;