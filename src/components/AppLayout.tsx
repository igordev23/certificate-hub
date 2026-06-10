import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Award, FileText, ShieldCheck, LayoutDashboard, Send, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/certificados", label: "Certificados", icon: Award },
  { to: "/envios", label: "Envios", icon: Send },
] as const;

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const loc = useLocation();
  return (
    <>
      {/* Gold top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

      {/* Logo / Brand */}
      <Link
        to="/"
        onClick={onNavClick}
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
              onClick={onNavClick}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-sidebar-accent text-gold"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground/90"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gold shadow-sm shadow-gold/50" />
              )}

              <n.icon
                className={`w-4.5 h-4.5 transition-all duration-200 ${
                  active ? "text-gold" : "group-hover:text-gold/70"
                }`}
              />
              {n.label}

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
          onClick={onNavClick}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-sidebar-foreground/40 hover:text-gold/80 hover:bg-sidebar-accent/60 transition-all duration-200 group"
        >
          <ShieldCheck className="w-3.5 h-3.5 group-hover:text-gold/70 transition-colors" />
          <span>Verificação pública</span>
        </Link>
      </div>
    </>
  );
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [loc.pathname]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-sidebar z-30 flex items-center px-4 gap-3 md:hidden border-b border-sidebar-border/50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-gold hover:bg-sidebar-accent/60 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-400 grid place-items-center shadow-lg shadow-gold/20">
          <ShieldCheck className="w-4.5 h-4.5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold tracking-tight text-sidebar-foreground/90">CertifyHub</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-sidebar text-sidebar-foreground flex-col relative">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col relative z-50 md:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-2">
          <SidebarContent onNavClick={() => setSidebarOpen(false)} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
