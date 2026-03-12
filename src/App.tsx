import { useState } from "react";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CadastrarPaciente from "./pages/CadastrarPaciente";
import ListaPacientes from "./pages/ListaPacientes";
import Profissionais from "./pages/Profissionais";
import RegistrarAtendimento from "./pages/RegistrarAtendimento";
import Agenda from "./pages/Agenda";
import FilaEspera from "./pages/FilaEspera";
import Buscativas from "./pages/Buscativas";
import EntradaSaida from "./pages/EntradaSaida";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import type { Paciente } from "./types";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editPaciente, setEditPaciente] = useState<Paciente | null>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setEditPaciente(null);
  };

  const handleEditPaciente = (paciente: Paciente) => {
    setEditPaciente(paciente);
    setCurrentPage("pacientes_cadastrar");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "pacientes_cadastrar":
        return (
          <CadastrarPaciente
            onBack={() => navigate("pacientes_lista")}
            editPaciente={editPaciente}
          />
        );
      case "pacientes_lista":
        return (
          <ListaPacientes
            onEdit={handleEditPaciente}
            onNew={() => navigate("pacientes_cadastrar")}
          />
        );
      case "profissionais":
        return <Profissionais />;
      case "atendimentos_registrar":
        return <RegistrarAtendimento />;
      case "atendimentos_agenda":
        return <Agenda />;
      case "fila_espera":
        return <FilaEspera />;
      case "buscativas":
        return <Buscativas />;
      case "entrada_saida":
        return <EntradaSaida />;
      case "relatorios":
        return <Relatorios />;
      case "configuracoes":
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
