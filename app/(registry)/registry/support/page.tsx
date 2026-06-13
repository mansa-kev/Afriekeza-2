import { PortalPageHeader } from "@/components/portal/page-header";
import { SupportTicketsPanel } from "@/components/portal/support-tickets-panel";
import { getCurrentProfile, listSupportTicketsForUser } from "@/lib/supabase/queries";

export default async function RegistrySupportPage() {
  const { user } = await getCurrentProfile();
  const { data: tickets } = user ? await listSupportTicketsForUser(user.id) : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Support"
        description="Registry setup, readiness review, and billing enquiries."
      />
      <SupportTicketsPanel portal="business" tickets={tickets ?? []} />
    </div>
  );
}
