import { useState } from "react";
import { api } from "@/services/api";
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
      setError((err as Error).message);
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
