import { z } from "zod";

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  return true;
}

export const emitCertificateSchema = z.object({
  recipientName: z.string().min(1, "Informe o nome do participante"),
  recipientCPF: z
    .string()
    .min(1, "Informe o CPF")
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
    .refine(isValidCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  courseName: z.string().min(1, "Informe o nome do curso"),
  courseHours: z.coerce.number().min(1, "Carga horária deve ser no mínimo 1"),
  templateId: z.string().min(1, "Selecione um template"),
  validityDate: z.string().min(1, "Selecione a data de validade"),
});

export type EmitCertificateData = z.infer<typeof emitCertificateSchema>;

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Informe o nome do template"),
  description: z.string().optional(),
});

export type CreateTemplateData = z.infer<typeof createTemplateSchema>;
