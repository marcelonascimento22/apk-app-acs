import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Vacina {
  id: number;
  nome: string;
}

export default function CriarLote() {
  const [codigo, setCodigo] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [vacinaId, setVacinaId] = useState<number | null>(null);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar vacinas
  useEffect(() => {
    async function loadVacinas() {
      const response = await api.get("/vacina");
      setVacinas(response.data);
    }

    loadVacinas();
  }, []);

  // Criar lote
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!vacinaId) {
      alert("Selecione uma vacina");
      return;
    }

    try {
      setLoading(true);

      await api.post("/lote", {
        codigo,
        validade,
        quantidade,
        vacinaId,
      });

      alert("Lote criado com sucesso!");

      // limpar formulário
      setCodigo("");
      setValidade("");
      setQuantidade(0);
      setVacinaId(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar lote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-md w-full bg-white shadow-lg rounded-xl mx-auto">
      <h2 className="text-lg font-bold text-center">Cadastrar Lote de Vacina</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Código do lote</label>
          <input
          className="border p-2 w-full rounded"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Validade</label>
          <input
          className="border p-2 w-full rounded"
            type="date"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Quantidade</label>
          <input
          className="border p-2 w-full rounded"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Vacina</label>
          <select
          className="border p-2 w-full rounded"
            value={vacinaId ?? ""}
            onChange={(e) => setVacinaId(Number(e.target.value))}
            required
          >
            <option value="">Selecione</option>
            {vacinas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nome}
              </option>
            ))}
          </select>
        </div>

        <button 
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded w-full"
        type="submit" 
        disabled={loading}>
          {loading ? "Salvando..." : "Criar Lote"}
        </button>
      </form>
    </div>
  );
}