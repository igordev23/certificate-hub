import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Award, FileText, ShieldCheck, LayoutDashboard, Send } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/certificados", label: "Certificados", icon: Award },
  { to: "/envios", label: "Envios", icon: Send },
] as const;

export function AppLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <Link to="/" className="px-6 py-6 border-b border-sidebar-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary grid place-items-center">
            <ShieldCheck className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">CertifyHub</div>
            <div className="text-[11px] text-sidebar-foreground/60">Painel administrativo</div>
          </div>
        </Link>
        <nav className="p-3 flex-1 space-y-1">
          {nav.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          <Link to="/verificar" className="hover:text-sidebar-accent-foreground">
            → Página pública de verificação
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}