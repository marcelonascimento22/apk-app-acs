import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

interface Props {
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditarComorbidade({
  item,
  onClose,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState(item.status);
  const [novaObservacao, setNovaObservacao] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const dataAtual = new Date().toLocaleDateString('pt-BR');

      const observacaoFinal = `
${item.observacao || ''}
[${dataAtual}] ${novaObservacao}
      `.trim();

      return api.patch(`/pessoa-comorbidade/${item.id}`, {
        status,
        observacao: observacaoFinal,
      });
    },
    onSuccess,
  });

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          Editar Comorbidade
        </h2>

        {/* STATUS */}
        <div className="mb-3">
          <label>Status</label>
          <select
            className="border w-full px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Inicio de Tratamento">Inicio de Tratamento</option>
            <option value="Controlado">Controlado</option>
            <option value="Curado">Curado</option>
            <option value="Tratamento Abandonado">Tratamento Abandonado</option>
          </select>
        </div>

        {/* OBS ANTIGA */}
        <div className="mb-3">
          <label>Histórico</label>
          <textarea
            className="border w-full px-3 py-2 rounded bg-gray-100"
            value={item.observacao || ''}
            disabled
          />
        </div>

        {/* NOVA OBS */}
        <div className="mb-3">
          <label>Nova Observação</label>
          <textarea
            className="border w-full px-3 py-2 rounded"
            value={novaObservacao}
            onChange={(e) => setNovaObservacao(e.target.value)}
          />
        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded mb-4 inline-block"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-400 mb-4 inline-block"
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </div>
    </div>
  );
}