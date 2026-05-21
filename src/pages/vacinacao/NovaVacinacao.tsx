import { useState } from 'react';
import api from '../../services/api';
import { usePessoas } from '../../hooks/usePessoa';
import { useVacinas } from '../../hooks/useVacina';
import formatDate from '../../utils/formatDate';
import  type { Lotes } from '../../types/vacina';



const NovaVacinacao = () => {
  const { data: pessoas } = usePessoas();
  const { data: vacinas } = useVacinas();

  const [form, setForm] = useState({
    pessoaId: '',
    vacinaId: '',
    dose: '',
    dataAplicacao: '',
    lote: '',
  });

  const [loading, setLoading] = useState(false);

  // 🔥 vacina selecionada
  const vacinaSelecionada = vacinas?.find(
    (v) => v.id === Number(form.vacinaId)
  );

  // 🔥 handle change com reset de lote
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === 'vacinaId') {
      setForm(prev => ({
        ...prev,
        vacinaId: value,
        lote: '', // 👈 limpa lote ao trocar vacina
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.pessoaId || !form.vacinaId || !form.dose || !form.dataAplicacao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      await api.post('/vacinacao', {
        pessoaId: Number(form.pessoaId),
        vacinaId: Number(form.vacinaId),
        dose: Number(form.dose),
        dataAplicacao: form.dataAplicacao,
        lote: form.lote || null,
      });

      alert('Vacina registrada com sucesso!');

      // 🔥 limpa form
      setForm({
        pessoaId: '',
        vacinaId: '',
        dose: '',
        dataAplicacao: '',
        lote: '',
      });

    } catch (error) {
      console.error(error);
      alert('Erro ao registrar vacina');
    } finally {
      setLoading(false);
    }
  };

  //console.log('Vacinas:', vacinas);

  return (
    <div className="p-6 space-y-4 max-w-md w-full bg-white shadow-lg rounded-xl mx-auto" >
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md ">

        <h2 className="text-lg font-bold text-center">Nova Vacinação</h2>

        {/* 👤 Pessoa */}
        <select
          name="pessoaId"
          value={form.pessoaId}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Selecione a pessoa</option>
          {pessoas?.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        {/* 💉 Vacina */}
        <select
          name="vacinaId"
          value={form.vacinaId}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Selecione a vacina</option>
          {vacinas?.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.nome}
            </option>
          ))}
        </select>

        {/* 🏷️ LOTE DINÂMICO */}
        <select
          name="lote"
          value={form.lote}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          
          
          disabled={!form.vacinaId}
        >
          <option value="">Selecione o lote</option>

          {vacinaSelecionada?.lotes.length ? (
            vacinaSelecionada.lotes.map((l: Lotes) => (
              <option key={l.id} value={l.codigo}>
                {l.codigo}
                {l.validade
                  ? ` - validade: ${formatDate(String(l.validade))}`
                  : ''}
              </option>
            ))
          ) : (
            <option disabled>Sem lotes disponíveis</option>
          )}
        </select>

        {/* 🔢 Dose */}
        <input
          type="number"
          name="dose"
          placeholder="Dose (ex: 1, 2, 3)"
          value={form.dose}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* 📅 Data */}
        <input
          type="date"
          name="dataAplicacao"
          value={form.dataAplicacao}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* 🔥 BOTÃO */}
        <button
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

export default NovaVacinacao;