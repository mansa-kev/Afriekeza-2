import Link from "next/link";
import {
  Briefcase,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/portal/metric-card";
import { PortalAlertCard } from "@/components/portal/portal-alert-card";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageIntro } from "@/components/portal/portal-page-intro";
import { PortalSearchBar } from "@/components/portal/portal-search-bar";
import { PortalSection } from "@/components/portal/portal-section";
import { PortalStatChip } from "@/components/portal/portal-stat-chip";
import { StatusPill } from "@/components/portal/status-pill";
import {
  countOpenSupportTickets,
  listBusinessesForAdmin,
  listInvestorsForAdmin,
  listIssuerReportsForAdmin,
  listOpportunities,
  listPaymentIntents,
  listPendingAllocations,
  listPendingDeposits,
} from "@/lib/supabase/queries";

type KycRow = {
  id: string;
  name: string;
  type: string;
  date: string;
  priority: string;
  href: string;
};

type PaymentRow = {
  id: string;
  reference: string;
  type: string;
  amount: string;
  status: string;
};

type DealRow = {
  id: string;
  name: string;
  issuer: string;
  stage: string;
  priority: string;
  href: string;
};

export default async function AdminDashboardPage() {
  const [
    { data: investors },
    { data: businesses },
    { data: opportunities },
    { data: allocations },
    { data: deposits },
    { data: paymentIntents },
    { data: reports },
    openTickets,
  ] = await Promise.all([
    listInvestorsForAdmin(),
    listBusinessesForAdmin(),
    listOpportunities(),
    listPendingAllocations(),
    listPendingDeposits(),
    listPaymentIntents(30),
    listIssuerReportsForAdmin(),
    countOpenSupportTickets(),
  ]);

  const pendingKyc = investors.filter(
    (i) => i.kyc_status !== "approved",
  ).length;
  const pendingKyb = businesses.filter(
    (b) => b.kyb_status !== "approved",
  ).length;
  const dealsUnderReview = opportunities.filter((o) =>
    ["draft", "under_review", "submitted"].includes(String(o.status)),
  ).length;
  const paymentsPending =
    deposits.length +
    (paymentIntents ?? []).filter((p) =>
      ["pending", "processing", "failed"].includes(String(p.status)),
    ).length;
  const reportsDue = (reports ?? []).filter(
    (r) => r.status === "submitted",
  ).length;
  const riskAlerts = openTickets;

  const liveOpportunities = opportunities.filter((o) =>
    ["open", "closing_soon"].includes(String(o.status)),
  ).length;

  const totalCommitted = opportunities.reduce(
    (sum, o) => sum + Number(o.target_raise_kes ?? 0),
    0,
  );

  const kycQueue: KycRow[] = investors
    .filter((i) =>
      ["submitted", "under_review", "action_required"].includes(
        String(i.kyc_status),
      ),
    )
    .slice(0, 5)
    .map((inv) => {
      const profile = inv.profiles as { full_name?: string; email?: string } | null;
      return {
        id: inv.id,
        name: profile?.full_name ?? profile?.email ?? "Investor",
        type: inv.classification ?? "Individual",
        date: new Date(inv.created_at).toLocaleDateString(),
        priority:
          inv.kyc_status === "action_required" ? "High" : "Medium",
        href: `/admin/investors/${inv.id}`,
      };
    });

  const paymentExceptions: PaymentRow[] = [
    ...(paymentIntents ?? [])
      .filter((p) => ["failed", "processing", "pending"].includes(String(p.status)))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        reference: p.external_id ?? p.id.slice(0, 8).toUpperCase(),
        type: String(p.purpose).replaceAll("_", " "),
        amount: `KES ${Number(p.amount_kes).toLocaleString()}`,
        status: String(p.status).replaceAll("_", " "),
      })),
    ...deposits.slice(0, 3).map((d) => ({
      id: d.id,
      reference: d.reference ?? d.id.slice(0, 8).toUpperCase(),
      type: "Wallet deposit",
      amount: `KES ${Number(d.amount_kes).toLocaleString()}`,
      status: "On hold",
    })),
  ].slice(0, 5);

  const dealQueue: DealRow[] = opportunities
    .filter((o) => o.status !== "repaid" && o.status !== "closed")
    .slice(0, 5)
    .map((o) => ({
      id: o.id,
      name: o.title,
      issuer: o.sector ?? "—",
      stage: String(o.status).replaceAll("_", " "),
      priority: ["under_review", "draft"].includes(String(o.status))
        ? "High"
        : "Medium",
      href: `/admin/opportunity-builder/${o.id}`,
    }));

  return (
    <div className="space-y-6">
      <PortalPageIntro
        title="Platform overview"
        description="Compliance queues, payment reconciliation, and operational activity."
        compact
      />

      <PortalSearchBar placeholder="Search investor, issuer, deal, or payment…" />

      {/* Compliance queue */}
      <div className="flex flex-wrap gap-2">
        <PortalStatChip label="KYC pending" value={pendingKyc} href="/admin/investors" tone="amber" />
        <PortalStatChip label="KYB pending" value={pendingKyb} href="/admin/businesses" tone="amber" />
        <PortalStatChip label="Deals under review" value={dealsUnderReview} href="/admin/opportunity-builder" tone="blue" />
        <PortalStatChip label="Payment reconciliation" value={paymentsPending} href="/admin/payments" tone="red" />
        <PortalStatChip label="Reporting status" value={reportsDue} href="/admin/reports" />
        <PortalStatChip label="Risk alerts" value={riskAlerts} href="/admin/support" tone={riskAlerts > 0 ? "red" : "default"} />
      </div>

      {/* Operational alerts */}
      <PortalSection title="Operational alerts">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pendingKyc > 0 && (
            <PortalAlertCard
              title="Investor KYC review"
              description={`${pendingKyc} profile${pendingKyc !== 1 ? "s" : ""} awaiting verification.`}
              priority="high"
              href="/admin/investors"
            />
          )}
          {reportsDue > 0 && (
            <PortalAlertCard
              title="Issuer report overdue"
              description={`${reportsDue} report${reportsDue !== 1 ? "s" : ""} pending publication.`}
              priority="medium"
              href="/admin/reports"
            />
          )}
          {paymentsPending > 0 && (
            <PortalAlertCard
              title="Payment exception"
              description={`${paymentsPending} item${paymentsPending !== 1 ? "s" : ""} require reconciliation.`}
              priority="high"
              href="/admin/payments"
            />
          )}
          {dealsUnderReview > 0 && (
            <PortalAlertCard
              title="Deal risk review"
              description={`${dealsUnderReview} opportunit${dealsUnderReview !== 1 ? "ies" : "y"} in review pipeline.`}
              priority="medium"
              href="/admin/opportunity-builder"
            />
          )}
          {pendingKyc === 0 && paymentsPending === 0 && dealsUnderReview === 0 && reportsDue === 0 && (
            <PortalAlertCard
              title="All queues clear"
              description="No outstanding operational alerts at this time."
              priority="low"
            />
          )}
        </div>
      </PortalSection>

      {/* Key metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total investors"
          value={investors.length.toLocaleString()}
          dense
          icon={Users}
          href="/admin/investors"
        />
        <MetricCard
          label="Active issuers"
          value={businesses.filter((b) => b.status === "approved" || b.kyb_status === "approved").length.toLocaleString()}
          dense
          icon={Building2}
          href="/admin/businesses"
        />
        <MetricCard
          label="Capital committed"
          value={`KES ${(totalCommitted / 1_000_000).toFixed(1)}M`}
          dense
          icon={TrendingUp}
        />
        <MetricCard
          label="Live opportunities"
          value={String(liveOpportunities)}
          dense
          icon={Briefcase}
          href="/admin/opportunity-builder"
        />
      </div>

      {/* Queue tables */}
      <div className="grid gap-4 xl:grid-cols-3">
        <PortalDataTable<KycRow>
          title="Compliance queue — KYC"
          rows={kycQueue}
          rowKey={(r) => r.id}
          dense
          emptyMessage="No KYC items in queue."
          columns={[
            { key: "name", header: "Investor", render: (r) => (
              <Link href={r.href} className="font-medium text-blue hover:underline">{r.name}</Link>
            )},
            { key: "type", header: "Type", render: (r) => <span className="capitalize text-muted">{r.type}</span> },
            { key: "date", header: "Date", render: (r) => <span className="text-muted">{r.date}</span> },
            { key: "priority", header: "Priority", render: (r) => (
              <StatusPill status={r.priority} className={r.priority === "High" ? "bg-red-50 text-risk-red" : "bg-amber-50 text-warning"} />
            )},
          ]}
        />
        <PortalDataTable<PaymentRow>
          title="Payment reconciliation"
          rows={paymentExceptions}
          rowKey={(r) => r.id}
          dense
          emptyMessage="No payment exceptions."
          columns={[
            { key: "ref", header: "Reference", render: (r) => <span className="font-mono text-xs">{r.reference}</span> },
            { key: "type", header: "Type", render: (r) => <span className="capitalize text-muted">{r.type}</span> },
            { key: "amount", header: "Amount", render: (r) => r.amount },
            { key: "status", header: "Status", render: (r) => (
              <StatusPill
                status={r.status}
                className={
                  r.status.toLowerCase().includes("fail")
                    ? "bg-red-50 text-risk-red"
                    : "bg-amber-50 text-warning"
                }
              />
            )},
          ]}
        />
        <PortalDataTable<DealRow>
          title="Opportunity review"
          rows={dealQueue}
          rowKey={(r) => r.id}
          dense
          emptyMessage="No deals in approval queue."
          columns={[
            { key: "name", header: "Deal", render: (r) => (
              <Link href={r.href} className="font-medium text-blue hover:underline">{r.name}</Link>
            )},
            { key: "issuer", header: "Sector", render: (r) => <span className="text-muted">{r.issuer}</span> },
            { key: "stage", header: "Stage", render: (r) => <span className="capitalize text-muted">{r.stage}</span> },
            { key: "priority", header: "Priority", render: (r) => <StatusPill status={r.priority} /> },
          ]}
        />
      </div>

      {allocations.length > 0 && (
        <PortalSection title="Allocation queue">
          <p className="text-sm text-muted">
            {allocations.length} pending allocation{allocations.length !== 1 ? "s" : ""}.{" "}
            <Link href="/admin/allocations" className="font-medium text-blue hover:underline">
              Review allocations →
            </Link>
          </p>
        </PortalSection>
      )}
    </div>
  );
}
