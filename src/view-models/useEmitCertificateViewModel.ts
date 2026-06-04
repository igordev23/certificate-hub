import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/services/api";
import { envios } from "@/services/envios";
import type { Template } from "@/models/template";

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

export function useEmitCertificateViewModel() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EmitCertificateForm>(DEFAULT_FORM_STATE);

  useEffect(() => {
    api.listTemplates()
      .then((t) => {
        setTemplates(t);
        if (t[0]) {
          setForm((current) => ({ ...current, templateId: t[0].id }));
        }
      })
      .catch((err) => {
        alert("Erro ao carregar templates: " + (err as Error).message);
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  function setFormField<K extends keyof EmitCertificateForm>(key: K, value: EmitCertificateForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

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

      navigate({ to: "/certificados" });
    } catch (err) {
      alert("Erro ao emitir: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function cancel() {
    navigate({ to: "/certificados" });
  }

  return {
    templates,
    loadingTemplates,
    submitting,
    form,
    setFormField,
    submit,
    cancel,
  };
}
