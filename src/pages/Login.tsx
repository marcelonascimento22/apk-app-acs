import { useState } from "react";
import { loginService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");


  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async () => {
    if (!email || !senha) {
      setErro("Preencha email e senha");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const res = await loginService(email, senha);

      if (res && res.data) {
        
        const token = res.data.access_token;
        const usuario = res.data.usuario;
        ////console.log("Resposta do login:", res);
        ////console.log("ANTES DO STORAGE");

        localStorage.setItem("token", token);
        // 1. Salva o usuário (se quiser manter no storage)
        localStorage.setItem("usuario", JSON.stringify(usuario));

        // 2. CHAMA O LOGIN DO CONTEXTO (Isso vai disparar o setToken e atualizar o App)
        login(token);

        ////console.log("ANTES DO NAVIGATE");
        navigate("/");
      }
    } catch (error: unknown) {
      let msg = "Erro ao fazer login";

      if (axios.isAxiosError(error)) {
        console.error("Erro completo:", error.response);

        msg =
          error.response?.data?.message ||
          `Erro ${error.response?.status}` ||
          "Erro na API";
      } else {
        console.error("Erro inesperado:", error);
      }

      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl text-center font-bold mb-4">
          Login
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          {erro && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="joao@teste.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              placeholder="******"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}