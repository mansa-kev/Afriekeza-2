import { AllocationActions, AllocationStatusPill } from "@/components/admin/allocation-actions";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { listPendingAllocations } from "@/lib/supabase/queries";

export default async function AllocationsPage() {
  const { data: commitments } = await listPendingAllocations();

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Allocations"
        description="Subscription review, finalization, and refund processing."
      />

      {commitments.length === 0 ? (
        <EmptyState
          title="No commitments pending allocation"
          description="Investor commitments awaiting payment verification will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {commitments.map((c) => {
            const investor = c.investor_profiles as {
              profiles?: { full_name?: string; email?: string };
            } | null;
            const opp = c.opportunities as { title?: string; slug?: string } | null;
            const profile = investor?.profiles;

            return (
              <PortalCard key={c.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark">{opp?.title ?? "Opportunity"}</p>
                    <p className="mt-1 text-sm text-muted">
                      {profile?.full_name ?? "Investor"} · {profile?.email ?? "—"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-dark">
                      KES {Number(c.amount_kes).toLocaleString()}
                    </p>
                  </div>
                  <AllocationStatusPill status={String(c.status)} />
                </div>
                <AllocationActions commitmentId={c.id} />
              </PortalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
