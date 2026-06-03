import type { EnvioEmail } from "@/models/envio";

const LS_EMAILS = "certifyhub:envios";

export const envios = {
  list(): EnvioEmail[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(LS_EMAILS) || "[]");
    } catch {
      return [];
    }
  },
  add(e: EnvioEmail) {
    const list = [e, ...envios.list()];
    localStorage.setItem(LS_EMAILS, JSON.stringify(list));
  },
};
