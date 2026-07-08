import { createFileRoute, useParams } from "@tanstack/react-router";
import { EditarCertificadoView } from "@/views/EditarCertificadoView";

export const Route = createFileRoute("/certificados/$id/editar")({
  head: () => ({ meta: [{ title: "Editar certificado — CertifyHub" }] }),
  component: CertificadoEdit,
});

function CertificadoEdit() {
  const { id } = useParams({ from: Route.id });
  return <EditarCertificadoView id={id} />;
}
