export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function calcularIdade(dataNascimento: string): number {
  if (!dataNascimento) return 0;
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export function formatarData(data: string): string {
  if (!data) return "";
  const partes = data.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

export function dataHoje(): string {
  return new Date().toISOString().split("T")[0];
}

export function diasEntre(inicio: string, fim: string): number {
  const d1 = new Date(inicio);
  const d2 = new Date(fim);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatarCPF(value: string): string {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9, 11)}`;
}

export function formatarTelefone(value: string): string {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 2) return nums;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 11) return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
}

export const ESPECIALIDADES = [
  "Psicologia",
  "Fonoaudiologia",
  "Fisioterapia",
  "Terapia Ocupacional",
  "Nutricionista",
  "Psicomotricidade",
  "Psicopedagogia",
  "Fortalecimento",
  "Oficineiro",
  "Tênis de mesa",
];

export const STATUS_LABELS: Record<string, string> = {
  em_espera: "Em espera",
  em_atendimento: "Em atendimento",
  alta: "Alta",
  alta_temporaria: "Alta temporária",
  desistencia: "Desistência",
};

export const MOTIVOS_SAIDA: Record<string, string> = {
  alta_objetivo: "Alta por objetivo atingido",
  alta_faltas: "Alta por faltas",
  desistencia: "Desistência",
  alta_temporaria: "Alta temporária",
};

export const STATUS_COLORS: Record<string, string> = {
  em_espera: "bg-yellow-100 text-yellow-700",
  em_atendimento: "bg-green-100 text-green-700",
  alta: "bg-blue-100 text-blue-700",
  alta_temporaria: "bg-purple-100 text-purple-700",
  desistencia: "bg-red-100 text-red-700",
};
