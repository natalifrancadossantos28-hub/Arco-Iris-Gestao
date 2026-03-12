import { useState } from "react";
import { Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateId, dataHoje, ESPECIALIDADES } from "../utils/helpers";

export default function RegistrarAtendimento() {
  const { pacientes, profissionais, atendimentos, setAtendimentos } = useApp();

  const [pacienteId, setPacienteId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [especialidade, setEspecialidade] = useState(ESPECIALIDADES[0]);
  const [data, setData] = useState(dataHoje());
  const [horario, setHorario] = useState("");
  const [status, setStatus] = useState("compareceu");
  const [observacoes, setObservacoes] = useState("");
  const [msg, setMsg] = useState("");

  const handleSave = () => {
    if (!pacienteId || !profissionalId || !data || !horario) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    setAtendimentos([
      ...atendimentos,
      {
        id: generateId(),
        pacienteId,
        profissionalId,
        especialidade,
        data,
        horario,
        status,
        observacoes,
      },
    ]);
    setPacienteId("");
    setProfissionalId("");
    setHorario("");
    setObservacoes("");
    setMsg("Atendimento registrado com sucesso!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registrar Atendimento</h1>
        <p className="text-gray-500 text-sm">Registre um novo atendimento</p>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{msg}</div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm border max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Paciente *</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Selecione...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Profissional *</label>
            <select
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Selecione...</option>
              {profissionais.filter((p) => p.situacao === "ativo").map((p) => (
                <option key={p.id} value={p.id}>{p.nome} - {p.especialidade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Especialidade</label>
            <select
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {ESPECIALIDADES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Data *</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Horário *</label>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="compareceu">Compareceu</option>
              <option value="falta">Falta</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-y"
              placeholder="Observações do atendimento"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
          >
            <Save size={16} /> Registrar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
}
