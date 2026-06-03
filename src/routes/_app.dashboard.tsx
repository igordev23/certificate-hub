import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, FileText, Send, ShieldCheck, Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useDashboardViewModel } from "@/view-models/useDashboardViewModel";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { stats, loading, error, load } = useDashboardViewModel();

  const cards = [
    { label: "Certificados emitidos", value: stats.certs, icon: Award, color: "text-primary" },
    { label: "Certificados ativos", value: stats.ativos, icon: ShieldCheck, color: "text-success" },
    { label: "Templates", value: stats.templates, icon: FileText, color: "text-primary" },
    { label: "E-mails registrados", value: stats.envios, icon: Send, color: "text-warning" },
  ];

  return (
    <div>
      <PageHeader
        title="Visão geral"
        description="Resumo da atividade da sua organização."
        action={
          <Link to="/certificados/novo" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-foreground font-medium" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Plus className="w-4 h-4" /> Emitir certificado
          </Link>
        }
      />
      {error && <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-4 mb-4 text-sm text-destructive">Erro ao carregar dados: {error}</div>}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /> Carregando...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
              <div className="text-3xl font-bold mt-3">{c.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Link to="/templates" className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
          <FileText className="w-6 h-6 text-primary" />
          <h3 className="font-semibold mt-3">Gerenciar templates</h3>
          <p className="text-sm text-muted-foreground mt-1">Cadastre modelos de certificado reutilizáveis.</p>
        </Link>
        <Link to="/certificados" className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="font-semibold mt-3">Ver certificados</h3>
          <p className="text-sm text-muted-foreground mt-1">Liste, edite validade e baixe PDFs.</p>
        </Link>
      </div>
    </div>
  );
}
