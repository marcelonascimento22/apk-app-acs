import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Familia } from '../types/familia';
import ModalMapa from './ModalMapa';

const cacheCoordenadas = new Map<string, { latitude: number; longitude: number }>();

// 🔹 Props
interface Props {
  familia?: Familia;
  onClose: () => void;
  onSave: (familia: Familia) => void;
}

type FormFamilia = Omit<Familia, 'id'> & {
  id?: number;
  cidade?: string;
  estado?: string;
  acsId?: number;
};

const ModalEditFamilia = ({ familia, onClose, onSave }: Props) => {
  const queryClient = useQueryClient();

  const [abrirMapa, setAbrirMapa] = useState(false);
  const [acsList, setAcsList] = useState<{ id: number; nome: string }[]>([]);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
 //console.log("Usuário logado:", usuario);

  const [form, setForm] = useState<FormFamilia>({
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    acsId: undefined,
  });

  useEffect(() => {
    if (familia) {
      setForm({
        ...familia,
        acsId: (familia as any).acs?.id || usuario?.id,
      });
    } else {
      setForm({
        endereco: '',
        numero: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
        acsId: usuario?.perfil === "ACS" ? usuario.id : undefined,
      });
    }
  }, [familia]);

  // 🔄 buscar ACS
  useEffect(() => {
    async function fetchAcs() {
      try {
        const res = await api.get('/usuarios?perfil=ACS');
        setAcsList(res.data);

        // 🔥 se usuário for ACS → seleciona automático
        if (usuario?.tipo === "ACS") {
          setForm(prev => ({
            ...prev,
            acsId: usuario.id,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar ACS", err);
      }
    }

    fetchAcs();
  }, []);

  const handleChange = (field: keyof FormFamilia, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: field === "acsId" ? Number(value) : value,
    }));
  };

  // 🔥 mutation
  const mutation = useMutation({
    mutationFn: async (data: FormFamilia) => {
      let lat = data.latitude != null ? Number(data.latitude) : null;
      let lng = data.longitude != null ? Number(data.longitude) : null;

      const enderecoCompleto = [
        data.endereco,
        data.numero,
        data.bairro,
        "Anajás",
        "Pará",
        "Brasil",
      ]
        .filter(Boolean)
        .join(", ");

      if (lat == null && lng == null) {
        if (cacheCoordenadas.has(enderecoCompleto)) {
          const cached = cacheCoordenadas.get(enderecoCompleto)!;
          lat = cached.latitude;
          lng = cached.longitude;
        } else {
          const resGeo = await api.post("/geocode", { endereco: enderecoCompleto });
          lat = Number(resGeo.data.latitude);
          lng = Number(resGeo.data.longitude);

          cacheCoordenadas.set(enderecoCompleto, { latitude: lat, longitude: lng });
        }
      }

      const payload = {
        endereco: data.endereco,
        numero: data.numero || null,
        bairro: data.bairro || null,
        descricao: data.descricao || null,
        latitude: lat,
        longitude: lng,
        acsId: data.acsId, // 🔥 NOVO
      };
      //console.log("Payload para salvar:", payload);
      const method = data.id ? 'put' : 'post';
      const url = data.id ? `/familia/${data.id}` : `/familia`;

      const res = await api[method](url, payload);
      //console.log("Resposta da API:", res);
      return res.data;
    },

    onSuccess: (savedData) => {
      queryClient.invalidateQueries({ queryKey: ['familias'] });
      onSave(savedData);
      onClose();
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao salvar";

      alert(message);
    },
  });

  // ✅ submit
  const handleSubmit = () => {
    if (!form.endereco?.trim()) {
      alert('Endereço é obrigatório!');
      return;
    }

    if (!form.acsId) {
      alert('Selecione um ACS!');
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          {form.id ? 'Editar Endereço' : 'Novo Endereço'}
        </h2>

        <div className="space-y-3">

          {/* ACS */}
          <div>
            <label>ACS Responsável</label>
              <select
                value={form.acsId || ""}
                onChange={(e) => handleChange("acsId", e.target.value)}
                className="w-full border p-2 rounded mt-1"
                disabled={usuario?.perfil === "ACS"} // 🔥 trava
              >
                <option value="">Selecione</option>
                {acsList.map((acs) => (
                  <option key={acs.id} value={acs.id}>
                    {acs.nome}
                  </option>
                ))}
              </select>
          </div>

          {/* descrição */}
          <div>
            <label>Descrição</label>
            <input
              value={form.descricao || ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* endereço */}
          <div>
            <label>Endereço</label>
            <input
              value={form.endereco || ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* número */}
          <div>
            <label>Número</label>
            <input
              value={form.numero || ''}
              onChange={(e) => handleChange('numero', e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* bairro */}
          <div>
            <label>Bairro</label>
            <input
              value={form.bairro || ''}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* botão mapa */}
          <button
            type="button"
            onClick={() => setAbrirMapa(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Selecionar no mapa
          </button>

          {form.latitude && form.longitude && (
            <p className="text-sm text-green-600">
              📍 Localização definida
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancelar</button>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* MAPA */}
      {abrirMapa && (
        <ModalMapa
          initialLat={form.latitude}
          initialLng={form.longitude}
          onClose={() => setAbrirMapa(false)}
          onSelect={(lat, lng) => {
            setForm(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
            }));
          }}
          onAddressSelect={(endereco) => {
            setForm(prev => ({
              ...prev,
              endereco: endereco.endereco || prev.endereco,
              bairro: endereco.bairro || prev.bairro,
            }));
          }}
        />
      )}
    </div>
  );
};

export default ModalEditFamilia;