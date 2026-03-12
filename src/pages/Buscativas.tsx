import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateId, dataHoje } from "../utils/helpers";

export default function Buscativas() {
  const { buscativas, setBuscativas, pacientes } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [pacienteId, setPacienteId] = useState("");
  const [data, setData] = useState(dataHoje());
  const [tipo, setTipo] = useState("telefone");
  const [descricao, setDescricao] = useState("");
  const [resultado, setResultado] = useState("contato_realizado");

  const handleSave = () => {
    if (!pacienteId) {
      alert("Selecione um paciente!");
      return;
    }
    setBuscativas([
      ...buscativas,
      { id: generateId(), pacienteId, data, tipo, descricao, resultado },
    ]);
    setPacienteId("");
    setDescricao("");
    setShowForm(false);
  };

  const remover = (id: string) => {
    if (confirm("Excluir esta buscativa?")) {
      setBuscativas(buscativas.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Buscativas</h1>
          <p className="text-gray-500 text-sm">Registro de busca ativa de pacientes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
        >
          <Plus size={16} /> Nova Buscativa
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Registrar Buscativa</h3>
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
              <label className="text-sm text-gray-600 mb-1 block">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="telefone">Telefone</option>
                <option value="visita">Visita domiciliar</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Resultado</label>
              <select
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="contato_realizado">Contato realizado</option>
                <option value="sem_contato">Sem contato</option>
                <option value="retorno_agendado">Retorno agendado</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-y"
                placeholder="Descreva a buscativa"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
            >
              Registrar
            </button>
          </div>
        </div>
      )}

      {buscativas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhuma buscativa registrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Paciente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Resultado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Descrição</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {buscativas.map((b) => {
                const pac = pacientes.find((p) => p.id === b.pacienteId);
                return (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{pac?.nome || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.data}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{b.tipo}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.resultado.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{b.descricao || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => remover(b.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
