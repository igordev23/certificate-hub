import { Award, Loader2, ScrollText } from "lucide-react";
import { useEmitCertificateViewModel, formatCPF } from "@/view-models/useEmitCertificateViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function NovoCertificadoView() {
  const { templates, loadingTemplates, submitting, form, submit, cancel } =
    useEmitCertificateViewModel();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Emitir certificado" description="Preencha os dados do participante." />
      <Form {...form}>
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
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <FormControl>
                    <select
                      disabled={loadingTemplates}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm"
                    >
                      {loadingTemplates && <option>Carregando...</option>}
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do participante</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientCPF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="mt-1.5"
                        onChange={(e) => field.onChange(formatCPF(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome do curso</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga horária</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} className="mt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="mt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validityDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de validade</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="mt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      </Form>
    </div>
  );
}
