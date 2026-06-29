import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Award, FileText, Send, ArrowRight, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CertifyHub — Emissão e verificação de certificados" },
      {
        name: "description",
        content:
          "Plataforma para emitir, gerenciar e verificar certificados digitais com autenticidade garantida.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl grid place-items-center shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-lg">CertifyHub</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/verificar"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Verificar certificado
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-primary-foreground font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
            >
              Acessar painel <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-accent/15 text-accent-foreground border border-accent/30">
            <BadgeCheck className="w-3.5 h-3.5" /> MVP em produção
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Certificados digitais com{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-navy-gold)" }}
            >
              autenticidade verificável
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Emita, gerencie e envie certificados em segundos. Cada documento recebe um código único
            e pode ser verificado publicamente por CPF.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
            >
              Começar agora
            </Link>
            <Link
              to="/verificar"
              className="px-6 py-3 rounded-lg font-medium border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all duration-200"
            >
              Verificar um certificado
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-20">
          {[
            { icon: FileText, title: "Templates", desc: "Modelos reutilizáveis." },
            { icon: Award, title: "Emissão", desc: "Código único automático." },
            { icon: Send, title: "Envio por e-mail", desc: "Entrega instantânea." },
            { icon: ShieldCheck, title: "Verificação", desc: "Pública e segura." },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-elevated hover:border-gold/30 group"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/10 to-amber-400/10 flex items-center justify-center mb-3 group-hover:from-gold/20 group-hover:to-amber-400/20 transition-all duration-200">
                <f.icon className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors duration-200" />
              </div>
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
