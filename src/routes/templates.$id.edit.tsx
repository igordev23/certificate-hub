import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { ColorPicker } from "@/components/ColorPicker";
import { Loader2, Save, ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type TemplateLayoutConfig = {
  backgroundColor: string;
  primaryColor: string;
  borderColor: string;
  titleFontSize: number;
  bodyFontSize: number;
  showLogo: boolean;
  showBorder: boolean;
};

const DEFAULT_LAYOUT: TemplateLayoutConfig = {
  backgroundColor: "#FFFFFF",
  primaryColor: "#1a365d",
  borderColor: "#c4a35a",
  titleFontSize: 36,
  bodyFontSize: 14,
  showLogo: true,
  showBorder: true,
};

export const Route = createFileRoute("/templates/$id/edit")({
  head: () => ({ meta: [{ title: "Editar template — CertifyHub" }] }),
  component: TemplateEdit,
});

function TemplateEdit() {
  const navigate = useNavigate();
  // extract id from pathname to avoid route-generic typing issues with useParams
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const parts = pathname.split("/").filter(Boolean);
  const id = parts.length >= 2 && parts[parts.length - 1] === "edit" ? parts[parts.length - 2] : "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [layout, setLayout] = useState<TemplateLayoutConfig>(DEFAULT_LAYOUT);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getTemplate(id)
      .then((t) => {
        if (!active) return;
        setName(t.name);
        setDescription(t.description || "");
        setLayout({
          ...DEFAULT_LAYOUT,
          ...((t.layoutConfig as Partial<TemplateLayoutConfig>) || {}),
        });
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
      await api.updateTemplate(id, { name, description, layoutConfig: layout as any });
      navigate({ to: "/templates" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 grid place-items-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate({ to: "/templates" })}
          className="p-2 rounded border border-border"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <PageHeader title="Editar template" description="Ajuste nome e aparência do template." />
        <div />
      </div>

      {error && <div className="mb-4 text-destructive">Erro: {error}</div>}

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded border border-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Descrição</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded border border-input"
          />
        </div>

        <ColorPicker
          label="Cor primária"
          value={layout.primaryColor}
          onChange={(hex) => setLayout({ ...layout, primaryColor: hex })}
        />
        <ColorPicker
          label="Cor de fundo"
          value={layout.backgroundColor}
          onChange={(hex) => setLayout({ ...layout, backgroundColor: hex })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate({ to: "/templates" })}
            className="px-4 py-2 rounded border"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded bg-primary text-primary-foreground inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{" "}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
