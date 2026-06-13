export type PortalId = "marketing" | "investor" | "business" | "admin";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

export type PortalConfig = {
  id: PortalId;
  label: string;
  description: string;
  subdomain: string | null;
  pathPrefix: string | null;
  homePath: string;
  loginPath: string;
  density: "minimal" | "lean" | "full";
};

export const PORTALS: Record<PortalId, PortalConfig> = {
  marketing: {
    id: "marketing",
    label: "Public Site",
    description: "Afriekeza marketing and product pages",
    subdomain: null,
    pathPrefix: null,
    homePath: "/",
    loginPath: "/invest",
    density: "minimal",
  },
  investor: {
    id: "investor",
    label: "Investor Portal",
    description: "Verified investor operating environment",
    subdomain: "invest",
    pathPrefix: "/investor",
    homePath: "/investor/dashboard",
    loginPath: "/investor/login",
    density: "minimal",
  },
  business: {
    id: "business",
    label: "Issuer Portal",
    description: "Capital-readiness workspace for issuers",
    subdomain: "business",
    pathPrefix: "/business",
    homePath: "/business/dashboard",
    loginPath: "/business/login",
    density: "lean",
  },
  admin: {
    id: "admin",
    label: "Admin Portal",
    description: "Internal operations and compliance control centre",
    subdomain: "admin",
    pathPrefix: "/admin",
    homePath: "/admin/dashboard",
    loginPath: "/admin/login",
    density: "full",
  },
};

const INVESTOR_ROUTES = [
  { label: "Overview", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Opportunities", path: "/opportunities", icon: "TrendingUp" },
  { label: "Portfolio", path: "/portfolio", icon: "PieChart" },
  { label: "Wallet", path: "/wallet", icon: "Wallet" },
  { label: "Reports", path: "/reports", icon: "FileText" },
  { label: "Tax Statements", path: "/tax-statements", icon: "Receipt" },
  { label: "Secondary", path: "/secondary-market", icon: "ArrowLeftRight" },
  { label: "Groups", path: "/groups", icon: "Users" },
  { label: "Documents", path: "/documents", icon: "FolderOpen" },
  { label: "Learn", path: "/learn-portal", icon: "BookOpen" },
  { label: "Support", path: "/support", icon: "LifeBuoy" },
  { label: "Account", path: "/account", icon: "User" },
];

const BUSINESS_ROUTES = [
  { label: "Overview", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Company Profile", path: "/company", icon: "Building2" },
  { label: "KYB Status", path: "/kyb", icon: "ShieldCheck" },
  { label: "Readiness Score", path: "/funding-readiness", icon: "ClipboardCheck" },
  { label: "Capital Request", path: "/raise-application", icon: "TrendingUp" },
  { label: "Data Room", path: "/data-room", icon: "Database" },
  { label: "Registry", path: "/registry-portal", icon: "Table2" },
  { label: "Deal Pipeline", path: "/deal-status", icon: "GitBranch" },
  { label: "Use of Funds", path: "/use-of-funds", icon: "Coins" },
  { label: "Investor Reporting", path: "/issuer-reporting", icon: "FileBarChart" },
  { label: "Team", path: "/team", icon: "Users" },
  { label: "Support", path: "/support", icon: "LifeBuoy" },
];

const ADMIN_ROUTES = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Investors", path: "/investors", icon: "Users" },
  { label: "Issuers", path: "/businesses", icon: "Building2" },
  { label: "Opportunities", path: "/opportunity-builder", icon: "Briefcase" },
  { label: "Payments", path: "/payments", icon: "CreditCard" },
  { label: "Allocations", path: "/allocations", icon: "ArrowLeftRight" },
  { label: "Reports", path: "/reports", icon: "FileText" },
  { label: "Registry", path: "/registry-portal", icon: "Table2" },
  { label: "Documents", path: "/documents", icon: "FolderOpen" },
  { label: "Support", path: "/support", icon: "LifeBuoy" },
  { label: "Audit Logs", path: "/audit-logs", icon: "ScrollText" },
  { label: "Risk & Compliance", path: "/compliance", icon: "Shield" },
  { label: "Settings", path: "/settings", icon: "Settings" },
];

function buildNav(
  portal: PortalId,
  routes: { label: string; path: string; icon: string }[],
): PortalNavItem[] {
  const prefix = PORTALS[portal].pathPrefix ?? "";
  return routes.map((r) => ({
    label: r.label,
    href: `${prefix}${r.path}`,
    icon: r.icon,
  }));
}

export const INVESTOR_NAV = buildNav("investor", INVESTOR_ROUTES);
export const BUSINESS_NAV = buildNav("business", BUSINESS_ROUTES);
export const ADMIN_NAV = buildNav("admin", ADMIN_ROUTES);

export function getNavForPortal(portal: PortalId): PortalNavItem[] {
  switch (portal) {
    case "investor":
      return INVESTOR_NAV;
    case "business":
      return BUSINESS_NAV;
    case "admin":
      return ADMIN_NAV;
    default:
      return [];
  }
}

export function getPortalFromPath(pathname: string): PortalId | null {
  if (pathname.startsWith("/investor")) return "investor";
  if (pathname.startsWith("/business")) return "business";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}
