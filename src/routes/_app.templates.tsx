import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { api, Template } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try { setItems(await api.listTemplates()); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createTemplate({ name, description, layoutConfig: {} });
      setName(""); setDescription(""); setOpen(false);
      await load();
    } catch (err) { alert((err as Error).message); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Remover este template?")) return;
    try { await api.deleteTemplate(id); await load(); }
    catch (err) { alert((err as Error).message); }
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
              <label className="text-sm font-medium">Nome</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="Ex.: Workshop de IA" />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="Opcional" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /> Carregando...</div>
      ) : error ? (
        <ApiError message={error} onRetry={load} />
      ) : (
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
              <h3 className="font-semibold mt-4">{t.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description || "Sem descrição"}</p>
              <p className="text-xs text-muted-foreground mt-2">Criado em {new Date(t.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum template cadastrado.</div>
          )}
        </div>
      )}
    </div>
  );
}

export function ApiError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-5">
      <div className="font-semibold text-destructive">Erro ao conectar ao servidor</div>
      <p className="text-sm text-muted-foreground mt-1">{message}</p>
      <p className="text-xs text-muted-foreground mt-2">Verifique se o servidor está rodando em <code>http://localhost:3000</code>.</p>
      <button onClick={onRetry} className="mt-3 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">Tentar novamente</button>
    </div>
  );
}
