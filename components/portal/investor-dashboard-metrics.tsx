import { MetricCard } from "@/components/portal/metric-card";
import { Briefcase, PieChart, TrendingUp, Wallet } from "lucide-react";

type Summary = {
  walletBalanceKes: number;
  committedKes: number;
  activePositions: number;
  pendingCommitments: number;
};

function formatKes(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export function InvestorDashboardMetrics({ summary }: { summary: Summary }) {
  const portfolioValue = summary.committedKes + summary.walletBalanceKes;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Portfolio value"
        value={formatKes(portfolioValue)}
        icon={PieChart}
      />
      <MetricCard
        label="Wallet balance"
        value={formatKes(summary.walletBalanceKes)}
        hint="Available to invest"
        icon={Wallet}
      />
      <MetricCard
        label="Active investments"
        value={String(summary.activePositions)}
        icon={Briefcase}
      />
      <MetricCard
        label="Pending commitments"
        value={String(summary.pendingCommitments)}
        icon={TrendingUp}
      />
    </div>
  );
}
