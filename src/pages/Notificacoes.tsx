import { Bell, Check, Trash2, LogOut, Send, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Notificacoes() {
  const { notificacoes, setNotificacoes, pacientes } = useApp();

  const sorted = [...notificacoes].sort((a, b) => {
    if (a.lida !== b.lida) return a.lida ? 1 : -1;
    return b.data.localeCompare(a.data);
  });

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const marcarLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const removerLidas = () => {
    setNotificacoes((prev) => prev.filter((n) => !n.lida));
  };

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case "alta":
        return <LogOut size={18} className="text-blue-500" />;
      case "encaminhamento":
        return <Send size={18} className="text-purple-500" />;
      case "agendamento":
        return <Calendar size={18} className="text-green-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "alta":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Alta
          </span>
        );
      case "encaminhamento":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Encaminhamento
          </span>
        );
      case "agendamento":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Agendamento
          </span>
        );
      default:
        return null;
    }
  };

  const getPacienteNome = (pacienteId: string) => {
    const pac = pacientes.find((p) => p.id === pacienteId);
    return pac?.nome || "";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
          <p className="text-gray-500 text-sm">
            {naoLidas > 0
              ? `${naoLidas} notificação(ões) não lida(s)`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
        <div className="flex gap-2">
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasLidas}
              className="flex items-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Check size={16} />
              Marcar todas como lidas
            </button>
          )}
          {notificacoes.some((n) => n.lida) && (
            <button
              onClick={removerLidas}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Limpar lidas
            </button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhuma notificação.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl shadow-sm border p-4 transition-colors ${
                n.lida ? "opacity-60" : "border-l-4 border-l-purple-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcone(n.tipo)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTipoBadge(n.tipo)}
                    <span className="text-xs text-gray-400">{n.data}</span>
                    {getPacienteNome(n.pacienteId) && (
                      <span className="text-xs text-gray-500">
                        — {getPacienteNome(n.pacienteId)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{n.mensagem}</p>
                  {n.detalhes && (
                    <p className="text-xs text-gray-500 mt-1">{n.detalhes}</p>
                  )}
                </div>
                {!n.lida && (
                  <button
                    onClick={() => marcarLida(n.id)}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg flex-shrink-0"
                    title="Marcar como lida"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
