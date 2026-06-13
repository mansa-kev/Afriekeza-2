import { NextResponse, type NextRequest } from "next/server";
import {
  getPortalCookieName,
  resolvePortal,
} from "@/lib/portal/resolve";
import { PORTALS, type PortalId } from "@/lib/portal/config";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "localhost:3000";
  const cookiePortal = request.cookies.get(getPortalCookieName())?.value;
  const queryPortal = request.nextUrl.searchParams.get("portal");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/products") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const sessionResponse = await updateSession(request);
  if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
    return sessionResponse;
  }

  const portal = resolvePortal(host, cookiePortal, queryPortal);
  const response = sessionResponse;
  response.headers.set("x-afriekeza-portal", portal);

  if (queryPortal && queryPortal in PORTALS) {
    response.cookies.set(getPortalCookieName(), queryPortal, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  const prefix = portal !== "marketing" ? PORTALS[portal as PortalId].pathPrefix : null;

  if (prefix && !pathname.startsWith(prefix)) {
    const isPortalRoot =
      pathname === "/dashboard" ||
      pathname === "/login" ||
      pathname.startsWith("/opportunities") ||
      pathname.startsWith("/portfolio") ||
      pathname.startsWith("/wallet") ||
      pathname.startsWith("/reports") ||
      pathname.startsWith("/documents") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/support") ||
      pathname.startsWith("/company") ||
      pathname.startsWith("/kyb") ||
      pathname.startsWith("/investors") ||
      pathname.startsWith("/businesses") ||
      pathname.startsWith("/readiness") ||
      pathname.startsWith("/cap-table") ||
      pathname.startsWith("/data-room") ||
      pathname.startsWith("/reporting") ||
      pathname.startsWith("/settings");

    if (portal !== "marketing" && (pathname === "/" || isPortalRoot)) {
      const target = pathname === "/" ? PORTALS[portal as PortalId].homePath : `${prefix}${pathname}`;
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (portal === "marketing" && isPrefixedPortalPath(pathname)) {
    const segment = pathname.split("/")[1] as PortalId;
    if (segment in PORTALS) {
      const url = new URL(pathname, request.url);
      url.searchParams.set("portal", segment);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

function isPrefixedPortalPath(pathname: string) {
  return (
    pathname.startsWith("/investor") ||
    pathname.startsWith("/registry") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/admin")
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
