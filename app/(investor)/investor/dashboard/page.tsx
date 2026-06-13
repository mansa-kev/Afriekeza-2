import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Upload,
} from "lucide-react";
import { ActionRequiredCard } from "@/components/portal/action-required-card";
import { InvestorDashboardMetrics } from "@/components/portal/investor-dashboard-metrics";
import { OpportunityFeatureCard } from "@/components/portal/opportunity-feature-card";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageIntro } from "@/components/portal/portal-page-intro";
import { PortalSearchBar } from "@/components/portal/portal-search-bar";
import { PortalSection } from "@/components/portal/portal-section";
import { PortalStatChip } from "@/components/portal/portal-stat-chip";
import { ensureInvestorWallet } from "@/lib/actions/portal";
import {
  getCurrentProfile,
  getInvestorDashboardSummary,
  getInvestorProfile,
  listOpportunities,
  listPublishedReportsForUser,
  listRepaymentsForUser,
} from "@/lib/supabase/queries";

function formatHeaderDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function verificationLabel(
  kyc?: string | null,
  suitability?: string | null,
): { label: string; tone: "green" | "amber" | "default" } {
  if (kyc === "approved" && suitability === "approved") {
    return { label: "Verified", tone: "green" };
  }
  if (kyc === "submitted" || kyc === "under_review" || suitability === "submitted") {
    return { label: "In review", tone: "amber" };
  }
  return { label: "Incomplete", tone: "default" };
}

