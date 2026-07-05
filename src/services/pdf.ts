import { jsPDF } from "jspdf";
import * as QRCode from "qrcode";

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function buildVerificationUrl(cpf: string, code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/verificar?cpf=${cpf}&codigo=${code}`;
}

export async function generateCertificatePdf(certificate: {
  id: string;
  recipientName: string;
  recipientCPF: string;
  courseName: string;
  courseHours: number;
  verificationCode: string;
  validityDate: string;
  issuedAt: string;
}) {
  const pdf = new jsPDF("landscape", "mm", "A4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const marginX = 8;
  const contentW = pageW - marginX * 2;

  // border
  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(2);
  pdf.rect(marginX - 2, 8, contentW + 4, pageH - 16);

  // inner border
  pdf.setDrawColor(200, 180, 120);
  pdf.setLineWidth(0.5);
  pdf.rect(marginX, 11, contentW, pageH - 22);

  // QR Code
  const qrUrl = buildVerificationUrl(certificate.recipientCPF, certificate.verificationCode);
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 120,
    margin: 2,
    color: { dark: "#1a365d", light: "#ffffff" },
  });

  const qrSize = 45;
  const qrX = pageW - marginX - qrSize - 8;
  const qrY = 24;
  pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // label below QR
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 120, 120);
  pdf.text("Verifique o certificado", qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });

  function responsiveSize(text: string, maxWidth: number, baseSize: number, minSize: number): number {
    const estWidth = text.length * baseSize * 0.38;
    if (estWidth <= maxWidth) return baseSize;
    return Math.max(minSize, Math.floor(maxWidth / (text.length * 0.38)));
  }

  const contentWidth = pageW - marginX * 2 - 16;

  // title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(32);
  pdf.setTextColor(26, 54, 93);
  pdf.text("CERTIFICADO", pageW / 2, 48, { align: "center" });

  // decorative line
  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(0.8);
  pdf.line(pageW / 2 - 50, 55, pageW / 2 + 50, 55);

  // subtitle
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text("CertifyHub", pageW / 2, 68, { align: "center" });

  // body text
  const nameSize = responsiveSize(certificate.recipientName, contentWidth, 24, 14);
  const courseSize = responsiveSize(certificate.courseName, contentWidth, 20, 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(60, 60, 60);

  const bodyY = 82;
  const lineH = 10;

  pdf.text("Certificamos que", pageW / 2, bodyY, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(nameSize);
  pdf.setTextColor(26, 54, 93);
  pdf.text(certificate.recipientName, pageW / 2, bodyY + lineH + 4, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(60, 60, 60);
  pdf.text("concluiu o curso", pageW / 2, bodyY + lineH * 2 + 8, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(courseSize);
  pdf.setTextColor(26, 54, 93);
  pdf.text(certificate.courseName, pageW / 2, bodyY + lineH * 3 + 14, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(60, 60, 60);
  pdf.text(
    `com carga horária de ${certificate.courseHours} horas.`,
    pageW / 2,
    bodyY + lineH * 4 + 18,
    {
      align: "center",
    },
  );

  // details
  const detailsY = bodyY + lineH * 6 + 12;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);

  const detailLines = [
    `CPF: ${formatCPF(certificate.recipientCPF)}`,
    `Código de verificação: ${certificate.verificationCode}`,
    `Emitido em: ${new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}`,
    `Válido até: ${new Date(certificate.validityDate).toLocaleDateString("pt-BR")}`,
  ];

  detailLines.forEach((line, i) => {
    pdf.text(line, pageW / 2, detailsY + i * 8, { align: "center" });
  });

  // footer
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Documento emitido eletronicamente pela CertifyHub.", pageW / 2, pageH - 22, {
    align: "center",
  });

  return pdf;
}
