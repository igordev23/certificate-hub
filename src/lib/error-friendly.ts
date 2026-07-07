const ERROR_MAP: Record<string, string> = {
  "Failed to fetch": "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  NetworkError: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  "Network request failed":
    "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
  "Load failed": "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
};

export function friendlyError(error: unknown, context?: string): string {
  const message = error instanceof Error ? error.message : String(error ?? "Erro desconhecido");

  const matchedKey = Object.keys(ERROR_MAP).find((key) =>
    message.toLowerCase().includes(key.toLowerCase()),
  );
  const friendly = matchedKey ? ERROR_MAP[matchedKey] : message;

  if (/(5\d{2})/.test(message)) {
    return "O servidor está temporariamente indisponível. Tente novamente mais tarde.";
  }

  if (/(4\d{2})/.test(message)) {
    return "Ocorreu um erro inesperado. Tente novamente mais tarde.";
  }

  if (context) {
    return `${context}: ${friendly}`;
  }

  return friendly;
}
