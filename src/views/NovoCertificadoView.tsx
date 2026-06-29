import { Award, Loader2, ScrollText } from "lucide-react";
import { useEmitCertificateViewModel } from "@/view-models/useEmitCertificateViewModel";
import { PageHeader } from "@/components/PageHeader";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Input } from "@/components/ui/input";

export function NovoCertificadoView() {
  const {
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
  } = useEmitCertificateViewModel();

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
      <form
        onSubmit={submit}
        className="bg-card border border-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Dados do certificado</span>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium">Template</label>
            <select
              required
              disabled={loadingTemplates}
              value={form.templateId}
              onChange={(e) => setFormField("templateId", e.target.value)}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm"
            >
              {loadingTemplates && <option>Carregando...</option>}
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {fieldError("templateId")}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">Nome do participante</label>
              <Input
                required
                value={form.recipientName}
                onChange={(e) => setFormField("recipientName", e.target.value)}
                className="mt-1.5"
              />
              {fieldError("recipientName")}
            </div>
            <div>
              <label className="text-sm font-medium">CPF</label>
              <Input
                required
                value={form.recipientCPF}
                onChange={(e) => setFormField("recipientCPF", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                className="mt-1.5"
              />
              {fieldError("recipientCPF")}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Nome do curso</label>
              <Input
                required
                value={form.courseName}
                onChange={(e) => setFormField("courseName", e.target.value)}
                className="mt-1.5"
              />
              {fieldError("courseName")}
            </div>
            <div>
              <label className="text-sm font-medium">Carga horária</label>
              <Input
                required
                type="number"
                min={1}
                value={form.courseHours}
                onChange={(e) => setFormField("courseHours", Number(e.target.value))}
                className="mt-1.5"
              />
              {fieldError("courseHours")}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">E-mail (opcional)</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setFormField("email", e.target.value)}
                className="mt-1.5"
              />
              {fieldError("email")}
            </div>
            <div>
              <label className="text-sm font-medium">Data de validade</label>
              <Input
                required
                type="date"
                value={form.validityDate}
                onChange={(e) => setFormField("validityDate", e.target.value)}
                className="mt-1.5"
              />
              {fieldError("validityDate")}
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 text-sm text-muted-foreground flex gap-3 items-start border border-primary/10">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="leading-relaxed">
              O servidor gerará o código de verificação automaticamente. O envio por e-mail será
              registrado localmente até a integração com o backend de envio.
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={cancel}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-primary-foreground font-medium text-sm inline-flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {!submitting && <ScrollText className="w-4 h-4" />}
            Emitir certificado
          </button>
        </div>
      </form>
    </div>
  );
}
