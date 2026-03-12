import { Users, UserCheck, Clock, ArrowUp } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { pacientes, atendimentos, profissionais } = useApp();

  const total = pacientes.length;
  const emAtendimento = pacientes.filter((p) => p.status === "em_atendimento").length;
  const emEspera = pacientes.filter((p) => p.status === "em_espera").length;
  const altas = pacientes.filter(
    (p) => p.status === "alta" || p.status === "alta_temporaria"
  ).length;

  const cards = [
    { label: "Total de Pacientes", value: total, icon: <Users size={24} />, color: "bg-purple-500" },
    { label: "Em Atendimento", value: emAtendimento, icon: <UserCheck size={24} />, color: "bg-green-500" },
    { label: "Em Espera", value: emEspera, icon: <Clock size={24} />, color: "bg-yellow-500" },
    { label: "Altas", value: altas, icon: <ArrowUp size={24} />, color: "bg-blue-500" },
  ];

  const atendimentosHoje = atendimentos.filter(
    (a) => a.data === new Date().toISOString().split("T")[0]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 shadow-sm border flex items-center gap-4"
          >
            <div className={`${card.color} text-white p-3 rounded-xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">Atendimentos Hoje</h3>
          {atendimentosHoje.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              Nenhum atendimento agendado para hoje
            </p>
          ) : (
            <div className="space-y-2">
              {atendimentosHoje.slice(0, 5).map((a) => {
                const pac = pacientes.find((p) => p.id === a.pacienteId);
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {pac?.nome || "Paciente"}
                      </p>
                      <p className="text-xs text-gray-400">{a.especialidade}</p>
                    </div>
                    <span className="text-sm text-gray-500">{a.horario}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">Resumo Rápido</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Total de pacientes</span>
              <span className="font-semibold">{pacientes.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Profissionais ativos</span>
              <span className="font-semibold">
                {profissionais.filter((p) => p.situacao === "ativo").length}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Atendimentos registrados</span>
              <span className="font-semibold">{atendimentos.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Desistências</span>
              <span className="font-semibold text-red-500">
                {pacientes.filter((p) => p.status === "desistencia").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
