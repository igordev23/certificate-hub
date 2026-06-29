import { useTemplatesViewModel } from "@/view-models/useTemplatesViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Edit3, Plus, Loader2, Palette, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Template } from "@/models/template";

export function TemplatesView() {
  const { items, loading, setOpen } = useTemplatesViewModel();

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Gerencie modelos de certificado."
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary-foreground font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            <Plus className="w-4 h-4" /> Novo template
          </button>
        }
      />

      <div className="mt-6">
        {loading ? (
          <div className="p-12 grid place-items-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="mt-3 text-sm">Carregando templates...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <Palette className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <div className="text-muted-foreground font-medium">Nenhum template encontrado</div>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Crie seu primeiro template para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t: Template) => (
              <div
                key={t.id}
                className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-elevated hover:border-primary/20"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/templates/${t.id}/edit` as any}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Editar template"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
