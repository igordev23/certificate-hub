import { Award, Loader2 } from "lucide-react";
import { useEmitCertificateViewModel } from "@/view-models/useEmitCertificateViewModel";
import { PageHeader } from "@/components/PageHeader";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Input } from "@/components/ui/input";

export function NovoCertificadoView() {
  const { templates, loadingTemplates, submitting, form, errors, generalErrors, setFormField, submit, cancel, clearErrors, getFieldError } = useEmitCertificateViewModel();

  function fieldError(field: string) {
    const msg = getFieldError(field);
    return msg ? <p className="text-[0.8rem] font-medium text-destructive mt-1">{msg}</p> : null;
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Emitir certificado" description="Preencha os dados do participante." />
      {errors.length > 0 && (
        <div className="mb-6">
          <ErrorAlert errors={errors} onDismiss={clearErrors} />
        </div>
      )}
      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="text-sm font-medium">Template</label>
          <select required disabled={loadingTemplates} value={form.templateId} onChange={(e) => setFormField("templateId", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background">
            {loadingTemplates && <option>Carregando...</option>}
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {fieldError("templateId")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome do participante</label>
            <Input required value={form.recipientName} onChange={(e) => setFormField("recipientName", e.target.value)} className="mt-1.5" />
            {fieldError("recipientName")}
          </div>
          <div>
            <label className="text-sm font-medium">CPF</label>
            <Input required value={form.recipientCPF} onChange={(e) => setFormField("recipientCPF", e.target.value)} placeholder="000.000.000-00" maxLength={14} className="mt-1.5" />
            {fieldError("recipientCPF")}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Nome do curso</label>
            <Input required value={form.courseName} onChange={(e) => setFormField("courseName", e.target.value)} className="mt-1.5" />
            {fieldError("courseName")}
          </div>
          <div>
            <label className="text-sm font-medium">Carga horária</label>
            <Input required type="number" min={1} value={form.courseHours} onChange={(e) => setFormField("courseHours", Number(e.target.value))} className="mt-1.5" />
            {fieldError("courseHours")}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">E-mail (opcional)</label>
            <Input type="email" value={form.email} onChange={(e) => setFormField("email", e.target.value)} className="mt-1.5" />
            {fieldError("email")}
          </div>
          <div>
            <label className="text-sm font-medium">Data de validade</label>
            <Input required type="date" value={form.validityDate} onChange={(e) => setFormField("validityDate", e.target.value)} className="mt-1.5" />
            {fieldError("validityDate")}
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
