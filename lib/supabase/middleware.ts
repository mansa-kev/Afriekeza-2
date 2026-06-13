import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/auth/callback",
  "/auth/auth-code-error",
  "/investor/login",
  "/business/login",
  "/registry/login",
  "/admin/login",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

type AppPortal = "investor" | "business" | "registry" | "admin";

function portalFromPath(pathname: string): AppPortal | null {
  if (pathname.startsWith("/investor")) return "investor";
  if (pathname.startsWith("/registry")) return "registry";
  if (pathname.startsWith("/business")) return "business";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

function loginPath(portal: AppPortal) {
  return `/${portal}/login`;
}

function hasPortalRole(
  roles: string[] | null | undefined,
  portal: AppPortal,
) {
  if (!roles?.length) return false;
  if (portal === "investor") return roles.includes("investor");
  if (portal === "business" || portal === "registry") {
    return roles.includes("business_user");
  }
  const adminRoles = [
    "admin",
    "super_admin",
    "compliance_officer",
    "issuer_analyst",
    "investment_committee",
    "operations_manager",
    "support_agent",
    "auditor",
  ];
  return roles.some((r) => adminRoles.includes(r));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const portal = portalFromPath(request.nextUrl.pathname);
  if (!portal || isPublicPath(request.nextUrl.pathname)) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath(portal);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("portal_roles, account_status")
    .eq("id", user.id)
    .maybeSingle();

  const onboardingAllowed =
    portal === "investor" && request.nextUrl.pathname.startsWith("/investor/onboarding");

  if (!hasPortalRole(profile?.portal_roles, portal) && !onboardingAllowed) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath(portal);
    url.searchParams.set("error", "access_denied");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
