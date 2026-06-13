"use client";

import { usePathname } from "next/navigation";
import {
  isPortalAuthPath,
  PortalAuthShell,
} from "@/components/portal/portal-auth-shell";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { PortalSidebarProvider } from "@/components/portal/portal-sidebar-context";
import { PORTALS, type PortalId } from "@/lib/portal/config";
import { cn } from "@/lib/utils";

type PortalShellProps = {
  portal: PortalId;
  children: React.ReactNode;
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

function PortalShellInner({
  portal,
  children,
  notifications = [],
  userName,
  userEmail,
}: PortalShellProps) {
  const pathname = usePathname();
  const config = PORTALS[portal];

  if (isPortalAuthPath(pathname)) {
    return <PortalAuthShell portal={portal}>{children}</PortalAuthShell>;
  }

  return (
    <div className="flex min-h-screen bg-off-white">
      <PortalSidebar
        portal={portal}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader
          portal={portal}
          dense={config.density === "full"}
          notifications={notifications}
          userName={userName}
          userEmail={userEmail}
        />
        <main
          className={cn(
            "flex-1",
            config.density === "minimal" && "px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
            config.density === "lean" && "px-4 py-5 sm:px-6 lg:px-7 lg:py-6",
            config.density === "full" && "px-4 py-4 sm:px-5 lg:px-6 lg:py-5",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function PortalShell(props: PortalShellProps) {
  return (
    <PortalSidebarProvider>
      <PortalShellInner {...props} />
    </PortalSidebarProvider>
  );
}
