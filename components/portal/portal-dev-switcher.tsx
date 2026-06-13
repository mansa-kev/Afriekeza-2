"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PORTALS, type PortalId } from "@/lib/portal/config";
import { cn } from "@/lib/utils";

const ORDER: PortalId[] = ["marketing", "investor", "registry", "business", "admin"];

export function PortalDevSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  function switchPortal(portal: PortalId) {
    const url = new URL(window.location.href);
    if (portal === "marketing") {
      url.searchParams.delete("portal");
      document.cookie = `afriekeza-portal=; path=/; max-age=0`;
      url.pathname = "/";
    } else {
      url.searchParams.set("portal", portal);
      url.pathname = PORTALS[portal].homePath;
    }
    router.push(`${url.pathname}${url.search}`);
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-xl border border-dashed border-blue/30 bg-soft-blue/40 p-1",
        className,
      )}
    >
      <span className="px-2 text-[10px] font-semibold tracking-wide text-blue uppercase">
        Portal
      </span>
      {ORDER.map((portal) => (
        <button
          key={portal}
          type="button"
          onClick={() => switchPortal(portal)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-navy transition-colors hover:bg-white"
        >
          {PORTALS[portal].label}
        </button>
      ))}
      <Link
        href={pathname}
        className="ml-1 rounded-lg px-2 py-1 text-[10px] text-muted hover:text-blue"
      >
        refresh
      </Link>
    </div>
  );
}
