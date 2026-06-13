import { PortalShell } from "@/components/portal/portal-shell";
import { CurrencyProvider } from "@/lib/currency/context";
import { getCurrentProfile, listNotificationsForUser } from "@/lib/supabase/queries";

export const metadata = {
  title: "Afriekeza Registry",
  description: "Capital readiness, ownership records, and investor reporting",
};

export default async function RegistryLayout({
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
        portal="registry"
        notifications={notifications ?? []}
        userName={profile?.full_name}
        userEmail={profile?.email ?? user?.email}
      >
        {children}
      </PortalShell>
    </CurrencyProvider>
  );
}
