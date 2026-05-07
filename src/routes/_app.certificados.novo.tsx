import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { db, Certificado, EnvioEmail, Template, gerarCodigo, statusFromValidade } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/certificados/novo")({
  component: NovoCertificado,
});

function NovoCertificado() {
  const nav = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState({
    nome_participante: "",
    cpf: "",
    email: "",
    template_id: 0,
    data_validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
  });

  useEffect(() => {
    const t = db.getTemplates();
    setTemplates(t);
    if (t[0]) setForm((f) => ({ ...f, template_id: t[0].id }));
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const tpl = templates.find((t) => t.id === Number(form.template_id));
    if (!tpl) return;
    const cert: Certificado = {
      id: Date.now(),
      template_id: tpl.id,
      template_nome: tpl.nome,
      nome_participante: form.nome_participante,
      cpf: form.cpf,
      email: form.email,
      codigo_unico: gerarCodigo(),
      data_emissao: new Date().toISOString().slice(0, 10),
      data_validade: form.data_validade,
      status: statusFromValidade(form.data_validade),
    };
    db.saveCertificados([cert, ...db.getCertificados()]);
    const envio: EnvioEmail = {
      id: Date.now() + 1,
      certificado_id: cert.id,
      destinatario_email: form.email,
      status: "enviado",
      data: new Date().toISOString(),
    };
    db.saveEnvios([envio, ...db.getEnvios()]);
    nav({ to: "/certificados" });
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Emitir certificado" description="Preencha os dados do participante." />
      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="text-sm font-medium">Template</label>
          <select required value={form.template_id} onChange={(e) => setForm({ ...form, template_id: Number(e.target.value) })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background">
            {templates.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome do participante</label>
            <input required value={form.nome_participante} onChange={(e) => setForm({ ...form, nome_participante: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">CPF</label>
            <input required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">E-mail do destinatário</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Data de validade</label>
            <input required type="date" value={form.data_validade} onChange={(e) => setForm({ ...form, data_validade: e.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background" />
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground flex gap-2 items-start">
          <Award className="w-4 h-4 mt-0.5 text-primary" />
          <div>Um código único será gerado automaticamente e o certificado será enviado por e-mail ao destinatário.</div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => nav({ to: "/certificados" })} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
          <button type="submit" className="px-5 py-2 rounded-md text-primary-foreground font-medium" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            Emitir e enviar
          </button>
        </div>
      </form>
    </div>
  );
}