export default async function InvestorDashboardPage() {
  const { user, profile } = await getCurrentProfile();
  const investor = user ? await getInvestorProfile(user.id) : null;
  if (user) await ensureInvestorWallet();

  const [summary, { data: opportunities }, reportsResult, repaymentsResult] = await Promise.all([
    user
      ? getInvestorDashboardSummary(user.id)
      : Promise.resolve({
          walletBalanceKes: 0,
          committedKes: 0,
          activePositions: 0,
          pendingCommitments: 0,
        }),
    listOpportunities(true),
    user ? listPublishedReportsForUser(user.id) : Promise.resolve({ data: [] }),
    user ? listRepaymentsForUser(user.id) : Promise.resolve({ data: [] }),
  ]);

  const reports = reportsResult.data ?? [];
  const repayments = repaymentsResult.data ?? [];

  const firstName = profile?.full_name?.split(/\s+/)[0] ?? "Investor";
  const kycApproved = investor?.kyc_status === "approved";
  const suitabilityApproved = investor?.suitability_status === "approved";
  const verification = verificationLabel(
    investor?.kyc_status,
    investor?.suitability_status,
  );

  const openOpportunities = opportunities.filter((o) =>
    ["open", "closing_soon", "coming_soon"].includes(String(o.status)),
  );

  const nextRepayment = repayments
    .filter((r) => r.status === "scheduled" || r.status === "pending")
    .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))[0];

  const actionItems = [];
  if (!kycApproved || !suitabilityApproved) {
    actionItems.push({
      title: "Complete risk profile",
      description: "Finish verification to unlock eligible opportunities.",
      href: "/investor/onboarding",
      cta: "Complete now",
      icon: ClipboardCheck,
      tone: "blue" as const,
    });
  }
  if ((reports ?? []).length > 0) {
    actionItems.push({
      title: "New report available",
      description: "Review the latest issuer update in your reporting centre.",
      href: "/investor/reports",
      cta: "View report",
      icon: FileText,
      tone: "green" as const,
    });
  }
  if (investor?.kyc_status === "action_required") {
    actionItems.push({
      title: "Document pending",
      description: "Upload the requested document to continue verification.",
      href: "/investor/documents",
      cta: "Upload document",
      icon: Upload,
      tone: "amber" as const,
    });
  }

  const featured = openOpportunities.slice(0, 3);

  return (
    <div className="space-y-8">
      <PortalPageIntro
        greeting={`${formatHeaderDate()}`}
        title={`Welcome back, ${firstName}`}
        description="Your portfolio summary, verification status, and next steps."
        action={
          <Link
            href="/investor/opportunities"
            className="hidden rounded-lg border border-header-border bg-white px-4 py-2 text-sm font-medium text-dark shadow-sm transition-colors hover:bg-off-white sm:inline-flex"
          >
            Quick actions
          </Link>
        }
      />

      <PortalSearchBar
        placeholder="Search opportunities, reports, or documents…"
        className="max-w-2xl"
      />

      {/* Portfolio summary chips — lean, grouped */}
      <div className="flex flex-wrap gap-2.5">
        <PortalStatChip
          label="Open opportunities"
          value={openOpportunities.length}
          href="/investor/opportunities"
          tone="blue"
        />
        <PortalStatChip
          label="Active investments"
          value={summary.activePositions}
          href="/investor/portfolio"
        />
        <PortalStatChip
          label="Reports available"
          value={(reports ?? []).length}
          href="/investor/reports"
        />
        <PortalStatChip
          label={`Verification: ${verification.label}`}
          tone={verification.tone}
        />
      </div>

      {/* Investor actions — max 3 */}
      {actionItems.length > 0 && (
        <PortalSection title="Investor actions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actionItems.slice(0, 3).map((item) => (
              <ActionRequiredCard key={item.title} {...item} />
            ))}
          </div>
        </PortalSection>
      )}

      {/* Financial overview */}
      <PortalSection title="Financial overview">
        <InvestorDashboardMetrics summary={summary} />
        {nextRepayment && (
          <PortalCard className="mt-4 border-soft-blue/50 bg-soft-blue/30" padding="sm">
            <p className="text-sm text-muted">Next expected payment</p>
            <p className="mt-1 text-lg font-semibold text-dark">
              KES {Number(nextRepayment.amount_kes).toLocaleString()}
              <span className="ml-2 text-sm font-normal text-muted">
                due {nextRepayment.due_date ?? "—"}
              </span>
            </p>
          </PortalCard>
        )}
      </PortalSection>

      {/* Featured opportunities */}
      {featured.length > 0 && (
        <PortalSection
          title="Featured opportunities"
          description="Structured products aligned with your eligibility."
          action={
            <Link href="/investor/opportunities" className="text-sm font-medium text-blue hover:underline">
              View all
            </Link>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((opp) => (
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
        </PortalSection>
      )}

      {/* Activity feed + Learn */}
      <div className="grid gap-6 lg:grid-cols-5">
        <PortalSection title="Activity feed" className="lg:col-span-3">
          <PortalCard padding="none">
            {(reports ?? []).length === 0 && summary.activePositions === 0 ? (
              <p className="px-5 py-8 text-sm text-muted">
                Activity will appear here as you invest, receive payments, and access reports.
              </p>
            ) : (
              <ul className="divide-y divide-header-border">
                {(reports ?? []).slice(0, 4).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-dark">Report published</p>
                      <p className="text-xs text-muted">{r.period_label ?? "Issuer update"}</p>
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(r.published_at ?? "").toLocaleDateString()}
                    </span>
                  </li>
                ))}
                {summary.activePositions > 0 && (
                  <li className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-dark">Portfolio active</p>
                      <p className="text-xs text-muted">
                        {summary.activePositions} active position
                        {summary.activePositions !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link href="/investor/portfolio" className="text-xs font-medium text-blue hover:underline">
                      View
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </PortalCard>
        </PortalSection>

        <div className="lg:col-span-2">
          <PortalCard className="h-full border-green/15 bg-soft-green/40">
            <div className="flex h-full flex-col">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green/10 text-green">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-dark">Learn before you invest</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                Understand risk, liquidity, and product structures before committing capital.
              </p>
              <Link
                href="/investor/learn-portal"
                className="mt-4 inline-flex w-fit items-center rounded-lg bg-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green/90"
              >
                Explore learning centre
              </Link>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
