import { PortalShell } from "@/components/portal/portal-shell";
import { CurrencyProvider } from "@/lib/currency/context";
import { getCurrentProfile, listNotificationsForUser } from "@/lib/supabase/queries";

export const metadata = {
  title: "Issuer Portal — Afriekeza",
  description: "Capital-readiness workspace for African businesses",
};

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentProfile();
  const { data: notifications } = user
    ? await listNotificationsForUser(user.id)
    : { data: [] };

  return (
    <CurrencyProvider>
      <PortalShell
        portal="business"
        notifications={notifications ?? []}
        userName={profile?.full_name}
        userEmail={profile?.email ?? user?.email}
      >
        {children}
      </PortalShell>
    </CurrencyProvider>
  );
}
