import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/services/api";
import { friendlyError } from "@/lib/error-friendly";
import { updateCertificateSchema, type UpdateCertificateData } from "@/lib/schemas";
import { isExpired } from "@/models/certificate";
import type { Certificate } from "@/models/certificate";

export function useEditCertificateViewModel(id: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const form = useForm<UpdateCertificateData>({
    resolver: zodResolver(updateCertificateSchema),
    mode: "onBlur",
    defaultValues: {
      recipientName: "",
      recipientCPF: "",
      courseName: "",
      courseHours: 40,
      validityDate: "",
    },
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getCertificate(id)
      .then((c) => {
        if (!active) return;
        setCertificate(c);
        form.reset({
          recipientName: c.recipientName ?? "",
          recipientCPF: c.recipientCPF ?? "",
          courseName: c.courseName ?? "",
          courseHours: c.courseHours ?? 40,
          validityDate: c.validityDate.slice(0, 10),
        });
      })
      .catch((e) => {
        if (!active) return;
        toast.error(friendlyError(e), { duration: Infinity });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, form]);

  async function submit(data: UpdateCertificateData) {
    setSubmitting(true);
    try {
      await api.updateCertificate(id, {
        recipientName: data.recipientName,
        recipientCPF: data.recipientCPF.replace(/\D/g, ""),
        courseName: data.courseName,
        courseHours: Number(data.courseHours),
        validityDate: new Date(data.validityDate).toISOString(),
      });
      toast.success("Certificado atualizado com sucesso!");
      navigate({ to: "/certificados" });
    } catch (e: any) {
      if (e?.details && Array.isArray(e.details)) {
        for (const d of e.details) {
          form.setError(d.field || "root", { message: d.message });
        }
        toast.error("Verifique os campos do formulário e tente novamente.", { duration: Infinity });
      } else {
        form.setError("root", { message: e?.message || "Erro desconhecido" });
        toast.error(friendlyError(e), { duration: Infinity });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const expired = certificate ? isExpired(certificate.validityDate) : false;

  return {
    certificate,
    loading,
    submitting,
    expired,
    form,
    submit: form.handleSubmit(submit),
    cancel: () => navigate({ to: "/certificados" }),
    pdfUrl: certificate ? api.pdfUrl(certificate.id) : "",
  };
}
