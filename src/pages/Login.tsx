import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface Props {
  onLogin: () => void;
}

const ADMIN_PASSWORD = "admin123";

export default function Login({ onLogin }: Props) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem("arcoiris_admin_password") || ADMIN_PASSWORD;
    if (senha === savedPassword) {
      sessionStorage.setItem("arcoiris_auth", "true");
      onLogin();
    } else {
      setErro("Senha incorreta!");
      setTimeout(() => setErro(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🌈</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Arco-Iris</h1>
          <p className="text-gray-500 text-sm mt-1">Gestao Terapeutica</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block font-medium">
              Senha de acesso
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Senha padrao: admin123
        </p>
      </div>
    </div>
  );
}
