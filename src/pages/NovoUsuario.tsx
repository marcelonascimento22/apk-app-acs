import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const NovoUsuario = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(
        {
            nome: "",
            telefone: "",
            cpf: "",
            email: "",
            senha: "",
            perfil: "ACS",
            ativo: true,
        }
    );

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/usuarios", form);

      alert("Usuário criado com sucesso!");
      navigate("/usuarios");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Usuário</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nome */}
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* CPF */}
        <div>
          <label className="block mb-1">CPF</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block mb-1">Telefone</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block mb-1">Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Perfil */}
        <div>
          <label className="block mb-1">Perfil</label>
          <select
            name="perfil"
            value={form.perfil}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="ADMIN">Admin</option>
            <option value="ACS">ACS</option>
            <option value="ATENDIMENTO">Atendimento</option>
          </select>
        </div>

        {/* Ativo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
          />
          <label>Usuário ativo</label>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default NovoUsuario;