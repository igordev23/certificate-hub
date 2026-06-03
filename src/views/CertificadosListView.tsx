import { Edit3, Copy, Calendar, Loader2, Download, Check } from "lucide-react";
import { useCertificatesViewModel } from "@/view-models/useCertificatesViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@tanstack/react-router";
import { api } from "@/services/api";
import type { Certificate } from "@/models/certificate";

export function CertificadosListView() {
  const {
    filteredItems,
    loading,
    error,
    load,
    q,
    setQ,
    editId,
    setEditId,
    novaValidade,
    setNovaValidade,
    copiar,
    salvarValidade,
    copied,
  } = useCertificatesViewModel();

  return (
    <div>
      <PageHeader title="Certificados" description="Lista de certificados emitidos." />

      <div className="mt-6 flex items-center gap-3">
        <input value={q} placeholder="Filtrar por nome ou código" onChange={(e) => setQ(e.target.value)} className="px-3 py-2 rounded-md border border-input w-full" />
        <Link to="/certificados/novo" className="px-3 py-2 rounded-md bg-primary text-primary-foreground">Emitir</Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="p-6 grid place-items-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-destructive font-semibold mb-2">Erro ao carregar certificados</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <div className="flex justify-center gap-2">
              <button onClick={load} className="px-3 py-2 rounded border">Tentar novamente</button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Nenhum certificado encontrado.</div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((c: Certificate) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.recipientName}</div>
                  <div className="text-sm text-muted-foreground">{c.courseName} • {c.courseHours}h</div>
                </div>
                <div className="flex items-center gap-3">
                  <button title="Copiar código" onClick={() => copiar(c)} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    {copied === c.id && <Check className="w-3 h-3 text-success" />}
                  </button>

                  {editId === c.id ? (
                    <div className="flex items-center gap-2">
                      <input type="date" defaultValue={c.validityDate.slice(0,10)} onChange={(e) => setNovaValidade(e.target.value)} className="px-2 py-1 rounded border border-input text-sm" />
                      <button onClick={() => salvarValidade(c.id)} className="px-2 py-1 rounded bg-primary text-primary-foreground text-sm">OK</button>
                    </div>
                  ) : (
                    <button title="Editar validade" onClick={() => { setEditId(c.id); setNovaValidade(c.validityDate.slice(0,10)); }} className="text-muted-foreground hover:text-foreground"><Calendar className="w-4 h-4" /></button>
                  )}

                  <a href={api.pdfUrl(c.id)} target="_blank" rel="noreferrer" title="Baixar PDF" className="text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" /></a>

                  <Link to={`/certificados/${c.id}/editar` as any} className="text-muted-foreground hover:text-foreground"><Edit3 className="w-4 h-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
