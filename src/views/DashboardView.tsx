import { useDashboardViewModel } from "@/view-models/useDashboardViewModel";
import { PageHeader } from "@/components/PageHeader";

export function DashboardView() {
  const { stats, loading } = useDashboardViewModel();

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do sistema." />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Certificados" value={stats.certs} loading={loading} />
        <StatCard title="Templates" value={stats.templates} loading={loading} />
        <StatCard title="Envios" value={stats.envios} loading={loading} />
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
