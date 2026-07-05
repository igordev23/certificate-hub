import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  Settings,
  ChevronLeft,
  Save,
  Eye,
  Palette,
} from "lucide-react";
import { useTemplatesViewModel } from "@/view-models/useTemplatesViewModel";
import { ColorPicker } from "@/components/ColorPicker";
import { PageHeader } from "@/components/PageHeader";
import { TemplatesView } from "@/views/TemplatesView";

export const Route = createFileRoute("/_app/templates")({
  component: TemplatesPage,
});

const PRIMARY_COLOR_PRESETS = [
  { name: "Navy Blue", value: "#1a365d" },
  { name: "Teal", value: "#0f766e" },
  { name: "Royal", value: "#1e3a8a" },
  { name: "Forest", value: "#15803d" },
  { name: "Terracotta", value: "#7c2d12" },
  { name: "Charcoal", value: "#1f2937" },
];

const BACKGROUND_COLOR_PRESETS = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Warm Cream", value: "#FFFDF5" },
  { name: "Ice Blue", value: "#F0F9FF" },
  { name: "Silver Gray", value: "#F8FAFC" },
  { name: "Eggshell", value: "#FAF9F6" },
];

const BORDER_COLOR_PRESETS = [
  { name: "Bronze Gold", value: "#c4a35a" },
  { name: "Cobalt", value: "#1d4ed8" },
  { name: "Slate Gray", value: "#64748b" },
  { name: "Sage Green", value: "#86efac" },
  { name: "Dark Navy", value: "#1a365d" },
];

