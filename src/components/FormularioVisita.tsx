import { useState } from "react";
import { api } from "../services/api";

export default function FormularioVisita({ pessoa, onClose }: any) {
  const [tipoVisita, setTipoVisita] = useState("");
  const [situacao, setSituacao] = useState("");
  const [encaminhamento, setEncaminhamento] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false); // Feedback de carregamento

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      // Usar ISOString garante compatibilidade com o tipo timestamp do Postgres
      dataVisita: new Date().toLocaleDateString("sv-SE"), 
      tipoVisita: tipoVisita || null,
      situacaoFamilia: situacao || null,
      encaminhamento: Boolean(encaminhamento),
      observacoes: observacoes || null,
      pessoaId: pessoa?.id,
      // Nota: Verifique se o seu backend exige acsId e familiaId aqui também!
      // acsId: 1, 
      // familiaId: pessoa?.familiaId, 
    };

    try {
      //console.log("Enviando PAYLOAD:", payload);
      await api.post("/visita", payload);
      
      alert("Visita salva com sucesso!");
      onClose(); // Fecha o modal/formulário após o sucesso
    } catch (error) {
      console.error("Erro ao salvar visita:", error);
      //alert("Erro ao salvar a visita. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="font-bold text-lg">Registrar Visita: {pessoa?.nome}</h2>

      <input
        placeholder="Tipo de visita (ex: Rotina, Idoso)"
        value={tipoVisita}
        onChange={(e) => setTipoVisita(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        placeholder="Situação da família"
        value={situacao}
        onChange={(e) => setSituacao(e.target.value)}
        className="border p-2 rounded"
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={encaminhamento}
          onChange={(e) => setEncaminhamento(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Gerar encaminhamento?</span>
      </label>

      <textarea
        placeholder="Observações adicionais..."
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        className="border p-2 rounded h-24"
      />

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded transition-colors`}
        >
          {loading ? "Salvando..." : "Salvar Visita"}
        </button>
      </div>
    </form>
  );
}