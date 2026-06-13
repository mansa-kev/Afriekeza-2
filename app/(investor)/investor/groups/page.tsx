import { GroupInvestingPanel, JoinGroupButton } from "@/components/investor/group-investing-panel";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";
import { listInvestmentGroups } from "@/lib/supabase/queries";

export default async function GroupsPage() {
  const { data: groups } = await listInvestmentGroups();

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Group investing"
        description="Pool capital with others toward shared allocation targets."
      />
      <GroupInvestingPanel />

      <PortalSection title="Active groups">
        {(groups ?? []).length === 0 ? (
          <EmptyState
            title="No groups yet"
            description="Create or join a group to invest together toward an opportunity."
          />
        ) : (
          <div className="grid gap-4">
            {(groups ?? []).map((g) => {
              const opp = g.opportunities as { title?: string } | null;
              return (
                <PortalCard key={g.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-dark">{g.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        Target KES {Number(g.target_amount_kes).toLocaleString()}
                        {opp?.title ? ` · ${opp.title}` : ""}
                      </p>
                    </div>
                    <StatusPill status={String(g.status)} />
                  </div>
                  <JoinGroupButton groupId={g.id} />
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>
    </div>
  );
}
