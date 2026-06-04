import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { PageHeader } from "@/components/PageHeader";
import { Loader2, Download, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/certificados/$id/editar")({
  head: () => ({ meta: [{ title: "Editar certificado — CertifyHub" }] }),
  component: CertificadoEdit,
});

function CertificadoEdit() {
  const navigate = useNavigate();
  // extract id from pathname
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const parts = pathname.split("/").filter(Boolean);
  const id = parts.length >= 2 && parts[parts.length - 1] === "editar" ? parts[parts.length - 2] : "";

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
    api.getCertificate(id)
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
    return () => { active = false; };
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

  if (loading) return <div className="p-6 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate({ to: "/certificados" })} className="p-2 rounded border border-border"><ChevronLeft className="w-4 h-4" /></button>
        <PageHeader title="Editar certificado" description="Ajuste validades e baixe o PDF do certificado." />
        <div />
      </div>

      {error && <div className="mb-4 text-destructive">Erro: {error}</div>}

      {certificate && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Participante</label>
            <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border border-input" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">CPF</label>
            <input value={recipientCPF} onChange={(e) => setRecipientCPF(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border border-input" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Curso</label>
            <input value={courseName} onChange={(e) => setCourseName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border border-input" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Horas</label>
            <input type="number" value={String(courseHours)} onChange={(e) => setCourseHours(e.target.value)} className="mt-1 w-40 px-3 py-2 rounded border border-input" />
          </div>
          <div>
            <label className="text-sm font-medium">Data de validade</label>
            <input type="date" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} className="mt-1 px-3 py-2 rounded border border-input" />
          </div>

          <div className="flex items-center gap-2">
            <a href={api.pdfUrl(certificate.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded border">
              <Download className="w-4 h-4" /> Baixar PDF
            </a>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-primary text-primary-foreground inline-flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar alterações"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