function TemplatesPage() {
  const {
    items,
    loading,
    error,
    open,
    setOpen,
    name,
    description,
    saving,
    editingTemplate,
    editName,
    editDescription,
    layout,
    load,
    add,
    remove,
    startEditing,
    saveChanges,
    cancelEditing,
    setName,
    setDescription,
    setEditName,
    setEditDescription,
    setLayout,
  } = useTemplatesViewModel();

  if (editingTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={cancelEditing}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Customizar Template</h2>
              <p className="text-xs text-muted-foreground">
                Ajuste cores, fontes e estilo do certificado em tempo real.
              </p>
            </div>
          </div>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-4 py-2 rounded-md text-primary-foreground font-medium inline-flex items-center gap-2"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Customizer Panel */}
          <div
            className="lg:col-span-5 bg-card border border-border rounded-xl p-5 space-y-6 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b border-border pb-1.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Informações básicas
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Nome do template
                  </label>
                  <input
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 text-sm rounded-md border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Descrição</label>
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 text-sm rounded-md border border-input bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b border-border pb-1.5 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" /> Cores e Estilos
              </h3>

              {/* Primary Color */}
              <ColorPicker
                label="Cor Primária"
                value={layout.primaryColor}
                onChange={(hex) => setLayout({ ...layout, primaryColor: hex })}
                presets={PRIMARY_COLOR_PRESETS}
              />

              {/* Background Color */}
              <ColorPicker
                label="Cor de Fundo"
                value={layout.backgroundColor}
                onChange={(hex) => setLayout({ ...layout, backgroundColor: hex })}
                presets={BACKGROUND_COLOR_PRESETS}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b border-border pb-1.5 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Borda e Margens
              </h3>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Exibir Borda</label>
                <input
                  type="checkbox"
                  checked={layout.showBorder}
                  onChange={(e) => setLayout({ ...layout, showBorder: e.target.checked })}
                  className="w-4 h-4 rounded border-input bg-background"
                />
              </div>

              {layout.showBorder && (
                <div className="pt-2 border-t border-border/50">
                  <ColorPicker
                    label="Cor da Borda"
                    value={layout.borderColor}
                    onChange={(hex) => setLayout({ ...layout, borderColor: hex })}
                    presets={BORDER_COLOR_PRESETS}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b border-border pb-1.5 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Fontes (Tamanho)
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Tamanho do Título</span>
                  <span>{layout.titleFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={layout.titleFontSize}
                  onChange={(e) => setLayout({ ...layout, titleFontSize: Number(e.target.value) })}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Tamanho do Corpo</span>
                  <span>{layout.bodyFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={layout.bodyFontSize}
                  onChange={(e) => setLayout({ ...layout, bodyFontSize: Number(e.target.value) })}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-1">
              <Eye className="w-3.5 h-3.5" />
              Visualização Real-time (Proporções A4)
            </div>

            <div
              className="relative w-full aspect-[1.414] bg-white border border-border shadow-xl rounded-xl overflow-hidden flex flex-col justify-between p-8 font-sans transition-all duration-300"
              style={{ backgroundColor: layout.backgroundColor }}
            >
              {/* Decorative Outer Border */}
              {layout.showBorder && (
                <div
                  className="absolute inset-4 border-[3px] pointer-events-none rounded-lg"
                  style={{ borderColor: layout.borderColor }}
                />
              )}

              {/* Decorative Inner Border */}
              {layout.showBorder && (
                <div
                  className="absolute inset-6 border pointer-events-none rounded-sm"
                  style={{ borderColor: layout.borderColor }}
                />
              )}

              {/* Decorative Top Line */}
              <div className="z-10 w-full px-8 mt-6">
                <div
                  className="h-0.5 w-full rounded"
                  style={{ backgroundColor: layout.primaryColor }}
                />
              </div>

              {/* Header Titles */}
              <div className="z-10 text-center flex flex-col items-center">
                <h1
                  className="font-bold tracking-widest leading-none font-serif"
                  style={{
                    color: layout.primaryColor,
                    fontSize: `${(layout.titleFontSize * 0.7).toFixed(1)}px`,
                  }}
                >
                  CERTIFICADO
                </h1>
                <p className="text-[12px] text-muted-foreground font-serif italic mt-1">
                  de Conclusão
                </p>
                <div className="h-[1px] w-24 bg-[#c4a35a]/60 mt-2" />
              </div>

              {/* Body Text Content */}
              <div className="z-10 text-center px-12 space-y-3 flex-1 flex flex-col justify-center">
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: `${(layout.bodyFontSize * 0.85).toFixed(1)}px` }}
                >
                  Certificamos que
                </p>
                <h2
                  className="font-bold font-sans"
                  style={{
                    color: layout.primaryColor,
                    fontSize: `${((layout.bodyFontSize + 10) * 0.85).toFixed(1)}px`,
                  }}
                >
                  João da Silva Sauro
                </h2>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: `${(layout.bodyFontSize * 0.85).toFixed(1)}px` }}
                >
                  concluiu com êxito o curso de
                </p>
                <h3
                  className="font-bold font-sans"
                  style={{
                    color: layout.primaryColor,
                    fontSize: `${((layout.bodyFontSize + 4) * 0.85).toFixed(1)}px`,
                  }}
                >
                  Inteligência Artificial & Machine Learning
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: `${(layout.bodyFontSize * 0.85).toFixed(1)}px` }}
                >
                  com carga horária total de 40 horas.
                </p>
              </div>

              {/* Dates line */}
              <div className="z-10 text-center text-[8px] text-muted-foreground/70 space-y-0.5">
                <p>Data de emissão: {new Date().toLocaleDateString("pt-BR")}</p>
                <p>Válido até: {new Date(Date.now() + 3.1536e10).toLocaleDateString("pt-BR")}</p>
              </div>

              {/* Signature */}
              <div className="z-10 px-8 flex justify-end pt-3 mb-2">
                <div className="text-center">
                  <div className="h-[1px] w-32 bg-muted-foreground/40 mx-auto" />
                  <p className="text-[8px] text-muted-foreground mt-1 font-semibold">
                    Diretor de Capacitação
                  </p>
                  <p className="text-[7px] text-muted-foreground/60">CertifyHub Org</p>
                </div>
              </div>

              {/* QR Code + Verification instructions */}
              <div className="z-10 px-8 flex items-start gap-3 pb-2">
                <div className="w-[52px] h-[52px] shrink-0 bg-white border border-primary/20 rounded grid grid-cols-5 grid-rows-5 gap-px p-0.5 shadow-sm">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const patterns = [0,2,3,7,8,11,12,14,16,17,20,22,24];
                    return <div key={i} className={`rounded-[0.5px] ${patterns.includes(i) ? "bg-primary/80" : "bg-white"}`} />;
                  })}
                </div>
                <div className="text-[7px] leading-snug text-muted-foreground/70 min-w-0">
                  <p className="font-semibold text-[7.5px] text-muted-foreground/80">INSTRUÇÕES PARA VERIFICAÇÃO DE AUTENTICIDADE:</p>
                  <p className="mt-0.5">
                    Este certificado foi emitido pelo CertificateHub. Verifique a sua autenticidade acessando o QR Code ao lado e informando o CPF 123.456.789-00, a data de conclusão ({new Date().toLocaleDateString("pt-BR")}) e o código de verificação (XYZ12345).
                  </p>
                  <p className="mt-0.5 text-[6.5px] text-muted-foreground/40 truncate">https://certificates.example.com/verify?cpf=12345678900&codigo=XYZ12345</p>
                </div>
              </div>

              {/* Decorative Bottom Line */}
              <div className="z-10 w-full px-8 mb-4">
                <div
                  className="h-0.5 w-full rounded"
                  style={{ backgroundColor: layout.primaryColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Modelos de certificado da sua organização."
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-foreground font-medium cursor-pointer"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
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
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Ex.: Workshop de IA"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Opcional"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md border border-border cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Carregando...
        </div>
      ) : error ? (
        <ApiError message={error} onRetry={load} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-card border border-border rounded-xl p-5 group flex flex-col justify-between"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(t)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Customizar layout"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(t.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold mt-4">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {t.description || "Sem descrição"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                <span>Criado em {new Date(t.createdAt).toLocaleDateString("pt-BR")}</span>
                {t.layoutConfig && Object.keys(t.layoutConfig).length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Personalizado
                  </span>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum template cadastrado.
            </div>
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
      <p className="text-xs text-muted-foreground mt-2">
        Verifique se o servidor está rodando em <code>http://localhost:3000</code>.
      </p>
      <button
        onClick={onRetry}
        className="mt-3 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm cursor-pointer"
      >
        Tentar novamente
      </button>
    </div>
  );
}
