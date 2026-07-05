import {
  ScrollText,
  Copy,
  CalendarCheck,
  Loader2,
  Download,
  Pencil,
  BadgeCheck,
  AlertTriangle,
  GraduationCap,
  Check,
  QrCode,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCertificatesViewModel } from "@/view-models/useCertificatesViewModel";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@tanstack/react-router";
import { api } from "@/services/api";
import type { Certificate } from "@/models/certificate";
import { isExpired } from "@/models/certificate";
import { CertificateQRCode } from "@/components/CertificateQRCode";
import { generateCertificatePdf } from "@/services/pdf";

function StatusBadge({ certificate }: { certificate: Certificate }) {
  const expired = isExpired(certificate.validityDate);
  return expired ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <AlertTriangle className="w-3 h-3" />
      Vencido
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
      <BadgeCheck className="w-3 h-3" />
      Ativo
    </span>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0 border border-primary/10">
      {initials}
    </div>
  );
}

export function CertificadosListView() {
  const {
    filteredItems,
    loading,
    error,
    load,
    q,
    setQ,
    editId,
    setEditId,
    novaValidade,
    setNovaValidade,
    copiar,
    salvarValidade,
    copied,
  } = useCertificatesViewModel();

  const [qrCodeId, setQrCodeId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Certificados"
        description="Lista de certificados emitidos."
        action={
          <Link
            to="/certificados/novo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary-foreground font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            <ScrollText className="w-4 h-4" />
            Emitir
          </Link>
        }
      />

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
        </div>
        <input
          value={q}
          placeholder="Buscar por nome, CPF ou código de verificação..."
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="p-12 grid place-items-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="mt-3 text-sm">Carregando certificados...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-card border border-border rounded-xl">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <div className="text-destructive font-semibold mb-2">Erro ao carregar certificados</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <button
              onClick={load}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <ScrollText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <div className="text-muted-foreground font-medium">Nenhum certificado encontrado</div>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {q ? "Tente alterar os termos da busca." : "Emita seu primeiro certificado."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((c: Certificate) => (
              <div
                key={c.id}
                className="group bg-card border border-border rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-elevated hover:border-primary/20"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="sm:flex sm:items-center sm:gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <InitialsAvatar name={c.recipientName} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[15px] truncate max-w-[180px] sm:max-w-none">
                          {c.recipientName}
                        </span>
                        <StatusBadge certificate={c} />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate min-w-0">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{c.courseName}</span>
                        </span>
                        <span className="text-border shrink-0">|</span>
                        <span className="shrink-0">{c.courseHours}h</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground/50 mt-0.5 font-mono truncate">
                        {c.verificationCode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-2 sm:mt-0 border-t sm:border-t-0 border-border/50 pt-2 sm:pt-0">
                    <button
                      title="Copiar código"
                      onClick={() => copiar(c)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
                    >
                      {copied === c.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      title="QR Code"
                      onClick={() => setQrCodeId(qrCodeId === c.id ? null : c.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        qrCodeId === c.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {qrCodeId === c.id ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <QrCode className="w-4 h-4" />
                      )}
                    </button>

                    {editId === c.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          defaultValue={c.validityDate.slice(0, 10)}
                          onChange={(e) => setNovaValidade(e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-input text-xs bg-background w-32"
                        />
                        <button
                          onClick={() => salvarValidade(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        title="Editar validade"
                        onClick={() => {
                          setEditId(c.id);
                          setNovaValidade(c.validityDate.slice(0, 10));
                        }}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        const pdf = await generateCertificatePdf(c);
                        pdf.save(`certificado-${c.verificationCode}.pdf`);
                      }}
                      title="Baixar PDF"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/certificados/${c.id}/editar` as any}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title="Editar certificado"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {qrCodeId === c.id && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-center">
                    <CertificateQRCode
                      verificationCode={c.verificationCode}
                      recipientCPF={c.recipientCPF}
                      size={130}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
