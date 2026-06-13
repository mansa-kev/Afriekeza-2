import Link from "next/link";
import { EmptyState } from "@/components/portal/empty-state";
import { OpportunityFeatureCard } from "@/components/portal/opportunity-feature-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSearchBar } from "@/components/portal/portal-search-bar";
import { listOpportunities } from "@/lib/supabase/queries";

export default async function OpportunitiesPage() {
  const { data: opportunities } = await listOpportunities(true);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Opportunities"
        description="Structured private-market products with clear terms and eligibility requirements."
      />

      <PortalSearchBar
        placeholder="Search by name, instrument, or sector…"
        className="max-w-xl"
      />

      {opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities listed yet"
          description="New opportunities will appear here once approved and published by Afriekeza."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opp) => (
            <OpportunityFeatureCard
              key={opp.id}
              title={opp.title}
              instrument={opp.instrument ?? undefined}
              minInvestment={opp.minimum_investment_kes}
              tenorMonths={opp.tenor_months}
              targetReturn={opp.target_return_pct}
              riskLabel={opp.risk_label}
              href={`/investor/opportunities/${opp.slug}`}
            />
          ))}
        </div>
      )}

      {opportunities.length > 0 && (
        <p className="text-sm text-muted">
          Need help choosing? Visit the{" "}
          <Link href="/investor/learn-portal" className="font-medium text-blue hover:underline">
            learning centre
          </Link>
          .
        </p>
      )}
    </div>
  );
}
