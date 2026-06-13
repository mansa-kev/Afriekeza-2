import { InvestorReviewActions } from "@/components/admin/review-actions";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { createClient } from "@/lib/supabase/server";

export default async function AdminInvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("*, profiles(*)")
    .eq("id", id)
    .maybeSingle();

  if (!investor) {
    return <p className="text-muted">Investor not found.</p>;
  }

  return (
    <div>
      <PortalPageHeader title="Investor review" description={(investor.profiles as { email?: string })?.email ?? id} />
      <div className="grid gap-4 lg:grid-cols-2">
        <PortalCard padding="sm">
          <h2 className="text-sm font-semibold text-dark">KYC review</h2>
          <div className="mt-3"><StatusPill status={String(investor.kyc_status).replace(/_/g, " ")} /></div>
          <InvestorReviewActions investorId={investor.id} />
        </PortalCard>
        <PortalCard padding="sm">
          <h2 className="text-sm font-semibold text-dark">Suitability</h2>
          <div className="mt-3"><StatusPill status={String(investor.suitability_status).replace(/_/g, " ")} /></div>
        </PortalCard>
        <PortalCard padding="sm" className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-dark">Restrictions & activity</h2>
          <p className="mt-2 text-xs text-muted">No restrictions applied. Activity log empty.</p>
        </PortalCard>
      </div>
    </div>
  );
}
