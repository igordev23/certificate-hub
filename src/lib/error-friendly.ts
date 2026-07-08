const ERROR_MAP: Record<string, string> = {
  "Failed to fetch": "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  NetworkError: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  "Network request failed":
    "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  "Load failed": "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  "HTTP 500": "O servidor está temporariamente indisponível. Tente novamente mais tarde.",
};

export function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "Erro desconhecido");

  const matchedKey = Object.keys(ERROR_MAP).find((key) =>
    message.toLowerCase().includes(key.toLowerCase()),
  );
  if (matchedKey) return ERROR_MAP[matchedKey];

  if (/\b5\d{2}\b/.test(message)) {
    return "O servidor está temporariamente indisponível. Tente novamente mais tarde.";
  }

  return message;
}
