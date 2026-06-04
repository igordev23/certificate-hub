import { Route as AppDashboardRouteImport } from "../routes/_app.dashboard";
import { appRoute } from "./appRoute";

export const AppDashboardRoute = AppDashboardRouteImport.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => appRoute,
} as any);
