import { StatusPill } from "@/components/portal/status-pill";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { RepaymentActions } from "@/components/admin/operational-actions";
import { listPaymentIntents, listRepaymentsForAdmin } from "@/lib/supabase/queries";

export default async function AdminPaymentsPage() {
  const [{ data: intents }, { data: repayments }] = await Promise.all([
    listPaymentIntents(50),
    listRepaymentsForAdmin(),
  ]);

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Payment reconciliation"
        description="M-Pesa, card, and crypto payment intents with automatic settlement."
      />

      <PortalSection title="Recent payment intents">
        {(intents ?? []).length === 0 ? (
          <p className="text-sm text-muted">No payment activity yet.</p>
        ) : (
          <div className="grid gap-3">
            {(intents ?? []).map((pi) => {
              const profile = pi.profiles as { full_name?: string; email?: string } | null;
              return (
                <PortalCard key={pi.id} padding="sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium capitalize text-dark">
                        {pi.provider} · {String(pi.purpose).replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {profile?.full_name ?? profile?.email ?? pi.user_id} · KES{" "}
                        {Number(pi.amount_kes).toLocaleString()}
                      </p>
                      {pi.external_id ? (
                        <p className="text-xs text-muted">Ref {pi.external_id}</p>
                      ) : null}
                      {pi.failure_reason ? (
                        <p className="text-xs text-risk-red">{pi.failure_reason}</p>
                      ) : null}
                    </div>
                    <StatusPill status={String(pi.status).replaceAll("_", " ")} />
                  </div>
                </PortalCard>
              );
            })}
          </div>
        )}
      </PortalSection>

      <PortalSection title="Scheduled repayments">
        {(repayments ?? []).length === 0 ? (
          <p className="text-sm text-muted">No repayments due.</p>
        ) : (
          <div className="grid gap-3">
            {(repayments ?? []).map((r) => {
              const pos = r.portfolio_positions as {
                opportunities?: { title?: string };
                investor_profiles?: { profiles?: { full_name?: string } };
              } | null;
              return (
                <PortalCard key={r.id} padding="sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-dark">{pos?.opportunities?.title}</p>
                      <p className="text-sm text-muted">
                        {pos?.investor_profiles?.profiles?.full_name} · Due {r.due_date} · KES{" "}
                        {Number(r.amount_kes).toLocaleString()}
                      </p>
                    </div>
                    <RepaymentActions repaymentId={r.id} />
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
