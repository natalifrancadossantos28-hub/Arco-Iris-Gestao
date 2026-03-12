import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ESPECIALIDADES, diasEntre, dataHoje } from "../utils/helpers";

export default function FilaEspera() {
  const { filaEspera, setFilaEspera, pacientes } = useApp();
  const [filtroEsp, setFiltroEsp] = useState("todas");

  const filtrada = filtroEsp === "todas"
    ? filaEspera
    : filaEspera.filter((f) => f.especialidade === filtroEsp);

  const sorted = [...filtrada].sort((a, b) => a.posicao - b.posicao);

  const moverPosicao = (id: string, dir: number) => {
    setFilaEspera((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= newArr.length) return prev;
      const temp = newArr[idx].posicao;
      newArr[idx] = { ...newArr[idx], posicao: newArr[swapIdx].posicao };
      newArr[swapIdx] = { ...newArr[swapIdx], posicao: temp };
      return newArr;
    });
  };

  const remover = (id: string) => {
    if (confirm("Remover da fila de espera?")) {
      setFilaEspera(filaEspera.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fila de Espera</h1>
        <p className="text-gray-500 text-sm">{filaEspera.length} pacientes na fila</p>
      </div>

      <div className="mb-4">
        <select
          value={filtroEsp}
          onChange={(e) => setFiltroEsp(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="todas">Todas as especialidades</option>
          {ESPECIALIDADES.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Clock size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum paciente na fila de espera.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Posição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Paciente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Especialidade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Data Entrada</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Dias na fila</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f) => {
                const pac = pacientes.find((p) => p.id === f.pacienteId);
                return (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-purple-600">{f.posicao}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {pac?.nome || "Paciente não encontrado"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{f.especialidade}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{f.dataEntrada}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {diasEntre(f.dataEntrada, dataHoje())} dias
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => moverPosicao(f.id, -1)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => moverPosicao(f.id, 1)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          onClick={() => remover(f.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
