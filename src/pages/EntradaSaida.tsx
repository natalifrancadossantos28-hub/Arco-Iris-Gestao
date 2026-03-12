import { useState } from "react";
import { Plus, Trash2, DoorOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateId, dataHoje, MOTIVOS_SAIDA } from "../utils/helpers";

export default function EntradaSaida() {
  const { entradasSaidas, setEntradasSaidas, pacientes } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [pacienteId, setPacienteId] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [data, setData] = useState(dataHoje());
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleSave = () => {
    if (!pacienteId) {
      alert("Selecione um paciente!");
      return;
    }
    setEntradasSaidas([
      ...entradasSaidas,
      { id: generateId(), pacienteId, tipo, data, motivo, observacoes },
    ]);
    setPacienteId("");
    setObservacoes("");
    setShowForm(false);
  };

  const remover = (id: string) => {
    if (confirm("Excluir este registro?")) {
      setEntradasSaidas(entradasSaidas.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Entrada e Saída</h1>
          <p className="text-gray-500 text-sm">Registro de entradas e saídas de pacientes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
        >
          <Plus size={16} /> Novo Registro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Novo Registro</h3>
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
              <label className="text-sm text-gray-600 mb-1 block">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
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
            {tipo === "saida" && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Motivo da saída</label>
                <select
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  {Object.entries(MOTIVOS_SAIDA).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">Observações</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-y"
                placeholder="Observações"
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

      {entradasSaidas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <DoorOpen size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum registro de entrada/saída.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Paciente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Motivo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Observações</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {entradasSaidas.map((es) => {
                const pac = pacientes.find((p) => p.id === es.pacienteId);
                return (
                  <tr key={es.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{pac?.nome || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          es.tipo === "entrada"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {es.tipo === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{es.data}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {MOTIVOS_SAIDA[es.motivo] || es.motivo || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{es.observacoes || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => remover(es.id)}
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
