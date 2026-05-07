const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

export interface Template {
  id: string;
  name: string;
  description: string;
  layoutConfig: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  recipientName: string;
  recipientCPF: string;
  courseName: string;
  courseHours: number;
  verificationCode: string;
  validityDate: string;
  templateId: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyResult {
  isAuthentic: boolean;
  isValid: boolean;
  certificate: null | {
    recipientName: string;
    courseName: string;
    courseHours: number;
    issuedAt: string;
    validityDate: string;
    verificationCode: string;
  };
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? json) as T;
}

export const api = {
  // Templates
  listTemplates: () => http<Template[]>("/api/templates"),
  getTemplate: (id: string) => http<Template>(`/api/templates/${id}`),
  createTemplate: (body: { name: string; description?: string; layoutConfig?: Record<string, unknown> }) =>
    http<Template>("/api/templates", { method: "POST", body: JSON.stringify(body) }),
  updateTemplate: (id: string, body: Partial<Template>) =>
    http<Template>(`/api/templates/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTemplate: (id: string) =>
    http<void>(`/api/templates/${id}`, { method: "DELETE" }),

  // Certificates
  listCertificates: () => http<Certificate[]>("/api/certificates"),
  getCertificate: (id: string) => http<Certificate>(`/api/certificates/${id}`),
  emitCertificate: (body: {
    recipientName: string;
    recipientCPF: string;
    courseName: string;
    courseHours: number;
    validityDate: string;
    templateId: string;
  }) => http<Certificate>("/api/certificates/emit", { method: "POST", body: JSON.stringify(body) }),
  updateValidity: (id: string, validityDate: string) =>
    http<Certificate>(`/api/certificates/${id}/validity`, {
      method: "PUT",
      body: JSON.stringify({ validityDate }),
    }),
  pdfUrl: (id: string) => `${API_URL}/api/certificates/${id}/pdf`,

  // Verify
  verify: (cpf: string, verificationCode: string) =>
    http<VerifyResult>("/api/verify", {
      method: "POST",
      body: JSON.stringify({ cpf, verificationCode }),
    }),
};

export function isExpired(validityDate: string): boolean {
  return new Date(validityDate) < new Date();
}

// Local-only email log (servidor ainda não envia e-mails)
export interface EnvioEmail {
  id: number;
  certificateId: string;
  recipientEmail: string;
  recipientName: string;
  status: "enviado" | "falhou" | "pendente";
  data: string;
}
const LS_EMAILS = "certifyhub:envios";
export const envios = {
  list(): EnvioEmail[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(LS_EMAILS) || "[]"); } catch { return []; }
  },
  add(e: EnvioEmail) {
    const list = [e, ...envios.list()];
    localStorage.setItem(LS_EMAILS, JSON.stringify(list));
  },
};
