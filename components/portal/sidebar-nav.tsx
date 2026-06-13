"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardCheck,
  Coins,
  CreditCard,
  Database,
  FileBarChart,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LifeBuoy,
  PieChart,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Table2,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import type { PortalNavItem } from "@/lib/portal/config";
import { cn } from "@/lib/utils";

const ICONS = {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Wallet,
  FileText,
  FolderOpen,
  BookOpen,
  LifeBuoy,
  User,
  Building2,
  ShieldCheck,
  ClipboardCheck,
  Database,
  Table2,
  GitBranch,
  Coins,
  FileBarChart,
  Users,
  Briefcase,
  CreditCard,
  ArrowLeftRight,
  ScrollText,
  Settings,
  Shield,
  Receipt,
} as const;

type SidebarNavProps = {
  items: PortalNavItem[];
  density?: "minimal" | "lean" | "full";
  onNavigate?: () => void;
};

export function SidebarNav({
  items,
  density = "lean",
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {items.map((item) => {
        const Icon = ICONS[item.icon as keyof typeof ICONS] ?? LayoutDashboard;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 font-medium transition-colors",
              density === "minimal" ? "py-2.5 text-[14px]" : "py-2 text-sm",
              density === "full" && "py-2 text-[13px]",
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-blue" />
            )}
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-blue" : "text-white/50 group-hover:text-white/80",
              )}
            />
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto rounded-full bg-green/20 px-2 py-0.5 text-[10px] font-semibold text-green">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
