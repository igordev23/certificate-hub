import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { db, EnvioEmail, Certificado } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/envios")({
  component: EnviosPage,
});

function EnviosPage() {
  const [items, setItems] = useState<EnvioEmail[]>([]);
  const [certs, setCerts] = useState<Certificado[]>([]);
  useEffect(() => {
    setItems(db.getEnvios());
    setCerts(db.getCertificados());
  }, []);

  const icon = (s: string) =>
    s === "enviado" ? <CheckCircle2 className="w-4 h-4 text-success" /> :
    s === "falhou" ? <XCircle className="w-4 h-4 text-destructive" /> :
    <Clock className="w-4 h-4 text-warning" />;

  return (
    <div>
      <PageHeader title="Envios por e-mail" description="Histórico de entregas de certificados." />
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        {items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Send className="w-8 h-8 mx-auto mb-3 opacity-50" />
            Nenhum envio registrado ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Destinatário</th>
                <th className="px-4 py-3 font-medium">Certificado</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => {
                const c = certs.find((c) => c.id === e.certificado_id);
                return (
                  <tr key={e.id} className="border-t border-border">
                    <td className="px-4 py-3">{e.destinatario_email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c?.nome_participante || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(e.data).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        {icon(e.status)} {e.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}