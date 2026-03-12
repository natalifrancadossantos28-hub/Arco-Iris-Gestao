import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateId, ESPECIALIDADES } from "../utils/helpers";

export default function Profissionais() {
  const { profissionais, setProfissionais } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState(ESPECIALIDADES[0]);
  const [cargaHoraria, setCargaHoraria] = useState("40");
  const [atendimentosDia, setAtendimentosDia] = useState("20");
  const [observacoes, setObservacoes] = useState("");
  const [situacao, setSituacao] = useState("ativo");

  const resetForm = () => {
    setNome("");
    setEspecialidade(ESPECIALIDADES[0]);
    setCargaHoraria("40");
    setAtendimentosDia("20");
    setObservacoes("");
    setSituacao("ativo");
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const p = profissionais.find((x) => x.id === id);
    if (!p) return;
    setNome(p.nome);
    setEspecialidade(p.especialidade);
    setCargaHoraria(p.cargaHoraria);
    setAtendimentosDia(p.atendimentosDia);
    setObservacoes(p.observacoes);
    setSituacao(p.situacao);
    setEditId(id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!nome.trim()) {
      alert("Nome é obrigatório!");
      return;
    }
    if (editId) {
      setProfissionais(
        profissionais.map((p) =>
          p.id === editId
            ? { ...p, nome, especialidade, cargaHoraria, atendimentosDia, observacoes, situacao }
            : p
        )
      );
    } else {
      setProfissionais([
        ...profissionais,
        { id: generateId(), nome, especialidade, cargaHoraria, atendimentosDia, observacoes, situacao },
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este profissional?")) {
      setProfissionais(profissionais.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profissionais</h1>
          <p className="text-gray-500 text-sm">{profissionais.length} profissionais cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
        >
          <Plus size={16} /> Novo Profissional
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">
              {editId ? "Editar Profissional" : "Novo Profissional"}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nome *</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Nome do profissional"
              />
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
              <label className="text-sm text-gray-600 mb-1 block">Situação</label>
              <select
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Carga horária (h/sem)</label>
              <input
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Atendimentos/dia</label>
              <input
                value={atendimentosDia}
                onChange={(e) => setAtendimentosDia(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Observações</label>
              <input
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
            >
              {editId ? "Salvar Alterações" : "Adicionar Profissional"}
            </button>
          </div>
        </div>
      )}

      {profissionais.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Nenhum profissional cadastrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Especialidade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Carga Horária</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Atend./dia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Situação</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.especialidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.cargaHoraria}h/sem</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.atendimentosDia}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.situacao === "ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.situacao === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleEdit(p.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
