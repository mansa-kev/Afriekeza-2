"use client";

import Link from "next/link";
import { Calendar, HelpCircle, Menu, Search } from "lucide-react";
import { CurrencySwitcher } from "@/components/portal/currency-switcher";
import { NotificationMenu } from "@/components/portal/notification-menu";
import { PortalDevSwitcher } from "@/components/portal/portal-dev-switcher";
import { usePortalSidebar } from "@/components/portal/portal-sidebar-context";
import type { PortalId } from "@/lib/portal/config";
import { PORTALS } from "@/lib/portal/config";
import { cn } from "@/lib/utils";

type PortalHeaderProps = {
  portal: PortalId;
  dense?: boolean;
  notifications?: Array<{
    id: string;
    title: string;
    body: string;
    link: string | null;
    read_at: string | null;
    created_at: string;
  }>;
  userName?: string | null;
  userEmail?: string | null;
};

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "AF";
}

function formatHeaderDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PortalHeader({
  portal,
  dense,
  notifications = [],
  userName,
  userEmail,
}: PortalHeaderProps) {
  const { toggle } = usePortalSidebar();
  const config = PORTALS[portal];
  const initials = getInitials(userName, userEmail);
  const accountPath =
    portal === "business"
      ? `${config.pathPrefix}/company`
      : `${config.pathPrefix}/account`;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-header-border bg-white/95 backdrop-blur-md",
        dense ? "px-4 py-2.5" : "px-4 py-3 sm:px-6",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex rounded-lg border border-header-border p-2 text-muted transition-colors hover:bg-off-white hover:text-dark"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-dark">
              {config.label}
            </p>
            <p className="truncate text-xs text-muted">{config.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-header-border bg-off-white px-3 py-1.5 text-xs font-medium text-muted md:inline-flex">
            <Calendar className="h-3.5 w-3.5" />
            {formatHeaderDate()}
          </span>

          <div className="hidden sm:block">
            <PortalDevSwitcher />
          </div>
          <CurrencySwitcher compact />
          <button
            type="button"
            className="hidden rounded-lg border border-header-border p-2 text-muted transition-colors hover:bg-off-white hover:text-dark lg:inline-flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <NotificationMenu notifications={notifications} />
          <Link
            href={`${config.pathPrefix}/support`}
            className="hidden rounded-lg border border-header-border p-2 text-muted transition-colors hover:bg-off-white hover:text-dark md:inline-flex"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Link>
          <Link
            href={accountPath}
            className="flex items-center gap-2 rounded-lg border border-header-border px-2.5 py-1.5 text-sm font-medium text-dark transition-colors hover:bg-off-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-soft-blue text-xs font-bold text-blue">
              {initials}
            </span>
            <span className="hidden max-w-[8rem] truncate lg:inline">
              {userName ?? "Account"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
