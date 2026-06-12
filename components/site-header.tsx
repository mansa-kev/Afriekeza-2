"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/mega-menu";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[76px] border-b transition-all duration-300",
        scrolled
          ? "border-header-border bg-white/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-white",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="shrink-0 py-2">
          <Image
            src="/afriekeza-logo.png"
            alt="Afriekeza"
            width={200}
            height={66}
            className="h-[34px] w-auto md:h-[38px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((section) => (
            <MegaMenu key={section.label} section={section} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label="Select region"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-off-white hover:text-dark"
          >
            <Globe className="h-5 w-5" />
          </button>
          <Button variant="ghost" size="sm" href="/contact">
            Log in
          </Button>
          <Button variant="primary" size="sm" href="/invest#waitlist">
            Join Waitlist
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-dark lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-[76px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="px-6 py-4">
            {mainNav.map((section) => (
              <MegaMenu
                key={section.label}
                section={section}
                mobile
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
            <div className="mt-6 space-y-3 border-t border-soft-border pt-6">
              <Button
                variant="primary"
                size="lg"
                href="/invest#waitlist"
                className="w-full"
              >
                Join Waitlist
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/raise#apply"
                className="w-full"
              >
                Apply as a Business
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
