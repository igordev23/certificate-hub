import { createFileRoute } from "@tanstack/react-router";
import { VerificarView } from "@/views/VerificarView";

export const Route = createFileRoute("/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar certificado — CertifyHub" },
      {
        name: "description",
        content:
          "Verifique a autenticidade de um certificado emitido pela CertifyHub usando CPF e código.",
      },
    ],
  }),
  component: VerificarView,
});
