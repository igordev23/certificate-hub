import { Route as AppRouteImport } from "../routes/_app";
import { rootRoute } from "./rootRoutes";

export const appRoute = AppRouteImport.update({
  id: "/_app",
  getParentRoute: () => rootRoute,
} as any);
