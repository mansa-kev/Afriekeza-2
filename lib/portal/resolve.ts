import type { PortalId } from "./config";
import { PORTALS } from "./config";

const PORTAL_COOKIE = "afriekeza-portal";

export function getPortalCookieName() {
  return PORTAL_COOKIE;
}

export function resolvePortalFromHost(host: string): PortalId {
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname.startsWith("invest.")) return "investor";
  if (hostname.startsWith("registry.")) return "registry";
  if (hostname.startsWith("business.")) return "business";
  if (hostname.startsWith("admin.")) return "admin";

  return "marketing";
}

export function resolvePortal(
  host: string,
  cookieValue?: string | null,
  queryPortal?: string | null,
): PortalId {
  const fromHost = resolvePortalFromHost(host);

  if (fromHost !== "marketing") {
    return fromHost;
  }

  if (queryPortal && queryPortal in PORTALS) {
    return queryPortal as PortalId;
  }

  if (cookieValue && cookieValue in PORTALS) {
    return cookieValue as PortalId;
  }

  return "marketing";
}
