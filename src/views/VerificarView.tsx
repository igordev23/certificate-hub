import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  Loader2,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { useVerifyViewModel } from "@/view-models/useVerifyViewModel";
import { Link } from "@tanstack/react-router";

export function VerificarView() {
  const { cpf, codigo, loading, resultado, error, setCpf, setCodigo, buscar } =
    useVerifyViewModel();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl grid place-items-center shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-lg">CertifyHub</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5 shadow-xl"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            <ShieldCheck className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Verificar certificado</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Informe o CPF do participante e o código único do certificado.
          </p>
        </div>

        <form
          onSubmit={buscar}
          className="bg-card border border-border rounded-xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Consulta pública</span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                CPF do participante
              </label>
              <input
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="00000000000"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Código de verificação
              </label>
              <input
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="A3B7K9XZ"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background font-mono uppercase text-sm tracking-widest transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-primary-foreground inline-flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Verificar autenticidade
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-destructive">
            Erro ao consultar o servidor: {error}
          </div>
        )}

        {resultado && (
          <div className="mt-6">
            {resultado.isAuthentic && resultado.certificate ? (
              <div
                className={`bg-card border-2 rounded-xl overflow-hidden ${resultado.isValid ? "border-emerald-200 dark:border-emerald-800" : "border-amber-200 dark:border-amber-800"}`}
              >
                <div
                  className={`p-5 flex items-center gap-3 ${resultado.isValid ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}
                >
                  {resultado.isValid ? (
                    <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                  <div>
                    <div
                      className={`font-semibold ${resultado.isValid ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
                    >
                      {resultado.isValid
                        ? "Certificado autêntico e válido"
                        : "Autêntico, mas expirado"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {resultado.isValid
                        ? "O documento é original e está dentro do prazo de validade."
                        : "O documento é original, mas a data de validade já expirou."}
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <Field label="Participante" value={resultado.certificate.recipientName} />
                  <Field label="Curso" value={resultado.certificate.courseName} />
                  <Field label="Carga horária" value={`${resultado.certificate.courseHours}h`} />
                  <Field label="Código" value={resultado.certificate.verificationCode} mono />
                  <Field
                    label="Emitido em"
                    value={format(new Date(resultado.certificate.issuedAt), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  />
                  <Field
                    label="Válido até"
                    value={format(new Date(resultado.certificate.validityDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  />
                </div>
                <div className="px-5 py-4 border-t border-border bg-secondary/20 flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-primary" />
                  Documento emitido pela CertifyHub
                </div>
              </div>
            ) : (
              <div className="bg-card border-2 border-destructive/40 rounded-xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-7 h-7 text-destructive" />
                </div>
                <div className="text-destructive font-semibold text-lg">
                  Certificado não encontrado
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Verifique se o CPF e o código foram digitados corretamente.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
