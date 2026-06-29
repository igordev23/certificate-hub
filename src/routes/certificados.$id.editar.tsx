import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { PageHeader } from "@/components/PageHeader";
import {
  Loader2,
  Download,
  ChevronLeft,
  BadgeCheck,
  AlertTriangle,
  ScrollText,
  GraduationCap,
  Clock,
  User,
  FileBadge,
  CalendarCheck,
} from "lucide-react";
import { isExpired } from "@/models/certificate";

export const Route = createFileRoute("/certificados/$id/editar")({
  head: () => ({ meta: [{ title: "Editar certificado — CertifyHub" }] }),
  component: CertificadoEdit,
});

function CertificadoEdit() {
  const navigate = useNavigate();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const parts = pathname.split("/").filter(Boolean);
  const id =
    parts.length >= 2 && parts[parts.length - 1] === "editar" ? parts[parts.length - 2] : "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);
  const [validityDate, setValidityDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCPF, setRecipientCPF] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseHours, setCourseHours] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getCertificate(id)
      .then((c) => {
        if (!active) return;
        setCertificate(c);
        setValidityDate(c.validityDate.slice(0, 10));
        setRecipientName(c.recipientName ?? "");
        setRecipientCPF(c.recipientCPF ?? "");
        setCourseName(c.courseName ?? "");
        setCourseHours(c.courseHours ?? "");
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      await api.updateCertificate(id, {
        recipientName,
        recipientCPF: (recipientCPF || "").replace(/\D/g, ""),
        courseName,
        courseHours: Number(courseHours) || 0,
        validityDate: new Date(validityDate).toISOString(),
      });
      navigate({ to: "/certificados" });
    } catch (e) {
      const err = e as any;
      if (err?.details) {
        setError(err.details.map((d: any) => d.message).join(". "));
      } else {
        setError(err?.message || "Erro desconhecido");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-12 grid place-items-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="mt-3 text-sm">Carregando certificado...</span>
      </div>
    );

  const expired = certificate ? isExpired(certificate.validityDate) : false;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate({ to: "/certificados" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para certificados
      </button>

      <PageHeader
        title="Editar certificado"
        description="Altere os dados do certificado e gerencie a validade."
      />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-destructive flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Erro ao salvar:</span> {error}
          </div>
        </div>
      )}

      {certificate && (
        <>
          {/* Status card */}
          <div
            className={`rounded-xl p-4 mb-6 flex items-center gap-3 border ${
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
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Dados do certificado</span>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Participante
                  </label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <FileBadge className="w-3.5 h-3.5 text-muted-foreground" />
                    CPF
                  </label>
                  <input
                    value={recipientCPF}
                    onChange={(e) => setRecipientCPF(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    Curso
                  </label>
                  <input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    Horas
                  </label>
                  <input
                    type="number"
                    value={String(courseHours)}
                    onChange={(e) => setCourseHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    Data de validade
                  </label>
                  <input
                    type="date"
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  />
                </div>
                <div className="flex items-end gap-3">
                  <a
                    href={api.pdfUrl(certificate.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </a>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-end gap-3">
              <button
                onClick={() => navigate({ to: "/certificados" })}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2 rounded-lg text-primary-foreground font-medium text-sm inline-flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ScrollText className="w-4 h-4" />
                )}
                Salvar alterações
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
