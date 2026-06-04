import { Route as AppTemplatesRouteImport } from "../routes/_app.templates";
import { Route as TemplatesIdEditRouteImport } from "../routes/templates.$id.edit";
import { appRoute } from "./appRoute";
import { rootRoute } from "./rootRoutes";

export const AppTemplatesRoute = AppTemplatesRouteImport.update({
  id: "/templates",
  path: "/templates",
  getParentRoute: () => appRoute,
} as any);

export const TemplatesIdEditRoute = TemplatesIdEditRouteImport.update({
  id: "/templates/$id/edit",
  path: "/templates/$id/edit",
  getParentRoute: () => rootRoute,
} as any);
