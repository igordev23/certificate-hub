import { createFileRoute } from "@tanstack/react-router";
import { CertificadosListView } from "@/views/CertificadosListView";

export const Route = createFileRoute("/_app/certificados/")({
  component: CertificadosListView,
});
