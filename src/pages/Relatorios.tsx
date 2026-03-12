import { useState } from "react";
import { FileDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ESPECIALIDADES, STATUS_LABELS } from "../utils/helpers";

export default function Relatorios() {
  const { pacientes, atendimentos } = useApp();
  const [periodo, setPeriodo] = useState("Mensal");
  const periodos = ["Semanal", "Mensal", "Trimestral", "Anual"];

  const totalAtendimentos = atendimentos.length;
  const compareceram = atendimentos.filter((a) => a.status === "compareceu").length;
  const faltas = atendimentos.filter((a) => a.status === "falta").length;

  const porEspecialidade = ESPECIALIDADES.map((esp) => {
    const atds = atendimentos.filter((a) => a.especialidade === esp);
    return {
      especialidade: esp,
      total: atds.length,
      compareceu: atds.filter((a) => a.status === "compareceu").length,
      faltou: atds.filter((a) => a.status === "falta").length,
    };
  }).filter((e) => e.total > 0);

  const idadeMedia = () => {
    const comIdade = pacientes.filter((p) => p.dataNascimento);
    if (comIdade.length === 0) return 0;
    const hoje = new Date();
    const totalIdade = comIdade.reduce((acc, p) => {
      const nasc = new Date(p.dataNascimento);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return acc + idade;
    }, 0);
    return Math.round(totalIdade / comIdade.length);
  };

  const exportPDF = () => {
    alert("Funcionalidade de exportação PDF em desenvolvimento.");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-500 text-sm">Relatórios automáticos por período</p>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 text-sm"
        >
          <FileDown size={16} /> Exportar PDF
        </button>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {periodos.map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-md text-sm ${
                periodo === p ? "bg-purple-600 text-white shadow" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-purple-600">{totalAtendimentos}</p>
          <p className="text-sm text-gray-500">Total atendimentos</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-green-600">{compareceram}</p>
          <p className="text-sm text-gray-500">Compareceram</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-red-600">{faltas}</p>
          <p className="text-sm text-gray-500">Faltas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">Por Especialidade</h3>
          {porEspecialidade.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Nenhum atendimento registrado</p>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 text-xs text-gray-600">Especialidade</th>
                  <th className="text-right py-2 text-xs text-gray-600">Total</th>
                  <th className="text-right py-2 text-xs text-gray-600">Compareceu</th>
                  <th className="text-right py-2 text-xs text-gray-600">Faltou</th>
                </tr>
              </thead>
              <tbody>
                {porEspecialidade.map((e) => (
                  <tr key={e.especialidade} className="border-b last:border-0">
                    <td className="py-2 text-sm text-gray-700">{e.especialidade}</td>
                    <td className="py-2 text-sm text-gray-800 font-semibold text-right">{e.total}</td>
                    <td className="py-2 text-sm text-green-600 text-right">{e.compareceu}</td>
                    <td className="py-2 text-sm text-red-600 text-right">{e.faltou}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">Estatísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Total de pacientes</span>
              <span className="font-semibold">{pacientes.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Idade média</span>
              <span className="font-semibold">{idadeMedia()} anos</span>
            </div>
            {Object.keys(STATUS_LABELS).map((key) => (
              <div key={key} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-600">{STATUS_LABELS[key]}</span>
                <span className="font-semibold">{pacientes.filter((p) => p.status === key).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
