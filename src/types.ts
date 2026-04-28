export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  nomeMae: string;
  telefone: string;
  telefoneResponsavel: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  cnesUnidade: string;
  dataEntradaUnidade: string;
  dataCadastro: string;
  tipoCadastro: string;
  cid: string;
  diagnostico: string;
  observacoes: string;
  status: string;
  especialidadesSolicitadas: string[];
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  cargaHoraria: string;
  atendimentosDia: string;
  observacoes: string;
  situacao: string;
}

export interface FilaEsperaItem {
  id: string;
  pacienteId: string;
  especialidade: string;
  dataEntrada: string;
  posicao: number;
}

export interface Atendimento {
  id: string;
  pacienteId: string;
  profissionalId: string;
  especialidade: string;
  data: string;
  horario: string;
  status: string;
  observacoes: string;
}

export interface Buscativa {
  id: string;
  pacienteId: string;
  data: string;
  tipo: string;
  descricao: string;
  resultado: string;
}

export interface EntradaSaida {
  id: string;
  pacienteId: string;
  tipo: string;
  data: string;
  motivo: string;
  observacoes: string;
}

export interface Notificacao {
  id: string;
  tipo: "alta" | "encaminhamento" | "agendamento";
  mensagem: string;
  data: string;
  lida: boolean;
  pacienteId: string;
  detalhes: string;
}
