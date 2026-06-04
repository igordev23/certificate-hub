import { createFileRoute } from "@tanstack/react-router";
import { EnviosView } from "@/views/EnviosView";

export const Route = createFileRoute("/_app/envios")({
  component: EnviosView,
});
