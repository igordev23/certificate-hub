import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, isExpired } from "@/services/api";
import { envios } from "@/services/envios";
import { friendlyError } from "@/lib/error-friendly";

export function useDashboardViewModel() {
  const [stats, setStats] = useState({ certs: 0, ativos: 0, templates: 0, envios: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [certs, tpls] = await Promise.all([api.listCertificates(), api.listTemplates()]);
      setStats({
        certs: certs.length,
        ativos: certs.filter((c) => !isExpired(c.validityDate)).length,
        templates: tpls.length,
        envios: envios.list().length,
      });
    } catch (e) {
      setError((e as Error).message);
      toast.error(friendlyError(e), {
        duration: Infinity,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    stats,
    loading,
    error,
    load,
  };
}
