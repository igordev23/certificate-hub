import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { useRef } from "react";

interface CertificateQRCodeProps {
  verificationCode: string;
  recipientCPF: string;
  size?: number;
}

function buildVerificationUrl(cpf: string, code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/verificar?cpf=${cpf}&codigo=${code}`;
}

export function CertificateQRCode({
  verificationCode,
  recipientCPF,
  size = 140,
}: CertificateQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const url = buildVerificationUrl(recipientCPF, verificationCode);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qrcode-${verificationCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas
        ref={canvasRef}
        value={url}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#000000"
        includeMargin
      />
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Baixar QR Code"
      >
        <Download className="w-3.5 h-3.5" />
        QR Code
      </button>
    </div>
  );
}
