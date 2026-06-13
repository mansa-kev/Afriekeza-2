"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, LogOut, TrendingUp, X } from "lucide-react";
import { SidebarNav } from "@/components/portal/sidebar-nav";
import { usePortalSidebar } from "@/components/portal/portal-sidebar-context";
import {
  getNavForPortal,
  PORTALS,
  type PortalId,
} from "@/lib/portal/config";
import { cn } from "@/lib/utils";

type PortalSidebarProps = {
  portal: PortalId;
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

export function PortalSidebar({
  portal,
  userName,
  userEmail,
}: PortalSidebarProps) {
  const { open, close } = usePortalSidebar();
  const pathname = usePathname();
  const config = PORTALS[portal];
  const nav = getNavForPortal(portal);
  const initials = getInitials(userName, userEmail);
  const accountPath =
    portal === "business"
      ? `${config.pathPrefix}/company`
      : portal === "registry"
        ? `${config.pathPrefix}/settings`
        : `${config.pathPrefix}/account`;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col bg-navy text-white shadow-xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:shadow-none",
          config.density === "full" ? "lg:w-64" : "lg:w-60",
          open ? "translate-x-0" : "-translate-x-full lg:hidden",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link
            href={config.homePath}
            className="flex items-center gap-2.5"
            onClick={() => {
              if (window.innerWidth < 1024) close();
            }}
          >
            <Image
              src="/afriekeza-logo-transparent.png"
              alt="Afriekeza"
              width={120}
              height={40}
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          <SidebarNav
            items={nav}
            density={config.density}
            onNavigate={() => {
              if (window.innerWidth < 1024) close();
            }}
          />
        </div>

        {/* Issuer capital readiness promo */}
        {portal === "business" && (
          <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue/20 text-blue">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Capital readiness</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                  Complete KYB and your data room to accelerate review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Investor refer promo */}
        {portal === "investor" && (
          <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green/20 text-green">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Refer & Earn</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                  Invite verified investors and earn rewards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User block */}
        <div className="border-t border-white/10 p-3">
          <Link
            href={accountPath}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5",
              pathname === accountPath && "bg-white/10",
            )}
            onClick={() => {
              if (window.innerWidth < 1024) close();
            }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/30 text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {userName ?? "Account"}
              </p>
              {userEmail && (
                <p className="truncate text-xs text-white/50">{userEmail}</p>
              )}
            </div>
            <LogOut className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
          </Link>
        </div>
      </aside>
    </>
  );
}
