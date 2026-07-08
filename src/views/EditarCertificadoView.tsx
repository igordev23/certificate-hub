import { useEditCertificateViewModel } from "@/view-models/useEditCertificateViewModel";
import {
  Loader2,
  ChevronLeft,
  BadgeCheck,
  AlertTriangle,
  ScrollText,
  GraduationCap,
  Clock,
  User,
  FileBadge,
  CalendarCheck,
  Download,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function EditarCertificadoView({ id }: { id: string }) {
  const { certificate, loading, submitting, expired, form, submit, cancel, pdfUrl } =
    useEditCertificateViewModel(id);

  if (loading) {
    return (
      <div className="p-12 grid place-items-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="mt-3 text-sm">Carregando certificado...</span>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="p-12 text-center bg-card border border-border rounded-xl">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <div className="text-destructive font-semibold mb-2">Certificado não encontrado</div>
        <button
          onClick={cancel}
          className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors mt-2"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={cancel}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar certificado</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Altere os dados do certificado e gerencie a validade.
          </p>
        </div>
      </div>

      {/* Status card */}
      <div
        className={`rounded-xl p-4 flex items-center gap-3 border ${
          expired
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
        }`}
      >
        {expired ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        ) : (
          <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        )}
        <div>
          <div className="font-medium text-sm">Certificado {expired ? "vencido" : "ativo"}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {expired
              ? "A data de validade já passou. Renove para ativar."
              : "O certificado está dentro do prazo de validade."}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Dados do certificado</span>
        </div>

        <Form {...form}>
          <form
            onSubmit={submit}
            className="p-6 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Participante
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel className="flex items-center gap-1.5">
                      <FileBadge className="w-3.5 h-3.5 text-muted-foreground" />
                      CPF
                    </FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={14} placeholder="000.000.000-00" />
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
                    <FormLabel className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                      Curso
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      Horas
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="validityDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                      Data de validade
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input text-sm font-medium hover:bg-secondary transition-colors w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </a>
              </div>
            </div>

            <div className="!mt-8 pt-4 border-t border-border flex items-center justify-end gap-3">
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
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {!submitting && <ScrollText className="w-4 h-4" />}
                Salvar alterações
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
