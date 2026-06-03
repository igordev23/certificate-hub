import { useEffect, useState } from "react";
import { envios } from "@/services/envios";
import type { EnvioEmail } from "@/models/envio";

export function useEnviosViewModel() {
  const [items, setItems] = useState<EnvioEmail[]>([]);

  useEffect(() => {
    setItems(envios.list());
  }, []);
  return {
    items,
  };
}
