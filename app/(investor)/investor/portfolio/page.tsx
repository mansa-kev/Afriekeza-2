import Link from "next/link";
import { PaymentCheckout } from "@/components/portal/payment-checkout";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";
import { getEnabledPaymentProviders } from "@/lib/actions/payments";
import {
  getCurrentProfile,
  getInvestorDashboardSummary,
  listCommitmentsForUser,
  listPortfolioForUser,
  listRepaymentsForUser,
} from "@/lib/supabase/queries";

export default async function PortfolioPage() {
  const { user } = await getCurrentProfile();
  const summary = user
    ? await getInvestorDashboardSummary(user.id)
    : { walletBalanceKes: 0, committedKes: 0, activePositions: 0, pendingCommitments: 0 };
  const { data: positions } = user ? await listPortfolioForUser(user.id) : { data: [] };
  const { data: commitments } = user ? await listCommitmentsForUser(user.id) : { data: [] };
  const { data: repayments } = user ? await listRepaymentsForUser(user.id) : { data: [] };
  const enabledProviders = await getEnabledPaymentProviders();

  const pendingCommitment = commitments.find((c) => c.status === "pending_payment");

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Portfolio"
        description="Active positions, repayment schedule, and allocation status."
      />

      {pendingCommitment ? (
        <PortalCard>
          <PaymentCheckout
            purpose="commitment_payment"
            amountKes={Number(pendingCommitment.amount_kes)}
            commitmentId={pendingCommitment.id}
            walletBalanceKes={summary.walletBalanceKes}
            enabledProviders={enabledProviders}
            title="Complete commitment payment"
            description="Pay via M-Pesa, card, crypto, or wallet balance."
          />
        </PortalCard>
      ) : null}

      <PortalSection title="Active positions">
        {positions.length === 0 ? (
          <EmptyState
            title="No active positions"
            description="Allocated investments will appear here after payment and admin allocation."
          />
        ) : (
          <div className="grid gap-4">
            {positions.map((pos) => {
              const opp = pos.opportunities as {
                slug?: string;
                title?: string;
                instrument?: string;
                tenor_months?: number;
              } | null;
              return (
                <PortalCard key={pos.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">{opp?.instrument}</p>
                      <h3 className="mt-1 text-lg font-semibold text-dark">{opp?.title}</h3>
                      <p className="mt-2 text-sm text-muted">
                        KES {Number(pos.principal_kes).toLocaleString()} principal
                        {opp?.tenor_months ? ` · ${opp.tenor_months} months` : ""}
                      </p>
                    </div>
                    <StatusPill status={String(pos.status)} />
                  </div>
                  {opp?.slug ? (
                    <Link href={`/investor/opportunities/${opp.slug}`} className="mt-4 inline-block text-sm font-medium text-blue hover:underline">
                      View opportunity
                    </Link>
                  ) : null}
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>

      <PortalSection title="Repayment schedule">
        {repayments.length === 0 ? (
          <p className="text-sm text-muted">Repayments appear after allocation.</p>
        ) : (
          <div className="space-y-2">
            {repayments.map((r) => {
              const opp = (r.portfolio_positions as { opportunities?: { title?: string } } | null)?.opportunities;
              return (
                <PortalCard key={r.id} padding="sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-dark">{opp?.title ?? "Position"}</p>
                      <p className="text-muted">Due {r.due_date ?? "—"} · KES {Number(r.amount_kes).toLocaleString()}</p>
                    </div>
                    <StatusPill status={String(r.status)} />
                  </div>
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>

      <PortalSection title="Commitments">
        {commitments.length === 0 ? (
          <p className="text-sm text-muted">No commitments yet.</p>
        ) : (
          <div className="grid gap-3">
            {commitments.map((c) => {
              const opp = c.opportunities as { title?: string } | null;
              return (
                <PortalCard key={c.id} padding="sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-dark">{opp?.title ?? "Opportunity"}</p>
                      <p className="text-sm text-muted">KES {Number(c.amount_kes).toLocaleString()}</p>
                    </div>
                    <StatusPill status={String(c.status).replaceAll("_", " ")} />
                  </div>
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>
    </div>
  );
}
