import { useDashboardViewModel } from "@/view-models/useDashboardViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Award, FileText, Send, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DashboardView() {
  const { stats, loading } = useDashboardViewModel();

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do sistema." />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Certificados emitidos" value={stats.certs} loading={loading} icon={<Award className="w-5 h-5 text-primary" />} />
        <StatCard title="Certificados ativos" value={stats.ativos} loading={loading} icon={<ShieldCheck className="w-5 h-5 text-success" />} />
        <StatCard title="Templates" value={stats.templates} loading={loading} icon={<FileText className="w-5 h-5 text-primary" />} />
        <StatCard title="Envios" value={stats.envios} loading={loading} icon={<Send className="w-5 h-5 text-warning" />} />
      </div>

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

function StatCard({ title, value, loading }: { title: string; value: number; loading?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold mt-2">{loading ? '—' : value}</div>
    </div>
  );
}
