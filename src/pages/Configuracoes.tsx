import { useState } from "react";
import { Download, Upload, AlertTriangle, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Configuracoes() {
  const {
    pacientes, setPacientes,
    profissionais, setProfissionais,
    filaEspera, setFilaEspera,
    atendimentos, setAtendimentos,
    buscativas, setBuscativas,
    entradasSaidas, setEntradasSaidas,
  } = useApp();

  const [msg, setMsg] = useState("");

  const exportarBackup = () => {
    const data = {
      pacientes,
      profissionais,
      filaEspera,
      atendimentos,
      buscativas,
      entradasSaidas,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arcoiris-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup exportado com sucesso!");
    setTimeout(() => setMsg(""), 3000);
  };

  const importarBackup = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.pacientes) setPacientes(data.pacientes);
          if (data.profissionais) setProfissionais(data.profissionais);
          if (data.filaEspera) setFilaEspera(data.filaEspera);
          if (data.atendimentos) setAtendimentos(data.atendimentos);
          if (data.buscativas) setBuscativas(data.buscativas);
          if (data.entradasSaidas) setEntradasSaidas(data.entradasSaidas);
          setMsg("Dados importados com sucesso!");
        } catch {
          alert("Erro ao importar arquivo. Verifique o formato.");
        }
        setTimeout(() => setMsg(""), 3000);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const apagarTudo = () => {
    if (
      confirm("ATENÇÃO: Isso irá apagar TODOS os dados do sistema. Deseja continuar?") &&
      confirm("Tem certeza absoluta? Esta ação não pode ser desfeita!")
    ) {
      setPacientes([]);
      setProfissionais([]);
      setFilaEspera([]);
      setAtendimentos([]);
      setBuscativas([]);
      setEntradasSaidas([]);
      setMsg("Todos os dados foram apagados.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-500 text-sm">Gerencie os dados do sistema</p>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{msg}</div>
      )}

      <div className="space-y-4 max-w-2xl">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-2">Backup dos Dados</h3>
          <p className="text-sm text-gray-500 mb-4">
            Exporte todos os dados do sistema em formato JSON para backup.
          </p>
          <button
            onClick={exportarBackup}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm"
          >
            <Download size={16} /> Exportar Backup
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-2">Importar Dados</h3>
          <p className="text-sm text-gray-500 mb-4">
            Importe dados de um arquivo de backup JSON. Os dados atuais serão substituídos.
          </p>
          <button
            onClick={importarBackup}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm"
          >
            <Upload size={16} /> Importar Backup
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-2">Resumo dos Dados</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Pacientes:</span>{" "}
              <span className="font-bold">{pacientes.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Profissionais:</span>{" "}
              <span className="font-bold">{profissionais.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Atendimentos:</span>{" "}
              <span className="font-bold">{atendimentos.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Fila de espera:</span>{" "}
              <span className="font-bold">{filaEspera.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Buscativas:</span>{" "}
              <span className="font-bold">{buscativas.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Entradas/Saídas:</span>{" "}
              <span className="font-bold">{entradasSaidas.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-semibold text-red-700">Zona de Perigo</h3>
          </div>
          <p className="text-sm text-red-600 mb-4">
            Apagar todos os dados do sistema. Esta ação é irreversível.
          </p>
          <button
            onClick={apagarTudo}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 text-sm"
          >
            <Trash2 size={16} /> Apagar Todos os Dados
          </button>
        </div>
      </div>
    </div>
  );
}
