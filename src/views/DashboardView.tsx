import { useDashboardViewModel } from "@/view-models/useDashboardViewModel";
import { PageHeader } from "@/components/PageHeader";
import {
  Award,
  FileText,
  Send,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const barConfig = {
  total: { label: "Certificados", color: "var(--color-chart-1)" },
};

export function DashboardView() {
  const { stats, monthlyData, courseData, loading } = useDashboardViewModel();

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

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div
          className="bg-card border border-border rounded-xl p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Certificados emitidos por mês</h3>
          </div>
          {monthlyData.length > 0 ? (
            <ChartContainer config={barConfig} className="aspect-auto h-72">
              <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-sm text-muted-foreground">
              {loading ? "Carregando..." : "Nenhum certificado emitido ainda."}
            </div>
          )}
        </div>

        <div
          className="bg-card border border-border rounded-xl p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Certificados por curso</h3>
          </div>
          {courseData.length > 0 ? (
            <ChartContainer
              config={Object.fromEntries(
                courseData.map((c, i) => [
                  c.course,
                  { label: c.course, color: CHART_COLORS[i % CHART_COLORS.length] },
                ]),
              )}
              className="aspect-auto h-72"
            >
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={courseData}
                  dataKey="total"
                  nameKey="course"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {courseData.map((entry, index) => (
                    <Cell key={entry.course} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-sm text-muted-foreground">
              {loading ? "Carregando..." : "Nenhum certificado emitido ainda."}
            </div>
          )}
        </div>
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
