import { Template } from "@/models/template";
import { Certificate } from "@/models/certificate";
import type { VerifyResult } from "@/models/verify";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

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
  listTemplates: () => http<Template[]>("/api/templates"),
  getTemplate: (id: string) => http<Template>(`/api/templates/${id}`),
  createTemplate: (body: { name: string; description?: string; layoutConfig?: Record<string, unknown> }) =>
    http<Template>("/api/templates", { method: "POST", body: JSON.stringify(body) }),
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
  pdfUrl: (id: string) => `${API_URL}/api/certificates/${id}/pdf`,

  verify: (cpf: string, verificationCode: string) =>
    http<VerifyResult>("/api/verify", {
      method: "POST",
      body: JSON.stringify({ cpf, verificationCode }),
    }),
};

export function isExpired(validityDate: string): boolean {
  return new Date(validityDate) < new Date();
}

export type { Template, Certificate, VerifyResult };
