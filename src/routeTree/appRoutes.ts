import { appRoute } from "./appRoute";
import { AppDashboardRoute } from "./dashboardRoute";
import { AppEnviosRoute } from "./enviosRoute";
import { AppTemplatesRoute } from "./templatesRoute";
import { AppCertificadosIndexRoute, AppCertificadosNovoRoute } from "./certificadosRoute";

export const appRouteWithChildren = appRoute._addFileChildren({
  AppDashboardRoute,
  AppEnviosRoute,
  AppTemplatesRoute,
  AppCertificadosIndexRoute,
  AppCertificadosNovoRoute,
});
