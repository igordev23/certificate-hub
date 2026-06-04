import { createFileRoute } from "@tanstack/react-router";
import { NovoCertificadoView } from "@/views/NovoCertificadoView";

export const Route = createFileRoute("/_app/certificados/novo")({
  component: NovoCertificadoView,
});
