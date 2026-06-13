import { notFound } from "next/navigation";
import { CommitmentPanel } from "@/components/portal/commitment-panel";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { checkInvestorEligibility } from "@/lib/investor/eligibility";
import { createClient } from "@/lib/supabase/server";
import {
  getCommitmentForOpportunity,
  getCurrentProfile,
  getInvestorProfile,
} from "@/lib/supabase/queries";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: opp } = await supabase
    .from("opportunities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!opp) notFound();

  const { user } = await getCurrentProfile();
  const investor = user ? await getInvestorProfile(user.id) : null;
  const existingCommitment = user
    ? await getCommitmentForOpportunity(user.id, opp.id)
    : null;

  const eligibility = checkInvestorEligibility(investor, opp);

  return (
    <div className="max-w-4xl">
      <PortalPageHeader
        title={opp.title}
        description={opp.plain_summary ?? "Structured private-market opportunity"}
        action={<StatusPill status={String(opp.status).replace(/_/g, " ")} />}
      />

      <div className="grid gap-6">
        <section className="rounded-xl border border-header-border bg-white p-6">
          <h2 className="font-semibold text-dark">Terms</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="text-sm text-muted">Target raise</dt><dd className="font-medium">KES {Number(opp.target_raise_kes).toLocaleString()}</dd></div>
            <div><dt className="text-sm text-muted">Minimum</dt><dd className="font-medium">KES {Number(opp.minimum_investment_kes).toLocaleString()}</dd></div>
            <div><dt className="text-sm text-muted">Tenor</dt><dd className="font-medium">{opp.tenor_months} months</dd></div>
            {opp.target_return_pct != null && (
              <div><dt className="text-sm text-muted">Target return</dt><dd className="font-medium">Up to {opp.target_return_pct}% p.a.</dd></div>
            )}
            <div><dt className="text-sm text-muted">Risk label</dt><dd className="font-medium">{opp.risk_label ?? "—"}</dd></div>
          </dl>
        </section>

        {opp.what_you_own && (
          <section className="rounded-xl border border-header-border bg-white p-6">
            <h2 className="font-semibold text-dark">What you own</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{opp.what_you_own}</p>
          </section>
        )}

        <CommitmentPanel
          opportunityId={opp.id}
          minimumKes={Number(opp.minimum_investment_kes)}
          canCommit={eligibility.canCommit}
          blockReasons={eligibility.reasons}
          existingStatus={existingCommitment?.status ?? null}
        />
      </div>
    </div>
  );
}
