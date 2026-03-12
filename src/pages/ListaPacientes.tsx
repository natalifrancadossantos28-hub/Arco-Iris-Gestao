import { useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Paciente } from "../types";
import { calcularIdade, formatarData, STATUS_LABELS, STATUS_COLORS } from "../utils/helpers";

interface Props {
  onEdit: (paciente: Paciente) => void;
  onNew: () => void;
}

export default function ListaPacientes({ onEdit, onNew }: Props) {
  const { pacientes, setPacientes } = useApp();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [detalhes, setDetalhes] = useState<Paciente | null>(null);

  const filtrados = pacientes.filter((p) => {
    const matchBusca =
      (p.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.cpf || "").includes(busca) ||
      (p.diagnostico || "").toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const excluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      setPacientes(pacientes.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lista de Pacientes</h1>
          <p className="text-gray-500 text-sm">{pacientes.length} pacientes cadastrados</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
        >
          <Plus size={16} /> Novo Paciente
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou diagnóstico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="todos">Todos os status</option>
          <option value="em_espera">Em espera</option>
          <option value="em_atendimento">Em atendimento</option>
          <option value="alta">Alta</option>
          <option value="alta_temporaria">Alta temporária</option>
          <option value="desistencia">Desistência</option>
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">CPF</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Idade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Diagnóstico</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Cadastro</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.cpf}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {p.dataNascimento ? calcularIdade(p.dataNascimento) + " anos" : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.diagnostico || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || ""}`}
                    >
                      {STATUS_LABELS[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatarData(p.dataCadastro)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setDetalhes(p)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => excluir(p.id)}
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

      {detalhes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">{detalhes.nome}</h2>
              <button
                onClick={() => setDetalhes(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">CPF:</span> <span className="font-medium">{detalhes.cpf}</span></div>
              <div><span className="text-gray-500">Data de nascimento:</span> <span className="font-medium">{formatarData(detalhes.dataNascimento) || "-"}</span></div>
              <div><span className="text-gray-500">Nome da mãe:</span> <span className="font-medium">{detalhes.nomeMae || "-"}</span></div>
              <div><span className="text-gray-500">Telefone:</span> <span className="font-medium">{detalhes.telefone || "-"}</span></div>
              <div><span className="text-gray-500">Endereço:</span> <span className="font-medium">{detalhes.endereco || "-"}</span></div>
              <div><span className="text-gray-500">Bairro:</span> <span className="font-medium">{detalhes.bairro || "-"}</span></div>
              <div><span className="text-gray-500">Cidade:</span> <span className="font-medium">{detalhes.cidade || "-"}</span></div>
              <div><span className="text-gray-500">CEP:</span> <span className="font-medium">{detalhes.cep || "-"}</span></div>
              <div><span className="text-gray-500">Diagnóstico:</span> <span className="font-medium">{detalhes.diagnostico || "-"}</span></div>
              <div><span className="text-gray-500">CID:</span> <span className="font-medium">{detalhes.cid || "-"}</span></div>
              <div><span className="text-gray-500">Status:</span> <span className="font-medium">{STATUS_LABELS[detalhes.status] || detalhes.status}</span></div>
              <div><span className="text-gray-500">Tipo de cadastro:</span> <span className="font-medium">{detalhes.tipoCadastro}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Observações:</span> <span className="font-medium">{detalhes.observacoes || "-"}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
