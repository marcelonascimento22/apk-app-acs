import axios from "axios";

export async function buscarCoordenadas(endereco: string) {
  try {
    const url = "https://nominatim.openstreetmap.org/search";

    const response = await axios.get(url, {
      params: {
        q: endereco,
        format: "json",
        limit: 1,
      },
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    const { lat, lon } = response.data[0];

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}