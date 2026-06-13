"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type PortalSearchBarProps = {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
};

export function PortalSearchBar({
  placeholder = "Search…",
  className,
  onSearch,
}: PortalSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full rounded-lg border border-header-border bg-white py-2.5 pl-10 pr-4 text-sm text-dark placeholder:text-muted/70 shadow-sm outline-none transition-colors focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
      />
    </div>
  );
}
