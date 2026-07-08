import { Template } from "@/models/template";
import { Certificate, isExpired } from "@/models/certificate";
import type { VerifyResult } from "@/models/verify";

const API_URL = process.env.VITE_API_URL || "http://localhost:3000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (body?.details) {
      const err = new Error(body.error || "Erro de validação");
      (err as any).details = body.details;
      throw err;
    }
    throw new Error(body?.error || `HTTP ${res.status}`);
  }

  const json = await res.json();
  return (json.data ?? json) as T;
}

export const api = {
  listTemplates: () => http<Template[]>("/api/templates"),
  getTemplate: (id: string) => http<Template>(`/api/templates/${id}`),
  createTemplate: (body: {
    name: string;
    description?: string;
    layoutConfig?: Record<string, unknown>;
  }) => http<Template>("/api/templates", { method: "POST", body: JSON.stringify(body) }),
  updateTemplate: (id: string, body: Partial<Template>) =>
    http<Template>(`/api/templates/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTemplate: (id: string) => http<void>(`/api/templates/${id}`, { method: "DELETE" }),

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
  updateCertificate: (id: string, body: Partial<Certificate>) =>
    http<Certificate>(`/api/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteCertificate: (id: string) => http<void>(`/api/certificates/${id}`, { method: "DELETE" }),
  pdfUrl: (id: string) => `${API_URL}/api/certificates/${id}/pdf`,

  verify: (cpf: string, verificationCode: string) =>
    http<VerifyResult>("/api/verify", {
      method: "POST",
      body: JSON.stringify({ cpf, verificationCode }),
    }),
};

export type { Template, Certificate, VerifyResult };
