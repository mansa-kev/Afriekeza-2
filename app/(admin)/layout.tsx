import { PortalShell } from "@/components/portal/portal-shell";
import { CurrencyProvider } from "@/lib/currency/context";
import { getCurrentProfile, listNotificationsForUser } from "@/lib/supabase/queries";

export const metadata = {
  title: "Admin Portal — Afriekeza",
  description: "Afriekeza internal operations control centre",
};

export default async function AdminLayout({
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
        portal="admin"
        notifications={notifications ?? []}
        userName={profile?.full_name}
        userEmail={profile?.email ?? user?.email}
      >
        {children}
      </PortalShell>
    </CurrencyProvider>
  );
}
