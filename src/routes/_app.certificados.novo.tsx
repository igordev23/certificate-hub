import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import type { Template } from "@/models/template";
import { envios } from "@/services/envios";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/certificados/novo")({
  component: NovoCertificado,
});

function NovoCertificado() {
  const nav = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTpl, setLoadingTpl] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    recipientName: "",
    recipientCPF: "",
    email: "",
    courseName: "",
    courseHours: 40,
    templateId: "",
    validityDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
  });

  useEffect(() => {
    api.listTemplates()
      .then((t) => {
        setTemplates(t);
        if (t[0]) setForm((f) => ({ ...f, templateId: t[0].id }));
      })
      .catch((e) => alert("Erro ao carregar templates: " + (e as Error).message))
      .finally(() => setLoadingTpl(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
      // Log local de e-mail (servidor ainda não envia)
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
      nav({ to: "/certificados" });
    } catch (err) {
      alert("Erro ao emitir: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Emitir certificado" description="Preencha os dados do participante." />
      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="text-sm font-medium">Template</label>
          <select required disabled={loadingTpl} value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background">
            {loadingTpl && <option>Carregando...</option>}
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome do participante</label>
            <input required value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">CPF (apenas números)</label>
            <input required value={form.recipientCPF} onChange={(e) => setForm({ ...form, recipientCPF: e.target.value })} placeholder="00000000000" maxLength={14} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Nome do curso</label>
            <input required value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Carga horária</label>
            <input required type="number" min={1} value={form.courseHours} onChange={(e) => setForm({ ...form, courseHours: Number(e.target.value) })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">E-mail (opcional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Data de validade</label>
            <input required type="date" value={form.validityDate} onChange={(e) => setForm({ ...form, validityDate: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground flex gap-2 items-start">
          <Award className="w-4 h-4 mt-0.5 text-primary" />
          <div>O servidor gerará o código de verificação automaticamente. O envio por e-mail será registrado localmente até a integração de envio ser implementada no backend.</div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => nav({ to: "/certificados" })} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-md text-primary-foreground font-medium inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Emitir certificado
          </button>
        </div>
      </form>
    </div>
  );
}
