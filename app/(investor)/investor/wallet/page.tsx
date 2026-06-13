import { PaymentCheckout } from "@/components/portal/payment-checkout";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { InvestorDashboardMetrics } from "@/components/portal/investor-dashboard-metrics";
import { WalletStatement } from "@/components/portal/wallet-panel";
import { getEnabledPaymentProviders } from "@/lib/actions/payments";
import { ensureInvestorWallet } from "@/lib/actions/portal";
import {
  getCurrentProfile,
  getInvestorDashboardSummary,
  listWalletTransactions,
} from "@/lib/supabase/queries";

export default async function WalletPage() {
  const { user } = await getCurrentProfile();
  if (user) await ensureInvestorWallet();

  const summary = user
    ? await getInvestorDashboardSummary(user.id)
    : { walletBalanceKes: 0, committedKes: 0, activePositions: 0, pendingCommitments: 0 };

  const { data: transactions } = user
    ? await listWalletTransactions(user.id)
    : { data: [] };

  const enabledProviders = await getEnabledPaymentProviders();

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Wallet"
        description="Fund via M-Pesa, card, or crypto. Diaspora payment rails supported."
      />

      <PortalSection title="Financial overview">
        <InvestorDashboardMetrics summary={summary} />
      </PortalSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard>
          <PaymentCheckout
            purpose="wallet_deposit"
            amountKes={0}
            enabledProviders={enabledProviders.filter((p) => p !== "wallet")}
            title="Add funds"
            description="Choose your payment rail. Funds credit automatically once the provider confirms payment."
          />
        </PortalCard>
        <PortalSection title="Statement">
          <WalletStatement transactions={transactions ?? []} />
        </PortalSection>
      </div>
    </div>
  );
}
