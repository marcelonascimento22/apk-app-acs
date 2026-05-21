import { useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import type { Feature } from "geojson";
import api from "../services/api";

type Props = {
  zona: any;
  onEachZona: any;
  cores: string[];
};

export function ZonaLayer({ zona, onEachZona, cores }: Props) {
  // 1. Memoiza a geometria para não processar o JSON toda hora
  const geometry = useMemo(() => {
    if (!zona.geometria) return null;
    return typeof zona.geometria === "string"
      ? JSON.parse(zona.geometria)
      : zona.geometria;
  }, [zona.geometria]);

  // 2. Busca o ACS (Agente Comunitário de Saúde) da zona
  const { data: usuariosZona } = useQuery({
    queryKey: ["usuarios-zonas", zona.id],
    queryFn: async () => {
      const res = await api.get(`/usuarios-zonas/zona/${zona.id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // Dados ficam "frescos" por 10 minutos
  });

  const acs = usuariosZona?.[0]?.usuario;

  // 3. Constrói o objeto GeoJSON Feature de forma estável
  const feature = useMemo((): Feature | null => {
    if (!geometry) return null;
    
    return {
      type: "Feature",
      properties: {
        id: zona.id,
        acsId: acs?.id ?? null,
        acsNome: acs?.nome ?? "Sem ACS",
        nome: zona.nome,
        descricao: zona.descricao,
      },
      geometry,
    };
  }, [zona, acs, geometry]);

  if (!feature) return null;

  // 4. Define a cor com um fallback de segurança
  const cor = cores[Number(zona.id) % cores.length] || "#3388ff";

  return (
    <GeoJSON
      /* ESTRATÉGIA CHAVE: A 'key' força o Leaflet a remontar o componente 
         assim que o nome do ACS for carregado pela API. 
      */
      key={`zona-${zona.id}-${acs?.id ?? 'loading'}`}
      data={feature}
      onEachFeature={onEachZona}
      style={{
        color: cor,
        fillColor: cor,
        fillOpacity: 0.3,
        weight: 2,
      }}
    />
  );
}