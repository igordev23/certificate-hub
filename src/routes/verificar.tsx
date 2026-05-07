import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Search, CheckCircle2, XCircle, Award, ArrowLeft, Loader2 } from "lucide-react";
import { api, VerifyResult } from "@/lib/api";

export const Route = createFileRoute("/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar certificado — CertifyHub" },
      { name: "description", content: "Verifique a autenticidade de um certificado emitido pela CertifyHub usando CPF e código." },
    ],
  }),
  component: VerificarPage,
});

function VerificarPage() {
  const [cpf, setCpf] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResultado(null);
    try {
      const res = await api.verify(cpf.replace(/\D/g, ""), codigo.trim().toUpperCase());
      setResultado(res);
    } catch (err) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">CertifyHub</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <ShieldCheck className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Verificar certificado</h1>
          <p className="text-muted-foreground mt-3">Informe o CPF do participante e o código único do certificado.</p>
        </div>

        <form onSubmit={buscar} className="bg-card border border-border rounded-xl p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <label className="text-sm font-medium">CPF do participante</label>
            <input required value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="00000000000" className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Código de verificação</label>
            <input required value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="A3B7K9XZ" className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background font-mono uppercase" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-md font-medium text-primary-foreground inline-flex items-center justify-center gap-2" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verificar autenticidade
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-destructive/5 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
            Erro ao consultar o servidor: {error}
          </div>
        )}

        {resultado && (
          <div className="mt-6">
            {resultado.isAuthentic && resultado.certificate ? (
              <div className={`bg-card border-2 rounded-xl p-6 ${resultado.isValid ? "border-success" : "border-warning"}`}>
                <div className={`flex items-center gap-2 font-semibold ${resultado.isValid ? "text-success" : "text-warning"}`}>
                  <CheckCircle2 className="w-5 h-5" />
                  {resultado.isValid ? "Certificado autêntico e válido" : "Autêntico, mas expirado"}
                </div>
                <div className="mt-5 space-y-3">
                  <Field label="Participante" value={resultado.certificate.recipientName} />
                  <Field label="Curso" value={resultado.certificate.courseName} />
                  <Field label="Carga horária" value={`${resultado.certificate.courseHours}h`} />
                  <Field label="Código" value={resultado.certificate.verificationCode} mono />
                  <Field label="Emitido em" value={new Date(resultado.certificate.issuedAt).toLocaleDateString("pt-BR")} />
                  <Field label="Válido até" value={new Date(resultado.certificate.validityDate).toLocaleDateString("pt-BR")} />
                </div>
                <div className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-primary" />
                  Documento emitido pela CertifyHub.
                </div>
              </div>
            ) : (
              <div className="bg-card border-2 border-destructive rounded-xl p-6">
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <XCircle className="w-5 h-5" /> Certificado não encontrado
                </div>
                <p className="text-sm text-muted-foreground mt-2">Verifique se o CPF e o código foram digitados corretamente.</p>
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
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
