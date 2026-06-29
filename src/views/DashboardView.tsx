import { useDashboardViewModel } from "@/view-models/useDashboardViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Award, FileText, Send, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DashboardView() {
  const { stats, loading } = useDashboardViewModel();

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do sistema." />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Certificados emitidos"
          value={stats.certs}
          loading={loading}
          icon={Award}
          gradient="from-primary/20 to-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Certificados ativos"
          value={stats.ativos}
          loading={loading}
          icon={ShieldCheck}
          gradient="from-emerald-500/20 to-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Templates"
          value={stats.templates}
          loading={loading}
          icon={FileText}
          gradient="from-amber-500/20 to-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Envios"
          value={stats.envios}
          loading={loading}
          icon={Send}
          gradient="from-sky-500/20 to-sky-500/10"
          iconColor="text-sky-600 dark:text-sky-400"
        />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Link
          to="/templates"
          className="group bg-card border border-border rounded-xl p-6 transition-all duration-200 hover:shadow-elevated hover:border-primary/30"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold">Gerenciar templates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre modelos de certificado reutilizáveis.
          </p>
          <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Acessar <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
        <Link
          to="/certificados"
          className="group bg-card border border-border rounded-xl p-6 transition-all duration-200 hover:shadow-elevated hover:border-primary/30"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold">Ver certificados</h3>
          <p className="text-sm text-muted-foreground mt-1">Liste, edite validade e baixe PDFs.</p>
          <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Acessar <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
  icon: Icon,
  gradient,
  iconColor,
}: {
  title: string;
  value: number;
  loading?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-elevated"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight">
        {loading ? <span className="text-muted-foreground/40">—</span> : value}
      </div>
    </div>
  );
}
