import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { friendlyError } from "@/lib/error-friendly";
import type { Certificate } from "@/models/certificate";

export function useCertificatesViewModel() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [novaValidade, setNovaValidade] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.listCertificates());
    } catch (e) {
      setError((e as Error).message);
      toast.error(friendlyError(e, "Não foi possível carregar a lista de certificados"), {
        duration: Infinity,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (c) =>
          c.recipientName.toLowerCase().includes(q.toLowerCase()) ||
          c.recipientCPF.includes(q) ||
          c.verificationCode.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q],
  );

  async function salvarValidade(id: string) {
    try {
      await api.updateValidity(id, new Date(novaValidade).toISOString());
      setEditId(null);
      toast.success("Validade atualizada com sucesso!");
      await load();
    } catch (err) {
      toast.error(friendlyError(err, "Não foi possível atualizar a validade"), {
        duration: Infinity,
      });
    }
  }

  async function deletar(id: string) {
    if (!confirm("Tem certeza que deseja excluir este certificado?")) return;
    try {
      await api.deleteCertificate(id);
      toast.success("Certificado excluído com sucesso!");
      await load();
    } catch (err) {
      toast.error(friendlyError(err, "Não foi possível excluir o certificado"), {
        duration: Infinity,
      });
    }
  }

  function copiar(c: Certificate) {
    navigator.clipboard.writeText(c.verificationCode);
    setCopied(c.id);
    toast.success("Código de verificação copiado!");
    setTimeout(() => setCopied(null), 1500);
  }

  return {
    items,
    filteredItems,
    loading,
    error,
    q,
    setQ,
    editId,
    setEditId,
    novaValidade,
    setNovaValidade,
    copied,
    load,
    salvarValidade,
    deletar,
    copiar,
  };
}
