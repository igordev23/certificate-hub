import { useEnviosViewModel } from "@/view-models/useEnviosViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Mail, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { EnvioEmail } from "@/models/envio";

export function EnviosView() {
  const { items } = useEnviosViewModel();

  const statusIcon = (s: EnvioEmail['status']) =>
    s === 'enviado' ? <CheckCircle2 className="w-4 h-4 text-success" /> :
    s === 'falhou' ? <XCircle className="w-4 h-4 text-destructive" /> :
    <Clock className="w-4 h-4 text-warning" />;

  return (
    <div>
      <PageHeader title="Envios" description="Histórico de envios locais." />

      <div className="mt-6">
        <div className="space-y-3">
          {items.map((e: EnvioEmail) => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">{e.recipientEmail}</div>
                <div className="text-sm text-muted-foreground">{e.recipientName} • {new Date(e.data).toLocaleString('pt-BR')}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {statusIcon(e.status)}
                <span className="capitalize">{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
