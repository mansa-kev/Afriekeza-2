import { SecondaryListingForm } from "@/components/investor/secondary-listing-form";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { getCurrentProfile, listPortfolioForUser, listSecondaryListings } from "@/lib/supabase/queries";

export default async function SecondaryMarketPage() {
  const { user } = await getCurrentProfile();
  const { data: listings } = await listSecondaryListings();
  const { data: positions } = user ? await listPortfolioForUser(user.id) : { data: [] };

  const positionOptions = (positions ?? []).map((p) => ({
    id: p.id,
    title: (p.opportunities as { title?: string } | null)?.title ?? "Position",
    principal_kes: Number(p.principal_kes),
  }));

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Secondary market"
        description="Controlled liquidity windows for eligible portfolio positions."
      />

      {user ? <SecondaryListingForm positions={positionOptions} /> : null}

      <PortalSection title="Open listings">
        {(listings ?? []).length === 0 ? (
          <EmptyState
            title="No open listings"
            description="Secondary windows will show positions available for transfer during approved periods."
          />
        ) : (
          <div className="grid gap-4">
            {(listings ?? []).map((l) => {
              const opp = (l.portfolio_positions as { opportunities?: { title?: string } } | null)?.opportunities;
              return (
                <PortalCard key={l.id}>
                  <p className="font-medium text-dark">{opp?.title ?? "Position"}</p>
                  <p className="mt-1 text-sm text-muted">
                    Asking KES {Number(l.asking_amount_kes).toLocaleString()}
                  </p>
                  {l.notes ? <p className="mt-2 text-sm text-muted">{l.notes}</p> : null}
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>
    </div>
  );
}
