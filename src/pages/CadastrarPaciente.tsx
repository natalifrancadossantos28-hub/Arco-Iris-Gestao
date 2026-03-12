import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Paciente } from "../types";
import {
  generateId,
  dataHoje,
  formatarCPF,
  formatarTelefone,
  ESPECIALIDADES,
} from "../utils/helpers";

interface Props {
  onBack: () => void;
  editPaciente: Paciente | null;
}

export default function CadastrarPaciente({ onBack, editPaciente }: Props) {
  const { pacientes, setPacientes, filaEspera, setFilaEspera } = useApp();

  const [form, setForm] = useState({
    nome: editPaciente?.nome || "",
    cpf: editPaciente?.cpf || "",
    dataNascimento: editPaciente?.dataNascimento || "",
    nomeMae: editPaciente?.nomeMae || "",
    telefone: editPaciente?.telefone || "",
    telefoneResponsavel: editPaciente?.telefoneResponsavel || "",
    endereco: editPaciente?.endereco || "",
    bairro: editPaciente?.bairro || "",
    cidade: editPaciente?.cidade || "",
    cep: editPaciente?.cep || "",
    cnesUnidade: editPaciente?.cnesUnidade || "",
    dataCadastro: editPaciente?.dataCadastro || dataHoje(),
    tipoCadastro: editPaciente?.tipoCadastro || "cadastro_ativo",
    cid: editPaciente?.cid || "",
    diagnostico: editPaciente?.diagnostico || "",
    observacoes: editPaciente?.observacoes || "",
    status: editPaciente?.status || "em_espera",
    especialidadesSolicitadas: editPaciente?.especialidadesSolicitadas || ([] as string[]),
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEspecialidade = (esp: string) => {
    setForm((prev) => ({
      ...prev,
      especialidadesSolicitadas: prev.especialidadesSolicitadas.includes(esp)
        ? prev.especialidadesSolicitadas.filter((e) => e !== esp)
        : [...prev.especialidadesSolicitadas, esp],
    }));
  };

  const handleSubmit = () => {
    if (!form.nome.trim() || !form.cpf.trim()) {
      alert("Nome e CPF são obrigatórios!");
      return;
    }

    if (editPaciente) {
      setPacientes(
        pacientes.map((p) =>
          p.id === editPaciente.id ? { ...form, id: editPaciente.id } : p
        )
      );
    } else {
      if (
        pacientes.find(
          (p) => p.cpf.replace(/\D/g, "") === form.cpf.replace(/\D/g, "")
        )
      ) {
        alert("Já existe um paciente com este CPF!");
        return;
      }

      const novoPaciente: Paciente = { ...form, id: generateId() };
      setPacientes([...pacientes, novoPaciente]);

      if (
        form.status === "em_espera" &&
        form.especialidadesSolicitadas.length > 0
      ) {
        const novasFilas = form.especialidadesSolicitadas.map((esp) => {
          const posicao = filaEspera.filter((f) => f.especialidade === esp).length + 1;
          return {
            id: generateId(),
            pacienteId: novoPaciente.id,
            especialidade: esp,
            dataEntrada: dataHoje(),
            posicao,
          };
        });
        setFilaEspera([...filaEspera, ...novasFilas]);
      }
    }

    onBack();
  };

  const InputField = ({
    label,
    field,
    type = "text",
    placeholder = "",
    required = false,
  }: {
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        value={(form as unknown as Record<string, string>)[field] || ""}
        onChange={(e) => {
          let val = e.target.value;
          if (field === "cpf") val = formatarCPF(val);
          if (field === "telefone" || field === "telefoneResponsavel")
            val = formatarTelefone(val);
          updateField(field, val);
        }}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
      />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {editPaciente ? "Editar Paciente" : "Cadastrar Paciente"}
          </h1>
          <p className="text-gray-500 text-sm">Preencha os dados do paciente</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4 text-purple-700">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Nome completo" field="nome" required placeholder="Nome do paciente" />
            <InputField label="CPF" field="cpf" required placeholder="000.000.000-00" />
            <InputField label="Data de nascimento" field="dataNascimento" type="date" />
            <InputField label="Nome da mãe" field="nomeMae" placeholder="Nome da mãe" />
            <InputField label="Telefone" field="telefone" placeholder="(00) 00000-0000" />
            <InputField label="Tel. Responsável" field="telefoneResponsavel" placeholder="(00) 00000-0000" />
            <InputField label="Endereço" field="endereco" placeholder="Rua, número" />
            <InputField label="Bairro" field="bairro" placeholder="Bairro" />
            <InputField label="Cidade" field="cidade" placeholder="Cidade" />
            <InputField label="CEP" field="cep" placeholder="00000-000" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4 text-purple-700">
            Dados Administrativos
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="CNES da unidade" field="cnesUnidade" placeholder="CNES" />
            <InputField label="Data de cadastro" field="dataCadastro" type="date" />
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tipo de cadastro</label>
              <select
                value={form.tipoCadastro}
                onChange={(e) => updateField("tipoCadastro", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="pre_cadastro">Pré-cadastro</option>
                <option value="cadastro_ativo">Cadastro ativo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4 text-purple-700">
            Dados Clínicos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="CID" field="cid" placeholder="Código CID" />
            <InputField label="Diagnóstico" field="diagnostico" placeholder="Diagnóstico" />
            <div className="col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">Observações</label>
              <textarea
                value={form.observacoes}
                onChange={(e) => updateField("observacoes", e.target.value)}
                placeholder="Observações clínicas"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-y"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4 text-purple-700">
            Status e Especialidades
          </h3>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status do paciente</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="em_espera">Em espera</option>
              <option value="em_atendimento">Em atendimento</option>
              <option value="alta">Alta</option>
              <option value="alta_temporaria">Alta temporária</option>
              <option value="desistencia">Desistência</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-600 mb-2 block">
              Especialidades solicitadas
            </label>
            <div className="flex flex-wrap gap-2">
              {ESPECIALIDADES.map((esp) => (
                <button
                  key={esp}
                  onClick={() => toggleEspecialidade(esp)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    form.especialidadesSolicitadas.includes(esp)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {esp}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <Save size={16} />
            {editPaciente ? "Salvar Alterações" : "Cadastrar Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}
