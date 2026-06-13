import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortalDevSwitcher } from "@/components/portal/portal-dev-switcher";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-copy";

export const metadata = {
  title: `${SITE_NAME} — Africa's Private Capital Markets Platform`,
  description: SITE_DESCRIPTION,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-soft-border bg-off-white px-4 py-2">
        <div className="mx-auto flex max-w-7xl justify-end">
          <PortalDevSwitcher />
        </div>
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
