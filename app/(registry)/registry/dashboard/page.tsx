import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  Database,
  FileText,
  PieChart,
} from "lucide-react";
import { ActionRequiredCard } from "@/components/portal/action-required-card";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageIntro } from "@/components/portal/portal-page-intro";
import { PortalSearchBar } from "@/components/portal/portal-search-bar";
import { PortalSection } from "@/components/portal/portal-section";
import { PortalStatChip } from "@/components/portal/portal-stat-chip";
import { ReadinessScorePanel } from "@/components/registry/readiness-score-panel";
import { bootstrapRegistryForCompany } from "@/lib/actions/registry";
import { formatReadinessLabel } from "@/lib/registry/score";
import {
  getRegistryCompanyContext,
  getRegistryDashboardSummary,
  listRegistryReviewsForCompany,
} from "@/lib/registry/queries";
import { getCurrentProfile } from "@/lib/supabase/queries";

function formatDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RegistryDashboardPage() {
  const { user, profile } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const company = membership?.companies as {
    id?: string;
    legal_name?: string;
    trading_name?: string;
    kyb_status?: string;
  } | null;
  const companyId = membership?.company_id ?? company?.id;

  if (companyId) {
    await bootstrapRegistryForCompany(companyId);
  }

  const summary = companyId
    ? await getRegistryDashboardSummary(companyId)
    : null;
  const reviews = companyId
    ? await listRegistryReviewsForCompany(companyId)
    : [];

  const companyName =
    company?.trading_name ??
    company?.legal_name ??
    profile?.full_name?.split(/\s+/)[0] ??
    "Company";

  const actionItems = [];
  if (!companyId) {
    actionItems.push({
      title: "Create company profile",
      description: "Start your Registry workspace with legal and business details.",
      href: "/registry/company",
      cta: "Start profile",
      icon: Building2,
      tone: "blue" as const,
    });
  }
  if (summary && summary.documentCount < 3) {
    actionItems.push({
      title: "Build your data room",
      description: "Upload registration, financial, and banking documents.",
      href: "/registry/data-room",
      cta: "Open data room",
      icon: Database,
      tone: "amber" as const,
    });
  }
  if (summary && summary.capTableCount === 0) {
    actionItems.push({
      title: "Record cap table",
      description: "Enter founders and shareholders with ownership percentages.",
      href: "/registry/cap-table",
      cta: "Open cap table",
      icon: PieChart,
      tone: "green" as const,
    });
  }
  if (summary && summary.score.missingRequired.length > 0) {
    actionItems.push({
      title: "Complete readiness checklist",
      description: `${summary.score.missingRequired.length} required items still outstanding.`,
      href: "/registry/readiness",
      cta: "View checklist",
      icon: ClipboardCheck,
      tone: "blue" as const,
    });
  }

  return (
    <div className="space-y-8">
      <PortalPageIntro
        greeting={formatDate()}
        title={`Welcome back, ${companyName}`}
        description="Funding readiness, document status, and reporting obligations."
        action={
          <Link
            href="/registry/readiness-report"
            className="hidden rounded-lg border border-header-border bg-white px-4 py-2 text-sm font-medium text-dark shadow-sm hover:bg-off-white sm:inline-flex"
          >
            Readiness report
          </Link>
        }
      />

      <PortalSearchBar
        placeholder="Search documents, readiness items, or reports…"
        className="max-w-xl"
      />

      {summary && (
        <>
          <div className="flex flex-wrap gap-2.5">
            <PortalStatChip
              label={`Readiness: ${formatReadinessLabel(summary.score.readinessLabel)}`}
              value={summary.score.overallScore}
              href="/registry/readiness"
              tone="blue"
            />
            <PortalStatChip
              label="Data room files"
              value={summary.documentCount}
              href="/registry/data-room"
            />
            <PortalStatChip
              label="Cap table entries"
              value={summary.capTableCount}
              href="/registry/cap-table"
            />
            <PortalStatChip
              label="Reporting tasks"
              value={summary.pendingTasks}
              href="/registry/reporting"
              tone={summary.pendingTasks > 0 ? "amber" : "default"}
            />
          </div>

          <ReadinessScorePanel score={summary.score} />
        </>
      )}

      {actionItems.length > 0 && (
        <PortalSection title="Registry actions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actionItems.slice(0, 3).map((item) => (
              <ActionRequiredCard key={item.title} {...item} />
            ))}
          </div>
        </PortalSection>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <PortalSection title="Readiness pipeline" className="lg:col-span-3">
          <PortalCard padding="none">
            <ul className="divide-y divide-header-border">
              {[
                { label: "Company profile", done: !!companyId, href: "/registry/company" },
                { label: "Data room", done: (summary?.documentCount ?? 0) >= 3, href: "/registry/data-room" },
                { label: "Cap table", done: (summary?.capTableCount ?? 0) > 0, href: "/registry/cap-table" },
                { label: "Readiness checklist", done: (summary?.score.overallScore ?? 0) >= 75, href: "/registry/readiness" },
                { label: "Afriekeza review", done: summary?.score.readinessLabel === "funding_review_ready", href: "/registry/readiness-report" },
              ].map((step) => (
                <li
                  key={step.label}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${step.done ? "bg-green" : "bg-muted/40"}`}
                    />
                    <span className="text-sm font-medium text-dark">{step.label}</span>
                  </div>
                  <Link
                    href={step.href}
                    className="text-xs font-medium text-blue hover:underline"
                  >
                    {step.done ? "View" : "Continue"}
                  </Link>
                </li>
              ))}
            </ul>
          </PortalCard>
        </PortalSection>

        <div className="lg:col-span-2">
          <PortalCard>
            <h3 className="font-semibold text-dark">Afriekeza review</h3>
            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                No review comments yet. Submit readiness items for Afriekeza review.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="text-sm">
                    <p className="font-medium capitalize text-dark">
                      {String(r.decision).replaceAll("_", " ")}
                    </p>
                    {r.notes && <p className="text-muted">{r.notes}</p>}
                    <p className="text-xs text-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/registry/support"
              className="mt-4 inline-flex text-sm font-medium text-blue hover:underline"
            >
              Contact support →
            </Link>
          </PortalCard>
        </div>
      </div>

      {summary?.subscription && (
        <PortalCard padding="sm" className="border-green/20 bg-soft-green/30">
          <p className="text-sm text-muted">Registry plan</p>
          <p className="font-semibold capitalize text-dark">
            {summary.subscription.plan_tier} · {summary.subscription.status}
          </p>
        </PortalCard>
      )}
    </div>
  );
}
