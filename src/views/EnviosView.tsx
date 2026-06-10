import { useEnviosViewModel } from "@/view-models/useEnviosViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Mail, CheckCircle2, XCircle, Clock, SendHorizonal } from "lucide-react";
import type { EnvioEmail } from "@/models/envio";

const statusConfig = {
  enviado: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", label: "Enviado" },
  falhou: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", label: "Falhou" },
  pendente: { icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", label: "Pendente" },
};

export function EnviosView() {
  const { items } = useEnviosViewModel();

  return (
    <div>
      <PageHeader title="Envios" description="Histórico de envios locais." />

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <SendHorizonal className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <div className="text-muted-foreground font-medium">Nenhum envio registrado</div>
            <p className="text-sm text-muted-foreground/60 mt-1">Os envios aparecerão aqui após emitir certificados com e-mail.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((e: EnvioEmail) => {
              const cfg = statusConfig[e.status] || statusConfig.pendente;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={e.id}
                  className="group bg-card border border-border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-elevated"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{e.recipientEmail}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {e.recipientName} • {new Date(e.data).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
