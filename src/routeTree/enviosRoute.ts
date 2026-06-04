import { Route as AppEnviosRouteImport } from "../routes/_app.envios";
import { appRoute } from "./appRoute";

export const AppEnviosRoute = AppEnviosRouteImport.update({
  id: "/envios",
  path: "/envios",
  getParentRoute: () => appRoute,
} as any);
