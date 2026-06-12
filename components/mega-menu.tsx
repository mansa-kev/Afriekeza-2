"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavSection } from "@/lib/navigation";

type MegaMenuProps = {
  section: NavSection;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function MegaMenu({ section, mobile = false, onNavigate }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (mobile) {
    return (
      <div className="border-b border-soft-border">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-dark"
        >
          {section.label}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open && (
          <div className="pb-4">
            {section.columns.map((column) => (
              <div key={column.title} className="mb-4">
                <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted uppercase">
                  {column.title}
                </p>
                <div className="space-y-1">
                  {column.items.map((item) => (
                    <Link
                      key={item.href + item.title}
                      href={item.href}
                      onClick={onNavigate}
                      className="block rounded-xl px-3 py-3 hover:bg-soft-green"
                    >
                      <span className="block text-[15px] font-medium text-dark">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={section.href}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-200",
          hovered ? "text-blue" : "text-navy/75 hover:text-blue",
        )}
      >
        {section.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            hovered && "rotate-180",
          )}
        />
      </Link>

      <div
        className={cn(
          "absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 transition-all duration-200",
          hovered
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        <div className="w-[640px] rounded-[22px] border border-soft-border bg-white p-6 shadow-xl shadow-navy/10 ring-1 ring-navy/5">
          <div className="grid grid-cols-2 gap-8">
            {section.columns.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
                  {column.title}
                </p>
                <div className="space-y-1">
                  {column.items.map((item) => (
                    <Link
                      key={item.href + item.title}
                      href={item.href}
                      className="block rounded-[14px] px-3.5 py-3.5 transition-colors hover:bg-soft-green"
                    >
                      <span className="block text-[15px] font-medium text-dark">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
