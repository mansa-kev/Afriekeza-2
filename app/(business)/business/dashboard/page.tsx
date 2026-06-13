import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { ActionRequiredCard } from "@/components/portal/action-required-card";
import { MetricCard } from "@/components/portal/metric-card";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageIntro } from "@/components/portal/portal-page-intro";
import { PortalSearchBar } from "@/components/portal/portal-search-bar";
import { PortalSection } from "@/components/portal/portal-section";
import { PortalStatChip } from "@/components/portal/portal-stat-chip";
import {
  getCurrentProfile,
  getCompanyForUser,
  getRaiseApplicationForUser,
  listDocumentsForOwner,
  listIssuerReportsForCompany,
} from "@/lib/supabase/queries";

function formatHeaderDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatStatus(value: string | undefined | null) {
  if (!value) return "Not started";
  return value.replaceAll("_", " ");
}

function kybTone(status?: string | null): "green" | "amber" | "default" {
  if (status === "approved") return "green";
  if (status === "submitted" || status === "under_review") return "amber";
  return "default";
}

export default async function BusinessDashboardPage() {
  const { user, profile } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const company = membership?.companies as {
    id?: string;
    legal_name?: string;
    trading_name?: string;
    funding_readiness_score?: number;
    funding_readiness_status?: string;
    status?: string;
    kyb_status?: string;
  } | null;

  const companyId = membership?.company_id ?? company?.id;
  const application = user ? await getRaiseApplicationForUser(user.id) : null;

  const [{ data: documents }, { data: reports }] = companyId
    ? await Promise.all([
        listDocumentsForOwner("company", companyId),
        listIssuerReportsForCompany(companyId),
      ])
    : [{ data: [] }, { data: [] }];

  const companyName =
    company?.trading_name ?? company?.legal_name ?? profile?.full_name?.split(/\s+/)[0] ?? "Issuer";
  const docCount = (documents ?? []).length;
  const pendingReports = (reports ?? []).filter((r) => r.status === "draft").length;

  const actionItems = [];
  if (!company) {
    actionItems.push({
      title: "Complete company profile",
      description: "Add legal details and ownership structure to begin KYB.",
      href: "/business/company",
      cta: "Start profile",
      icon: Building2,
      tone: "blue" as const,
    });
  }
  if (company && company.kyb_status !== "approved") {
    actionItems.push({
      title: "Submit KYB documents",
      description: "Upload registration, ownership, and banking records for verification.",
      href: "/business/kyb",
      cta: "View checklist",
      icon: ShieldCheck,
      tone: "amber" as const,
    });
  }
  if (company && !application) {
    actionItems.push({
      title: "Prepare capital request",
      description: "Draft your structured raise application for Afriekeza review.",
      href: "/business/raise-application",
      cta: "Open application",
      icon: TrendingUp,
      tone: "green" as const,
    });
  }
  if (docCount === 0 && company) {
    actionItems.push({
      title: "Build your data room",
      description: "Organize financials and governance documents for due diligence.",
      href: "/business/data-room",
      cta: "Upload documents",
      icon: FileText,
      tone: "blue" as const,
    });
  }

  return (
    <div className="space-y-8">
      <PortalPageIntro
        greeting={formatHeaderDate()}
        title={`Welcome back, ${companyName}`}
        description="Capital readiness, deal pipeline status, and issuer actions in one place."
        action={
          <Link
            href="/business/raise-application"
            className="hidden rounded-lg border border-header-border bg-white px-4 py-2 text-sm font-medium text-dark shadow-sm transition-colors hover:bg-off-white sm:inline-flex"
          >
            Capital request
          </Link>
        }
      />

      <PortalSearchBar
        placeholder="Search documents, reports, or deal stages…"
        className="max-w-xl"
      />

      {/* Issuer status — lean chip row */}
      <div className="flex flex-wrap gap-2.5">
        <PortalStatChip
          label={`KYB: ${formatStatus(company?.kyb_status)}`}
          tone={kybTone(company?.kyb_status)}
          href="/business/kyb"
        />
        <PortalStatChip
          label="Readiness score"
          value={company?.funding_readiness_score ?? "—"}
          href="/business/funding-readiness"
          tone="blue"
        />
        <PortalStatChip
          label="Data room files"
          value={docCount}
          href="/business/data-room"
        />
        <PortalStatChip
          label={`Deal: ${formatStatus(application?.status ?? company?.status)}`}
          href="/business/deal-status"
        />
      </div>

      {actionItems.length > 0 && (
        <PortalSection title="Issuer actions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actionItems.slice(0, 3).map((item) => (
              <ActionRequiredCard key={item.title} {...item} />
            ))}
          </div>
        </PortalSection>
      )}

      <PortalSection title="Capital readiness">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Readiness score"
            value={company?.funding_readiness_score ? String(company.funding_readiness_score) : "—"}
            hint={formatStatus(company?.funding_readiness_status)}
            icon={ClipboardCheck}
            href="/business/funding-readiness"
          />
          <MetricCard
            label="KYB status"
            value={formatStatus(company?.kyb_status)}
            icon={ShieldCheck}
            href="/business/kyb"
          />
          <MetricCard
            label="Capital request"
            value={application ? formatStatus(application.status) : "Not started"}
            hint={application ? "In progress" : "Draft when ready"}
            icon={TrendingUp}
            href="/business/raise-application"
          />
          <MetricCard
            label="Reporting status"
            value={String((reports ?? []).length)}
            hint={pendingReports > 0 ? `${pendingReports} draft${pendingReports !== 1 ? "s" : ""}` : "Up to date"}
            icon={FileText}
            href="/business/issuer-reporting"
          />
        </div>
      </PortalSection>

      <div className="grid gap-6 lg:grid-cols-5">
        <PortalSection title="Deal pipeline" className="lg:col-span-3">
          <PortalCard padding="none">
            <ul className="divide-y divide-header-border">
              {[
                { label: "Company profile", done: !!company, href: "/business/company" },
                { label: "KYB verification", done: company?.kyb_status === "approved", href: "/business/kyb" },
                { label: "Funding readiness", done: !!company?.funding_readiness_score, href: "/business/funding-readiness" },
                { label: "Capital request", done: !!application, href: "/business/raise-application" },
                { label: "Data room complete", done: docCount >= 3, href: "/business/data-room" },
              ].map((step) => (
                <li key={step.label} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${step.done ? "bg-green" : "bg-muted/40"}`}
                    />
                    <span className="text-sm font-medium text-dark">{step.label}</span>
                  </div>
                  <Link href={step.href} className="text-xs font-medium text-blue hover:underline">
                    {step.done ? "View" : "Continue"}
                  </Link>
                </li>
              ))}
            </ul>
          </PortalCard>
        </PortalSection>

        <div className="lg:col-span-2">
          <PortalCard className="h-full border-blue/15 bg-soft-blue/30">
            <h3 className="font-semibold text-dark">Afriekeza review</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              No open review comments. Your issuer analyst will post feedback here during KYB and deal structuring.
            </p>
            <Link
              href="/business/support"
              className="mt-4 inline-flex text-sm font-medium text-blue hover:underline"
            >
              Contact support →
            </Link>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
