import { createFileRoute } from "@tanstack/react-router";
import { Award, Loader2 } from "lucide-react";
import { useEmitCertificateViewModel } from "@/view-models/useEmitCertificateViewModel";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/certificados/novo")({
  component: NovoCertificado,
});

function NovoCertificado() {
  const { templates, loadingTemplates, submitting, form, setFormField, submit, cancel } = useEmitCertificateViewModel();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Emitir certificado" description="Preencha os dados do participante." />
      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="text-sm font-medium">Template</label>
          <select required disabled={loadingTemplates} value={form.templateId} onChange={(e) => setFormField("templateId", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background">
            {loadingTemplates && <option>Carregando...</option>}
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome do participante</label>
            <input required value={form.recipientName} onChange={(e) => setFormField("recipientName", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">CPF (apenas números)</label>
            <input required value={form.recipientCPF} onChange={(e) => setFormField("recipientCPF", e.target.value)} placeholder="00000000000" maxLength={14} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Nome do curso</label>
            <input required value={form.courseName} onChange={(e) => setFormField("courseName", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Carga horária</label>
            <input required type="number" min={1} value={form.courseHours} onChange={(e) => setFormField("courseHours", Number(e.target.value))} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">E-mail (opcional)</label>
            <input type="email" value={form.email} onChange={(e) => setFormField("email", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Data de validade</label>
            <input required type="date" value={form.validityDate} onChange={(e) => setFormField("validityDate", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground flex gap-2 items-start">
          <Award className="w-4 h-4 mt-0.5 text-primary" />
          <div>O servidor gerará o código de verificação automaticamente. O envio por e-mail será registrado localmente até a integração de envio ser implementada no backend.</div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={cancel} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-md text-primary-foreground font-medium inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Emitir certificado
          </button>
        </div>
      </form>
    </div>
  );
}
