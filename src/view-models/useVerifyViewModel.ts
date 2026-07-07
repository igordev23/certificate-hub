import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { friendlyError } from "@/lib/error-friendly";
import type { VerifyResult } from "@/models/verify";

export function useVerifyViewModel() {
  const [cpf, setCpf] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await api.verify(cpf.replace(/\D/g, ""), codigo.trim().toUpperCase());
      setResultado(res);
    } catch (err) {
      const e = err as any;
      if (e?.details) {
        setError(e.details.map((d: any) => d.message).join(". "));
        toast.error("Verifique os dados informados e tente novamente.", { duration: Infinity });
      } else {
        const msg = e?.message || "Erro desconhecido";
        setError(msg);
        toast.error(friendlyError(err), { duration: Infinity });
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    cpf,
    codigo,
    loading,
    resultado,
    error,
    setCpf,
    setCodigo,
    buscar,
  };
}
