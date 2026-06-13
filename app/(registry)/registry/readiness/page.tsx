import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/page-header";
import { ReadinessChecklist } from "@/components/registry/readiness-checklist";
import { ReadinessScorePanel } from "@/components/registry/readiness-score-panel";
import { bootstrapRegistryForCompany, recalculateRegistryScore } from "@/lib/actions/registry";
import { getCurrentProfile } from "@/lib/supabase/queries";
import {
  getRegistryCompanyContext,
  getRegistryDashboardSummary,
} from "@/lib/registry/queries";

export default async function RegistryReadinessPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const companyId = membership?.company_id;

  if (companyId) {
    await bootstrapRegistryForCompany(companyId);
    await recalculateRegistryScore(companyId);
  }

  const summary = companyId
    ? await getRegistryDashboardSummary(companyId)
    : null;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Funding readiness"
        description="Checklist, score breakdown, and items for Afriekeza review."
        action={
          companyId ? (
            <Link
              href="/registry/readiness-report"
              className="text-sm font-medium text-blue hover:underline"
            >
              Download report →
            </Link>
          ) : undefined
        }
      />

      {!companyId ? (
        <p className="text-sm text-muted">
          <Link href="/registry/company" className="text-blue hover:underline">
            Create your company profile
          </Link>{" "}
          to start the readiness checklist.
        </p>
      ) : (
        <>
          {summary && <ReadinessScorePanel score={summary.score} />}
          <ReadinessChecklist
            companyId={companyId}
            items={summary?.items ?? []}
          />
        </>
      )}
    </div>
  );
}
