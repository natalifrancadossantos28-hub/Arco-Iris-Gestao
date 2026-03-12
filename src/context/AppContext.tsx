import React, { createContext, useContext, useState, useEffect } from "react";
import type { Paciente, Profissional, FilaEsperaItem, Atendimento, Buscativa, EntradaSaida } from "../types";

interface AppContextType {
  pacientes: Paciente[];
  setPacientes: React.Dispatch<React.SetStateAction<Paciente[]>>;
  profissionais: Profissional[];
  setProfissionais: React.Dispatch<React.SetStateAction<Profissional[]>>;
  filaEspera: FilaEsperaItem[];
  setFilaEspera: React.Dispatch<React.SetStateAction<FilaEsperaItem[]>>;
  atendimentos: Atendimento[];
  setAtendimentos: React.Dispatch<React.SetStateAction<Atendimento[]>>;
  buscativas: Buscativa[];
  setBuscativas: React.Dispatch<React.SetStateAction<Buscativa[]>>;
  entradasSaidas: EntradaSaida[];
  setEntradasSaidas: React.Dispatch<React.SetStateAction<EntradaSaida[]>>;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return fallback;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>(() =>
    loadFromStorage("arcoiris_pacientes", [])
  );
  const [profissionais, setProfissionais] = useState<Profissional[]>(() =>
    loadFromStorage("arcoiris_profissionais", [])
  );
  const [filaEspera, setFilaEspera] = useState<FilaEsperaItem[]>(() =>
    loadFromStorage("arcoiris_fila", [])
  );
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>(() =>
    loadFromStorage("arcoiris_atendimentos", [])
  );
  const [buscativas, setBuscativas] = useState<Buscativa[]>(() =>
    loadFromStorage("arcoiris_buscativas", [])
  );
  const [entradasSaidas, setEntradasSaidas] = useState<EntradaSaida[]>(() =>
    loadFromStorage("arcoiris_entradas_saidas", [])
  );

  useEffect(() => {
    localStorage.setItem("arcoiris_pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("arcoiris_profissionais", JSON.stringify(profissionais));
  }, [profissionais]);

  useEffect(() => {
    localStorage.setItem("arcoiris_fila", JSON.stringify(filaEspera));
  }, [filaEspera]);

  useEffect(() => {
    localStorage.setItem("arcoiris_atendimentos", JSON.stringify(atendimentos));
  }, [atendimentos]);

  useEffect(() => {
    localStorage.setItem("arcoiris_buscativas", JSON.stringify(buscativas));
  }, [buscativas]);

  useEffect(() => {
    localStorage.setItem("arcoiris_entradas_saidas", JSON.stringify(entradasSaidas));
  }, [entradasSaidas]);

  return (
    <AppContext.Provider
      value={{
        pacientes,
        setPacientes,
        profissionais,
        setProfissionais,
        filaEspera,
        setFilaEspera,
        atendimentos,
        setAtendimentos,
        buscativas,
        setBuscativas,
        entradasSaidas,
        setEntradasSaidas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
