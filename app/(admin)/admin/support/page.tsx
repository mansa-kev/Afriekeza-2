import { AdminSupportActions } from "@/components/admin/allocation-actions";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listSupportTickets } from "@/lib/supabase/queries";

export default async function AdminSupportPage() {
  const { data: tickets } = await listSupportTickets();

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Support"
        description="User conversations, escalations, and SLA tracking."
      />

      {tickets.length === 0 ? (
        <EmptyState
          title="No open tickets"
          description="Support requests from investors and issuers will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const profile = ticket.profiles as { full_name?: string; email?: string } | null;
            return (
              <PortalCard key={ticket.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark">{ticket.subject}</p>
                    <p className="mt-1 text-sm text-muted">
                      {profile?.full_name ?? "User"} · {profile?.email ?? "—"} · {ticket.portal} ·{" "}
                      {ticket.category}
                    </p>
                  </div>
                  <StatusPill status={String(ticket.status).replaceAll("_", " ")} />
                </div>
                <p className="mt-3 text-sm text-muted">{ticket.body}</p>
                <AdminSupportActions ticketId={ticket.id} status={ticket.status} />
              </PortalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
