import Link from "next/link";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { formatReadinessLabel } from "@/lib/registry/score";
import { getCurrentProfile } from "@/lib/supabase/queries";
import {
  getRegistryCompanyContext,
  getRegistryDashboardSummary,
  listReadinessItems,
} from "@/lib/registry/queries";
import { bootstrapRegistryForCompany } from "@/lib/actions/registry";

export default async function ReadinessReportPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const company = membership?.companies as {
    legal_name?: string;
    trading_name?: string;
    registration_number?: string;
    sector?: string;
    kyb_status?: string;
  } | null;
  const companyId = membership?.company_id;

  if (companyId) await bootstrapRegistryForCompany(companyId);

  const summary = companyId
    ? await getRegistryDashboardSummary(companyId)
    : null;
  const items = companyId ? await listReadinessItems(companyId) : [];

  const name = company?.trading_name ?? company?.legal_name ?? "Company";

  return (
    <div className="max-w-3xl space-y-6">
      <PortalPageHeader
        title="Afriekeza funding readiness report"
        description="Summary of profile completeness, checklist status, and recommended next steps."
      />

      {!companyId || !summary ? (
        <p className="text-sm text-muted">
          Complete your{" "}
          <Link href="/registry/company" className="text-blue hover:underline">
            company profile
          </Link>{" "}
          to generate a readiness report.
        </p>
      ) : (
        <div id="readiness-report">
          <PortalCard className="print:shadow-none">
          <div className="border-b border-header-border pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Afriekeza Registry
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-navy">
              Funding Readiness Report
            </h2>
            <p className="mt-2 text-sm text-muted">
              {name}
              {company?.registration_number
                ? ` · Reg ${company.registration_number}`
                : ""}
            </p>
            <p className="text-xs text-muted">
              Generated {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Overall score</p>
              <p className="text-3xl font-bold text-navy">
                {summary.score.overallScore}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Status</p>
              <p className="text-lg font-semibold capitalize text-blue">
                {formatReadinessLabel(summary.score.readinessLabel)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">KYB</p>
              <p className="font-medium capitalize">
                {String(company?.kyb_status ?? "not started").replaceAll("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Sector</p>
              <p className="font-medium">{company?.sector ?? "—"}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-dark">Category scores</h3>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(summary.score.categoryScores).map(([cat, val]) => (
                <div
                  key={cat}
                  className="flex justify-between rounded-lg bg-off-white px-3 py-2 text-sm"
                >
                  <dt className="capitalize text-muted">{cat.replaceAll("_", " ")}</dt>
                  <dd className="font-semibold">{val}%</dd>
                </div>
              ))}
            </dl>
          </div>

          {summary.score.missingRequired.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-dark">Priority gaps</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-muted">
                {summary.score.missingRequired.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-semibold text-dark">Checklist summary</h3>
            <p className="mt-1 text-sm text-muted">
              {items.filter((i) => i.status === "approved").length} approved ·{" "}
              {items.filter((i) => i.status === "submitted").length} submitted ·{" "}
              {items.filter((i) => i.status === "not_started").length} not started
            </p>
          </div>

          <p className="mt-8 text-xs text-muted">
            This report is for funding readiness purposes only and does not constitute
            investment advice, regulatory approval, or a guarantee of capital access.
          </p>
          </PortalCard>
        </div>
      )}
    </div>
  );
}
