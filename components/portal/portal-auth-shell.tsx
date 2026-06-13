"use client";

import Image from "next/image";
import Link from "next/link";
import { PortalDevSwitcher } from "@/components/portal/portal-dev-switcher";
import { PORTALS, type PortalId } from "@/lib/portal/config";

export function PortalAuthShell({
  portal,
  children,
}: {
  portal: PortalId;
  children: React.ReactNode;
}) {
  const config = PORTALS[portal];

  return (
    <div className="min-h-screen bg-off-white">
      <header className="border-b border-header-border bg-white/95 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href={config.loginPath} className="flex items-center gap-2">
            <Image
              src="/afriekeza-logo-transparent.png"
              alt="Afriekeza"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="hidden text-xs font-semibold uppercase tracking-wide text-muted sm:inline">
              {config.label}
            </span>
          </Link>
          <PortalDevSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function isPortalAuthPath(pathname: string) {
  return (
    pathname.endsWith("/login") ||
    pathname.endsWith("/signup") ||
    pathname.includes("/auth/")
  );
}
