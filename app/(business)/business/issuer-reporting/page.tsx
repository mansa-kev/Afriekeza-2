import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";
import { IssuerReportingManager } from "@/components/business/issuer-reporting-manager";
import { getCurrentProfile, getCompanyForUser, listIssuerReportsForCompany } from "@/lib/supabase/queries";

const WORKFLOW = [
  "Draft",
  "Submitted",
  "Admin Review",
  "Changes Requested",
  "Approved",
  "Published",
];

export default async function IssuerReportingPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const companyId = membership?.company_id;
  const { data: reports } = companyId
    ? await listIssuerReportsForCompany(companyId)
    : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Investor reporting"
        description="Monthly and quarterly updates for allocated investors."
      />

      <PortalSection title="Reporting workflow">
        <div className="flex flex-wrap gap-2">
          {WORKFLOW.map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </div>
      </PortalSection>

      {companyId ? (
        <IssuerReportingManager companyId={companyId} reports={reports ?? []} />
      ) : (
        <p className="text-sm text-muted">
          Save your company profile before drafting reports.
        </p>
      )}
    </div>
  );
}
