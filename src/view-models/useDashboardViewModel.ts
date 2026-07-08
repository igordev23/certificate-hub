import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { isExpired } from "@/models/certificate";
import { envios } from "@/services/envios";
import { friendlyError } from "@/lib/error-friendly";
import type { Certificate } from "@/models/certificate";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function useDashboardViewModel() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [enviosCount, setEnviosCount] = useState(0);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [certsData, tpls] = await Promise.all([api.listCertificates(), api.listTemplates()]);
      setCerts(certsData);
      setTemplatesCount(tpls.length);
      setEnviosCount(envios.list().length);
    } catch (e) {
      setError((e as Error).message);
      toast.error(friendlyError(e), { duration: Infinity });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(
    () => ({
      certs: certs.length,
      ativos: certs.filter((c) => !isExpired(c.validityDate)).length,
      templates: templatesCount,
      envios: enviosCount,
    }),
    [certs, templatesCount, enviosCount],
  );

  const monthlyData = useMemo(() => {
    const buckets: Record<string, number> = {};
    certs.forEach((c) => {
      const date = new Date(c.issuedAt || c.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => {
        const [, month, year] = /(\d{4})-(\d{2})/.exec(key) || [];
        return {
          month: `${MONTHS[parseInt(month) - 1] || month}/${year}`,
          total,
        };
      });
  }, [certs]);

  const courseData = useMemo(() => {
    const buckets: Record<string, number> = {};
    certs.forEach((c) => {
      const name = c.courseName || "Sem curso";
      buckets[name] = (buckets[name] || 0) + 1;
    });

    return Object.entries(buckets)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([course, total]) => ({ course, total }));
  }, [certs]);

  return {
    stats,
    monthlyData,
    courseData,
    loading,
    error,
    load,
  };
}
