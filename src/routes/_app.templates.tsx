import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { db, Template } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState("");

  useEffect(() => setItems(db.getTemplates()), []);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const next: Template = {
      id: Date.now(),
      nome,
      arquivo_path: arquivo || "/templates/novo.pdf",
      created_at: new Date().toISOString().slice(0, 10),
    };
    const list = [next, ...items];
    setItems(list);
    db.saveTemplates(list);
    setNome(""); setArquivo(""); setOpen(false);
  }

  function remove(id: number) {
    const list = items.filter((t) => t.id !== id);
    setItems(list);
    db.saveTemplates(list);
  }

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Modelos de certificado da sua organização."
        action={
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-foreground font-medium" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Plus className="w-4 h-4" /> Novo template
          </button>
        }
      />

      {open && (
        <form onSubmit={add} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold">Cadastrar novo template</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do template</label>
              <input required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="Ex.: Workshop de IA" />
            </div>
            <div>
              <label className="text-sm font-medium">Caminho do arquivo</label>
              <input value={arquivo} onChange={(e) => setArquivo(e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="/templates/arquivo.pdf" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium">Salvar</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-5 group" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold mt-4">{t.nome}</h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">{t.arquivo_path}</p>
            <p className="text-xs text-muted-foreground mt-2">Criado em {t.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}