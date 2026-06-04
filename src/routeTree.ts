import { Route as rootRouteImport } from "./routes/__root";
import { Route as VerificarRouteImport } from "./routes/verificar";
import { Route as AppRouteImport } from "./routes/_app";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as AppTemplatesRouteImport } from "./routes/_app.templates";
import { Route as AppEnviosRouteImport } from "./routes/_app.envios";
import { Route as AppDashboardRouteImport } from "./routes/_app.dashboard";
import { Route as AppCertificadosIndexRouteImport } from "./routes/_app.certificados.index";
import { Route as TemplatesIdEditRouteImport } from "./routes/templates.$id.edit";
import { Route as CertificadosIdEditarRouteImport } from "./routes/certificados.$id.editar";
import { Route as AppCertificadosNovoRouteImport } from "./routes/_app.certificados.novo";

const rootRoutes = {
  VerificarRoute: VerificarRouteImport.update({
    id: "/verificar",
    path: "/verificar",
    getParentRoute: () => rootRouteImport,
  } as any),
  IndexRoute: IndexRouteImport.update({
    id: "/",
    path: "/",
    getParentRoute: () => rootRouteImport,
  } as any),
  TemplatesIdEditRoute: TemplatesIdEditRouteImport.update({
    id: "/templates/$id/edit",
    path: "/templates/$id/edit",
    getParentRoute: () => rootRouteImport,
  } as any),
  CertificadosIdEditarRoute: CertificadosIdEditarRouteImport.update({
    id: "/certificados/$id/editar",
    path: "/certificados/$id/editar",
    getParentRoute: () => rootRouteImport,
  } as any),
};

const appRoute = AppRouteImport.update({
  id: "/_app",
  getParentRoute: () => rootRouteImport,
} as any);

const appChildRoutes = {
  AppDashboardRoute: AppDashboardRouteImport.update({
    id: "/dashboard",
    path: "/dashboard",
    getParentRoute: () => appRoute,
  } as any),
  AppEnviosRoute: AppEnviosRouteImport.update({
    id: "/envios",
    path: "/envios",
    getParentRoute: () => appRoute,
  } as any),
  AppTemplatesRoute: AppTemplatesRouteImport.update({
    id: "/templates",
    path: "/templates",
    getParentRoute: () => appRoute,
  } as any),
  AppCertificadosIndexRoute: AppCertificadosIndexRouteImport.update({
    id: "/certificados/",
    path: "/certificados/",
    getParentRoute: () => appRoute,
  } as any),
  AppCertificadosNovoRoute: AppCertificadosNovoRouteImport.update({
    id: "/certificados/novo",
    path: "/certificados/novo",
    getParentRoute: () => appRoute,
  } as any),
};

const appRouteWithChildren = appRoute._addFileChildren(appChildRoutes);

const rootRouteChildren = {
  IndexRoute: rootRoutes.IndexRoute,
  AppRoute: appRouteWithChildren,
  VerificarRoute: rootRoutes.VerificarRoute,
  TemplatesIdEditRoute: rootRoutes.TemplatesIdEditRoute,
  CertificadosIdEditarRoute: rootRoutes.CertificadosIdEditarRoute,
};

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren);
