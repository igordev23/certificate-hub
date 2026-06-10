import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Award, FileText, ShieldCheck, LayoutDashboard, Send, ChevronRight } from "lucide-react";

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
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col relative">
        {/* Gold top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

        {/* Logo / Brand */}
        <Link
          to="/"
          className="px-6 pt-8 pb-6 border-b border-sidebar-border/50 flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-400 grid place-items-center shadow-lg shadow-gold/20 group-hover:shadow-gold/30 transition-shadow duration-300">
            <ShieldCheck className="w-5.5 h-5.5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base">CertifyHub</div>
            <div className="text-[10px] text-sidebar-foreground/40 font-medium tracking-wide uppercase">
              Painel administrativo
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="p-3 flex-1 space-y-0.5 mt-3">
          {nav.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-sidebar-accent text-gold"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground/90"
                }`}
              >
                {/* Active gold left indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gold shadow-sm shadow-gold/50" />
                )}

                <n.icon
                  className={`w-4.5 h-4.5 transition-all duration-200 ${
                    active ? "text-gold" : "group-hover:text-gold/70"
                  }`}
                />
                {n.label}

                {/* Active chevron hint */}
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-gold/40" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-sidebar-border/50 mt-auto">
          <Link
            to="/verificar"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-sidebar-foreground/40 hover:text-gold/80 hover:bg-sidebar-accent/60 transition-all duration-200 group"
          >
            <ShieldCheck className="w-3.5 h-3.5 group-hover:text-gold/70 transition-colors" />
            <span>Verificação pública</span>
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
