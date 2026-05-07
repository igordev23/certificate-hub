import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Calendar, Send, Copy, Check } from "lucide-react";
import { db, Certificado, statusFromValidade, EnvioEmail } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/certificados/")({
  component: CertificadosList,
});

function CertificadosList() {
  const [items, setItems] = useState<Certificado[]>([]);
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [novaValidade, setNovaValidade] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => setItems(db.getCertificados()), []);

  const filtered = items.filter(
    (c) =>
      c.nome_participante.toLowerCase().includes(q.toLowerCase()) ||
      c.cpf.includes(q) ||
      c.codigo_unico.toLowerCase().includes(q.toLowerCase()),
  );

  function salvarValidade(id: number) {
    const list = items.map((c) =>
      c.id === id ? { ...c, data_validade: novaValidade, status: statusFromValidade(novaValidade) } : c,
    );
    setItems(list);
    db.saveCertificados(list);
    setEditId(null);
  }

  function reenviar(c: Certificado) {
    const envios = db.getEnvios();
    const novo: EnvioEmail = {
      id: Date.now(),
      certificado_id: c.id,
      destinatario_email: c.email,
      status: "enviado",
      data: new Date().toISOString(),
    };
    db.saveEnvios([novo, ...envios]);
    alert(`E-mail enviado para ${c.email}`);
  }

  function copiar(c: Certificado) {
    navigator.clipboard.writeText(c.codigo_unico);
    setCopied(c.id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        title="Certificados"
        description="Histórico de emissões da organização."
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
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{c.nome_participante}</div>
                  <div className="text-xs text-muted-foreground">{c.template_nome}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.cpf}</td>
                <td className="px-4 py-3">
                  <button onClick={() => copiar(c)} className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded bg-secondary hover:bg-accent transition">
                    {c.codigo_unico}
                    {copied === c.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {editId === c.id ? (
                    <div className="flex items-center gap-1">
                      <input type="date" defaultValue={c.data_validade} onChange={(e) => setNovaValidade(e.target.value)} className="px-2 py-1 rounded border border-input bg-background text-xs" />
                      <button onClick={() => salvarValidade(c.id)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">OK</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(c.id); setNovaValidade(c.data_validade); }} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <Calendar className="w-3.5 h-3.5" /> {c.data_validade}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => reenviar(c)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary">
                    <Send className="w-3.5 h-3.5" /> Reenviar
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhum certificado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ativo: "bg-success/10 text-success",
    expirado: "bg-warning/10 text-warning",
    revogado: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] || "bg-muted"}`}>{status}</span>;
}