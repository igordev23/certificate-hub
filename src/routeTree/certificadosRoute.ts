import { Route as AppCertificadosIndexRouteImport } from "../routes/_app.certificados.index";
import { Route as AppCertificadosNovoRouteImport } from "../routes/_app.certificados.novo";
import { Route as CertificadosIdEditarRouteImport } from "../routes/certificados.$id.editar";
import { appRoute } from "./appRoute";
import { rootRoute } from "./rootRoutes";

export const AppCertificadosIndexRoute = AppCertificadosIndexRouteImport.update({
  id: "/certificados/",
  path: "/certificados/",
  getParentRoute: () => appRoute,
} as any);

export const AppCertificadosNovoRoute = AppCertificadosNovoRouteImport.update({
  id: "/certificados/novo",
  path: "/certificados/novo",
  getParentRoute: () => appRoute,
} as any);

export const CertificadosIdEditarRoute = CertificadosIdEditarRouteImport.update({
  id: "/certificados/$id/editar",
  path: "/certificados/$id/editar",
  getParentRoute: () => rootRoute,
} as any);
