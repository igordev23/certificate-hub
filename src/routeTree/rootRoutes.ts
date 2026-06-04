import { Route as rootRouteImport } from "../routes/__root";
import { Route as VerificarRouteImport } from "../routes/verificar";
import { Route as IndexRouteImport } from "../routes/index";
import { Route as TemplatesIdEditRouteImport } from "../routes/templates.$id.edit";
import { Route as CertificadosIdEditarRouteImport } from "../routes/certificados.$id.editar";

export const rootRoute = rootRouteImport;

export const rootRoutes = {
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

export const rootRouteChildren = {
  IndexRoute: rootRoutes.IndexRoute,
  VerificarRoute: rootRoutes.VerificarRoute,
  TemplatesIdEditRoute: rootRoutes.TemplatesIdEditRoute,
  CertificadosIdEditarRoute: rootRoutes.CertificadosIdEditarRoute,
};
