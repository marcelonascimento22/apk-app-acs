import { useState } from 'react';
import api from '../../services/api';

const NovaVacina = () => {
  const [form, setForm] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    fabricante: '',
    doseRecomendada: '',
    viaAdministracao: '',
    grupoAlvo: '',
    intervaloDoses: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.nome) {
      alert('Nome da vacina é obrigatório');
      return;
    }

    try {
      setLoading(true);

      await api.post('/vacina', {
        ...form,
        intervaloDoses: Number(form.intervaloDoses) || 0,
      });

      //console.log('Vacina criada:', response.data);

      alert('Vacina cadastrada com sucesso!');

      setForm({
        nome: '',
        codigo: '',
        descricao: '',
        fabricante: '',
        doseRecomendada: '',
        viaAdministracao: '',
        grupoAlvo: '',
        intervaloDoses: '',
      });

    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || 'Erro ao cadastrar vacina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-4 max-w-md w-full bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-xl font-bold text-center">
          Nova Vacina
        </h2>

        <input
          name="nome"
          placeholder="Nome da vacina"
          value={form.nome}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="fabricante"
          placeholder="Fabricante"
          value={form.fabricante}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          name="doseRecomendada"
          placeholder="Dose recomendada"
          value={form.doseRecomendada}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="viaAdministracao"
          placeholder="IM, SC, VO, ID"
          value={form.viaAdministracao}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="grupoAlvo"
          placeholder="Grupo alvo"
          value={form.grupoAlvo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          name="intervaloDoses"
          placeholder="Intervalo entre doses (dias)"
          value={form.intervaloDoses}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <button
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default NovaVacina;