import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  List,
  Briefcase,
  ClipboardList,
  Calendar,
  Clock,
  Search,
  DoorOpen,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { notificacoes } = useApp();
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  const [expanded, setExpanded] = useState<string[]>(["pacientes", "atendimentos"]);

  const toggleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const menuItem = (
    page: string,
    label: string,
    icon: React.ReactNode,
    indent = false
  ) => (
    <button
      key={page}
      onClick={() => onNavigate(page)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        indent ? "pl-8" : ""
      } ${
        currentPage === page
          ? "bg-purple-600 text-white"
          : "text-gray-300 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const submenu = (
    key: string,
    label: string,
    icon: React.ReactNode,
    items: { page: string; label: string; icon: React.ReactNode }[]
  ) => (
    <div key={key}>
      <button
        onClick={() => toggleExpand(key)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {expanded.includes(key) ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </button>
      {expanded.includes(key) && (
        <div className="mt-1 space-y-1">
          {items.map((item) => menuItem(item.page, item.label, item.icon, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-56 min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🌈</span>
        <div>
          <h1 className="font-bold text-lg leading-tight">Arco-Íris</h1>
          <p className="text-xs text-purple-300">Gestão Terapêutica</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItem("dashboard", "Dashboard", <LayoutDashboard size={18} />)}

        {submenu("pacientes", "Pacientes", <Users size={18} />, [
          {
            page: "pacientes_cadastrar",
            label: "Cadastrar paciente",
            icon: <UserPlus size={16} />,
          },
          {
            page: "pacientes_lista",
            label: "Lista de pacientes",
            icon: <List size={16} />,
          },
        ])}

        {menuItem("profissionais", "Profissionais", <Briefcase size={18} />)}

        {submenu("atendimentos", "Atendimentos", <ClipboardList size={18} />, [
          {
            page: "atendimentos_registrar",
            label: "Registrar atendimento",
            icon: <ClipboardList size={16} />,
          },
          {
            page: "atendimentos_agenda",
            label: "Agenda",
            icon: <Calendar size={16} />,
          },
        ])}

        {menuItem("fila_espera", "Fila de espera", <Clock size={18} />)}
        {menuItem("buscativas", "Buscativas", <Search size={18} />)}
        {menuItem("entrada_saida", "Entrada e Saída", <DoorOpen size={18} />)}
        {menuItem("relatorios", "Relatórios", <BarChart3 size={18} />)}

        <button
          key="notificacoes"
          onClick={() => onNavigate("notificacoes")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentPage === "notificacoes"
              ? "bg-purple-600 text-white"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <div className="relative">
            <Bell size={18} />
            {naoLidas > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {naoLidas > 9 ? "9+" : naoLidas}
              </span>
            )}
          </div>
          Notificações
        </button>

        {menuItem("configuracoes", "Configurações", <Settings size={18} />)}
      </nav>

      <div className="mt-4 pt-4 border-t border-purple-700">
        <p className="text-xs text-purple-400">Dados salvos localmente</p>
      </div>
    </div>
  );
}
