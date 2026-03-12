import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Agenda() {
  const { atendimentos, pacientes } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const getAtendimentosForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return atendimentos.filter((a) => a.data === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        <p className="text-gray-500 text-sm">Visualize os atendimentos agendados</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayAtendimentos = getAtendimentosForDay(day);
            return (
              <div
                key={day}
                className={`h-24 border rounded-lg p-1 ${
                  isToday(day) ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
              >
                <span className={`text-xs font-medium ${isToday(day) ? "text-purple-600" : "text-gray-600"}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayAtendimentos.slice(0, 2).map((a) => {
                    const pac = pacientes.find((p) => p.id === a.pacienteId);
                    return (
                      <div
                        key={a.id}
                        className="text-xs bg-purple-100 text-purple-700 rounded px-1 py-0.5 truncate"
                      >
                        {a.horario} {pac?.nome?.split(" ")[0] || ""}
                      </div>
                    );
                  })}
                  {dayAtendimentos.length > 2 && (
                    <div className="text-xs text-gray-400">+{dayAtendimentos.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
