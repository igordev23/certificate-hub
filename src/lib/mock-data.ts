export interface Template {
  id: number;
  nome: string;
  arquivo_path: string;
  created_at: string;
}

export interface Certificado {
  id: number;
  template_id: number;
  template_nome: string;
  nome_participante: string;
  cpf: string;
  codigo_unico: string;
  data_emissao: string;
  data_validade: string;
  status: "ativo" | "expirado" | "revogado";
  email: string;
}

export interface EnvioEmail {
  id: number;
  certificado_id: number;
  destinatario_email: string;
  status: "enviado" | "falhou" | "pendente";
  data: string;
}

const LS_TEMPLATES = "certifyhub:templates";
const LS_CERTS = "certifyhub:certificados";
const LS_EMAILS = "certifyhub:envios";

const seedTemplates: Template[] = [
  { id: 1, nome: "Certificado de Conclusão - Padrão", arquivo_path: "/templates/padrao.pdf", created_at: "2025-01-10" },
  { id: 2, nome: "Workshop de Inovação", arquivo_path: "/templates/workshop.pdf", created_at: "2025-02-22" },
  { id: 3, nome: "Diploma Acadêmico", arquivo_path: "/templates/diploma.pdf", created_at: "2025-03-15" },
];

const seedCerts: Certificado[] = [
  { id: 1, template_id: 1, template_nome: "Certificado de Conclusão - Padrão", nome_participante: "Ana Carolina Silva", cpf: "123.456.789-00", codigo_unico: "CERT-A1B2C3D4", data_emissao: "2025-04-01", data_validade: "2027-04-01", status: "ativo", email: "ana@exemplo.com" },
  { id: 2, template_id: 2, template_nome: "Workshop de Inovação", nome_participante: "Bruno Mendes", cpf: "987.654.321-00", codigo_unico: "CERT-X9Y8Z7W6", data_emissao: "2025-03-12", data_validade: "2026-03-12", status: "ativo", email: "bruno@exemplo.com" },
  { id: 3, template_id: 1, template_nome: "Certificado de Conclusão - Padrão", nome_participante: "Carla Souza", cpf: "111.222.333-44", codigo_unico: "CERT-K3L4M5N6", data_emissao: "2024-01-20", data_validade: "2025-01-20", status: "expirado", email: "carla@exemplo.com" },
];

function read<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  const v = localStorage.getItem(key);
  if (!v) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(v) as T; } catch { return seed; }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const db = {
  getTemplates: () => read<Template[]>(LS_TEMPLATES, seedTemplates),
  saveTemplates: (t: Template[]) => write(LS_TEMPLATES, t),
  getCertificados: () => read<Certificado[]>(LS_CERTS, seedCerts),
  saveCertificados: (c: Certificado[]) => write(LS_CERTS, c),
  getEnvios: () => read<EnvioEmail[]>(LS_EMAILS, []),
  saveEnvios: (e: EnvioEmail[]) => write(LS_EMAILS, e),
};

export function gerarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "CERT-";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function statusFromValidade(validade: string): "ativo" | "expirado" {
  return new Date(validade) >= new Date() ? "ativo" : "expirado";
}