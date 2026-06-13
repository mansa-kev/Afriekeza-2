import { PortalPageHeader } from "@/components/portal/page-header";
import { SupportTicketsPanel } from "@/components/portal/support-tickets-panel";
import { getCurrentProfile, listSupportTicketsForUser } from "@/lib/supabase/queries";

export default async function BusinessSupportPage() {
  const { user } = await getCurrentProfile();
  const { data: tickets } = user ? await listSupportTicketsForUser(user.id) : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Support"
        description="Get help with KYB, capital requests, or your issuer workspace."
      />
      <SupportTicketsPanel portal="business" tickets={tickets ?? []} />
    </div>
  );
}
