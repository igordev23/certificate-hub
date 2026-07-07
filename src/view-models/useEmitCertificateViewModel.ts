import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/services/api";
import { envios } from "@/services/envios";
import { friendlyError } from "@/lib/error-friendly";
import type { Template } from "@/models/template";
import type { ValidationError } from "@/components/ErrorAlert";

export interface EmitCertificateForm {
  recipientName: string;
  recipientCPF: string;
  email: string;
  courseName: string;
  courseHours: number;
  templateId: string;
  validityDate: string;
}

const DEFAULT_FORM_STATE: EmitCertificateForm = {
  recipientName: "",
  recipientCPF: "",
  email: "",
  courseName: "",
  courseHours: 40,
  templateId: "",
  validityDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
};

export function isValidCPF(cpf: string): boolean {
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

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function useEmitCertificateViewModel() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EmitCertificateForm>(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    api
      .listTemplates()
      .then((t) => {
        setTemplates(t);
        if (t[0]) {
          setForm((current) => ({ ...current, templateId: t[0].id }));
        }
      })
      .catch((err) => {
        toast.error(friendlyError(err), {
          duration: Infinity,
        });
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  function setFormField<K extends keyof EmitCertificateForm>(
    key: K,
    value: EmitCertificateForm[K],
  ) {
    if (errors.some((e) => e.field === key)) {
      setErrors((prev) => prev.filter((e) => e.field !== key));
    }
    if (key === "recipientCPF") {
      setForm((current) => ({
        ...current,
        [key]: formatCPF(value as string) as EmitCertificateForm[K],
      }));
    } else {
      setForm((current) => ({ ...current, [key]: value }));
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const rawCPF = form.recipientCPF.replace(/\D/g, "");
    if (rawCPF.length !== 11 || !isValidCPF(rawCPF)) {
      setErrors([
        { field: "recipientCPF", message: "CPF inválido. Digite um CPF com 11 dígitos válidos." },
      ]);
      setSubmitting(false);
      return;
    }

    try {
      const cert = await api.emitCertificate({
        recipientName: form.recipientName,
        recipientCPF: form.recipientCPF.replace(/\D/g, ""),
        courseName: form.courseName,
        courseHours: Number(form.courseHours),
        validityDate: new Date(form.validityDate).toISOString(),
        templateId: form.templateId,
      });

      if (form.email) {
        envios.add({
          id: Date.now(),
          certificateId: cert.id,
          recipientEmail: form.email,
          recipientName: cert.recipientName,
          status: "pendente",
          data: new Date().toISOString(),
        });
      }

      toast.success("Certificado emitido com sucesso!");
      navigate({ to: "/certificados" });
    } catch (err) {
      const error = err as any;

      if (error?.details && Array.isArray(error.details)) {
        setErrors(error.details);
        toast.error("Verifique os campos do formulário e tente novamente.", { duration: Infinity });
      } else if (error?.message) {
        setErrors([{ field: "geral", message: error.message }]);
        toast.error(friendlyError(error), { duration: Infinity });
      } else {
        setErrors([{ field: "geral", message: "Erro desconhecido ao emitir certificado" }]);
        toast.error("Não foi possível emitir o certificado. Tente novamente.", {
          duration: Infinity,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function cancel() {
    navigate({ to: "/certificados" });
  }

  function clearErrors() {
    setErrors([]);
  }

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  const generalErrors = errors.filter((e) => e.field === "geral");

  return {
    templates,
    loadingTemplates,
    submitting,
    form,
    errors,
    generalErrors,
    setFormField,
    submit,
    cancel,
    clearErrors,
    getFieldError,
  };
}
