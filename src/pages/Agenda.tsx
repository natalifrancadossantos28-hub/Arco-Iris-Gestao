import { useState } from "react";
import { ChevronLeft, ChevronRight, X, AlertTriangle, Send, LogOut, Activity } from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateId, dataHoje, ESPECIALIDADES } from "../utils/helpers";
import type { Atendimento } from "../types";

export default function Agenda() {
  const {
    atendimentos,
    setAtendimentos,
    pacientes,
    profissionais,
    filaEspera,
    setFilaEspera,
    notificacoes,
    setNotificacoes,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);

  // Modal states
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [motivoAlta, setMotivoAlta] = useState("");

  const [showEncaminhamentoModal, setShowEncaminhamentoModal] = useState(false);
  const [encEspecialidade, setEncEspecialidade] = useState(ESPECIALIDADES[0]);
  const [encMotivo, setEncMotivo] = useState("");
  const [encErro, setEncErro] = useState("");

  const [feedbackMsg, setFeedbackMsg] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const getAtendimentosForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return atendimentos.filter((a) => a.data === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const getPacienteNome = (pacienteId: string) => {
    const pac = pacientes.find((p) => p.id === pacienteId);
    return pac?.nome || "Paciente não encontrado";
  };

  const getProfissionalNome = (profissionalId: string) => {
    const prof = profissionais.find((p) => p.id === profissionalId);
    return prof?.nome || "Profissional não encontrado";
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  // 1. "Em Atendimento" action
  const handleEmAtendimento = (atendimento: Atendimento) => {
    setAtendimentos((prev) =>
      prev.map((a) =>
        a.id === atendimento.id ? { ...a, status: "em_atendimento" } : a
      )
    );
    setSelectedAtendimento({ ...atendimento, status: "em_atendimento" });

    const nomePac = getPacienteNome(atendimento.pacienteId);
    setNotificacoes([
      ...notificacoes,
      {
        id: generateId(),
        tipo: "agendamento",
        mensagem: `Paciente ${nomePac} está em atendimento (${atendimento.especialidade}).`,
        data: dataHoje(),
        lida: false,
        pacienteId: atendimento.pacienteId,
        detalhes: `Horário: ${atendimento.horario} | Profissional: ${getProfissionalNome(atendimento.profissionalId)}`,
      },
    ]);

    showFeedback("Status alterado para 'Em Atendimento'. Recepção notificada.");
  };

  // 2. "Dar Alta" action
  const openAltaModal = () => {
    setMotivoAlta("");
    setShowAltaModal(true);
  };

  const confirmarAlta = () => {
    if (!motivoAlta.trim()) {
      alert("Por favor, descreva o motivo da alta.");
      return;
    }
    if (!selectedAtendimento) return;

    setAtendimentos((prev) =>
      prev.map((a) =>
        a.id === selectedAtendimento.id
          ? { ...a, status: "alta", observacoes: `${a.observacoes ? a.observacoes + " | " : ""}Motivo da Alta: ${motivoAlta}` }
          : a
      )
    );

    const nomePac = getPacienteNome(selectedAtendimento.pacienteId);
    setNotificacoes((prev) => [
      ...prev,
      {
        id: generateId(),
        tipo: "alta",
        mensagem: `Alta registrada para ${nomePac}. Horário ${selectedAtendimento.horario} liberado.`,
        data: dataHoje(),
        lida: false,
        pacienteId: selectedAtendimento.pacienteId,
        detalhes: `Motivo: ${motivoAlta} | Especialidade: ${selectedAtendimento.especialidade} | Profissional: ${getProfissionalNome(selectedAtendimento.profissionalId)}`,
      },
    ]);

    setShowAltaModal(false);
    setSelectedAtendimento(null);
    showFeedback("Alta registrada com sucesso. Recepção notificada sobre a liberação do horário.");
  };

  // 3. "Encaminhamento Interno" action
  const openEncaminhamentoModal = () => {
    setEncEspecialidade(ESPECIALIDADES[0]);
    setEncMotivo("");
    setEncErro("");
    setShowEncaminhamentoModal(true);
  };

  const confirmarEncaminhamento = () => {
    if (!selectedAtendimento) return;

    const jaExisteNaFila = filaEspera.some(
      (f) =>
        f.pacienteId === selectedAtendimento.pacienteId &&
        f.especialidade === encEspecialidade
    );

    if (jaExisteNaFila) {
      setEncErro(
        "Este paciente já possui um encaminhamento ativo/está na fila para esta especialidade."
      );
      return;
    }

    if (!encMotivo.trim()) {
      setEncErro("Por favor, descreva o motivo do encaminhamento.");
      return;
    }

    const maxPosicao = filaEspera
      .filter((f) => f.especialidade === encEspecialidade)
      .reduce((max, f) => Math.max(max, f.posicao), 0);

    setFilaEspera((prev) => [
      ...prev,
      {
        id: generateId(),
        pacienteId: selectedAtendimento.pacienteId,
        especialidade: encEspecialidade,
        dataEntrada: dataHoje(),
        posicao: maxPosicao + 1,
      },
    ]);

    const nomePac = getPacienteNome(selectedAtendimento.pacienteId);
    setNotificacoes((prev) => [
      ...prev,
      {
        id: generateId(),
        tipo: "encaminhamento",
        mensagem: `Encaminhamento interno: ${nomePac} adicionado à fila de ${encEspecialidade}.`,
        data: dataHoje(),
        lida: false,
        pacienteId: selectedAtendimento.pacienteId,
        detalhes: `Motivo: ${encMotivo} | Posição na fila: ${maxPosicao + 1} | Encaminhado por: ${getProfissionalNome(selectedAtendimento.profissionalId)}`,
      },
    ]);

    setShowEncaminhamentoModal(false);
    setSelectedAtendimento(null);
    showFeedback("Paciente encaminhado e adicionado à fila de espera. Recepção notificada.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_atendimento":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Em Atendimento
          </span>
        );
      case "alta":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Alta
          </span>
        );
      case "compareceu":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Compareceu
          </span>
        );
      case "falta":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Falta
          </span>
        );
      case "cancelado":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Agendado
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        <p className="text-gray-500 text-sm">Visualize os atendimentos agendados</p>
      </div>

      {feedbackMsg && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
          <Activity size={16} />
          {feedbackMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayAtendimentos = getAtendimentosForDay(day);
            return (
              <div
                key={day}
                className={`h-24 border rounded-lg p-1 ${
                  isToday(day) ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
              >
                <span className={`text-xs font-medium ${isToday(day) ? "text-purple-600" : "text-gray-600"}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayAtendimentos.slice(0, 2).map((a) => {
                    const pac = pacientes.find((p) => p.id === a.pacienteId);
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAtendimento(a)}
                        className="w-full text-left text-xs bg-purple-100 text-purple-700 rounded px-1 py-0.5 truncate hover:bg-purple-200 transition-colors cursor-pointer"
                      >
                        {a.horario} {pac?.nome?.split(" ")[0] || ""}
                      </button>
                    );
                  })}
                  {dayAtendimentos.length > 2 && (
                    <div className="text-xs text-gray-400">+{dayAtendimentos.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel de detalhes do atendimento com ações — Dark Neon */}
      {selectedAtendimento && !showAltaModal && !showEncaminhamentoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cyan-400">Detalhes do Atendimento</h3>
              <button
                onClick={() => setSelectedAtendimento(null)}
                className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Paciente:</span>
                <span className="text-sm font-medium text-gray-100">
                  {getPacienteNome(selectedAtendimento.pacienteId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Profissional:</span>
                <span className="text-sm font-medium text-gray-100">
                  {getProfissionalNome(selectedAtendimento.profissionalId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Especialidade:</span>
                <span className="text-sm font-medium text-gray-100">
                  {selectedAtendimento.especialidade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Data:</span>
                <span className="text-sm font-medium text-gray-100">
                  {selectedAtendimento.data}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Horário:</span>
                <span className="text-sm font-medium text-gray-100">
                  {selectedAtendimento.horario}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Status:</span>
                {getStatusBadge(selectedAtendimento.status)}
              </div>
              {selectedAtendimento.observacoes && (
                <div>
                  <span className="text-sm text-gray-400">Observações:</span>
                  <p className="text-sm text-gray-300 mt-1">{selectedAtendimento.observacoes}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs font-semibold text-cyan-400 mb-3 uppercase tracking-wide">Ações</p>
              <div className="space-y-2">
                {selectedAtendimento.status !== "em_atendimento" && selectedAtendimento.status !== "alta" && (
                  <button
                    onClick={() => handleEmAtendimento(selectedAtendimento)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                  >
                    <Activity size={16} />
                    Em Atendimento
                  </button>
                )}

                {selectedAtendimento.status !== "alta" && (
                  <button
                    onClick={openAltaModal}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"
                  >
                    <LogOut size={16} />
                    Dar Alta
                  </button>
                )}

                {selectedAtendimento.status !== "alta" && (
                  <button
                    onClick={openEncaminhamentoModal}
                    className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(192,38,211,0.5)] transition-all"
                  >
                    <Send size={16} />
                    Encaminhamento Interno
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dar Alta — Dark Neon */}
      {showAltaModal && selectedAtendimento && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cyan-400">Dar Alta</h3>
              <button
                onClick={() => setShowAltaModal(false)}
                className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-2">
              Paciente: <strong className="text-gray-100">{getPacienteNome(selectedAtendimento.pacienteId)}</strong>
            </p>

            <div className="mb-4">
              <label className="text-sm font-medium text-cyan-300 mb-1 block">
                Motivo da Alta *
              </label>
              <textarea
                value={motivoAlta}
                onChange={(e) => setMotivoAlta(e.target.value)}
                placeholder="Descreva o motivo da alta..."
                rows={4}
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none placeholder-gray-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAltaModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAlta}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"
              >
                <LogOut size={16} />
                Confirmar Alta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Encaminhamento Interno — Dark Neon */}
      {showEncaminhamentoModal && selectedAtendimento && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-fuchsia-400">Encaminhamento Interno</h3>
              <button
                onClick={() => setShowEncaminhamentoModal(false)}
                className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              Paciente: <strong className="text-gray-100">{getPacienteNome(selectedAtendimento.pacienteId)}</strong>
            </p>

            {encErro && (
              <div className="bg-red-900/50 text-red-300 text-sm p-3 rounded-lg mb-4 flex items-center gap-2 border border-red-700">
                <AlertTriangle size={16} />
                {encErro}
              </div>
            )}

            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium text-fuchsia-300 mb-1 block">
                  Especialidade de Destino *
                </label>
                <select
                  value={encEspecialidade}
                  onChange={(e) => {
                    setEncEspecialidade(e.target.value);
                    setEncErro("");
                  }}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none"
                >
                  {ESPECIALIDADES.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-fuchsia-300 mb-1 block">
                  Motivo do Encaminhamento *
                </label>
                <textarea
                  value={encMotivo}
                  onChange={(e) => {
                    setEncMotivo(e.target.value);
                    setEncErro("");
                  }}
                  placeholder="Descreva o motivo do encaminhamento..."
                  rows={4}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none resize-none placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEncaminhamentoModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEncaminhamento}
                className="flex-1 flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(192,38,211,0.5)] transition-all"
              >
                <Send size={16} />
                Encaminhar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
