import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Calendar, Download, Copy, Check, Loader2 } from "lucide-react";
import { api, isExpired } from "@/services/api";
import type { Certificate } from "@/models/certificate";
import { PageHeader } from "@/components/PageHeader";
import { ApiError } from "./_app.templates";

export const Route = createFileRoute("/_app/certificados/")({
  component: CertificadosList,
});

function CertificadosList() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [novaValidade, setNovaValidade] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try { setItems(await api.listCertificates()); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = items.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(q.toLowerCase()) ||
      c.recipientCPF.includes(q) ||
      c.verificationCode.toLowerCase().includes(q.toLowerCase()),
  );

  async function salvarValidade(id: string) {
    try {
      await api.updateValidity(id, new Date(novaValidade).toISOString());
      setEditId(null);
      await load();
    } catch (err) { alert((err as Error).message); }
  }

  function copiar(c: Certificate) {
    navigator.clipboard.writeText(c.verificationCode);
    setCopied(c.id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        title="Certificados"
        description="Histórico de emissões."
        action={
          <Link to="/certificados/novo" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-foreground font-medium" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Plus className="w-4 h-4" /> Emitir certificado
          </Link>
        }
      />

      <div className="relative mb-5 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, CPF ou código"
          className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /> Carregando...</div>
      ) : error ? (
        <ApiError message={error} onRetry={load} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Participante</th>
                <th className="px-4 py-3 font-medium">CPF</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Validade</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const expired = isExpired(c.validityDate);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.recipientName}</div>
                      <div className="text-xs text-muted-foreground">{c.courseName} · {c.courseHours}h</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.recipientCPF}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => copiar(c)} className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded bg-secondary hover:bg-accent transition">
                        {c.verificationCode}
                        {copied === c.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {editId === c.id ? (
                        <div className="flex items-center gap-1">
                          <input type="date" defaultValue={c.validityDate.slice(0, 10)} onChange={(e) => setNovaValidade(e.target.value)} className="px-2 py-1 rounded border border-input bg-background text-xs" />
                          <button onClick={() => salvarValidade(c.id)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">OK</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(c.id); setNovaValidade(c.validityDate.slice(0, 10)); }} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(c.validityDate).toLocaleDateString("pt-BR")}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${expired ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                        {expired ? "expirado" : "ativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={api.pdfUrl(c.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </a>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhum certificado encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
