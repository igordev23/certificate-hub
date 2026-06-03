import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
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
      await load();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function copiar(c: Certificate) {
    navigator.clipboard.writeText(c.verificationCode);
    setCopied(c.id);
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
    copiar,
  };
}
