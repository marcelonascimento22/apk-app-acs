import { useNavigate } from "react-router-dom";

function BotaoVoltar() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 px-4 py-2 bg-gray-800 text-white rounded"
    >
      ← Voltar
    </button>
  );
}

export default BotaoVoltar;