import { PortalPageHeader } from "@/components/portal/page-header";
import { SupportTicketsPanel } from "@/components/portal/support-tickets-panel";
import { getCurrentProfile, listSupportTicketsForUser } from "@/lib/supabase/queries";

export default async function SupportPage() {
  const { user } = await getCurrentProfile();
  const { data: tickets } = user ? await listSupportTicketsForUser(user.id) : { data: [] };

  return (
    <div>
      <PortalPageHeader title="Support" description="Get help with verification, documents, or your account." />
      <SupportTicketsPanel portal="investor" tickets={tickets ?? []} />
    </div>
  );
}
