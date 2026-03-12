import { useState } from "react";
import { FileDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ESPECIALIDADES, STATUS_LABELS, formatarData, formatarCPF } from "../utils/helpers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Relatorios() {
  const { pacientes, atendimentos, filaEspera, profissionais } = useApp();
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
    const doc = new jsPDF();
    const hoje = new Date();
    const dataStr = `${String(hoje.getDate()).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(107, 33, 168);
    doc.text("Gestao Terapeutica Arco-Iris", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Relatorio gerado em ${dataStr} - Periodo: ${periodo}`, 14, 28);

    // Resumo geral
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Resumo Geral", 14, 40);

    autoTable(doc, {
      startY: 44,
      head: [["Indicador", "Valor"]],
      body: [
        ["Total de pacientes", String(pacientes.length)],
        ["Idade media", `${idadeMedia()} anos`],
        ["Total de atendimentos", String(totalAtendimentos)],
        ["Compareceram", String(compareceram)],
        ["Faltas", String(faltas)],
        ["Profissionais ativos", String(profissionais.filter((p) => p.situacao === "ativo").length)],
        ["Pacientes na fila de espera", String(filaEspera.length)],
        ...Object.keys(STATUS_LABELS).map((key) => [
          STATUS_LABELS[key],
          String(pacientes.filter((p) => p.status === key).length),
        ]),
      ],
      theme: "grid",
      headStyles: { fillColor: [107, 33, 168] },
    });

    // Atendimentos por especialidade
    if (porEspecialidade.length > 0) {
      const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;
      doc.setFontSize(14);
      doc.text("Atendimentos por Especialidade", 14, finalY + 12);

      autoTable(doc, {
        startY: finalY + 16,
        head: [["Especialidade", "Total", "Compareceu", "Faltou"]],
        body: porEspecialidade.map((e) => [
          e.especialidade,
          String(e.total),
          String(e.compareceu),
          String(e.faltou),
        ]),
        theme: "grid",
        headStyles: { fillColor: [107, 33, 168] },
      });
    }

    // Lista de pacientes
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Lista de Pacientes", 14, 20);

    autoTable(doc, {
      startY: 24,
      head: [["Nome", "CPF", "Status", "Diagnostico", "Data Cadastro"]],
      body: pacientes.map((p) => [
        p.nome,
        formatarCPF(p.cpf),
        STATUS_LABELS[p.status] || p.status,
        p.diagnostico || "-",
        formatarData(p.dataCadastro) || "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [107, 33, 168] },
      styles: { fontSize: 8 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Gestao Terapeutica Arco-Iris - Pagina ${i} de ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`relatorio-arco-iris-${hoje.toISOString().split("T")[0]}.pdf`);
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
