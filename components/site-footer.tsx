import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { FOOTER_DISCLAIMER } from "@/lib/site-copy";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12">
          <Image
            src="/afriekeza-logo.png"
            alt="Afriekeza"
            width={200}
            height={66}
            className="h-[34px] w-auto md:h-[38px]"
          />
          <p className="mt-3 text-sm text-white/50">Africa Invests</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Afriekeza</h4>
            <ul className="space-y-2.5">
              {footerLinks.afriekeza.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Invest</h4>
            <ul className="space-y-2.5">
              {footerLinks.invest.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Raise</h4>
            <ul className="space-y-2.5">
              {footerLinks.raise.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Registry</h4>
            <ul className="space-y-2.5">
              {footerLinks.registry.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Institutions
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.institutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p>www.afriekeza.com</p>
              <p>+254 726 391 916</p>
              <p>Nairobi, Kenya</p>
            </div>
            <p className="text-white/40">
              © {new Date().getFullYear()} Afriekeza. All rights reserved.
            </p>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-white/40">
            {FOOTER_DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>
  );
}
