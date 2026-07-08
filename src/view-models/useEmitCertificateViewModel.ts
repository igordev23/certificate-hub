import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/services/api";
import { envios } from "@/services/envios";
import { friendlyError } from "@/lib/error-friendly";
import { emitCertificateSchema, type EmitCertificateData } from "@/lib/schemas";
import type { Template } from "@/models/template";

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

  const form = useForm<EmitCertificateData>({
    resolver: zodResolver(emitCertificateSchema),
    mode: "onBlur",
    defaultValues: {
      recipientName: "",
      recipientCPF: "",
      email: "",
      courseName: "",
      courseHours: 40,
      templateId: "",
      validityDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    api
      .listTemplates()
      .then((t) => {
        setTemplates(t);
        if (t[0] && !form.getValues("templateId")) {
          form.setValue("templateId", t[0].id);
        }
      })
      .catch((err) => {
        toast.error(friendlyError(err), { duration: Infinity });
      })
      .finally(() => setLoadingTemplates(false));
  }, [form]);

  async function submit(data: EmitCertificateData) {
    setSubmitting(true);

    try {
      const cert = await api.emitCertificate({
        recipientName: data.recipientName,
        recipientCPF: data.recipientCPF.replace(/\D/g, ""),
        courseName: data.courseName,
        courseHours: Number(data.courseHours),
        validityDate: new Date(data.validityDate).toISOString(),
        templateId: data.templateId,
      });

      if (data.email) {
        envios.add({
          id: Date.now(),
          certificateId: cert.id,
          recipientEmail: data.email,
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
        for (const d of error.details) {
          form.setError(d.field || "root", { message: d.message });
        }
        toast.error("Verifique os campos do formulário e tente novamente.", { duration: Infinity });
      } else if (error?.message) {
        form.setError("root", { message: error.message });
        toast.error(friendlyError(error), { duration: Infinity });
      } else {
        form.setError("root", { message: "Erro desconhecido ao emitir certificado" });
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

  return {
    templates,
    loadingTemplates,
    submitting,
    form,
    submit: form.handleSubmit(submit),
    cancel,
  };
}
