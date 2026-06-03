import { Edit3, Copy, Calendar, Loader2 } from "lucide-react";
import { useCertificatesViewModel } from "@/view-models/useCertificatesViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@tanstack/react-router";

export function CertificadosListView() {
  const {
    filteredItems,
    loading,
    q,
    setQ,
    editId,
    setEditId,
    novaValidade,
    setNovaValidade,
    copiar,
    salvarValidade,
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
        ) : (
          <div className="space-y-3">
            {filteredItems.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.recipientName}</div>
                  <div className="text-sm text-muted-foreground">{c.courseName} • {c.courseHours}h</div>
                </div>
                <div className="flex items-center gap-3">
                  <button title="Copiar código" onClick={() => copiar(c)} className="text-muted-foreground hover:text-foreground"><Copy className="w-4 h-4" /></button>
                  <button title="Editar validade" onClick={() => { setEditId(c.id); setNovaValidade(c.validityDate.slice(0,10)); }} className="text-muted-foreground hover:text-foreground"><Calendar className="w-4 h-4" /></button>
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
