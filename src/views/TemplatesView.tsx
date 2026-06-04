import { useTemplatesViewModel } from "@/view-models/useTemplatesViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Edit3, Plus, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Template } from "@/models/template";

export function TemplatesView() {
  const { items, loading, setOpen } = useTemplatesViewModel();

  return (
    <div>
      <PageHeader title="Templates" description="Gerencie modelos de certificado." />

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{items.length} templates</div>
        <div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" /> Novo template
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="p-6 grid place-items-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((t: Template) => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/templates/${t.id}/edit` as any} className="text-muted-foreground hover:text-foreground"><Edit3 className="w-4 h-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
